## Key Concepts and Recap

## 1. Recoverable vs unrecoverable errors:
   Recoverable errors are mostly handled by the Library being used.
   
   2. You should only panic! when you really dont know what do and there are no other alternatives.
   3. ? Operator works with println!("{?}") you print vectors, 
      but panics are not the normal error-handling channel. they signal
      "signal this program reached a state it should not have."
       --> Use expect as a reason to unwrap the producion code
     
      Example: 
      ```
      rust
      
      //lets say a vector GOOD: we just checked that the vector is not empty.
      
      if !items.is_empty() {
        let first = items.first().expect("items verified non-empty")
      }
      
      for a example in a vector
      let matrix: Vec<Vec<i32>> = vec![vec![1,2],vec![3,4]];
      
      let first_row: &Vec<i32> = matrix.first().expect("Vector should be non-empty");
      ´´´
   4. 