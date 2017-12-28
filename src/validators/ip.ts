import { FormControl } from '@angular/forms';
export class IPValidator {
  public ValidateIPaddress(ipaddress): Boolean {
    var ip = ipaddress.split(".");

       if (ip.length != 4) {
           return false;
       }

       //Check Numbers
       for (var c = 0; c < 4; c++) {
           //Perform Test
           if ( ip[c] <= -1 || ip[c] > 255 ||
                isNaN(parseFloat(ip[c])) ||
                !isFinite(ip[c])  ||
                ip[c].indexOf(" ") !== -1 ) {

                return false;
           }
       }
       return true;
}
}
