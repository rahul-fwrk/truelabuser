import { Component } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Observable } from 'rxjs/Rx'
import { LoadingController, Platform } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
	selector: 'page-changepwd',
	templateUrl: 'changepwd.html'
})
export class ChangepwdPage {

	public data = '';
	constructor(
		public navCtrl: NavController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		public toastCtrl: ToastController,
		public platform: Platform,
		public nav : Nav
	) {

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
			duration: 1800,
			position: 'middle'
		});
		toast.present();
	}



	changePwd(formdata) {
		//console.log(signup);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });

		var url = this.appsetting.base_url + 'users/changepassword';
		var user:any = localStorage.getItem("current_user");
		var postdata = { 
			old_password: formdata.value.password,
			new_password: formdata.value.newpassword,
			email: JSON.parse(user).email };

		var serialized = this.serializeObj(postdata);
		console.log(serialized);
		var Loader = this.loadingCtrl.create({
			dismissOnPageChange: true
		});
		if (formdata.value.password.length < 6) {
			this.showToast("Your old password is incorrect");
			return false;
		} else {
			if (formdata.value.newpassword == formdata.value.cpassword) {
				Loader.present().then(() => {
					this.http.post(url, serialized, options).map(res => res.json())
						.subscribe(data => {

							Loader.dismiss();
							//this.hide();
							console.log(" response" + JSON.stringify(data));
							this.data = data;
							console.log(this.data);

							if (data.isSucess == 'true') {
								//alert(data.msg)
								this.showToast(data.msg)
								this.logOut();
							} else {
								this.showToast(data.msg)
							}

						}, err => {
							console.log("Error");
							Loader.dismiss();
							console.log("Error!:", err.json());
						});

				})
			}
			else {
				this.showToast("Passwords do not match");
			}
		}

	}

	logOut() {
		localStorage.removeItem('current_user');
		localStorage.removeItem('user_id');
		this.showToast("Please log in again with new password");
		this.nav.setRoot(SigninPage); //this.nav.push(SigninPage)
		this.navCtrl.popToRoot();
	}
	// getPdf(url) {

	// 	//alert('jdshvfd')
	// 	this.platform.ready().then(() => {
	// 		open(url, "_system");
	// 		console.log("link viewed");
	// 	});

	// }


	nextPage() {
		this.navCtrl.push(SigninPage);
	}
}
