#![allow(clippy::unused_async)]
use axum::http::StatusCode;
use loco_rs::prelude::*;

use crate::{
    dtos::{
        common::{ApiError, Page},
        listings::{CreateListing, ListingDto, UpdateListing},
    },
    models::_entities::listings::{ActiveModel, Column, Entity},
};

/// Build a 404 response shaped as the [`ApiError`] envelope.
fn not_found(message: &str) -> Response {
    let error = ApiError {
        code: "not_found".to_string(),
        message: message.to_string(),
        details: None,
    };
    (StatusCode::NOT_FOUND, Json(error)).into_response()
}

#[debug_handler]
async fn list(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Query(pagination): Query<query::PaginationQuery>,
) -> Result<Json<Page<ListingDto>>> {
    let res = query::paginate(
        &ctx.db,
        Entity::find().order_by_asc(Column::Id),
        None,
        &pagination,
    )
    .await?;

    Ok(Json(Page::from_query(res)))
}

#[debug_handler]
async fn get_one(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("listing not found"));
    };
    Ok(Json(ListingDto::from(model)).into_response())
}

#[debug_handler]
async fn create(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Json(params): Json<CreateListing>,
) -> Result<Response> {
    let item = ActiveModel {
        host_id: Set(params.host_id),
        title: Set(params.title),
        description: Set(params.description),
        city: Set(params.city),
        price_per_night_cents: Set(params.price_per_night_cents),
        max_guests: Set(params.max_guests),
        image_url: Set(params.image_url),
        is_active: Set(params.is_active),
        ..Default::default()
    };
    let item = item.insert(&ctx.db).await?;

    Ok((StatusCode::CREATED, Json(ListingDto::from(item))).into_response())
}

#[debug_handler]
async fn update(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
    Json(params): Json<UpdateListing>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("listing not found"));
    };

    let mut item = model.into_active_model();
    item.host_id = Set(params.host_id);
    item.title = Set(params.title);
    item.description = Set(params.description);
    item.city = Set(params.city);
    item.price_per_night_cents = Set(params.price_per_night_cents);
    item.max_guests = Set(params.max_guests);
    item.image_url = Set(params.image_url);
    item.is_active = Set(params.is_active);
    let item = item.update(&ctx.db).await?;

    Ok(Json(ListingDto::from(item)).into_response())
}

#[debug_handler]
async fn remove(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("listing not found"));
    };

    model.into_active_model().delete(&ctx.db).await?;

    Ok(StatusCode::NO_CONTENT.into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("/api/listings")
        .add("/", get(list))
        .add("/", post(create))
        .add("/{id}", get(get_one))
        .add("/{id}", put(update))
        .add("/{id}", delete(remove))
}
