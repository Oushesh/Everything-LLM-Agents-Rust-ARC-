#![allow(clippy::unused_async)]
use axum::http::StatusCode;
use loco_rs::prelude::*;

use crate::{
    dtos::{
        bookings::{BookingDto, CreateBooking, UpdateBooking},
        common::{ApiError, Page},
    },
    models::_entities::bookings::{ActiveModel, Column, Entity},
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
) -> Result<Json<Page<BookingDto>>> {
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
        return Ok(not_found("booking not found"));
    };
    Ok(Json(BookingDto::from(model)).into_response())
}

#[debug_handler]
async fn create(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Json(params): Json<CreateBooking>,
) -> Result<Response> {
    let item = ActiveModel {
        listing_id: Set(params.listing_id),
        guest_id: Set(params.guest_id),
        check_in: Set(params.check_in),
        check_out: Set(params.check_out),
        guests_count: Set(params.guests_count),
        total_price_cents: Set(params.total_price_cents),
        status: Set(params.status),
        ..Default::default()
    };
    let item = item.insert(&ctx.db).await?;

    Ok((StatusCode::CREATED, Json(BookingDto::from(item))).into_response())
}

#[debug_handler]
async fn update(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
    Json(params): Json<UpdateBooking>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("booking not found"));
    };

    let mut item = model.into_active_model();
    item.listing_id = Set(params.listing_id);
    item.guest_id = Set(params.guest_id);
    item.check_in = Set(params.check_in);
    item.check_out = Set(params.check_out);
    item.guests_count = Set(params.guests_count);
    item.total_price_cents = Set(params.total_price_cents);
    item.status = Set(params.status);
    let item = item.update(&ctx.db).await?;

    Ok(Json(BookingDto::from(item)).into_response())
}

#[debug_handler]
async fn remove(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i64>,
) -> Result<Response> {
    let Some(model) = Entity::find_by_id(id).one(&ctx.db).await? else {
        return Ok(not_found("booking not found"));
    };

    model.into_active_model().delete(&ctx.db).await?;

    Ok(StatusCode::NO_CONTENT.into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("/api/bookings")
        .add("/", get(list))
        .add("/", post(create))
        .add("/{id}", get(get_one))
        .add("/{id}", put(update))
        .add("/{id}", delete(remove))
}
