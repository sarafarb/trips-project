import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';

type SortType = '' | 'price' | 'date';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBar {

  destination = signal('');
  sortType = signal<SortType>('');

  filterChange = output<{
    destination: string;
    sortType: SortType;
  }>();

  private emit() {
    this.filterChange.emit({
      destination: this.destination(),
      sortType: this.sortType()
    });
  }

  setDestination(value: string) {
    this.destination.set(value);
    this.emit();
  }

  setSortType(value: string) {
    this.sortType.set(value as SortType);
    this.emit();
  }

  reset() {
    this.destination.set('');
    this.sortType.set('');
    this.emit();
  }
}