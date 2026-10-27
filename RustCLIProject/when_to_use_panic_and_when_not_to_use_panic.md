## Key Concepts: 
   When and when not to use panic!
   
   * panic!
     unwinds the stack, prints a message and aborts the thread

   * unwrap and expect
     convenience methods that panic on None or Err

   * when to panic
     programmer errors, not user input errors
     For user input errors you should be considerate enough
     to 

   
## Panic or not to panic (Rust)
   When do you know if you have to panic or not? 
   
   you can always panic but that means you dont know
   how to handle the situation in the code.

## Examples: 
   ```
   rust: 
   
   pub struct Guess {
        value: i32,
   }
   
   //impl implements a method for Guess
   impl Guess {
        pub fn new(value:i32) -> Guess {
            if value <1 || value > 100 {
                panic!("Guess value must between 1 and 100, got {value}.")                   
            }
            
            Guess {value}
        }
        pub fn value (&self) -> i32 {
            self.value
        }
   }
   
   The above is just an implementation 
   
   ```

## Best Practices for Panic and not panic!
   Rust error handling features are designed to help you write better code.
   If you use panic! everywhere it means you cannot handle the code.

## Rust Design and Patterns: 
   How to design and replace panics in code 
   using other error handling strategies:

   Result and Match strategy
   
   ```
   rust
   
   // Anti-pattern: panics on bad input, terminating the program
   
   pub fn parse_port_naive(s:&str) -> u16 {
        let port: u32 = s.parse().unwrap() //panics if not integer
        
        //Condition of handling value range
        if !(1...=65535).contains(&port).unwrap(); //panics if out of boundaries or out of bounds 
        {
            panic!("Port out of range: {}",port); // panics on out-of-range
        }
        
        port as u16
        
   }
   ```
    
   ```
   rust 
    //Instead signal the different possibilities with Result: 
    //Here we
    
    //Panic unwind 
   ´´´
