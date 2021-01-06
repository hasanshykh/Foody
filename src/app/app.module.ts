import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {environment} from '../environments/environment';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
