use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "bookings",
            &[
                ("id", ColType::PkAuto),
                ("listing_id", ColType::BigInteger),
                ("guest_id", ColType::BigInteger),
                ("check_in", ColType::Date),
                ("check_out", ColType::Date),
                ("guests_count", ColType::BigInteger),
                ("total_price_cents", ColType::BigInteger),
                ("status", ColType::String),
            ],
            &[],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bookings").await
    }
}
