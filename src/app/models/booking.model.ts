export interface Booking {
  id?: Date | string | number;
  tripId: string | number;
  userId: string | number;
  people: number;
}