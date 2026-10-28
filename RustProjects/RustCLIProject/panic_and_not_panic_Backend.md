## Key Concepts:
   When to use and when not to use panic button in Backend
   

## Panic and Not Panic Button
   Usually as long as you can define or architect how the errors are coming from and why you should 
   do so: 
   
   ```
   rust: 
   
   // Anti-pattern: panis on bad input, terminating
   the program.
    ```
    

## Example of Naive Code:
   ```
   rust: 
   pub fn parse_port_naive(s:&str) -> u16 {
        let port: u32 = s.parse().unwrap(); //panics if not an integer
        if !(1..=65535).contains(&port) {
   
        }
   }

   ´´´
