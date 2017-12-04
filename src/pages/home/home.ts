import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { SigninPage } from '../signin/signin';
import {Http, Headers, RequestOptions} from '@angular/http';
import { TaskPage } from '../task/task';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	public user_id : '';
	
   constructor ( 
		public navCtrl: NavController,
		public http:Http,
		private menu: MenuController
	){ 

		var user_id = localStorage.getItem('user_id');
		if(user_id == null || user_id == undefined){
			console.log("not logged")
		} else{
			console.log("logged user")
			this.navCtrl.push(TaskPage);	
		}
   }
  
      ionViewDidEnter() {
		this.menu.swipeEnable(false);
    }
  
	nextPage(){
		this.navCtrl.push(SigninPage);
	  }
	  
	  
	sigPage(){
		this.navCtrl.push(SignupPage);
	  }

}
