#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20261123_124041_listings;
mod m20261123_124217_bookings;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20261123_124041_listings::Migration),
            Box::new(m20261123_124217_bookings::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}
