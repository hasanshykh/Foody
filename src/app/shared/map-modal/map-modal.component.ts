import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { promise } from 'protractor';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center={lat:25.393239, lng:68.349019};
  @Input() selectAble=true;
  @Input() closeButtonText='Cancel';
  @Input() title= 'pick a location';
  clickListener:any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController, private renderer:Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit(){
    this.getMap().then(googleMaps=>{
      this.googleMaps=googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center:this.center,
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', ()=>{
        this.renderer.addClass(mapEl, 'visible');
      });

      if(this.selectAble){
        this.clickListener= map.addListener('click', event=>{
          const coords={lat:event.latLng.lat(), lng:event.latLng.lng()
          };
          this.modalCtrl.dismiss(coords);
        });
      }
      else{
        const marker= new googleMaps.Marker({
          position:this.center,
          map:map,
          title:'Picked location'
        });
        marker.setMap(map);
      }
     
    }).catch(err=>{
      console.log(err);
    });
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  ngOnDestroy(){
    if(this.clickListener){
      this.googleMaps.event.removeListener(this.clickListener);
    }
    
  }

  private getMap(): Promise<any>{
    const win= window as any;
    const googleModule= win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject)=>{
      const script= document.createElement('script');
      script.
      src='https://maps.googleapis.com/maps/api/js?key='+environment.googleMapsApiKey;
      script.async=true;
      script.defer=true;
      document.body.appendChild(script);
      script.onload= ()=>{
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        }
        else{
          reject('Google Maps SDK not available.');
        }
      };
  
    })
  }
}
