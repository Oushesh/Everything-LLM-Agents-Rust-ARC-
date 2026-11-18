## Key Concepts: 
   To Bulk-insert rows in

## Maturin and how I helped companies win or so. 

## Python and Rust working together.
   Use pyo3 and make the 

## Complete Streaming Bulk-insert Pattern
   ```
   rust

   use csv::ReaderBuilder;
   use rusqlite::{params, Connection, Result};
   use serde::Deserialize;
   use std::error::Error; 
   use std::fs::File; 
   use std::io::BufReader; 

   // 1. Define a struct matching your CSV Headers
   #[derive(Debug, Deserialize)]
   struct PersonRow {
        name: String,
        age: i32,
   }

   fn bulk_insert_csv(conn: &mut Connection, csv_path: &str) -> std::result::Result <usize,Box<dyn Error>> {
        // 2. Open File with BufReader so we never load the whole csv into RAM

        let file = File::open(csv_path)?;
   }
   ```