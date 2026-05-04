mod auth;
mod download;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      auth::create_pkce_params,
      auth::open_browser_auth,
      auth::wait_for_auth_callback,
      auth::exchange_code_for_tokens,
      auth::refresh_access_token,
      download::download_file,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
