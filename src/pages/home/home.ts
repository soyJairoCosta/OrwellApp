import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ClusterProvider } from '../../providers/clusterDB/clusterDB';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public IPs: string[] = ["123", "123", "342"];
  constructor(public navCtrl: NavController, public clusterProv: ClusterProvider) {

  }

}
