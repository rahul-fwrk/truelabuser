import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions, URLSearchParams, QueryEncoder} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import {Observable} from 'rxjs/Rx'
import {LoadingController , Platform} from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-forgotpw',
  templateUrl: 'forgotpw.html'
})
export class ForgotpwPage {

	public data='';
	public Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
		dismissOnPageChange: true					
	});


    constructor (
		 public navCtrl: NavController, 
		 public http:Http, 
		 public loadingCtrl:LoadingController, 
		 public appsetting: Appsetting,
		 public toastCtrl : ToastController,
		 public platform : Platform
	){
		 
	 }
  
  //https://rakesh.crystalbiltech.com/truelab/api/users/forgetpwd
  
	serializeObj(obj) {
			var result = [];
			for (var property in obj)
				result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

			return result.join("&");
	}
		
		
	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1800,
			position: 'middle'
		});
		toast.present();
	}


		
   forgotPwd(userEmail){
		//console.log(signup);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		
		var url = this.appsetting.base_url+'users/forgetpwd';
		
		var postdata = { username:userEmail.value.email };
		
		var serialized = this.serializeObj(postdata);
		
		console.log(" postdata"  + serialized);

		var Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
			dismissOnPageChange: true					
		});
	    Loader.present().then(()=>{
		this.http.post(url, serialized, options).map(res=>res.json())
			.subscribe(data=>{
					 Loader.dismiss()
					console.log(" response"  +JSON.stringify(data));
					this.data=data;
					console.log(this.data);

					 if(data.error == 0) {
						 //alert(data.msg)
						 userEmail = {};
						this.showToast(data.msg)
						 this.navCtrl.push(SigninPage); 
					 } else {
						// alert(data.msg)
						 this.showToast(data.msg)
					 }
					
			}, err=>{
				
				  console.log("Error");
				  Loader.dismiss();
				  console.log("Error!:", err.json());
			});
			
			 })
		
	 }
  
	public hide(){ 
		this.Loader.dismiss(); 
	}
	public show(){ 
		this.Loader.present(); 
	}
  

	// getPdf(url) {

	// 	//alert('jdshvfd')
	// 	this.platform.ready().then(() => {
	// 		open(url, "_system");
	// 		console.log("link viewed");
	// 	});

	// }


nextPage(){
    this.navCtrl.push(SigninPage);
  }
}
