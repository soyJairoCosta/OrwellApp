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
        this.IPs = [];  // Initalization of the array that saves the IPs that the user has in the DB
        this.hided=false; //Hide the delete buttons of the IP cards that are showen in the main menu
    }

  // Loads the IP list that the user has stored in the firebase DB once the page is fully loaded.
  // This way, all the elements are created and the profileProvider has all the elements connected.
  ionViewDidEnter()
    //Gets the reference to the firebaseDB
    this.profileProvider.getUserIPs().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      var auxIPs: Ips[] = []; // Auxiliar var that will connect all the IPs obtained with the global var.
      // The ForEach function will return a boolean result, so it is needed to equal to a variable in order to
      //  avoid warnings during compilation. The ForEach, iterate over all the childs inside the userProfileSnapshot
      //  reference and add them to the auxiliar list.
      var done: boolean = userProfileSnapshot.forEach(function(childSnapshot) {
        // Takes the head of the element =>  ELEMENT: NAME {NAME:"", INSTITUION:"", ...}
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        // Replace all the - with . In the DB, all the roots elements can't include an . so IPs are stored like
        //   192-168-1-1. When the system load them back, the - are replaced with dots again.
        auxIPs.push(new Ips(childKey.replace(/\-/g, "."), childData.name, childData.institution, childData.extra));
      });
      this.IPs = auxIPs;
    });
  }

// Add an IP to the firebase DB using an alert with empty fields
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
          // When the button save is pressed, the handler will act.
          handler: data => {
            // First check the correct format of the IP (xxx.xxx.xxx.xxx)
            if(this.ipVal.ValidateIPaddress(data.ip))
              // If correct, the profileProvider will add the IP to the user perfil.
              this.profileProvider.addIP(data.ip, data.name, data.institution, data.extra);
            else{
              // If not correct, the system will show a toast alert.
              this.presentToastErrorIP();
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  // An option menú will appears when the user press during a few seconds an element of the
  //   ips main menu. EDIT, DELETE or CANCEL
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

  // Change the state of the hiden buttons
  showDeleteIcons(){
    this.hided = !this.hided;
  }

  // Edits the atributes of an IP. Shows an alert with editable fields.
  // The user cant edit he IP address. In that case, he must delete and create again
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
              // The profileProvider will update the IP of the user profile.
              this.profileProvider.editIP(e.ip, data.name, data.institution, data.extra);

          }
        }
      ]
    });
    alert.present();
  }

  // Delete an IP from a user profile showing an alert asking for confirmation.
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
          // Delete the IP from the IPs[] array
          this.IPs.splice(index, 1);
          // The profileProvider will delete the IP from the user profile.
          this.profileProvider.deleteIP(e.ip);
       }
     }
   ]
 });
 alert.present();
  }

  // Change all the '-' used when the IP addresses are saved into the DB with '.'
  //   for easier read.
  correctIpFromDB(ip: string): string{
    return ip.replace("-", ".");
  }

  // Presents an error when the users fails introducing the IP addresses or uses an
  //   incorrect format.
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
