import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private socialSharing: SocialSharing,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogOut() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  onShare() {
    var options = {
      message: 'hey, Im inviting you to this briliant social app',
      url: 'http://localhost:8100/auth',
    };
    this.socialSharing.shareWithOptions(options)
  }
}
