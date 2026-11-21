## Core Concepts

## CSV::ReaderBuilder is the seam for parser configuration.


## 10 million rows in memory is the wrong shape

## Where in the loader would you place the connn.transaction() call so the entire load is one atomic unit, and 


## Serialisation and Deserialisation in JSON: 
   Usually if you wanna do that you need the models of the table headers as struct and the serde_json to serialise or deserialise the code.
   

```
rust:
    //serde and serde_json are here.
    //Deserialisation of serde json

    fn default_unit() -> String {
        "celsius".to_string()
    }

    #[derive(Debug, Deserialize, Serialize)]
    struct Sensor {
        device_id: String, 
        temperature: f64,
        humidity: Option<f64>,
        timestamp: String,

        // missing key -> "celsius" via function
        #[serde(default="default_unit")]
        unit: String,
    }

    fn main() -> Result<()>
    {
        let conn = Connection::open_in_memory()?;

        conn.execute_bath(
            "CREATE TABLE sensor_readings(
                id            INTEGER PRIMARY KEY,
                device_id.    TEXT.   NOT NULL,
                temperature   REAL    NOT NULL,
                humidity.     REAL,
                timestamp.    TEXT.   NOT NULL,
                raw_json.     TEXT 
            );,
            "
        )?;

        let path = std::env::args().nth(1).(|| {
            // This closure only runs when `cell` is `None`
            "sensors.json".to_string()
        });
        let json_input = fs::read_to_string(&path).(|| {
            // This closure only runs when `cell` is `None`
            //here you can put whatever here.
        });

        let readings: Vec <Sensor> = 
            serde_json::from_str(&json_input).expect("valid JSON");
        
        let tx = conn.unchecked_transaction()?;


        //loop over the readings and insert them inside 
        for r in &readings {
            let raw = serde_json::to_string(r).ok();
            tx.execute(
            "INSERT INTO sensor_readings(device_id, temperature,humidity,temperature,raw_json)")

        }


    }
```

//That would give me sensor reading and what not.


// brew install --cask db-browser-for-sqlite. 