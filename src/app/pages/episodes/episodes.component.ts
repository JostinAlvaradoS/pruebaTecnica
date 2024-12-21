import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickAndMortyService';
import { forkJoin } from 'rxjs';

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

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getEpisodes().subscribe((data: any) => {
      this.episodes = data.results;
      console.log(this.episodes);
      this.loading = false;
    });
  }
// Funcion que se ejecuta cuando se hace click en un episodio y se obtiene el id de personaje del episodio desde la url, 
// para en el forkjopin iterar todos los personajes de cada episodio
  onEpisodeClick(episode: any): void {
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
    forkJoin<any[]>(characterIds.map((id: number) => this.rickAndMortyService.getCharacterById(id))).subscribe((data: any[]) => {
      this.characters = data;
      console.log(this.characters);
      this.loading = false;
    });
  } 

  closeEpisodeDetails(): void {
    this.selectedEpisode = null;
    this.characters = [];
  }
}
