## Key Concepts of Rust:
   In Rust you can build and assign the functions and expression evaluation direclty to variables.

   Example:

   
   ```
   rust 

   fn main () {
    let number: i32 = 7;
    let label: &str = if number <=10 {"small"} else {"big"};

    println! {"The number {} is {label}", number};

    for n in 1..=5 {
        if n % 3 == 0 {
            println! {"{n} is divisible by 3"};
        }
    }

    //There are also other good things with rust:
    // match

   }
   ´´´

## Looping Concepts1: while

   ```
   rust 
   fn main () {
    let mut n: i32 = 3;

    while n>0 {println!{"{}",n}; n-=1;}
   }
   ´´´

## Looping Concepts2: loop 
   Refernence: https://doc.rust-lang.org/rust-by-example/flow_control/loop.html

   In Rust you loop with loop and break condition. 
   ```
   rust

   //Loop by default uses the infinite look --> inside {} add break to break the look. 
   
   fn main () 
   {
    // Infinite Loop 
    let mut count : i32 = 0;
    loop {
        count +=1;
        if count ==3 {
            println!("counter is {}",count);

            //continue; //This will continue the loop 
        }

        //you can add else here or else if and then 
        //else or just another if 

        if count ==5 {
            println!{"Ok, desired number {}reached",count};
            break;
        }
        
    }
   }
   ´´´
## Looping Concept3: foo strategy of the for loop
   
   ```
   rust
   fn main () 
   {
        //Looping strategy
        for i in 1..=5 
        {
            println! {"{i}"}
        } 
   }
   ```