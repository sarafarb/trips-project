import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Trip } from '../models/trip.model';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private http = inject(HttpClient);

  private tripsUrl = 'http://localhost:3000/trips';
  private bookingsUrl = 'http://localhost:3000/bookings';

  private tripsSignal = signal<Trip[]>([]);
  private bookingsSignal = signal<Booking[]>([]);

  trips = this.tripsSignal.asReadonly();
  bookings = this.bookingsSignal.asReadonly();

  tripsCount = computed(() => this.tripsSignal().length);

 
  loadTrips() {
    this.http.get<Trip[]>(this.tripsUrl)
      .subscribe(data => this.tripsSignal.set(data));
  }

  getTripById(id: number | string) {
    const tripId = Number(id);
    return this.http.get<Trip>(`${this.tripsUrl}/${tripId}`);
  }

  addTrip(trip: Trip) {
    return this.http.post<Trip>(this.tripsUrl, trip).pipe(
      tap(newTrip => {
        this.tripsSignal.update(list => [...list, newTrip]);
      })
    );
  }

  updateTrip(id: number | string, trip: Partial<Trip>) {
    const tripId = Number(id);
    return this.http.put<Trip>(`${this.tripsUrl}/${tripId}`, trip).pipe(
      tap(updatedTrip => {
        this.tripsSignal.update(list =>
          list.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        );
      })
    );
  }
  
  createTrip(trip: Trip) {
    return this.http.post<Trip>(this.tripsUrl, trip).pipe(
      tap(newTrip => {
        this.tripsSignal.update(list => [...list, newTrip]);
      })
    );
  }

  deleteTrip(id: number | string) {
    const tripId = Number(id);
    return this.http.delete(`${this.tripsUrl}/${tripId}`).pipe(
      tap(() => {
        this.tripsSignal.update(list =>
          list.filter(t => t.id !== tripId)
        );
      })
    );
  }


  loadBookings() {
    this.http.get<Booking[]>(this.bookingsUrl)
      .subscribe(data => this.bookingsSignal.set(data));
  }

  bookTrip(userId: number, tripId: number, people: number) {
    const booking: Booking = {
      id: Date.now(),
      userId,
      tripId,
      people,
    };

    this.http.post<Booking>(this.bookingsUrl, booking)
      .subscribe(created => {
        this.bookingsSignal.update(list => [...list, created]);
      });
  }

  cancelBooking(userId: number, tripId: number) {
    const booking = this.bookingsSignal().find(
      b => b.userId === userId && b.tripId === tripId
    );

    if (!booking) return;

    this.http.delete(`${this.bookingsUrl}/${booking.id}`)
      .subscribe(() => {
        this.bookingsSignal.update(list =>
          list.filter(b => b.id !== booking.id)
        );
      });
  }

  isUserBooked(userId: number, tripId: number): boolean {
    return this.bookingsSignal().some(
      b => b.userId === userId && b.tripId === tripId
    );
  }



  filterByDestination(trips: Trip[], destination: string): Trip[] {
    return trips.filter(t =>
      t.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  sortByPrice(trips: Trip[], asc: boolean = true): Trip[] {
    return [...trips].sort((a, b) =>
      asc ? a.price - b.price : b.price - a.price
    );
  }

  sortByDate(trips: Trip[], asc: boolean = true): Trip[] {
    return [...trips].sort((a, b) =>
      asc
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }
}