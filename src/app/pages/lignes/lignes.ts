import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

type TicketClassKey = 'firstClass' | 'secondClass' | 'thirdClass';

interface TicketSelection {
  routeId: string;
  departureTime: string;
  ticketClass: TicketClassKey;
  quantity: number;
  label: string;
  price: number;
}

@Component({
  selector: 'app-lignes',
  imports: [CommonModule, FormsModule],
  templateUrl: './lignes.html',
  styleUrl: './lignes.scss',
})
export class Lignes implements OnInit {
  cities: City[] = [];
  routes: Route[] = [];
  departureCity = '';
  arrivalCity = '';
  selectedRouteId = '';
  selectedTime = '';
  selectedClass: TicketClassKey = 'secondClass';
  quantity = 1;
  cartItems: TicketSelection[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadData();
    this.route.queryParamMap.subscribe((params) => {
      this.departureCity = params.get('departure') ?? '';
      this.arrivalCity = params.get('arrival') ?? '';
      this.applySelection();
    });
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
      this.applySelection();
    } catch (error) {
      console.error('Impossible de charger les données depuis le fichier JSON.', error);
      this.cities = [];
      this.routes = [];
    }
  }

  private applySelection(): void {
    if (!this.routes.length) {
      return;
    }

    const matchingRoute = this.routes.find(
      (route) => route.from === this.departureCity && route.to === this.arrivalCity,
    );

    if (matchingRoute) {
      this.selectedRouteId = matchingRoute.id;
      this.selectedTime = matchingRoute.schedules[0]?.time ?? '';
      return;
    }

    const departureRoute = this.routes.find(
      (route) => route.from === this.departureCity || route.to === this.departureCity,
    );

    if (departureRoute) {
      this.selectedRouteId = departureRoute.id;
      this.selectedTime = departureRoute.schedules[0]?.time ?? '';
      return;
    }

    this.selectedRouteId = this.routes[0]?.id ?? '';
    this.selectedTime = this.routes[0]?.schedules[0]?.time ?? '';
  }

  get cityOptions() {
    return this.cities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }

  get selectedRoute(): Route | undefined {
    return this.routes.find((route) => route.id === this.selectedRouteId);
  }

  get routeOptions(): Route[] {
    if (!this.departureCity) {
      return this.routes;
    }

    return this.routes.filter(
      (route) => route.from === this.departureCity || route.to === this.departureCity,
    );
  }

  get selectedSchedule(): DepartureSchedule | undefined {
    return this.selectedRoute?.schedules.find((schedule) => schedule.time === this.selectedTime);
  }

  get selectedPrice(): number {
    return this.selectedSchedule?.prices[this.selectedClass] ?? 0;
  }

  get totalCartPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get selectedTripLabel(): string {
    const origin = this.cities.find((city) => city.id === this.departureCity)?.name ?? 'Départ';
    const destination = this.cities.find((city) => city.id === this.arrivalCity)?.name ?? 'destination';

    return `${origin} → ${destination}`;
  }

  get classOptions() {
    return [
      { value: 'thirdClass' as TicketClassKey, label: 'Économique', hint: 'Le plus abordable' },
      { value: 'secondClass' as TicketClassKey, label: 'Affaires', hint: 'Confort supplémentaire' },
      { value: 'firstClass' as TicketClassKey, label: 'Première', hint: 'Le meilleur confort' },
    ];
  }

  cityNameById(cityId: string): string {
    return this.cities.find((city) => city.id === cityId)?.name ?? cityId;
  }

  formatDuration(durationMinutes: number): string {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h${String(minutes).padStart(2, '0')}`;
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString('fr-FR')} XPF`;
  }

  classLabel(ticketClass: TicketClassKey): string {
    return this.classOptions.find((option) => option.value === ticketClass)?.label ?? ticketClass;
  }

  onDepartureCityChange(): void {
    this.applySelection();
  }

  onRouteChange(): void {
    const selectedRoute = this.selectedRoute;

    if (selectedRoute && !selectedRoute.schedules.some((schedule) => schedule.time === this.selectedTime)) {
      this.selectedTime = selectedRoute.schedules[0]?.time ?? '';
    }
  }

  addToCart(): void {
    const selectedRoute = this.selectedRoute;
    const selectedSchedule = this.selectedSchedule;

    if (!selectedRoute || !selectedSchedule) {
      return;
    }

    const existingItem = this.cartItems.find(
      (item) =>
        item.routeId === selectedRoute.id &&
        item.departureTime === this.selectedTime &&
        item.ticketClass === this.selectedClass,
    );

    if (existingItem) {
      existingItem.quantity += this.quantity;
    } else {
      this.cartItems.push({
        routeId: selectedRoute.id,
        departureTime: this.selectedTime,
        ticketClass: this.selectedClass,
        quantity: this.quantity,
        label: `${this.cityNameById(selectedRoute.from)} → ${this.cityNameById(selectedRoute.to)}`,
        price: this.selectedPrice,
      });
    }

    this.quantity = 1;
  }
}
