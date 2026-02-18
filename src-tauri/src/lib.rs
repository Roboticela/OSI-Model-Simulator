#[tauri::command]
fn write_file(path: String, data: String) -> Result<(), String> {
    use std::io::Write;
    let bytes = base64::Engine::decode(
        &base64::engine::general_purpose::STANDARD,
        &data,
    )
    .map_err(|e| format!("Failed to decode base64: {}", e))?;
    std::fs::File::create(&path)
        .map_err(|e| format!("Failed to create file: {}", e))?
        .write_all(&bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init());

  #[cfg(desktop)]
  {
    builder = builder.plugin(tauri_plugin_window_state::Builder::default().build());
  }

  builder
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
    .invoke_handler(tauri::generate_handler![write_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
