## Key Concepts: 
   Move, Copy and Clone
   
   Copy: int, 
   Not Copy: Vec, Heatmap, String. Why ??
   Calling .clone() on a string will create a deep copy 
   of that string and genuinely allow you to build 
   a copy and help you in your programm

## Examples and Diverse Stuffs: 
   
## Examples:
   ```
   rust
   
   fn main () {
     let s1: String = String::from("hello");
     let s2: String = s1.clone();
     prlintln!("{} {}",s1,s2);
   }
   
   An effidient way to pass arguments is references
   to avoid copy and stuffs.
   
   
   Empecent: & 
   fn main() {
      let msg: String = String::from("hello");
      add_exclamantion(&msg);
      println!("{}",msg);
   }
   
   //The & allows you to pass the variable 
   fn add_exclamation(s:&string)
   {
        s.push_str(string:"!");
   }
   
   

   ```