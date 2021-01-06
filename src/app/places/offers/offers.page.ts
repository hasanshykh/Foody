import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
 


@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offeredPlaces: Place[];
  private placesSub: Subscription;
  isLoading = false;

  constructor(private placeServices: PlacesService, private router:Router ) { }

  ngOnInit() {
   this.placesSub= this.placeServices.places.subscribe(places =>{
    this.offeredPlaces=places;
   });
  }
  ionViewWillEnter(){
    this.isLoading= true;
    this.placeServices.getData().subscribe(()=>{
      this.isLoading=false;
    });
  }
  
  onEdit(placeId:string, slider:IonItemSliding){
    slider.close();
    console.log('Editing item', placeId);
    this.router.navigate(['/','places','tabs','offers','edit', placeId]);
  }
  ngOnDestroy(){
    if(this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

}
