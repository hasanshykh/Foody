import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';

interface authResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userId = null;
  public userFb = null;

  get userAuthenticated() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  get userId() {
    return this._userId;
  }

  constructor(
    private httpClient: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log('logged In', user);
        this.userFb = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.log('no user');
        localStorage.setItem('user', null);
      }
    });

  }

  signUp(email: string, password: string) {
    return this.httpClient.post<authResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      { email: email, password: password, returnSecureToken: true });
  }

  signupFirebase(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async response => {
        await response.user.updateProfile({
          displayName: 'Hasan Sheikh'
        })
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Login successful');
        this.userFb = value.user;
        localStorage.setItem('user', JSON.stringify(value.user));
        return true;
      })
      .catch(err => {
        console.log('FB - Something went wrong:', err.message);
        return false;
      });
  }

  logout() {
    this.firebaseAuth.signOut();
  }
}
