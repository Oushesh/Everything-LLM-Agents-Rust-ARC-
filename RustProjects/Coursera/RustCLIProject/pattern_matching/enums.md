## Key Concept Enums: 
   Enums is a different type of data where the the value can only
   be an element from the list or so and exactly whats given
   

## Example Code: 
   enum Direction {
        North,
        South,
        East,
        West.
    }
   
## Variants with data: 
   Each variant of an enum can carry its own payload, and different variants
   can carry completely different shapes. The classic example from the Book:
   
   enum Message {
        Quit //no data
        Move {x:i32,y:i32}, // named fields (struct-like)
        Write (String),     (( single String))
        ChangeColor (i32,i32,i32)
    }

    One Enum type, 4 variants, 4 completely different shapes.
    This is the feature that makes Rust so different to the other languages.

## Example Code Here: 
   ```
   match pattern matching 
   
   pattern => value 
   
   fn double (n:Option<i32>) {
        match n {
            Some(value.i32) => Some (value*2);
            None => None,
        }
   }
   
   
   ```