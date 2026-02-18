
import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

// Fix for default marker icon paths in Angular
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements AfterViewInit {
  private map?: L.Map;
  private http = inject(HttpClient);

  ngAfterViewInit(): void {
    const cordoba: L.LatLngExpression = [-31.4201, -64.1888];

    this.map = L.map('map', {
      center: cordoba,
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Llama a la API de Open-Meteo para obtener estaciones meteorológicas cercanas
    this.http.get<any>('https://api.open-meteo.com/v1/stations?latitude=-31.4201&longitude=-64.1888&distance=100')
      .subscribe(response => {
        if (response && response.results) {
          response.results.forEach((station: any) => {
            if (station.latitude && station.longitude) {
              L.marker([station.latitude, station.longitude])
                .addTo(this.map!)
                .bindPopup(`<b>${station.name || 'Estación'}</b><br>Lat: ${station.latitude}<br>Lon: ${station.longitude}`);
            }
          });
        }
      });

    // CLAVE: asegurar que el mapa se renderice bien
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }
}
