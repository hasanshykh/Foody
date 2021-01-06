import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit,  Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import {Plugins, Capacitor} from '@capacitor/core';

import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, donarLoaction } from 'src/app/places/location.model';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick= new EventEmitter<donarLoaction>();
  locationImage: string;
  isLoading= false;

  constructor(private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl:AlertController) { }

  ngOnInit() {}

  onPickLocation(){
    this.actionSheetCtrl.create({
      header:'Please choose!',
      buttons:[
        {text:'Auto Locate!',handler:()=>{
          this.locateUser();
        }},
        {text:'Pick on the map',handler:()=>{
          this.openMap();
        }},
        {text:'Cancel', role:'cancel'}
    ]
    }).then(actionShetEl =>{
      actionShetEl.present();
    });
  }
  private locateUser(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      this.showError();
      return;
    }
    this.isLoading=true;
    Plugins.Geolocation.getCurrentPosition().then(geoPosition=> {
      const coordinates: Coordinates ={lat: geoPosition.coords.latitude,
      lng: geoPosition.coords.longitude};
      this.createItem(coordinates.lat, coordinates.lng);
      this.isLoading=false;
    }).catch(err=>{
      this.isLoading=false;
      this.showError();
    })
  }

  showError(){
    this.alertCtrl.create({header:'Could not fetch location',
    message:'Please use the map to pick the location',
    buttons:['Okay']
  }).then(alertEl => alertEl.present());
  }
  private openMap(){
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl =>{
      modalEl.onDidDismiss().then(mapCoords =>{
        if(!mapCoords.data){
          return;
        }
       const coordinates: Coordinates ={
         lat:mapCoords.data.lat,
         lng:mapCoords.data.lng
       };
      this.createItem(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }
  private createItem(lat:number, lng:number){
    const pickedLocation: donarLoaction={
      lat: lat,
      lng: lng,
      address:null,
      mapImageUrl: null
    };

    this.isLoading=true;
    this.getAddress(lat, lng).pipe(switchMap( address =>{
      pickedLocation.address=address;
      return of(this.mapImage(pickedLocation.lat, pickedLocation.lng,14));
    })
    ).subscribe(MapImageUrl =>{
      pickedLocation.mapImageUrl=MapImageUrl;
      this.locationImage=MapImageUrl;
      this.isLoading=false;
      this.locationPick.emit(pickedLocation);
    });
  }

  private getAddress(lat:number, lng: number){
    return this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
    ${environment.googleMapsApiKey}`)
    .pipe(map(geoData=>{
      if(! geoData || !geoData.results || geoData.results.length === 0){
        return null;
      }
      return geoData.results[0].formatted_address;
    }));
  }

  private mapImage(lat: number, lng: number, zoom: number){
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Person%7C${lat},${lng}
    &key=${environment.googleMapsApiKey}`;
  }
}


