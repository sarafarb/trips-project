import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private http = inject(HttpClient);

  private tripsUrl = 'http://localhost:3000/trips';

  private tripsSignal = signal<Trip[]>([]);

  trips = this.tripsSignal.asReadonly();

  tripsCount = computed(() => this.tripsSignal().length);

  loadTrips() {
    this.http.get<Trip[]>(this.tripsUrl)
      .subscribe(data => this.tripsSignal.set(data));
  }

  getTripById(id: number | string) {
    return this.http.get<Trip>(
      `${this.tripsUrl}/${Number(id)}`
    );
  }

  createTrip(trip: Trip) {
    return this.http.post<Trip>(
      this.tripsUrl,
      trip
    ).pipe(
      tap(newTrip => {
        this.tripsSignal.update(list => [
          ...list,
          newTrip
        ]);
      })
    );
  }

  updateTrip(
    id: number | string,
    trip: Partial<Trip>
  ) {
    return this.http.put<Trip>(
      `${this.tripsUrl}/${Number(id)}`,
      trip
    ).pipe(
      tap(updatedTrip => {
        this.tripsSignal.update(list =>
          list.map(t =>
            t.id === updatedTrip.id
              ? updatedTrip
              : t
          )
        );
      })
    );
  }

  deleteTrip(id: number | string) {
    const tripId = Number(id);

    return this.http.delete(
      `${this.tripsUrl}/${tripId}`
    ).pipe(
      tap(() => {
        this.tripsSignal.update(list =>
          list.filter(t => t.id !== tripId)
        );
      })
    );
  }

  filterByDestination(
    trips: Trip[],
    destination: string
  ): Trip[] {
    return trips.filter(t =>
      t.destination
        .toLowerCase()
        .includes(destination.toLowerCase())
    );
  }

  sortByPrice(
    trips: Trip[],
    asc: boolean = true
  ): Trip[] {
    return [...trips].sort((a, b) =>
      asc
        ? a.price - b.price
        : b.price - a.price
    );
  }

  sortByDate(
    trips: Trip[],
    asc: boolean = true
  ): Trip[] {
    return [...trips].sort((a, b) =>
      asc
        ? new Date(a.startDate).getTime() -
          new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime()
    );
  }
}