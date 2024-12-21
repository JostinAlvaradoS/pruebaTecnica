import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../services/rickAndMortyService';

@Component({
  selector: 'app-characters-page',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];
  currentPage = 1;
  itemsPerPage = 5; // 5 items por pagina
  filters = {
    search: '',
    status: '',
    species: '',
    gender: '',
    origin: ''
  };
  statusOptions = ['Alive', 'Dead', 'unknown'];
  speciesOptions = ['Human', 'Alien', 'unknown'];
  genderOptions = ['Male', 'Female', 'Genderless', 'unknown'];
  originOptions: string[] = [];

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickAndMortyService.getCharacters().subscribe((data: any) => {
      this.characters = data.results;
      this.originOptions = [...new Set(this.characters.map(character => character.origin.name))];
      this.applyFilters();
    });
  }

  get paginatedCharacters() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCharacters.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredCharacters.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  applyFilters() {
    this.filteredCharacters = this.characters.filter(character => {
      return (
        (!this.filters.search || character.name.toLowerCase().includes(this.filters.search.toLowerCase())) &&
        (!this.filters.status || character.status === this.filters.status) &&
        (!this.filters.species || character.species === this.filters.species) &&
        (!this.filters.gender || character.gender === this.filters.gender) &&
        (!this.filters.origin || character.origin.name === this.filters.origin)
      );
    });
    this.currentPage = 1; 
  }

  resetFilters() {
    this.filters = {
      search: '',
      status: '',
      species: '',
      gender: '',
      origin: ''
    };
    this.applyFilters();
  }
}
