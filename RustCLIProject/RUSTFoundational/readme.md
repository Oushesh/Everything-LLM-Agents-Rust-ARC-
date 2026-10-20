## The promise of Rust:

## What is Rust ? 
    The promise to provide all the advantages of the other languages without the drawbacks of C and C++

    So it promises to provide the memroy safety and the performance of C and C++ at compile time.

    This is done through a system called ownership.


### The features of Rust :
    1. Memory Safety
    2. Performance
    3. Concurrency
    4. No garbage collector
    5. Interoperability (FFI)
    6. Modern Tooling
    7. Expressive Type System
    8. Fearless Concurrency

## Why did the Rust Foundation create Rust ? 
    Rust was created by Mozilla to address the shortcomings of C and C++. 

## Give me examples of code that explicitly explain the advantages from above from point 1 to 8: 
   
    ## 1. Memory Safety
        In C and C++ we can have null pointer derefrencing.
        But in Rust we cannot have null pointer derefrencing.
        Example:-

        Rust code:
        ```rust
                      
        ```
    
## Memory Safety (Ownership & Borrowing)
   Rust precents use-after-free, double frees, and dangling pointers at compile time through ownership rules. Python relies on reference counting, garbage collection and dynamic naming bindings.

   Code Example:-

   ```
    rust: 
    fn main() {
        let s1 = String::from("hello");
        let s2=s1; // Ownership moves to s2; s1 is invalidated.
        // println!("{s1}"); //COMPILE ERROR: value used here after move
        println!("{s2}");
    } 
   ```

   ```
   python:
   s1 = ["hello"]
   s2 = s1 # Copies the reference; both point to the same list
   s2.append("world")
   print (s1)
   ```

## 2. Performance (Zero-Cost Abstractions)
   Rust compiles direclty to machine code via LLVM without an interpreter loop or dynamic dispatch. High-level iterators optimize down into raw assembly loops.

   ```
   Rust
   fn main() {
        // Compiles down to the exact equivalent of an unrolled C loop

        let sum: u64 = (1..=1_000_000).filter(|x| x % 2 == 0).sum();
        println!("{sum}");
   }
   ``` 

   ```
   Python
   # Evaluated through bytecode execution and object wrapping per number: 
   total = sum(x for x in range(1,1_000_0001) if x % 2==0)
   print (total)
   ```

## 3. Concurrency (OS Thrads )
   Rust spins up native OS threads capable of running CPU-bound computations simultaneously across multiple cores. Standard CPython threads share a single Global Interpreter Lock (GIL).

   ```
   use std::thread;

   fn main () {
    let handle = thread::spawn(
        ||{
            println!("Running on a separate native core");
        }

    );
    handle.join().unwrap(); // Wait for thread completion
   }
   ```

   ```
   Python
   import threading

   def task():
        print("Running in thread (still bound to GIL for CPU tasks)")

    t = threading.Thread(target=task)
    t.start()
    t.join()
   ```

## 4. No garbage collector (Deterministic Cleanup/RAII)
   Rust frees heap allocations microsecond the owning variable exits its scope ("Drop Trait"). Python uses reference counting backed by a periodic cyclic garbage collector.

   ```
   Rust: 
   {
     let file = std::fs::File::open("log.txt");
     // file operates here ...
   } // Exact point file descriptor is closed and memory is freed (no GC pause) 
   ```

   ```
   Python
   # Python can mimic deterministic closure via context managers:
   with open("log.txt") as file:
      pass 

   # without 'with', cleanup waits for refcount hit to 0 or cyclic GC run. 
   ```

## 5. Interoperability (FFI/Calling C)
   Rust can bind directly to external C libraries with zero runtime wrapper overhead using the extern "C" declaration. Python typically  

   tbd

   ```

## 6. Modern Tooling (Cargo vs Pip/Venv)
   Rust bundles package management, compilation, testing and documentation into a single CLI tool (cargo). Python typically coordinates multiple independent 


## 8. Fearless Concurrency (Data Race Prevention at Compile Time)
   Rust checks thread safety using Send and Sync traits: attempting to mutate unsynchronized shared memory across threads triggers a compiler error. Python allows race conditions freely unless explicit locks are mutually managed.
   
   ```
   Rust: rust checks thread safety at compile time. 
   How does rust deal with this with Send and Sync traits: attempting to mutate unsynchronized shared memory across threads triggers a compiler error. Python allows race conditions freely unless explicit locks are mutually managed. 

    What does this race condition imply? 
    Example : 

        Rust: 

        use std::sync::{Arc, Mutex};
        use std::thread,

        fn main() {
            let counter = Arc::new(Mutex::new(0));
            let c = Arc::clone(&counter);

            thread::spawn(
                move || {
                    let mut num = c.lock().unwrap(); 
                    *num += 1;
                }
            )
        }
   ```

    ```
    Python: 
    import threading

    class ThreadSafeCounter:
       def __init__(self):
          self.value = 0
          self._lock = threading.Lock()

        def increment(self):
            with self._lock:
                self._value += 1

        @property
        def value(self):
            with self._lock:
               return self._value
    
    
    counter = ThreadSafeCounter()

    # Workers only call the thread-safe method; no 'global' needed
    threads = [threading.Thread(
        target=counter.increment) for _ in range(1000)
    ]

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    print(counter.value)
    ```

    


    



   

   