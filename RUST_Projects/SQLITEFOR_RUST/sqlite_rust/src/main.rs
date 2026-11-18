use rusqlite::{Connection, Result};
use std::error::Error;
use serde::Deserialize;

//Strategy is every data you wanna send to this sql connection you can use struct 
// and perform the CRUD operations in the talbe.
#[derive(Debug)]
struct Person {
    id: i32,
    name: String,
    data: Option <Vec<u8>>
}


// 1. Define a struct matching your csv headers
#[derive(Debug,Deserialize)]
struct PersonRow {
    name: String,
    age: i32,
}


//Add other projects or other functions here where needed: 
/*
fn bulk_insert_csv(conn: &mut rusqlite::Connection, csv_path: &str) -> Result<usize, Box<dyn Error>>
{
    // 2. Open File with BufReader so we never load the whole CSV into RAM
    //
}
*/






fn main() -> Result<()> 
{
    println!("Hello, world!");

    let conn  = Connection::open_in_memory()?;

    conn.execute(
        "
        CREATE TABLE person(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            data BLOB
        )",
        (), // empty list of parameters.
        )?;

    let me = Person {
        id: 0, 
        name: "Steven".to_string(),
        data: None,
    };

    //execute an sql command and add the data to the database
    //First we built the struct the second thing we do is updating the data.
    conn.execute(
        "INSERT INTO person (name, data) VALUES (?1, ?2)",
        (&me.name, &me.data),
    )?;

    let mut stmt = conn.prepare("SELECT id, name, data FROM person")?;
    let person_iter = stmt.query_map([], |row| {
        Ok(Person {
            id: row.get(0)?,
            name: row.get(1)?,
            data: row.get(2)?,
        })
    })?;

    for person in person_iter {
        println!("Found person {:?}", person.unwrap());
    }
    Ok(())
}



//next parsing CSV Files in Rust