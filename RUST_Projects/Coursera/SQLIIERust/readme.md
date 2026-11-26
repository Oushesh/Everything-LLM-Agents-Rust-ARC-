## SQLITE FOR RUST:

## SQLITE FOUNDATIONS:

   Advantages of using sqlx in Rust: 
   sqlx is complie safe in rust so you can avoid errors in sqlx vs normal sql even before running the code.

   However, sqlx will not gurnatee that other problems would not occur from the side of the datbase or cloud during deployment. Example if database became full.


   Example of the code is the following: 
   
   sqlx::query!()
   
   ```
   SQL
   
   ```

   ```
   rust

   struct User {
    id: i64,
    name: String, 
    bio: Option <String>, // must be Option <String> because 'bio' can be NULL
   }

   async fn get_users(pool:) -> Result <Vec<user>,sqlx::Error>{
        // Notice the exlamation mark(!) -> Compile-time checked macro
        sqlx::query_as!(User,"SELECT id, name,bio FROM users")
            .fetch_all(pool)
            .await
   }
   ```
## What sqlx cannot Catch at Compile Time? 
   While it eliminates syntax, schema, and type errors, it still returns a Result at runtime because external issues can happen while your app is running: 


## SQLITE FOR RUST:
   