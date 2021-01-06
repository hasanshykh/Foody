import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private itemSub: Subscription;
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private placeService: PlacesService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alrtCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.itemSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isLoading = false;
      }, error => {
        this.alrtCtrl.create({
          header: 'An error occured!',
          message: 'Could not load item.',
          buttons: [{
            text: 'Okay', handler: () => {
              this.router.navigate(['/places/tabs/discover']);
            }
          }
          ]
        }).then(alertEl => alertEl.present());
      });
    });

  }

  onBookingPlace() {
    //this.router.navigateByUrl('/places/tabs/discover');
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an action!',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.onBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.onBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });

  }

  onBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.create({ component: CreateBookingComponent, componentProps: { selectedPlace: this.place } })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log('Booked');
        }
      });
  }
  
  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }

  onShowMap() {
    this.modalCtrl.create({
      component: MapModalComponent, componentProps: {
        center: { lat: this.place.location.lat, lng: this.place.location.lng },
        selectAble: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
    }).then(modalEl => {
      modalEl.present();
    })
  }
}
