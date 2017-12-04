import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Appsetting provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Appsetting {

  public base_url:string = 'https://truelabllc.com/truelab/api/'; 

    // public base_url:string = 'http://rakesh.crystalbiltech.com/truelab/api/'; 
 
  constructor(public http: Http) {
    console.log('Hello Appsetting Provider');
  }

  
}
