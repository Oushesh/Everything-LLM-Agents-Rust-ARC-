## Key Concepts
   * String vs &str
   * Vec<T>
     growable heap array like C++ with push and pop
   * Hashmap <K,V>
      Similar to python dictionary --> {Key:Value}
      K: Key
      V: Value


## Example Code: 
   There are 2 ways to write or declare the string in Rust.
    1. String
    2. &str

    ```
    rust

    fn main () {
        let fruits: Vec<&str> = vec!["apple","orange","cherry"]
        
        println!("{}",fruits[1]);
        
        for f: &&str in &fruits {
            //loop and do some stuffs here
            println!("{}",f); 
            //you can also use other stuffs like
            //println!("{:?}");
        }
        //Get length of the vector
        println!("{}",fruits.len());
    }
    ```
     
## Get Method and Indexing for the Vectors
   get method 