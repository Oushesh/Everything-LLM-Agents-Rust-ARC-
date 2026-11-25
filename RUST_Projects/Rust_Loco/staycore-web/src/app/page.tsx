"use client";

import { useEffect, useState } from "react";
import type { BookingDto } from "@/types/generated/BookingDto";
import type { CreateBooking } from "@/types/generated/CreateBooking";
import type { ListingDto } from "@/types/generated/ListingDto";
import type { Page } from "@/types/generated/Page";

export default function StayCoreBrowser() {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState("host@test.com");
  const [password, setPassword] = useState("Password123!");
  const [authError, setAuthError] = useState("");

  const [listings, setListings] = useState<ListingDto[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [selectedListing, setSelectedListing] = useState<ListingDto | null>(null);

  // Booking modal state
  const [checkIn, setCheckIn] = useState("2026-12-10");
  const [checkOut, setCheckOut] = useState("2026-12-14");
  const [guests, setGuests] = useState(1);
  const [bookingMsg, setBookingMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("staycore_token");
    const savedName = localStorage.getItem("staycore_name");
    if (savedToken) {
      setToken(savedToken);
      setUserName(savedName || "Guest");
    }
  }, []);

  useEffect(() => {
    if (token) fetchListings();
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setAuthError("Invalid credentials or Loco server offline.");
      return;
    }
    const data = await res.json();
    localStorage.setItem("staycore_token", data.token);
    localStorage.setItem("staycore_name", data.name);
    setToken(data.token);
    setUserName(data.name);
  }

  async function fetchListings() {
    const res = await fetch("/api/listings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data: Page<ListingDto> = await res.json();
      setListings(data.items || []);
    }
  }

  async function handleReserve() {
    if (!selectedListing || !token) return;
    setBookingMsg(null);

    const nights = Math.max(
      1,
      Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    );

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing_id: selectedListing.id,
        guest_id: 1,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        total_price_cents: nights * selectedListing.price_per_night_cents,
        status: "confirmed",
      } satisfies CreateBooking),
    });

    if (res.status === 409) {
      setBookingMsg({ text: "Selected dates are already booked.", ok: false });
    } else if (res.ok) {
      const booking: BookingDto = await res.json();
      setBookingMsg({ text: `Confirmed! Reservation #${booking.id}`, ok: true });
    } else {
      setBookingMsg({ text: "Booking failed. Check date range.", ok: false });
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md space-y-4">
          <h1 className="text-2xl font-bold text-[#FF385C]">StayCore</h1>
          <p className="text-sm text-gray-500">Sign in to browse and book stays</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Password"
          />
          {authError && <p className="text-xs text-red-600">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-[#FF385C] text-white font-semibold py-2.5 rounded-lg hover:bg-[#e03150] transition"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  const filtered = listings.filter((l) =>
    l.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  const previewNights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Navbar */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <span className="text-xl font-bold text-[#FF385C]">StayCore</span>

          {/* Airbnb Search Pill */}
          <div className="flex items-center border rounded-full shadow-sm px-4 py-2 gap-3 text-sm">
            <input
              type="text"
              placeholder="Search destination (e.g. Munich)..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="outline-none w-56"
            />
            <span className="bg-[#FF385C] text-white px-3 py-1 rounded-full text-xs font-semibold">
              Search
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Hi, {userName}</span>
            <button
              onClick={() => {
                localStorage.removeItem("staycore_token");
                setToken(null);
              }}
              className="border rounded-full px-3 py-1.5 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Listing Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-20">
            No listings found. Create one via POST /api/listings or clear your search filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedListing(item);
                  setBookingMsg(null);
                  setGuests(1);
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="flex justify-between font-semibold text-sm">
                  <span>{item.city}</span>
                  <span>★ 4.95</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{item.title}</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">
                    €{(item.price_per_night_cents / 100).toFixed(0)}
                  </span>{" "}
                  night
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
            <img
              src={selectedListing.image_url}
              alt={selectedListing.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedListing.title}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedListing.city} · Max {selectedListing.max_guests} guests
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-600">{selectedListing.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500">
                  Guests
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedListing.max_guests}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>

              {bookingMsg && (
                <p
                  className={`text-sm font-medium ${bookingMsg.ok ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {bookingMsg.text}
                </p>
              )}

              <button
                onClick={handleReserve}
                className="w-full bg-[#FF385C] text-white font-semibold py-3 rounded-xl hover:bg-[#e03150] transition"
              >
                Reserve · €
                {previewNights * (selectedListing.price_per_night_cents / 100)} total
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}