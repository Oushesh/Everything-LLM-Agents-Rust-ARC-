## Objective: 
   Rust-CLI From Zero: 

   What will we build: datactl: CSV/JSON ETL Helper.

   CLI: A Cargo Workspace that splits the CLI from a sibling library so other internal tools can depend on the same parsing logic.

   A release artifact you can cargo install or downlaod as a static musl binary

   
   Key Concepts:
   datactl: CLI

   Clap, serde, CSV, anyhow, env_logger --> 

   Rust for data Engineering --> why correctness, speed and a single static binary matter for data tools.

   Rust analyzer --> and Github Copilot. 


## Architecture of Software Writing Rust:
   Just like in python you use several .py files and import into the main.py

   The simplest file: lib.rs file. In rust you can use the .rs file.