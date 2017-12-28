import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';

import { ProfileProvider } from '../../providers/profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public userProfile: any;
  public IPs: any;
  public IPST: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public profileProvider: ProfileProvider) {}

 //  ionViewDidLoad() {
 //      this.profileProvider.getUserProfile().then(
 //        IPs => {
 //          this.loading.dismiss().then(() => {
 //            this.userProfile = userProfileSnapshot.val();
 //            this.IPs = userProfileSnapshot.val().IPs;
 //          });
 //        },
 //        error => {
 //          this.loading.dismiss().then(() => {
 //            const alert: Alert = this.alertCtrl.create({
 //              message: error.message,
 //              buttons: [{ text: 'Ok', role: 'cancel' }]
 //            });
 //            alert.present();
 //          });
 //        });
 //
 //      this.loading = this.loadingCtrl.create();
 //      this.loading.present();
 //    }
 //
 // test(){
 //   this.clusterProv.getIPs().on('value', userIPsSnapshot => {
 //     this.IPs = userIPsSnapshot.val();
 //   });
 //     console.log(this.IPs);
 // }
 //  addIP(){
 //    const alert: Alert = this.alertCtrl.create({
 //      message: 'Cluster info',
 //      inputs: [
 //        {
 //          name: 'name',
 //          placeholder: 'Cluster name',
 //          value: ""
 //        },
 //        {
 //          name: 'ip',
 //          placeholder: 'IP addr',
 //          value: ""
 //        },
 //        {
 //          name: 'institution',
 //          placeholder: 'Cluster institution',
 //          value: ""
 //        },
 //        {
 //          name: 'extra',
 //          placeholder: 'Extra information',
 //          value: ""
 //        }
 //      ],
 //      buttons: [
 //        { text: 'Cancel' },
 //        {
 //          text: 'Save',
 //          handler: data => {
 //            this.clusterProv.addIP(data.name, data.ip, data.institution, data.extra);
 //          }
 //        }
 //      ]
 //    });
 //    alert.present();
 //  }

}
