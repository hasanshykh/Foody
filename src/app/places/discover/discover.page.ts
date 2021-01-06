import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedItem: Place[];
  private itemSub: Subscription;
  isLoading = false;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.itemSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.listedLoadedItem = this.loadedPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.getData().subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilter(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
  
  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }
}
