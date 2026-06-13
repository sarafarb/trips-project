import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/bookings';

  // 🔥 STATE מרכזי
  private bookingsSignal = signal<Booking[]>([]);

  // ✅ READ ONLY
  bookings = this.bookingsSignal.asReadonly();

  // 🧠 derived state
  bookingsCount = computed(() => this.bookingsSignal().length);

  // 📦 load all bookings
  loadBookings() {
    this.http.get<Booking[]>(this.apiUrl)
      .subscribe(data => {
        this.bookingsSignal.set(data);
      });
  }

  // ➕ create booking (optimistic update)
  bookTrip(userId: string |number, tripId: number, people: number) {
    const newBooking: Booking = {
      id: Date.now(),
      userId,
      tripId,
      people
    };

    this.bookingsSignal.update(list => [...list, newBooking]);

    return this.http.post<Booking>(this.apiUrl, newBooking)
      .subscribe();
  }

  // ❌ cancel booking (signal-first)
  cancelBooking(userId: string |number, tripId: number) {
    const booking = this.bookingsSignal()
      .find(b => b.userId === userId && b.tripId === tripId);

    if (!booking) return;

    this.bookingsSignal.update(list =>
      list.filter(b => b.id !== booking.id)
    );

    this.http.delete(`${this.apiUrl}/${booking.id}`)
      .subscribe();
  }

  // 🔎 check booking (pure computed style)
  isUserBooked(userId: string |number, tripId: number): boolean {
    return this.bookingsSignal().some(
      b => b.userId === userId && b.tripId === tripId
    );
  }

  // 👥 people count
  getBookingPeopleCount(bookingId: number): number {
    return this.bookingsSignal()
      .find(b => b.id === bookingId)?.people ?? 0;
  }

  // ✏️ update people
  setBookingPeople(bookingId: number, people: number) {
    this.bookingsSignal.update(list =>
      list.map(b =>
        b.id === bookingId ? { ...b, people } : b
      )
    );

    this.http.put(`${this.apiUrl}/${bookingId}`, {
      people
    }).subscribe();
  }

  // 🗑 delete booking (admin)
  deleteBooking(id: number) {
    this.bookingsSignal.update(list =>
      list.filter(b => b.id !== id)
    );

    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe();
  }
}