import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public userProfile: any;
  public city: string;
  public institution: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider
  ) {

  }

  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.city = userProfileSnapshot.val().city;
      this.institution = userProfileSnapshot.val().institution;
      
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your first name & last name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Your first name',
          value: this.userProfile.name
        },
        {
          name: 'surname',
          placeholder: 'Your last name',
          value: this.userProfile.surname
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.name, data.surname);
          }
        }
      ]
    });
    alert.present();
  }

  updateCity(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your city',
      inputs: [
        {
          name: 'city',
          placeholder: 'Your city',
          value: this.userProfile.city
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateCity(data.city);
          }
        }
      ]
    });
    alert.present();
  }


  updateInstitution(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your institution',
      inputs: [
        {
          name: 'institution',
          placeholder: 'Your institution',
          value: this.userProfile.institution
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateInstitution(data.institution);
          }
        }
      ]
    });
    alert.present();
  }


  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email'
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            let newEmail = data.newEmail;

            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }
}
