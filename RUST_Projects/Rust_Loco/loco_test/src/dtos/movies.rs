use sea_orm::prelude::DateTimeWithTimeZone;
use ts_rs::TS;

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct MovieDto {
    #[ts(type = "number")]
    pub id: i64,
    pub title: Option<String>,
    #[ts(type = "string")]
    pub created_at: DateTimeWithTimeZone,
    #[ts(type = "string")]
    pub updated_at: DateTimeWithTimeZone,
}

impl From<crate::models::_entities::movies::Model> for MovieDto {
    fn from(m: crate::models::_entities::movies::Model) -> Self {
        Self {
            id: m.id,
            title: m.title,
            created_at: m.created_at,
            updated_at: m.updated_at,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct CreateMovie {
    pub title: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, TS)]
pub struct UpdateMovie {
    pub title: Option<String>,
}
