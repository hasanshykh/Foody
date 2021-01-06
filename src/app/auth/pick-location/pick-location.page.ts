import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { switchMap, map } from 'rxjs/operators';
import { donarLoaction } from 'src/app/places/location.model';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pick-location',
  templateUrl: './pick-location.page.html',
  styleUrls: ['./pick-location.page.scss'],
})
export class PickLocationPage implements OnInit {

  locationPicked = false;

  constructor(
    private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    if (!this.authService.userAuthenticated) {
      this.router.navigateByUrl('/auth');
    }
  }

  ngOnInit() { }

  onPickLocation() {
    this.locationPicked = true;
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(mapCoords => {
        if (!mapCoords.data) {
          return;
        }
        const pickedLocation: donarLoaction = {
          lat: mapCoords.data.lat,
          lng: mapCoords.data.lng,
          address: null,
          mapImageUrl: null
        };
        this.getAddress(mapCoords.data.lat, mapCoords.data.lng).pipe(switchMap(address => {
          //Error here.
          return pickedLocation.address = address;
        }));
      });
      modalEl.present();
    });
    this.locationPicked = false;
  }

  private getAddress(lat: number, lng: number) {
    return this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
    ${environment.googleMapsApiKey}`)
      .pipe(map(geoData => {
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      }));
  }

}
