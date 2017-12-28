import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';


import firebase from 'firebase';
import { FIREBASE_CREDENTIALS } from './credentials';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'MainPage';

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider) {

    firebase.initializeApp(FIREBASE_CREDENTIALS);

    //If the user is not logged, the system guide him to LoginPage.
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = 'LoginPage';
        unsubscribe();
      } else {
        this.rootPage = 'MainPage';
        unsubscribe();
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Perfil', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


    });
  }

  openPage(page) {
    this.nav.push(page.component);
  }

  logoutUser(){
    this.authProvider.logoutUser().then(() => {
      this.nav.setRoot('LoginPage');
    });
  }
}
