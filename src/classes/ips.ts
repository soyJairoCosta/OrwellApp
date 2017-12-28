export class Ips{
  ip: string;
  name:string;
  extra: string;
  institution: string;

  constructor(ip: string, name: string, institution: string,  extra: string){
    this.ip = ip;
    this.name = name;
    this.extra = extra;
    this.institution = institution;
  }
}
