import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.modal';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBooking:Booking[];

  constructor(private bookingService:BookingService) { }

  ngOnInit() {
    this.loadedBooking=this.bookingService.bookings;
  }

  onBookingCancel(offerId:string, slidingEle:IonItemSliding){
    slidingEle.close(); 

  }

}
