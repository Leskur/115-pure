use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DownloadProgress {
    pub task_id: String,
    pub downloaded: u64,
    pub total: u64,
    pub speed: u64,
}

#[tauri::command]
pub async fn download_file(
    app: AppHandle,
    task_id: String,
    url: String,
    save_path: String,
    access_token: String,
) -> Result<(), String> {
    let client = reqwest::Client::new();
    let response = client
        .get(&url)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let total = response.content_length().unwrap_or(0);
    let path = PathBuf::from(&save_path);

    if let Some(parent) = path.parent() {
        tokio::fs::create_dir_all(parent)
            .await
            .map_err(|e| e.to_string())?;
    }

    let mut file = File::create(&path).await.map_err(|e| e.to_string())?;
    let mut downloaded: u64 = 0;
    let mut stream = response.bytes_stream();

    use futures_util::StreamExt;
    let start = std::time::Instant::now();

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;

        let elapsed = start.elapsed().as_secs_f64().max(0.001);
        let speed = (downloaded as f64 / elapsed) as u64;

        let _ = app.emit(
            "download-progress",
            DownloadProgress {
                task_id: task_id.clone(),
                downloaded,
                total,
                speed,
            },
        );
    }

    Ok(())
}
