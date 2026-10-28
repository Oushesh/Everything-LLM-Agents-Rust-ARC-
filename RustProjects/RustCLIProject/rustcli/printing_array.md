## Key Concepts

## Example
   ```
   rust
   //Compound Types

   // loop and print elements  
   fn main() {
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];
    let months: [&str; 3] = ["Jan", "Feb","March"]; 
    // Fixed: closed the quote on "March"

    // Debug print collections with {:?}
    println!("numbers: {:?}", numbers);
    println!("months: {:?}", months);

    // Fixed: removed invalid `: Type` annotations from loop headers
    for n in &numbers {
        println!("n: {}", n);
    }
    for m in &months {
        println!("m: {}", m);
    }
}
   
   ´´´

## Concepts of Printing the different elements

  1. 