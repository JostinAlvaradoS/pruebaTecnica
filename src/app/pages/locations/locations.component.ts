import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickAndMortyService';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-locations-page',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  loading: boolean = true;
  selectedLocation: any = null;
  residents: any[] = [];
  private currentResidentSubscription: Subscription | null = null;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.rickAndMortyService.getLocations().subscribe({
      next: (data: any) => {
        this.locations = data.results;
        console.log(this.locations);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        this.loading = false;
      }
    });
  }

  onLocationClick(location: any): void {
    // Si ya está cargando, no permitir otro clic
    if (this.loading) {
      return;
    }

    this.selectedLocation = location;
    this.loading = true;
    const residentUrls = location.residents || [];
    const residentIds = residentUrls.map((url: string) => {
      const id = url.split('/').pop();
      return id ? +id : null;
    }).filter((id: number | null): id is number => id !== null);

    if (residentIds.length === 0) {
      this.loading = false;
      this.residents = [];
      return;
    }

    // Cancelar suscripción anterior si existe
    if (this.currentResidentSubscription) {
      this.currentResidentSubscription.unsubscribe();
    }

    // Realizar las nuevas solicitudes de residentes
    this.currentResidentSubscription = forkJoin<any[]>(residentIds.map((id: number) =>
      this.rickAndMortyService.getCharacterById(id)
    )).subscribe({
      next: (data: any[]) => {
        this.residents = data;
        console.log(this.residents);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading residents:', err);
        this.loading = false;
      }
    });
  }

  closeLocationDetails(): void {
    this.selectedLocation = null;
    this.residents = [];
    this.loading = false; // Reseteo inmediato del estado de carga
  }
}
