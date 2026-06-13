import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  
  trip = input.required<Trip>(); 
  isAdmin = input<boolean>(false);
  isBooked = input<boolean>(false);

  edit = output<Trip>();
  delete = output<Trip>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.trip());
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.trip());
  }
}