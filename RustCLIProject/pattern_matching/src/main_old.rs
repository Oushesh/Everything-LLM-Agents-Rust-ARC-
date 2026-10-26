use std::fs::File;
use std::io::ErrorKind;

use std::result::Result::{Ok,Err};

enum Light {
    Red,
    Yellow,
    Green
}

fn action(light: Light) -> &'static str {
    match light {
        Light::Red => "stop",
        Light::Yellow => "wait",
        Light::Green => "go",
    }
}

/*
fn main() {
    let current_light = Light::Red;
    println!("Action: {}", action(current_light));
}
*/



/*
You can either declare enum or make it here
 */


/*
fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {e:?}"),
            },
            _ => {
                panic!("Problem opening the file: {error:?}");
            }
        },
    };
}

*/

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {e:?}"),
            },
            _ => {
                panic!("Problem opening the file: {error:?}");
            }
        },
    };
}




/*
Alternative to match using unwrap_or_else
 */

/*
fn main() {
    let greeting_file = File::open("hello.txt").unwrap_or_else(|error|
        {
            if error.kind() == ErrorKind::NotFound {
                File::create("hello.txt").unwrap_or_else(|error|
                    {
                        panic!("Problem creating the file: {error:?}");
                    }
                )
            }
            else { panic!("Problem opening the file: {error:?}") }
        }
    );
}
*/
