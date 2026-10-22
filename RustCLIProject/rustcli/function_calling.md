## Key Concept
   Private and Public function.

   Within the same .rs file, the functions are private by default unless specified with pub fn.

   Example Code:

   ```
   rust 

   fn add(x: i32, y: i32) -> i32 {
     x + y
   }   

   pub fn multiply(x: i32, y: i32) -> i32 {
     x * y
   }   
   ```

   ```
   rust 
   fn main ()
   {
    greet("Oushesh");
   }

   fn greet (name: &str)
   {
    println!{"Hello {}!", name};
   }
   ´´´

   