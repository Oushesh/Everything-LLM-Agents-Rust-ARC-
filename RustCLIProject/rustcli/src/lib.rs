use serde_json::Value;
use std::error::Error;
use std::process::Command;

/// Runs a system command and returns its stdout as a UTF-8 string.
pub fn run_command(binary: &str, args: &[&str]) -> Result<String, Box<dyn Error>> {
    let output = Command::new(binary)
        .args(args)
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Command '{binary}' failed with status {}: {stderr}", output.status).into());
    }

    Ok(String::from_utf8(output.stdout)?)
}

/// Recursively searches for a device name across block devices and their children.
pub fn find_device<'a>(devices: &'a [Value], target_device: &str) -> Option<&'a Value> {
    for dev in devices {
        if dev.get("name").and_then(Value::as_str) == Some(target_device) {
            return Some(dev);
        }

        if let Some(children) = dev.get("children").and_then(Value::as_array) {
            if let Some(found) = find_device(children, target_device) {
                return Some(found);
            }
        }
    }
    None
}

/// Invokes `lsblk` with JSON formatting and extracts the requested device.
pub fn run_lsblk(device: &str) -> Result<Value, Box<dyn Error>> {
    let stdout = run_command("lsblk", &["-J", "-o", "NAME,SIZE,TYPE,MOUNTPOINT"])?;
    let parsed: Value = serde_json::from_str(&stdout)?;

    let blockdevices = parsed
        .get("blockdevices")
        .and_then(Value::as_array)
        .ok_or("Field 'blockdevices' missing or not an array in lsblk output")?;

    find_device(blockdevices, device)
        .cloned()
        .ok_or_else(|| format!("Device '{device}' not found").into())
}