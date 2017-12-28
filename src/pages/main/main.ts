import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import { Ips } from '../../classes/ips';
import { IPValidator } from "../../validators/ip";
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  public userProfile: any;
  public IPs: Ips[];
  public hided: boolean;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    public ipVal: IPValidator,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController) {
        this.IPs = []
        this.hided=false;
    }

  ionViewDidEnter() {
    this.profileProvider.getUserIPs().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      var auxIPs: Ips[] = [];
      userProfileSnapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        auxIPs.push(new Ips(childKey.replace(/\-/g, "."), childData.name, childData.institution, childData.extra));
      });
      this.IPs = auxIPs;
      console.log(this.IPs);
    });
  }

  async test(){
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.IPs = userProfileSnapshot.val().ips;
      console.log(this.IPs);
    });
  }

  addIP(){
    const alert: Alert = this.alertCtrl.create({
      message: 'Cluster info',
      inputs: [
        {
          name: 'name',
          placeholder: 'Cluster name',
          value: ""
        },
        {
          name: 'ip',
          placeholder: 'IP addr',
          value: ""
          //required\spattern: "((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$"
        },
        {
          name: 'institution',
          placeholder: 'Cluster institution',
          value: ""
        },
        {
          name: 'extra',
          placeholder: 'Extra information',
          value: ""
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            if(this.ipVal.ValidateIPaddress(data.ip))
              this.profileProvider.addIP(data.ip, data.name, data.institution, data.extra);
            else{
              this.presentToastErrorIP();
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }
  pressEvent(e, index){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.editarIP(e, index);
          }
        },{
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarIP(e, index);
          }
        },{
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  
  showDeleteIcons(){
    this.hided = !this.hided;
  }

  editarIP(e, index){
    const alert: Alert = this.alertCtrl.create({
      subTitle: 'Cluster info',
      inputs: [
        {
          name: 'name',
          placeholder: 'Cluster name',
          value: e.name
        },
        {
          name: 'institution',
          placeholder: 'Cluster institution',
          value: e.institution
        },
        {
          name: 'extra',
          placeholder: 'Extra information',
          value: e.extra
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
              this.profileProvider.editIP(e.ip, data.name, data.institution, data.extra);

          }
        }
      ]
    });
    alert.present();
  }

  eliminarIP(e, index){
    let alert = this.alertCtrl.create({
   title: 'Confirmar eliminación',
   message: '¿Quieres eliminar la IP?',
   buttons: [
     {
       text: 'Cancelar',
       role: 'cancel',
     },
     {
       text: 'Sí',
       handler: () => {
          this.IPs.splice(index, 1);
          this.profileProvider.deleteIP(e.ip);
       }
     }
   ]
 });
 alert.present();
  }

  correctIpFromDB(ip: string): string{
    return ip.replace("-", ".");
  }

  presentToastErrorIP() {
    let toast = this.toastCtrl.create({
      message: 'IP format incorrect, follow XXX.XXX.XXX.XXX',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
