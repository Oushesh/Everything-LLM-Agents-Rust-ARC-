```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // 1. Initial value (0) is placed inside the Mutex
    let counter = Arc::new(Mutex::new(0));

    // 2. Clone the Arc pointer (ref count = 2)
    let counter_clone = Arc::clone(&counter);

    // 3. Move the pointer into another thread
    let handle = thread::spawn(move || {
        let mut data = counter_clone.lock().unwrap();
        *data += 10; // Modifies the original 0 to 10
    });

    handle.join().unwrap();
    println!("Final value: {}", counter.lock().unwrap());
}
```