import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { BookingsService } from '../../../services/bookings';
import { TripsService } from '../../../services/trips';
import { AuthService } from '../../../services/auth';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css'
})
export class TripDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router); // הוספנו את הראוטר כדי שנוכל לנקות את ה-URL בסיום
  private tripsService = inject(TripsService);
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);

  private id = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id')))),
    { requireSync: true }
  );

  trip = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.tripsService.getTripById(id))
    )
  );

  // 1. קוראים באופן חד-פעמי האם הגענו לדף הזה במצב עריכה
  isEditing = signal<boolean>(
    this.route.snapshot.queryParamMap.get('edit') === 'true'
  );

  currentUser = this.authService.currentUser;
  userId = computed(() => String(this.currentUser()?.id || "0"));
  
  hasTrip = computed(() => !!this.trip());

  isBooked = computed(() => {
    const user = this.currentUser();
    const currentTrip = this.trip();
    if (!user || !currentTrip) return false;
    return this.bookingsService.isUserBooked(String(user.id), Number(currentTrip.id) );
  });

  // 2. פונקציית שמירה של הנתונים
  saveChanges(updatedName: string, updatedDest: string, updatedPrice: string, updatedDesc: string) {
    const currentTrip = this.trip();
    if (!currentTrip) return;

    const updatedTrip: Trip = {
      ...currentTrip,
      name: updatedName,
      destination: updatedDest,
      price: Number(updatedPrice),
      description: updatedDesc
    };

    // כאן את קוראת לסרביס לעדכן את השרת (תורידי את ההערה אם יש לך פונקציה כזו)
    // this.tripsService.updateTrip(Number(updatedTrip.id), updatedTrip);

    // סוגרים את מצב העריכה וחוזרים לתצוגה רגילה
    this.isEditing.set(false);
    
    // מנקים את ה-?edit=true מה-URL כדי שזה יראה נקי
    this.router.navigate([], { queryParams: { edit: null }, queryParamsHandling: 'merge' });
  }

  bookTrip() {
    const user = this.currentUser();
    const trip = this.trip();
    if (user && trip) {
      this.bookingsService.bookTrip(String(user.id),Number(trip.id), 1);
    }
  }

  cancelBooking() {
    this.bookingsService.cancelBooking(this.userId(), this.id());
  }

  setPeople(quantity: number) {
    this.bookingsService.setBookingPeople(this.id(), quantity);
  }

  peopleCount = computed(() => this.bookingsService.getBookingPeopleCount(this.id()));

  back() {
    window.history.back();
  }
}