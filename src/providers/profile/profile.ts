import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference;
  public userIpProfile: firebase.database.Reference;
  public currentUser: firebase.User;
  public ips: string;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/users/${this.correctedEmail(user.email)}`);
        this.userIpProfile = firebase.database().ref(`/users/${this.correctedEmail(user.email)}/IPs/`);
        console.log("Constructor");
        }
    });

  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }
  getUserIPs(): firebase.database.Reference{
    console.log("getUserIp");
    return this.userIpProfile;
  }

  updateName(name: string, surname: string): Promise<any> {
    return this.userProfile.update({ name, surname });
  }

  updateCity(city: string): Promise<any> {
    return this.userProfile.update({ city });
  }
  updateInstitution(institution: string): Promise<any> {
    return this.userProfile.update({ institution });
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );

    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log('Password Changed');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  correctedEmail(email:string): string{
    return email.replace(/\./g, "-").toLowerCase();
  }

  addIP(ip:string, name: string, institution: string, extra: string): Promise<any>{
    //return this.userProfile.update({ ips });
    return firebase
      .database().ref(`/users/${this.correctedEmail(this.currentUser.email)}/IPs/${(ip).replace(/\./g, "-")}`).set({
        name: name,
        institution: institution,
        extra: extra
        //active: false
      });
  }

  editIP(ip:string, name: string, institution: string, extra: string): Promise<any>{
    //return this.userProfile.update({ ips });
    return firebase
      .database().ref(`/users/${this.correctedEmail(this.currentUser.email)}/IPs/${(ip).replace(/\./g, "-")}`).update({
        name: name,
        institution: institution,
        extra: extra
        //active: false
      });
  }

  deleteIP(ip:string): Promise<any>{
    console.log(ip);
    return firebase
      .database().ref(`/users/${this.correctedEmail(this.currentUser.email)}/IPs/${(ip).replace(/\./g, "-")}`).remove();
  }
}
