import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickAndMortyService';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-episodes-page',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  loading: boolean = true;
  selectedEpisode: any = null;
  characters: any[] = [];
  private currentCharacterSubscription: Subscription | null = null;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.loading = true;
    this.rickAndMortyService.getEpisodes().subscribe({
      next: (data: any) => {
        this.episodes = data.results;
        console.log(this.episodes);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading episodes:', err);
        this.loading = false;
      }
    });
  }

  onEpisodeClick(episode: any): void {
    // Si ya está cargando, no permitir otro clic
    if (this.loading) {
      return;
    }

    this.selectedEpisode = episode;
    this.loading = true;
    const characterIds = episode.characters?.map((url: string) => {
      const id = url.split('/').pop();
      return id ? +id : null; 
    }).filter((id: null) => id !== null) || []; 

    if (characterIds.length === 0) {
      this.loading = false;
      this.characters = [];
      return;
    }

    // Cancelar suscripción anterior si existe
    if (this.currentCharacterSubscription) {
      this.currentCharacterSubscription.unsubscribe();
    }

    // Realizar las nuevas solicitudes de personajes
    this.currentCharacterSubscription = forkJoin<any[]>(characterIds.map((id: number) =>
      this.rickAndMortyService.getCharacterById(id)
    )).subscribe({
      next: (data: any[]) => {
        this.characters = data;
        console.log(this.characters);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading characters:', err);
        this.loading = false;
      }
    });
  }

  closeEpisodeDetails(): void {
    this.selectedEpisode = null;
    this.characters = [];
    this.loading = false; // Reseteo inmediato del estado de carga
  }
}
