import { Injectable } from '@angular/core';
import { Booking } from './booking.modal';

 @Injectable({providedIn:'root'})
 export class BookingService{
    private _bookings: Booking[]= [{
        id: 'abc',
        placeId: 'p1',
        title:'Royle Taj',
        userId: 'ui',
        guestNumber: 3,
        imageUrl:'./assets/images/RT.jpg'
    }];

    get bookings(){
        return [...this._bookings]
    }
 }