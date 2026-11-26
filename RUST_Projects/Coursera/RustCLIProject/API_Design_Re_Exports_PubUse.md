## Part 1: API Design, Re-Exports and pub use
   1. Why pub use belongs to API Design rather than implementation.

   pub on an inner item is a compiler-level acess permission: it answers "May code outside this exact module boundary see this item?"


   pub use is an architectural contract: it answers "Where should consumers think this item in my public surface area?"

   
   What 'pub use' buys over plain pub on the inner item: 

   * Decoupling internal file layout from the public api: 


## Part 2: Refactoring main.rs, MOdularity, and Subdirectories
   Why moving a function into parser.rs doesn't expose it by default
   In Rust, items are private by default to the module they are declared in. Moving a function 



## Scenario B: Extracted into a Subfolder (After)
   parser.rs grows too large, so its logic is split into token.rs and grammar.rs inside the new directory src/parser.

   So we have the following folderstructure as defined below: 


## New Folder Structure: 
   src/
├── io.rs
├── main.rs
├── parser.rs         <-- Gateway file for the parser module
├── parser/
│   ├── grammar.rs    <-- Submodule of parser
│   └── tokens.rs     <-- Submodule of parser
└── summary.rs

   --> Consequently we 


## src/main.rs
    ```
    rust
    mod io;
    mod parser;
    mod summary;

    fn main() {
        let tokens = parser::parse("alpha beta gamma");
        println!("Tokens: {:?}", tokens);
    }

    ```
    In main.rs we define all the 3 different modules as mod --> module

## in parser.rs
   Parser.rs parse or define the structures of the submodule or subfolder parser/

   So we have the following changes in the code then: 
   src/parser.rs

   ```
   rust
   
   // 1. Declare the child files inside the 'parser/' folder
   pub (crate) mod grammar;
   pub (crate) mod tokens; 

   //2. Re-export key items (facade pattern)
   pub (crate) use grammar::parse;
   pub (crate) use tokens::Token;

   ```
   2. inside src/main.rs it requires zero change because parser.rs which in turn define the submodules of the folder parser/ takes care of everything.


   src/main.rs --> 

   ```
   rust 
   mod io;
   mod parser;
   mod summary;

   fn main() {
        // Calls parser: parse directly as if nothing changed or moved!
        let tokens = parser::parse("alpha beta gamma");
        println!("Tokens: {:?}", tokens);
   }
   ```

   As a reference from ChatGPT here you go:
   parser.rs no longer contains the parsing algorithms directly. It registers the submodules and re-exports the items dont have to reach into nested subfolders.

    3. 