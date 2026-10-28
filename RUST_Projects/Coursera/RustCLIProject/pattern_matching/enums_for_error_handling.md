## Key Concepts:
   Using Enums as a way to handle errors when reading in files. Key idea to 
   cater for both the result when the type is OK and Error

   Example:
   ```
   rust 
   enum Result <T,E> 
   {
        Ok(T),
        Err(E),
   }


   use std::fs::File;

   fn main() {
        let greeting_file_result = File::open("hello.txt");



   } 
   ´´´
   
## Example of the Key Concept: 
   The T and E are generic type parameters: We'll discuss generics in more detail. 

   T-> Success
   E --> Error  

## Examples
   ```
   use std::fs::File;

   rust

   //In the example below we will call the file matching stuffs here

   fn main () {
        let greeting_file_result = File::open("hello.txt");

        let greeting_file = match greeting_file_result {
            Ok(file) => file,
            Err(error) => panic!("Problem opening the File: {error:?}),

        };

   }
   
   ´´´

## Matching on different Errors: 
   How to enhance the file opening here? 
   
   if the file does not exist, the code will panic and 


## Same code and matching on different Errors: 
   

## Same code but cleaner to read
   ```
   rust

   use std::io:fs::File;
   use std::io::ErrorKind;


   fn main () {
        let greeting_file = File::open("hello.txt).unwrap_or_else(|error|)

   }
   ´´´

## 

## References: 
   https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html

## 