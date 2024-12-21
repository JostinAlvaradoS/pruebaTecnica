import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto asegura que Angular registre el servicio automáticamente
})
export class RickAndMortyService {
  // Link de la api, al ser una api completamente publica, no necesita apikey
  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}
// Funciones que realizan las peticiones a la api y se consumen desde cada pagina del proyecto segun sea necesario
  getCharacters(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/character?page=${page}`);
  }

  getEpisodes(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/episode?page=${page}`);
  }

  getLocations(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/location?page=${page}`);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/character/${id}`);
  }
}
