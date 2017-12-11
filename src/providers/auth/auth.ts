import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable()
export class AuthProvider {

  constructor() {
  }

  // checkActiveUser(email:string){
  //   const searchEmail = this.correctedEmail(email);
  //   console.log("mail: " + searchEmail);
  //   var ref = firebase.database().ref(`/users/`+searchEmail+`/active`);
  //   ref.on("value", function(snapshot) {
  //   console.log(snapshot.val());
  //     if(snapshot.val() == true ){
  //       console.log("Yes");
  //         return new Promise((resolve, error) => resolve(true));
  //       }
  //     });
  //   console.log("Nope");
  //   return new Promise((resolve, error) => resolve(false));
  //
  // }

  loginUser(email: string, password: string): Promise<any> {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    }


    logoutUser(): Promise<void> {
      const emailOff: string = this.correctedEmail(firebase.auth().currentUser.email);
      firebase
        .database()
        .ref(`/users/${emailOff}`)
        .off();
      return firebase.auth().signOut();
    }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  signupUser(email: string, password: string, name: string, surname: string, city: string, institution): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase
          .database()
          .ref(`/users/`+this.correctedEmail(email)+`/`)
          .set({
            id: newUser.uid,
            name: name,
            surname: surname,
            email: email,
            city: city,
            institution: institution
            //active: false
          });
      })
      .catch(error => console.error(error));
  }

  correctedEmail(email:string): string{
    return email.replace(".", "-").toLowerCase();
  }
}
