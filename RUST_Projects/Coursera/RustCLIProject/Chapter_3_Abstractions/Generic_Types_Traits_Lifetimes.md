## Key Concepts:
   One of the abstraction method of Generics is the
   Traits and stuffs.
   

## Why it's important? 
   Generics (3.1.1), Traits(3.1.2) and Lifetimes(3.1.3)
   The 3 concepts fit so tightly in Rust they are best learned as 1 unit.
   
## Generics
   Generics is similar to template to C++
   But however the one in Rust is better than C++
   because .....   

   ```rust
     //WITH TEMPLATE OR Trait like they call it Rust
fn print_twice<T: std::fmt::Display>(val: T) {
    println!("{}", val);
    println!("{}", val);
}

//The code above will not compile because its not called in the main function

fn main() {
   print_twice(42); //Works. integers implement display
   print_twice("Hello world"); //Works: strings implement Display 
   print_twice(3.14); //works: float implements display
}

// What happens under the hood: Compiler compiles for both version
// like the integer, the 3.14 and the string 
```

```rust
     //You can also apply the same concept with struct
     struct Pair <T> {
        first: T,
        second: T,
}

fn main() {
   let p1: Pair<i32,i32> = Pair{first:10, second:20};
   let p2: Pair <&str,&str> = Pair{first:"hello",second:"world"};
   
}

//In this case, both the code the i32 and string are used as references for the 
// compilation. Rust compile both versions so you have 2 binaries and they are called
// upon different data type invocation



```

```rust
     // fn_largest_i32 
     fn_largest_i32(list: &[i32]) {


}

fn main() {
   let p1: Pair<i32,i32> = Pair{first:10, second:20};
   let p2: Pair <&str,&str> = Pair{first:"hello",second:"world"};
   
}

//In this case, both the code the i32 and string are used as references for the 
// compilation. Rust compile both versions so you have 2 binaries and they are called
// upon different data type invocation



```

```rust
     // The hardest code main.rs
fn main() {
  
}

fn largest<T:PartialOrd + Copy> (list:&[T]) -> T {
   let mut largest: T = list[0];
   
   for &item:T in list {
      if item> largest{largest=item;}
   } 
   return largest;
   //largest
}

//In this case, both the code the i32 and string are used as references for the 
// compilation. Rust compile both versions so you have 2 binaries and they are called
// upon different data type invocation PartialOrd
// it cannot implement or compare operations > and <



```


## Traits
    Traits is like method definition (abstract) to be later defined 
    for a specific struct or function in the future.
    In python its similar to the ABC abstract class.


```rust
   

```
## Lifetimes
   Dangling Pointers.
   How does rust fix this problem? 
   The concept of borrow checker. Only 1 activated reference at a time.
   
   This is concept of borrow and check. Sync borrow and send: 
   
   The way you implement this is via: Arc Mutex
   Arc: Atomic Reference Counter -> 
   Mutex: Mutual Exclusion -> Handles Safe mutability. Because Arc only hands
   out shared immutable referenes (&T), you need interior mutability to modify
   the data safely without data races.

   Together (Arc<Mutex<T>>): 
   Arc solves how long the data lives across threads, and Mutex solves who is allowed to 
   mutate it any given moment.

   

   