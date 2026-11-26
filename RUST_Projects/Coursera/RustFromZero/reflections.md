## Rust from Zero: 
   Move vs Copy vs Clone

   Primitive types implement copy and are duplicated.

## Predict before running: 
   Will c.as_ptr() == d.as_ptr()?


## Exerciese 4: Result and the ? Operator
   Demo: i232_result_question.rs


## Vectors in General: 
   Strong Lists of Values with Vectors: 

   Vectors can be initiaised different ways for example using the default vector constructor:

   New Vector: 
   ```
   rust
   let v: Vec<i32> = Vec::new();
   ```


   Here we are not adding values to this vector yet. Its just initialised.

   You use push to add values interatively or just statistically declaure them as: 

   ```
   rust
   let v = vec![1,2,3];
   ```

   ```
   let mut v = Vec::new();

   //without mutual you cannot push since it will alter vectors

   v.push(5);
   v.push(6);
   v.push(7);
   v.push(8);
   ```

   ```
   rust
   let v = vec![1,2,3,4,5];
    // This is static vector initialisation.
   ```

   ```
   rust: 
   v.get(2);
   if its not inside this boundary, we will get None as output so we don't crash the program. 
   ```


   ```
   add the details of the code here 

   ```

   ```
   System Design in Rust ? 
   ```

