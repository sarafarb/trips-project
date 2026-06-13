import { Component, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TripsService } from '../../../services/trips';
import { AuthService } from '../../../services/auth';
import { BookingsService } from '../../../services/bookings'; // חובה להוסיף כדי לדעת אילו טיולים הוזמנו

import { TripCard } from '../../../components/trip-card/trip-card';
import { Trip } from '../../../models/trip.model';

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [TripCard], // CommonModule הוסר - אין בו צורך יותר!
  templateUrl: './trips-my.html',
  styleUrl: './trips-my.css'
})
export class MyTrips implements OnInit {

  private tripsService = inject(TripsService);
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  // 1. חיבור ישיר וריאקטיבי לסיגנל של המשתמש מהסרביס!
  currentUser = this.authService.currentUser;

 // 2. הקסם של Signals: מחשבים את "הטיולים שלי" אוטומטית ברגע שהמידע זמין
  myTrips = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    // מביאים את כל הטיולים ואת כל ההזמנות מהסרביסים
    const allTrips = this.tripsService.trips();
    const allBookings = this.bookingsService.bookings();

    // שולפים רק את ה-ID של הטיולים שהמשתמש הנוכחי הזמין (ממירים ל-String כדי למנוע באגים)
    const myBookedTripIds = allBookings
      .filter(booking => String(booking.userId) === String(user.id))
      .map(booking => String(booking.tripId));

    // מחזירים רק את הטיולים שה-ID שלהם קיים ברשימה (שוב, ממירים ל-String להשוואה בטוחה)
    return allTrips.filter(trip => myBookedTripIds.includes(String(trip.id)));
  });
  
  // ה-computed הזה יתעדכן אוטומטית ברגע ש-myTrips יתעדכן
  hasTrips = computed(() => this.myTrips().length > 0);

  // 3. באנגולר, עדיף להשתמש ב-ngOnInit עבור קריאות HTTP / טעינת נתונים ראשונית, ולא בקונסטרקטור
  ngOnInit() {
    this.tripsService.loadTrips();
    this.bookingsService.loadBookings();
  }

  openTrip(id: number) {
    this.router.navigateByUrl(`/trip/${id}`);
  }
}