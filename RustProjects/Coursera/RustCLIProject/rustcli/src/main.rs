use std::error::Error;
//use rustcli::run_lsblk;

fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = std::env::args().collect();
    
    // Ensure an argument was explicitly provided
    if args.len() < 2 {
        eprintln!("Usage: {} <device-name> (e.g., sda1, nvme0n1p1)", args[0]);
        std::process::exit(1);
    }

    let device = &args[1];
    let device_info = rustcli::run_lsblk(device)?;

    println!("{}", serde_json::to_string_pretty(&device_info)?);
    Ok(())
}