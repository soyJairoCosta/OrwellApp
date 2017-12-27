export class ClusterInfo {
  private IP : string;
  private name : string;
  private institution: string;
  private description: string;

  constructor() {

  }

  setIP(IP: string){
    this.IP = IP;
  }
  setName(name: string){
    this.name = name;
  }
  setInstitution(institution: string){
    this.institution = institution;
  }
  setDescription(description: string){
    this.description = description;
  }
  getIP(){
    return this.IP;
  }
  getName(){
    return this.name;
  }
  getInstitution(){
    return this.institution;
  }
  getDescription(){
    return this.description;
  }

}

export class Cluster extends ClusterInfo {

  constructor() {

  }
}
