import { Component, inject, computed, effect } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { TripsService } from '../../services/trips';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.css'
})
export class TripForm {
  private fb = inject(NonNullableFormBuilder);
  private tripsService = inject(TripsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    destination: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    description: [''],
    imageUrl: ['']
  });

  tripId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const raw = params.get('id');
        if (!raw || raw === 'new') {
          return null;
        }
        const parsed = Number(raw);
        return Number.isNaN(parsed) ? null : parsed;
      })
    ),
    { initialValue: null }
  );

  isEdit = computed(() => this.tripId() !== null);

  private loadTrip = effect(() => {
    const id = this.tripId();
    if (id !== null) {
      this.tripsService.getTripById(id).subscribe(trip => {
        this.form.patchValue({
          name: trip.name,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          price: trip.price,
          description: trip.description,
          imageUrl: trip.image
        });
      });
      return;
    }

    this.form.reset({
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      price: 0,
      description: '',
      imageUrl: ''
    });
  });

  submit() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const id = this.tripId();

    const tripData: Trip = {
      ...(id !== null ? { id } : {}),
      name: formValue.name,
      destination: formValue.destination,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      price: formValue.price,
      description: formValue.description,
      image: formValue.imageUrl
    };

    if (id !== null) {
      this.tripsService.updateTrip(id, tripData).subscribe({
        next: () => this.router.navigate(['/home/trips-all']),
        error: (err) => console.error('שגיאה בעדכון הטיול:', err)
      });
    } else {
      this.tripsService.createTrip(tripData).subscribe({
        next: () => this.router.navigate(['/home/trips-all']),
        error: (err) => console.error('שגיאה ביצירת הטיול:', err)
      });
    }
  }
}