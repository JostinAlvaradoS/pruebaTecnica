import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickAndMortyService';
import { forkJoin } from 'rxjs';

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

  constructor(private rickAndMortyService: RickAndMortyService) {}
// Funcion que se al iniciar la pagina, para cargar los datos de los personajes y obtener los datos de origen de cada personaje
  ngOnInit(): void {
    this.rickAndMortyService.getLocations().subscribe((data: any) => {
      this.locations = data.results;
      console.log(this.locations);
      this.loading = false;
    });
  }
// Funcion que se ejecuta cuando se hace click en un episodio y se obtiene el id de personaje de la ubicacion desde la url, 
// para en el forkjopin iterar todos los personajes de cada ubicacion
  onLocationClick(location: any): void {
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
    forkJoin<any[]>(residentIds.map((id: number) => this.rickAndMortyService.getCharacterById(id))).subscribe((data: any[]) => {
      this.residents = data;
      console.log(this.residents);
      this.loading = false;
    });
  }

  closeLocationDetails(): void {
    this.selectedLocation = null;
    this.residents = [];
  }
}
