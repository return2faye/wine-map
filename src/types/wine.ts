export interface Wine {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  images?: string[];
  vintage?: number;
  grapeVariety?: string;
  price?: number;
  rating?: number;
  tastingNotes?: string;
  personalComment?: string;
  dateConsumed?: string;
  winery?: string;
  alcoholContent?: number;
  color?: 'red' | 'white' | 'rose' | 'sparkling';
}

export interface WineMarker {
  wine: Wine;
  position: [number, number];
}
