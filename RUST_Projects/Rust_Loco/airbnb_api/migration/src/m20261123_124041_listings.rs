use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "listings",
            &[
                ("id", ColType::PkAuto),
                ("host_id", ColType::BigInteger),
                ("title", ColType::String),
                ("description", ColType::Text),
                ("city", ColType::String),
                ("price_per_night_cents", ColType::BigInteger),
                ("max_guests", ColType::BigInteger),
                ("image_url", ColType::String),
                ("is_active", ColType::Boolean),
            ],
            &[],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "listings").await
    }
}
