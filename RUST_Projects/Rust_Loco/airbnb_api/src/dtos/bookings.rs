use sea_orm::prelude::{Date, DateTimeWithTimeZone};
use ts_rs::TS;

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct BookingDto {
    #[ts(type = "number")]
    pub id: i64,
    #[ts(type = "number")]
    pub listing_id: i64,
    #[ts(type = "number")]
    pub guest_id: i64,
    #[ts(type = "string")]
    pub check_in: Date,
    #[ts(type = "string")]
    pub check_out: Date,
    #[ts(type = "number")]
    pub guests_count: i64,
    #[ts(type = "number")]
    pub total_price_cents: i64,
    pub status: String,
    #[ts(type = "string")]
    pub created_at: DateTimeWithTimeZone,
    #[ts(type = "string")]
    pub updated_at: DateTimeWithTimeZone,
}

impl From<crate::models::_entities::bookings::Model> for BookingDto {
    fn from(m: crate::models::_entities::bookings::Model) -> Self {
        Self {
            id: m.id,
            listing_id: m.listing_id,
            guest_id: m.guest_id,
            check_in: m.check_in,
            check_out: m.check_out,
            guests_count: m.guests_count,
            total_price_cents: m.total_price_cents,
            status: m.status,
            created_at: m.created_at,
            updated_at: m.updated_at,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct CreateBooking {
    #[ts(type = "number")]
    pub listing_id: i64,
    #[ts(type = "number")]
    pub guest_id: i64,
    #[ts(type = "string")]
    pub check_in: Date,
    #[ts(type = "string")]
    pub check_out: Date,
    #[ts(type = "number")]
    pub guests_count: i64,
    #[ts(type = "number")]
    pub total_price_cents: i64,
    pub status: String,
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct UpdateBooking {
    #[ts(type = "number")]
    pub listing_id: i64,
    #[ts(type = "number")]
    pub guest_id: i64,
    #[ts(type = "string")]
    pub check_in: Date,
    #[ts(type = "string")]
    pub check_out: Date,
    #[ts(type = "number")]
    pub guests_count: i64,
    #[ts(type = "number")]
    pub total_price_cents: i64,
    pub status: String,
}
