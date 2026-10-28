## Key Concepts: 
    ```
    rust
    std::collections::Hashmap;
    ´´´

   * That's how hashmap is defined in rust.
   ```
   rust
   std::collections::Hashmap;
   fn main () {
        let mut scores: Hashmap<String, i32> = Hashmap::new(); //we use the constructor from the original library
        
        //Then we insert the values here also known as populating the Hashmap
        //IN python you would say hashmap = {}, then each line you could
        //say: hashmap["alpha"] = "beta", hasmap["gamma"] = 5
        //So your dictionary would be: hashmap = {"alpha":"beta","gamma":5}
        //len (hashmap) = 2
        
        scores.insert(String::from("Alice"),95);
        scores.insert(String::from("Bob"),87);
        println!("Alice scores,{}",scores["Alice"]); 
    }
´´´

## Examples
  ```
  rust 
  std::collections::Hashmap;

  ´´´