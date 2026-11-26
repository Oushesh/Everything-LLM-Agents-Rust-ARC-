## Functions and Closure: 
   Environment capture: 

   fn main() {
    let factor = 3; 
    let scale = |x| x * factor;


   }

   This is equivalent to: 

   fn scale (x:i32,factor:i32)-> i32 {x*factor}

## Advantages of that structure.
   In General its similar to python, lambda from functionality.
   But unlike python where it has runtime function objects and evaluate losures dynamically via lookups, in rust the compiler generates unique, anonymous struct at compile time that stores the captured environment (factor). 

## Deep Concepts: Fn, FnMut, FnOnce
   Fn, FnMut, FnOnce
   Fnonce is jsut without the closures it just operates once.
   FnMut -> is mutated. 


## Example Code: 
   ```
   rust
   #[derive(Debug, PartialEq, Copy,Clone)]
   enum ShirtColor {
        Red,
        Blue
   }

   struct Inventory {
        shirts: Vec<ShirtColor>, //in python it would look like: [{Red,Blue},{Red,Blue},{Red,Blue},{Red,Blue}]
   }

   //Next we implement a method impl:
   impl Inventory {
        fn giveaway(&self,user_preference: Option<ShirtColor>) -> ShirtColor {


        }

        //implement n methods here

        fn most_stocked(&self) -> ShirtColor {
        let mut num_red = 0;
        let mut num_blue = 0;

        for color in &self.shirts {
            match color {
                ShirtColor::Red => num_red += 1,
                ShirtColor::Blue => num_blue += 1,
            }
        }
        if num_red > num_blue {
            ShirtColor::Red
        } else {
            ShirtColor::Blue
        }
    }

    fn main () {
        let store = Inventory {
            shirts: vec![]
        };
    }


   }

   ```
## Functional Language Features: Iterators and Closures
   Iterators work on vectors: We can have an example here on iterators for Rust. 

   A value that produces sequence of items one at a time until it runs out. You ask for the next item, it gives you one, you keep asking and eventually it signal "no more". Under the hood this is the iterator trait, which requires a single method, 

   fn next (&mut self) --> Option <Self::Item>, Every Iterator in Rust -- whether you get it from Vec, from a HashMap, or from a range like 1..10 -- implements that same trait, which is how adapters like map and filter work uniformly across all of them.


    ```
    rust
    .iter() -- yields shared references (&T). The collection is borrowed; the original remains usable afterward. This is by far the most common.

    .iter_mut() -- 
    
    .into_iter() -- 
    ```

    ```
    rust
    // Example of rust iterator and lazy operators

    #[test]
    fn iterator_demonstration() {
        let v1 = vec![3,5,6];
        //use the iterators and define the iterator here

        let mut v1_iter = v1.iter();
        assert_eq!(v1_iter.next(),Some(&1));
        assert_eq!(v1_iter.next(),Some(&2));
        assert_eq!(v1_iter.next(),Some(&3));
        assert_eq!(v1_iter.next(),None);
    }
    ```

    ```
    fn iterator_sum() {
        let v1 = vec![];
        let v1_iter = v1.iter();

        let total: i32 = v1_iter.sum();
        assert_eq!(total,6);
    }
    ```

## Lazy Operators: 
   What makes Lazy Operators so important or crucial in language architecture? 

   Well lazy operators in fact, only access the data and perform the operation when needed not beforehand at once and save in memory. 

   For example lazy oeprators usueful in working with large lists where huge vectors have to be processed, sort of streaming its called.

## Lazy Operators and 
    * map(f) — apply closure f to each item.

    * filter(pred) — keep only items where pred returns true.

    * take(n) / skip(n) — keep the first / drop the first n items.

    * zip(other) — pair items with another iterator.

    * enumerate() — pair each item with its index.
    * 

## When to use collect and when not to use .collect() in 
   .iter ()
    
   I would use .collect() if I plan to return the output as a vector and not any single variable. 

   For example if you use iterator methods like .map(), filter(), .take() and want a new Vec back at the end.


   Example Code

   ```
   rust

   let mut v1 = vec![1,2,3];
   v1.iter_mut().
   ```


## Why people prefer to use iterators over manual for loops
   Even though a for loop is eager and straight forward


   Example Code below

   ```
   let v1 = vec![1,2,3];
   //create a new vector v2 where we push and update the results later
   let mut v2 = Vec::with_capacity(v1.len()); //what .collect () does internally

   for x in &v1 {
        v2.push(x+1);
   }
   ```

   * The Lazy Operation Function
   * Fused pipelines: if you have 4 steps (.filter().map().skip().take()) an iterator chain runs all 4 steps in a single pass no need for tempoerary vec between each overlap
   * No bounds checking overhead: Looping by index from o to the last index and checking you go out over the length of the array or vector.

## Practical Scenarios
   Scenario 1: Transforming a sales dataset: 
   You have Vec<Sale> and want the sum of amount for sales in region "EU":



   ```
   rust:
   Transforming a sales dataset: 

   let total: f64 = sales
    .iter().filter(|s| s.region == "EU").map(|s| s.amount).sum();
   ```

## Secnario 3: Why lazy matters
   You write this and expect it to print something: 
   
   ```
   let v = vec![1,2,3,4];
   v.iter().map(|x| {
    println!("seeing {x}");
    x*2

   });
   ```

## Scenario 4: 
   trait Drawable {
        fn draw (&self);
   }

   struct Button {
        label: String,
   }

   struct TextBox {
    text: String,
   }


   //impl in Rust is more methods in classes
   //Default constructor.

   impl Drawable for TextBox {
    fn draw (&self) {
        //add the code for TextBox here
        println!("Drawing button: {}",self.lable);

        //Here you can add all the stuffs here for drawing.
    }

    impl Drawable for Button {
        fn draw (&self) {
            println!("Drawing button: {}",self.label);
        }
    }


   }

   fn render_all<T:Drawable> (items: &Vec<T>)
   {    
        for item in items {
            item.draw();
        }
   }


   fn main() {
        l


   }