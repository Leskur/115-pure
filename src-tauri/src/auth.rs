use anyhow::{anyhow, Result};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;

const REDIRECT_PORT: u16 = 51115;
const REDIRECT_URI: &str = "http://localhost:51115/callback";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthTokens {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: u64,
    pub token_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PkceParams {
    pub code_verifier: String,
    pub code_challenge: String,
    pub state: String,
    pub redirect_uri: String,
    pub auth_url: String,
}

pub fn generate_code_verifier() -> String {
    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    URL_SAFE_NO_PAD.encode(bytes)
}

pub fn generate_code_challenge(verifier: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(verifier.as_bytes());
    URL_SAFE_NO_PAD.encode(hasher.finalize())
}

pub fn generate_state() -> String {
    let mut bytes = [0u8; 16];
    rand::thread_rng().fill_bytes(&mut bytes);
    URL_SAFE_NO_PAD.encode(bytes)
}

#[tauri::command]
pub fn create_pkce_params(client_id: String) -> Result<PkceParams, String> {
    let code_verifier = generate_code_verifier();
    let code_challenge = generate_code_challenge(&code_verifier);
    let state = generate_state();

    let auth_url = format!(
        "https://passportapi.115.com/open/authorize?response_type=code&client_id={}&redirect_uri={}&code_challenge={}&code_challenge_method=S256&state={}",
        client_id,
        urlencoding::encode(REDIRECT_URI),
        code_challenge,
        state
    );

    Ok(PkceParams {
        code_verifier,
        code_challenge,
        state,
        redirect_uri: REDIRECT_URI.to_string(),
        auth_url,
    })
}

#[tauri::command]
pub async fn open_browser_auth(url: String) -> Result<(), String> {
    open::that(&url).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn wait_for_auth_callback(
    expected_state: String,
) -> Result<String, String> {
    let listener = TcpListener::bind(format!("127.0.0.1:{}", REDIRECT_PORT))
        .await
        .map_err(|e| format!("Failed to bind port {}: {}", REDIRECT_PORT, e))?;

    let (mut stream, _) = listener
        .accept()
        .await
        .map_err(|e| format!("Failed to accept connection: {}", e))?;

    let mut reader = BufReader::new(&mut stream);
    let mut request_line = String::new();
    reader
        .read_line(&mut request_line)
        .await
        .map_err(|e| e.to_string())?;

    let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nConnection: close\r\n\r\n\
        <html><body style='font-family:sans-serif;text-align:center;padding:40px'>\
        <h2>授权成功！</h2><p>请返回 115 Pure 应用。</p>\
        <script>window.close()</script></body></html>";

    stream
        .write_all(response.as_bytes())
        .await
        .map_err(|e| e.to_string())?;

    let path = request_line
        .split_whitespace()
        .nth(1)
        .ok_or("Invalid request")?;

    let query = path.split('?').nth(1).unwrap_or("");
    let params: HashMap<String, String> = query
        .split('&')
        .filter_map(|kv| {
            let mut parts = kv.splitn(2, '=');
            Some((
                parts.next()?.to_string(),
                urlencoding::decode(parts.next()?).ok()?.into_owned(),
            ))
        })
        .collect();

    let returned_state = params.get("state").ok_or("Missing state parameter")?;
    if returned_state != &expected_state {
        return Err("State mismatch: possible CSRF attack".to_string());
    }

    params
        .get("code")
        .cloned()
        .ok_or_else(|| params.get("error").cloned().unwrap_or("No code returned".to_string()))
}

#[tauri::command]
pub async fn exchange_code_for_tokens(
    code: String,
    code_verifier: String,
    client_id: String,
) -> Result<AuthTokens, String> {
    let client = reqwest::Client::new();
    let params = [
        ("grant_type", "authorization_code"),
        ("code", &code),
        ("code_verifier", &code_verifier),
        ("client_id", &client_id),
        ("redirect_uri", REDIRECT_URI),
    ];

    let response = client
        .post("https://proapi.115.com/open/oauth/token")
        .form(&params)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let tokens: AuthTokens = response.json().await.map_err(|e| e.to_string())?;
    Ok(tokens)
}

#[tauri::command]
pub async fn refresh_access_token(
    refresh_token: String,
    client_id: String,
) -> Result<AuthTokens, String> {
    let client = reqwest::Client::new();
    let params = [
        ("grant_type", "refresh_token"),
        ("refresh_token", &refresh_token),
        ("client_id", &client_id),
    ];

    let response = client
        .post("https://proapi.115.com/open/oauth/token")
        .form(&params)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let tokens: AuthTokens = response.json().await.map_err(|e| e.to_string())?;
    Ok(tokens)
}
