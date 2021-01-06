import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { donarLoaction } from './location.model';


interface GetFromDataBase {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  dateFrom: Date;
  dateTo: Date;
  userId: string;
  location: donarLoaction;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private httpClient: HttpClient) { }

  getData() {
    return this.httpClient.get<{ [key: string]: GetFromDataBase }>
      ('https://fypproject-cf84d.firebaseio.com/offered-items.json')
      .pipe(map(respData => {
        const item = [];
        for (const key in respData) {
          if (respData.hasOwnProperty(key)) {
            item.push(new Place(key,
              respData[key].title,
              respData[key].description,
              respData[key].imageUrl,
              respData[key].price,
              new Date(respData[key].dateFrom),
              new Date(respData[key].dateTo),
              respData[key].userId,
              respData[key].location
            )
            );
          }
        }
        return item;
      }),
        tap(item => {
          this._places.next(item);
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.httpClient.post<{ imageUrl: string, imagePath: string }>('https://us-central1-fypproject-cf84d.cloudfunctions.net/storeImage', uploadData);
  }

  getPlace(id: string) {
    return this.httpClient.get<GetFromDataBase>(`https://fypproject-cf84d.firebaseio.com/offered-items/${id}.json`)
      .pipe(
        map(respData => {
          return new Place(id,
            respData.title,
            respData.description,
            respData.imageUrl,
            respData.price,
            respData.dateFrom,
            respData.dateTo,
            respData.userId,
            respData.location)
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: donarLoaction,
    imageUrl: string
  ) {
    let generatedId: string;
    const newPlace = new Place(Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );
    return this.httpClient.post<{ name: string }>('https://fypproject-cf84d.firebaseio.com/offered-items.json',
      { ...newPlace, id: null })
      .pipe(
        switchMap(respData => {
          generatedId = respData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(take(1), delay(1000),
    //tap(places=>{
    // this._places.next(places.concat(newPlace));
    // })
    //);
  }

  updateItem(placeId: string, title: string, description: string) {
    let updatedItem: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.getData();
        }
        else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedItemIndex = places.findIndex(it => it.id === placeId);
        updatedItem = [...places];
        const oldItem = updatedItem[updatedItemIndex];
        updatedItem[updatedItemIndex] = new Place(
          oldItem.id,
          title,
          description,
          oldItem.imageUrl,
          oldItem.price,
          oldItem.dateFrom,
          oldItem.dateTo,
          oldItem.userId,
          oldItem.location
        );
        return this.httpClient.put(`https://fypproject-cf84d.firebaseio.com/offered-items/${placeId}.json`,
          { ...updatedItem[updatedItemIndex], id: null }
        );
      }), tap(() => {
        this._places.next(updatedItem);
      })
    );
  }
}
