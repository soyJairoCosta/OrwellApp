import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;  //Login form
  public loading: Loading;      //Loading spinner


  constructor(
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public authProvider: AuthProvider,
      public formBuilder: FormBuilder,
      public storage: Storage
    ) {

      // Create the form and also validate the email and the password
      this.loginForm = formBuilder.group({
        email: [
          '',
          Validators.compose([Validators.required, EmailValidator.isValid])
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        ]
      });
    }

    // Log the user in the system checking if the user exist in the firebase DB
    loginUser(): void {
      if (!this.loginForm.valid) {
        console.log(
          `Form is not valid yet, current value: ${this.loginForm.value}`
        );
      }else{
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        // Ask the provider to log the user using email and password
        this.authProvider.loginUser(email, password).then(
          authData => {
            this.loading.dismiss().then(() => {
              this.storage.set('email', email);
              this.navCtrl.setRoot('MainPage');
            });
          },
          error => {
            this.loading.dismiss().then(() => {
              const alert: Alert = this.alertCtrl.create({
                message: error.message,
                buttons: [{ text: 'Ok', role: 'cancel' }]
              });
              alert.present();
            });
          }
        );
        this.loading = this.loadingCtrl.create();
        this.loading.present();
      }
    }

    //Goes to SignUpPage
    goToSignup(): void {
      this.navCtrl.push('SignupPage');
    }

    goToResetPassword(): void {
      this.navCtrl.push('ResetPasswordPage');
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
