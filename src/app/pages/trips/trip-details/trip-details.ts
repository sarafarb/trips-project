import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, of } from 'rxjs';

import { BookingsService } from '../../../services/bookings';
import { TripsService } from '../../../services/trips';
import { AuthService } from '../../../services/auth';
import { Trip } from '../../../models/trip.model';
import { TripForm } from '../../../components/trip-form/trip-form';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [TripForm],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css'
})
export class TripDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);

  private rawId = toSignal(
  this.route.paramMap.pipe(
    map(params => params.get('id'))
  ),
  {
    initialValue: null
  }
);
  private editQuery = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('edit') === 'true')),
    { initialValue: false }
  );

  id = computed(() => {
    const raw = this.rawId();
    if (!raw || raw === 'new') return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  });

  isNew = computed(() => this.rawId() === 'new');
  isEditing = computed(() => this.isNew() || this.editQuery());

  trip = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => {
        if (id === null) return of(null);
        return this.tripsService.getTripById(id);
      })
    ),
    { initialValue: null }
  );

  currentUser = this.authService.currentUser;
  userId = computed(() => String(this.currentUser()?.id || '0'));

  isBooked = computed(() => {
    const user = this.currentUser();
    const currentTrip = this.trip();
    if (!user || !currentTrip) return false;
    return this.bookingsService.isUserBooked(String(user.id), Number(currentTrip.id));
  });

  bookTrip() {
    const user = this.currentUser();
    const trip = this.trip();
    if (user && trip) {
      this.bookingsService.bookTrip(String(user.id), Number(trip.id), 1);
    }
  }

  cancelBooking() {
    const user = this.currentUser();
    const tripId = this.id();
    if (!user || tripId === null) return;

    this.bookingsService.cancelBooking(String(user.id), tripId);
  }

  setPeople(quantity: number) {
    const user = this.currentUser();
    const tripId = this.id();
    if (!user || tripId === null) return;

    this.bookingsService.setBookingPeople(String(user.id), tripId, quantity);
  }

  peopleCount = computed(() => {
    const user = this.currentUser();
    const tripId = this.id();
    if (!user || tripId === null) return 0;

    return this.bookingsService.getBookingPeopleCount(String(user.id), tripId);
  });

  back() {
    window.history.back();
  }
}