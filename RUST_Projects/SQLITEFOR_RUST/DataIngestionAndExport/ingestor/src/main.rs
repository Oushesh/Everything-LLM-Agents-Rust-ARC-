use std::fs;
use rusqlite::{params,Connection,Result};
use serde::{Deserialize,Serialize};


/*
how do I make Ingestor for Bulk ingestion
How do we declare the header: using struct -> match the table in sql or so.

csv::ReaderBuilder 

400 000 EUR -> 40 000 000 EUR -> 400 000 000 EUR -> 4B EUR -> 4 000 000 000 EUR

*/

/*
implement this for the bulk ingestion.

Holding 10 million rows in memory is the wrong shape.

*/

//Ideas: First we define a struct as in the header of the table of sql

fn default_unit () -> String {
    "celsius".to_string()
}


#[derive(Debug,Deserialize, Serialize)]
struct Sensor {
    device_id: String, 
    temperature:  f64,
    humidity:     Option<f64>,
    timestamp:    String,

    //missing key -> "celsius" via function
    #[serde(default = "default_unit")]
    unit:String,
}


fn main() -> Result <()> {
    // 1. Open an on-device file database (persists after program ends)
    // 2. You could also do in Memory here but after device ends its good.

    // 2. Create table if it doesn't already exist
    let conn = Connection::open("sensors.db")?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS sensor_readings(
            id             INTEGER  PRIMARY KEY,
            device_id      TEXT     NOT NULL,
            temperature    REAL     NOT NULL,
            humidity       REAL, 
            timestamp      TEXT     NOT NULL,
            raw_json       TEXT
        );",
    )?;

    // 3. Get File path from CLI agreement, or fall back 
    let path = std::env::args().nth(1).unwrap_or_else(|| {
        println!("No file argument provided,defaulting to sensors.json");
        "sensors.json".to_string()
    });

    // 4. Read the JSON File, or fall back to default JSON array if missing/unreadable
    let json_input = fs::read_to_string(&path).unwrap_or_else(|err| {
        eprintln!("Could not read '{}': {}. Using fallback data.", path, err);
        r#"[{"device_id": "fallback-01", "temperature": 21.5, "timestamp": "2026-11-20T12:00:00Z"}]"#
            .to_string()
    });
    
    // 5. Deserialize JSON into Vec <Sensor>
    let readings: Vec <Sensor> = serde_json::from_str(&json_input).expect("Input must be valid JSON");

    // 6. Start transaction and insert rows
    let tx = conn.unchecked_transaction()?;

    // tx.execute 
    for r in &readings {
        let raw = serde_json::to_string(r).ok();
        tx.execute(
            "INSERT INTO sensor_readings (device_id, temperature, humidity, timestamp, raw_json)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![r.device_id, r.temperature, r.humidity, r.timestamp, raw],
        )?;
    }
    // 7. Commit the transaction so changes are written to disk
    tx.commit()?;
    println!("Successfully inserted {} sensor readings into sensors.db", readings.len());
    Ok(())
}

// Running this code into termninal.
// 