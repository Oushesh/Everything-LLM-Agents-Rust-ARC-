## Key Concepts

## Example: 
   ```
   rust

   
fn main () {
    let numbers: [i32; 5] = [1,2,3,4,5];
    let months : [&str;3] = ["Jan","Feb","March"];


    println!("{}",numbers[0]);
    println!("{}",numbers.len());

    //We can slice the vectors just like in python:
    let slice_inkl = &numbers[0..=2];

    println!("{:?}",slice_inkl); //you have to unwrap it.
    
    // slice_exkl is where you dont have the boundary 
    //value included
    let slice_exkl = &numbers[0..2];
    println!("{:?}",slice_exkl);
}
```

## Rule of Best Practice: 
   use the vector templated idea and make a program out of it.

   ```
   rust 
   //The core idea is here to use the vector of Rust 
   // and get the best out of it.

   fn main () {
    // 1. Initialising a vector from examples
    let mut months: Vec<&str> = vec!["Jan","Feb","March"];
    months.push("April");
    months.push("May");
    

    // 2. you can also initialise with zeros and 
    // sequentially push the elements into the vectors

    let months: Vec<&str> = Vec::new();
    months.push("Jan");
    months.push("Feb");
    months.push("March");

    //For vector or stuffs you have to unwrap it.
    println!("{:?}",months); 
   }
   ```

   ```
   python:
   from typing import Any,List,Tuple, defaultdict
   def main():
      months = []
      months.append("Jan")
      months.append("Feb")
      months.append("March")

      print ("months:{}",months)
      return None

   if __name__ == "__main__":
       main()
   ´´´

