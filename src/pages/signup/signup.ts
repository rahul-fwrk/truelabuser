import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { HomePage } from '../home/home';


import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import {Observable} from 'rxjs/Rx'
import {LoadingController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
	
	submitted = false;
	onSubmit() { this.submitted = true; }
	public data='';
	public resError = '';
	public pass = '';
	public notnumber = '';
	public Loader=this.loadingCtrl.create({
    content: 'Please wait...',
	dismissOnPageChange: true,
  });
   constructor ( public navCtrl: NavController, public toastCtrl : ToastController, public http:Http, public loadingCtrl:LoadingController , public appsetting: Appsetting){ }
 
  	 
	 
	 

	 
	 
	public register(signup){
		
		console.log(signup);

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let options = new RequestOptions({ headers: headers });
		//var url:string = 'http://rakesh.crystalbiltech.com/truelab/api/users/registration';
		var url = this.appsetting.base_url+'users/registration';
		console.log(this.appsetting.base_url);
		var postdata = JSON.stringify({
				firstname:signup.value.fname,
				lastname:signup.value.lname,
				email:signup.value.email,
				username:signup.value.email,
				password:signup.value.password,
				cpassword:signup.value.cpassword,
				role:'user',
				phonenumber:signup.value.phone,
				address: signup.value.address,
				address2: signup.value.address2,
				city: signup.value.city,
				state: signup.value.state,
				zipcode: signup.value.zip,

		});

		console.log(" postdata"  + postdata);

	
	   if(signup.value.password == signup.value.cpassword) {
		   
		    this.Loader.present();
			//return false;
			this.http.post(url, postdata, options).map(res=>res.json()).subscribe(data=>{
					
					this.Loader.dismiss();
					
					console.log(" response"  +JSON.stringify(data));
					this.data=data;
					console.log(this.data);
					console.log(data.error)
					
					if (data.error == 0) {
						//alert(data.msg)
						this.showToast(data.msg);
						signup = {};
						this.navCtrl.push(SigninPage);
					} else {
						//	alert(data.msg)
						this.showToast(data.msg);

					}
					
					
			}, err=>{
					
				   console.log("Error");
				   this.Loader.dismiss();
				   console.log("Error!:", err.json());
			});
			
			
	   }else{
		 
		  this.showToast('Password do not match');
		  // alert("Passwords do not match")
		   console.log("Passwords do not match");
	   }
		
	}

	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1500,
			position: 'middle'
		});
		toast.present();
	}
	
	siPage(){
		this.navCtrl.push(SigninPage);
	}
	
	
	
	// see if you need this function or not
	isnumber(number){
		
		console.log(number)
		if(!number){
			this.notnumber = '1';
		} else {
			this.notnumber = '';
			console.log(this.notnumber);
		}
	}


nextPage(){
	this.navCtrl.push(HomePage);
}

}
