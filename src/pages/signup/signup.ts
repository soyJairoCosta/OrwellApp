import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";  
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      name: [
        ""
      ],
      surname: [
        ""
      ],
      city: [
        ""
      ],
      institution: [
        ""
      ],
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }


  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const name: string = this.signupForm.value.name;
      const surname: string = this.signupForm.value.surname;
      const city: string = this.signupForm.value.city;
      const institution: string = this.signupForm.value.institution;
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;

      this.authProvider.signupUser(email, password, name, surname, city, institution).then(
        user => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(LoginPage);
            this.loading.dismiss().then(() => {
              const alert: Alert = this.alertCtrl.create({
                message: "El administrador del sistema debe activar tu cuenta",
                buttons: [{ text: "Ok", role: "cancel" }]
              });
              alert.present();
            });
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
