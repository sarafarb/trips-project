import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TripsService } from '../../../services/trips';
import { AuthService } from '../../../services/auth';
import { BookingsService } from '../../../services/bookings';

import { TripCard } from '../../../components/trip-card/trip-card';
import { FilterBar } from '../../../components/filter-bar/filter-bar';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-trips-all',
  standalone: true,
  imports: [TripCard, FilterBar, ConfirmDialog],
  templateUrl: './trips-all.html',
  styleUrl: './trips-all.css'
})
export class TripsAll implements OnInit {
  // Services
  private tripsService = inject(TripsService);
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  // State
  filter = signal({
    destination: '',
    date: '',
    maxPrice: null as number | null
  });

  sortBy = signal<string>('');
  showDialog = signal(false);
  selectedTripId = signal<number | null>(null);

  // Reactivity
  currentUser = this.authService.currentUser;
  isAdmin = computed(() => !!this.currentUser()?.isAdmin);

  ngOnInit() {
    this.tripsService.loadTrips();
    this.bookingsService.loadBookings();
  }

  // Computed
  filteredTrips = computed(() => {
    let list = [...this.tripsService.trips()];
    const { destination, date, maxPrice } = this.filter();
    const currentSort = this.sortBy();

    if (destination) {
      list = list.filter((t) =>
        t.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (date) {
      list = list.filter((t) => {
        const tripDate = (t as any).date || (t as any).startDate;
        return tripDate && new Date(tripDate) >= new Date(date);
      });
    }

    if (maxPrice !== null) {
      list = list.filter((t) => t.price <= maxPrice);
    }

    if (currentSort === 'date') {
      list.sort(
        (a, b) =>
          new Date((a as any).date || (a as any).startDate || 0).getTime() -
          new Date((b as any).date || (b as any).startDate || 0).getTime()
      );
    } else if (currentSort === 'price') {
      list.sort((a, b) => a.price - b.price);
    }

    return list;
  });

  // Helpers
  onFilterChange(event: any) {
    this.filter.set({
      destination: event?.destination || '',
      date: event?.date || '',
      maxPrice: event?.maxPrice ?? null
    });

    if (event?.sortType) {
      this.sortBy.set(event.sortType);
    }
  }

  onSortChange(value: any) {
    this.sortBy.set(value);
  }

  // בדיקה ריאקטיבית - האם המשתמש רשום לטיול
  isBooked(tripId: number | string | undefined): boolean {
    const user = this.currentUser();
    if (!user || tripId === undefined || tripId === null) return false;

    return this.bookingsService.isUserBooked(String(user.id), Number(tripId));
  }

  bookTrip(trip: Trip) {
    const user = this.currentUser();
    if (!user || !trip.id) return;

    this.bookingsService.bookTrip(String(user.id), Number(trip.id), 1);
  }

  // Actions
  openDeleteDialog(trip: Trip) {
    if ((trip as any).registeredCount > 0) {
      alert('לא ניתן למחוק טיול שיש אליו כבר נרשמים!');
      return;
    }

    this.selectedTripId.set(Number(trip.id));
    this.showDialog.set(true);
  }

  confirmDelete() {
    const id = this.selectedTripId();

    if (id) {
      this.tripsService.deleteTrip(id).subscribe(() => {
        this.showDialog.set(false);
        this.selectedTripId.set(null);
      });
    }
  }

  cancelDelete() {
    this.showDialog.set(false);
    this.selectedTripId.set(null);
  }

  onEditTrip(trip: Trip) {
    this.router.navigate(['/trip', trip.id], { queryParams: { edit: 'true' } });
  }

  navigateToEdit(trip: Trip) {
    if ((trip as any).registeredCount > 0) {
      alert('לא ניתן לערוך טיול שיש אליו כבר נרשמים!');
      return;
    }

    this.router.navigate(['/trips/edit', trip.id]);
  }

  viewTripDetails(tripId: number | string | undefined) {
    if (tripId) {
      this.router.navigate(['/trips/view', tripId]);
    }
  }

  navigateToAddTrip() {
    this.router.navigate(['/trip', 'new']);
  }
}