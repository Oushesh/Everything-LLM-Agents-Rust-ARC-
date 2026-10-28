## Scenario 2: Debugging an aliasing Error
   
   A colleague write this and cannot understand why the borrow 
   checker rejects it of coure during compile time: 
   

    ```
    rust 
    
    let mut s = String::from("hello");
    let r1 =&s;  //shared borrow vecause of referemce
    let r2 = &mut s; //exclusive borrow -ERROR
    
    Compile Error --> a value can have one exlculse (&mut) reference
    or any number of shared (&) references, but never both at the same time.
   
    The reason the code fails is that r1 is still in score when r2 is created and you have race conditions
    
    
    ´´´

## Questions to consider: 
   * Why does Rust treat aliasing plus-mutation as a compile error rather than a runtime hazard? 
   Because the designers of the language at Firefox wanted to have all the checks at compile time.

   * What would go wrong at runtime in a language that permitted the same pattern silently? (Think about concurrent threads, iterator invalidation, and stale pointers.)
       
## Scenario 3: When does cleanup run? 
   """
   You write: 
   
   Every heap allocation is freed exaclty once, at a known and predictable
   point in the source code, with no runtime 
   garbage collector involved.
   
   Questions to consider: 
   * if you moved t into a helper function before the inner block closed, where would t's Drop now run?
     --> After the inner block is closed. provided after the helper function is called. 
   """
   
   ```
   rust
   
   struct Resource (&'static str);
   
   //This is basically implementing a method for the struct Resource
   
   impl Drop for Resource {
        fn drop (&mut self)
        {
            println!("Drop called for {}",self.0);
        }
   }
   
   fn helper (t:Resouces) {
        println!("Entereed helper");
        // work with t ...
        println!("Exiting helper");
   } // t's Drop rnus Right Here at the closing brace of 'helper'
   
   fn main() {
        {
            let t = Resource("target");   
            //
        }
   }
   
   ```
## 