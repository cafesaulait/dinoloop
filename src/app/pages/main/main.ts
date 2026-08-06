import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
}

interface DepartureSchedule {
  time: string;
  availableSeats: number;
  prices: {
    firstClass: number;
    secondClass: number;
    thirdClass: number;
  };
}

interface Route {
  id: string;
  from: string;
  to: string;
  line: string;
  durationMinutes: number;
  distanceKm: number;
  schedules: DepartureSchedule[];
}

interface HyperloopData {
  cities: City[];
  routes: Route[];
}

interface CityOption {
  value: string;
  label: string;
}

interface DepartureRow {
  departureTime: string;
  destinationId: string;
  destinationLabel: string;
  line: string;
  duration: string;
  timeMinutes: number;
}

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})

export class Main implements OnInit {
  cities: City[] = [];
  routes: Route[] = [];
  departureCity = '';
  arrivalCity = '';

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const response = await fetch('/assets/data/hyperloop-data.json');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as HyperloopData;
      this.cities = data.cities;
      this.routes = data.routes;
    } catch (error) {
      console.error('Impossible de charger les données depuis le fichier JSON.', error);
      this.cities = [];
      this.routes = [];
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  get upcomingDepartures(): DepartureRow[] {
    if (!this.departureCity) {
      return [];
    }

    const currentMinutes = this.timeToMinutes(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    );

    return this.routes
      .filter((route) => route.from === this.departureCity || route.to === this.departureCity)
      .map((route) => {
        const isOutbound = route.from === this.departureCity;
        const destinationId = isOutbound ? route.to : route.from;
        const destinationLabel = this.cities.find((city) => city.id === destinationId)?.name ?? destinationId;

        return route.schedules.map((schedule) => ({
          departureTime: schedule.time,
          destinationId,
          destinationLabel,
          line: route.line,
          duration: `${Math.floor(route.durationMinutes / 60)}h${String(route.durationMinutes % 60).padStart(2, '0')}`,
          timeMinutes: this.timeToMinutes(schedule.time),
        }));
      })
      .reduce((all, routeSchedules) => all.concat(routeSchedules), [] as DepartureRow[])
      .filter((departure) => departure.timeMinutes >= currentMinutes)
      .sort((a, b) => a.timeMinutes - b.timeMinutes);
  }

  departureOptions(): CityOption[] {
    return this.cities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }

  arrivalOptions(): CityOption[] {
    const availableCities = this.departureCity
      ? this.cities.filter((city) => city.id !== this.departureCity)
      : this.cities;

    return availableCities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }

  onDepartureChange(): void {
    if (this.arrivalCity === this.departureCity) {
      this.arrivalCity = '';
    }
  }
}
