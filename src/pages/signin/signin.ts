import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Observable } from 'rxjs/Rx'
import { LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions, Window } from "@ionic-native/push";
import { AlertController, Nav, Platform } from "ionic-angular";
import { SignupPage } from '../signup/signup';
import { SchedulePage } from '../schedule/schedule';
import { ForgotpwPage } from '../forgotpw/forgotpw';
import { TaskPage } from '../task/task';
import { HomePage } from '../home/home';
import { Firebase } from '@ionic-native/firebase';

import { ToastController } from 'ionic-angular';
export class NotificationModel {
	public body: string;
	public title: string;
	public tap: boolean
	public aps: any;
	public alert : any;
}


@Component({
	selector: 'page-signin',
	templateUrl: 'signin.html'
})

export class SigninPage {

	submitted = false; // not of much use yet
	onSubmit() { this.submitted = true; } // same
	public user_id = '';
	public data = '';
	public Dvictoken = '';
	public user = '';
	public window: Window;

	public Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
		content: 'Loggin you in...',
	});

	constructor(
		public navCtrl: NavController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		private menu: MenuController,
		public push: Push,
		public platform: Platform,
		public alertCtrl: AlertController,
		public nav: Nav,
		public toastCtrl: ToastController,
		public firebase: Firebase)
		 {
		// 	 this.platform.ready().then(() => {		

		// 	if (this.platform.is('cordova')) {
		// 		// Initialize push notification feature
		// 		this.platform.is('android') ? this.initializeFireBaseAndroid() : this.initializeFireBaseIos();
		// 	} else {
		// 		console.log('Push notifications are not enabled since this is not a real device');
		// 	}
		// });
		//this.notification();
		console.log('Updated')
	}
	
	ionViewDidEnter() {
		this.menu.swipeEnable(false, 'menu1');
	}

	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}


	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1000,
			position: 'middle'
		});
		toast.present();
	}

	showToast2(text) {
		let toast = this.toastCtrl.create({
			message: text,
			position: 'middle',
			closeButtonText: 'OK',
			showCloseButton: true
		});
		toast.present();
	}
	


	notification() {
		this.firebase.getToken()
			.then((token) => {
				console.log('token retrieved ' + token)
				this.Dvictoken = token;
			});

		this.firebase.onTokenRefresh()
			.subscribe((token: string) => console.log(`Got a new token ${token}`));


		this.firebase.onNotificationOpen()
			.subscribe((data: any) => {

				//alert('res->  '+ JSON.stringify(data));
				if (data.tap) {
					//alert('tapped -> ' + JSON.stringify(data))
					let confirmAlert = this.alertCtrl.create({
						title: '<center>' + data.aps.alert.title + '</center>',
						message: '<center>' + data.aps.alert.body + '</center>',
						buttons: [{
							text: 'Ignore',
							role: 'cancel'
						}, {
							text: 'View',
							handler: () => {
								//TODO: Your logic here
								this.user = localStorage.getItem('current_user');
								//alert('user' + this.user)
								if (this.user == undefined || this.user == null) {
									//this.nav.push(SigninPage, {message: data.message});
								} else {

									this.nav.push(TaskPage, { message: data.message }); //this.nav.setRoot(this.pages2.SchedulePage);
								}

							}
						}]
					});
					confirmAlert.present();

				} else  {
					alert('not tapped -> ');

					//alert(JSON.stringify(data.aps.alert.title));
					//alert(JSON.stringify(data.aps.alert.body));
					// let confirmAlert = this.alertCtrl.create({
					// 	title: '<center>' + data.aps.alert.title + '</center>',
					// 	message: '<center>' + data.aps.alert.body + '</center>',
					// 	buttons: [{
					// 		text: 'Ignore',
					// 		role: 'cancel'
					// 	}, {
					// 		text: 'View',
					// 		handler: () => {
					// 			//TODO: Your logic here
					// 			this.user = localStorage.getItem('current_user');
					// 			// alert('user' + this.user)
					// 			if (this.user == undefined || this.user == null) {
					// 				this.nav.push(SigninPage, { message: data.message });
					// 			} else {

					// 				this.nav.push(TaskPage, { message: data.message }); //this.nav.setRoot(this.pages2.SchedulePage);
					// 			}
					// 			// this.nav.push(SchedulePage, {message: data.message});
					// 		}
					// 	}]
					// });
					// confirmAlert.present();
				} 
				// else {

				// 	console.log('else')
				// 	//alert('something went wrong')

				// }
			});
	}






	loginfn(signup) {
		this.firebase.getToken()
			.then((token) => {
				this.Dvictoken = token;
				let headers = new Headers();
				headers.append('Content-Type', 'application/json');
				let options = new RequestOptions({ headers: headers });

				var url = this.appsetting.base_url + 'users/login';

				var postdata = JSON.stringify({
					email: signup.value.email,
					//username:signup.value.email,
					password: signup.value.password,
					tokenid: this.Dvictoken,
					role: 'user'
				});

				console.log(" postdata" + postdata);
				var Loader = this.loadingCtrl.create({    //creating a custom loader which can be used later
					content: 'Loggin you in...',
				});
				Loader.present().then(() => {
				this.http.post(url, postdata, options).map(res => res.json())
					.subscribe(data => {

						console.log(" response" + JSON.stringify(data));
						this.data = data;
						console.log(this.data);
						Loader.dismiss();
						if (data.error == 0) {
							//alert(data.msg)
							if(data.data.User.active == '0'){
								this.showToast2("Your account has not been activated yet. Please try after some time.");
							} else{
								localStorage.setItem("user_id", data.userid);
								this.showToast(data.msg);
								this.navCtrl.push(TaskPage);

							}
							

						} else {
							this.showToast(data.msg);
						}

					}, err => {

						console.log("Error");
						Loader.dismiss();
						console.log("Error!:", err);
					});
				 })
			})
			.catch(error => console.error('Error getting token', error));
	}





	siguPage() {
		this.navCtrl.push(SignupPage);
	}

	fpwPage() {
		this.navCtrl.push(ForgotpwPage);
	}

	nextPage() {
		this.navCtrl.push(HomePage);
	}



}
