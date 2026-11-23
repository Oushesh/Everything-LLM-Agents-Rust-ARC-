use sea_orm::prelude::DateTimeWithTimeZone;
use ts_rs::TS;

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct ListingDto {
    #[ts(type = "number")]
    pub id: i64,
    #[ts(type = "number")]
    pub host_id: i64,
    pub title: String,
    pub description: String,
    pub city: String,
    #[ts(type = "number")]
    pub price_per_night_cents: i64,
    #[ts(type = "number")]
    pub max_guests: i64,
    pub image_url: String,
    pub is_active: bool,
    #[ts(type = "string")]
    pub created_at: DateTimeWithTimeZone,
    #[ts(type = "string")]
    pub updated_at: DateTimeWithTimeZone,
}

impl From<crate::models::_entities::listings::Model> for ListingDto {
    fn from(m: crate::models::_entities::listings::Model) -> Self {
        Self {
            id: m.id,
            host_id: m.host_id,
            title: m.title,
            description: m.description,
            city: m.city,
            price_per_night_cents: m.price_per_night_cents,
            max_guests: m.max_guests,
            image_url: m.image_url,
            is_active: m.is_active,
            created_at: m.created_at,
            updated_at: m.updated_at,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct CreateListing {
    #[ts(type = "number")]
    pub host_id: i64,
    pub title: String,
    pub description: String,
    pub city: String,
    #[ts(type = "number")]
    pub price_per_night_cents: i64,
    #[ts(type = "number")]
    pub max_guests: i64,
    pub image_url: String,
    pub is_active: bool,
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct UpdateListing {
    #[ts(type = "number")]
    pub host_id: i64,
    pub title: String,
    pub description: String,
    pub city: String,
    #[ts(type = "number")]
    pub price_per_night_cents: i64,
    #[ts(type = "number")]
    pub max_guests: i64,
    pub image_url: String,
    pub is_active: bool,
}
