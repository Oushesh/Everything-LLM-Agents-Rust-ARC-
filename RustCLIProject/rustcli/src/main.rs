fn main() {
    println!("Hello, world!");
}


//Update the code with rust for the future:

use std::process:Command;

fn run_command(command:&str) -> String {
    let args: Vec<&str> = command.split("").collect();

    let output = Command::new()
}

