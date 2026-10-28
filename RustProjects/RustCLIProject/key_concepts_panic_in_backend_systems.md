## Key Concepts:
When to use and when not to use panic in Backend

## Panic and Not Panic
Usually as long as you can define or architect where errors are coming from and why, you should handle them gracefully rather than panicking:

```rust
// Anti-pattern: panics on bad input, terminating the program.
```

## Example of Naive Code:
```rust
pub fn parse_port_naive(s: &str) -> u16 {
    let port: u32 = s.parse().unwrap(); // panics if not an integer
    if !(1..=65535).contains(&port) {
        panic!("port out of range");
    }
    port as u16
}
```

## Recommended Pattern (Idiomatic Error Handling):
```rust
use std::num::ParseIntError;

#[derive(Debug)]
pub enum PortError {
    InvalidNumber(ParseIntError),
    OutOfRange(u32),
}

pub fn parse_port(s: &str) -> Result<u16, PortError> {
    let port: u32 = s.parse().map_err(PortError::InvalidNumber)?;
    if !(1..=65535).contains(&port) {
        return Err(PortError::OutOfRange(port));
    }
    Ok(port as u16)
}



```

 The next thing is to use map error Result <T,Err> technique 
and enum to map each condition and write the error patterns -> only 
when we dont know we actually panic! and send message.


```rust
   #[derive(Debug,PartialEq, Eq)]
   pub enum PortError {
    InvalidDigit,
    OutofRange(u32),
}

   pub fn parse_port(s: &str) -> Result<u16,PortError> {
       let port: u32 = s.parse().map_err(|_| PortError::InvalidDigit)?;
       
       
       if (1..=65535).contains(&port) {
           Ok(port as u16)
       } else {
           Err (PortError::OutofRange(port))
       }
   }
```

```rust
   match parse_port("70000") 
{
    Ok(port) => printlin!("Listening on port{port}"),
    Err(PortError::InvalidDigit) => eprintln!("PLease provisw"),
    Err(PortError::Outof Range(p)) => eprintln!("Port {p must be between 1 and 65535}"),

}
```

