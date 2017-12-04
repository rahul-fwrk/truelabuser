import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Observable } from 'rxjs/Rx'
import { LoadingController } from 'ionic-angular';
import { AlertController, Nav, Platform } from "ionic-angular";
import { SignupPage } from '../signup/signup';
import { SchedulePage } from '../schedule/schedule';
import { ViewdetailPage } from '../viewdetail/viewdetail';
import { TaskPage } from '../task/task';
import { ToastController } from 'ionic-angular';


@Component({
	selector: 'page-report',
	templateUrl: 'report.html'
})


export class ReportPage {

	onSubmit() { };
	public user_id = '';
	public data: object;// = '';
	public user = '';
	public test_id; test_name = '';
	testBit = 0;
	INR; PT; reportToSend; units; inrUnit; ptUnit; flagReport; values; isData; inrflag; ptflag; INRval; PTval;
	refRange; ptRange; inrRange;

	constructor(
		public navCtrl: NavController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		private menu: MenuController,
		public platform: Platform,
		public alertCtrl: AlertController,
		public nav: Nav,
		public navParams: NavParams,
		private toastCtrl: ToastController
	) {
		//this.isData = 0;
	

		this.test_id = this.navParams.get('test_id');
		this.test_name = this.navParams.get('tname');
		this.units = this.navParams.get('units');
		this.refRange = this.navParams.get('range');
		console.log(this.refRange);

		if (this.test_name == 'PT/INR') {
			var split = this.test_name.split("/");
			this.PT = split[0];
			this.INR = split[1];
			console.log(this.INR)
			console.log(this.PT)
			this.testBit = 1;

			var splitunit = this.units.split("/");
			this.ptUnit = splitunit[0];
			this.inrUnit = splitunit[1];


			var splitRange = this.refRange.split("/")
			console.log(this.refRange)
			this.ptRange = splitRange[0];
			console.log(this.ptRange);
			this.inrRange = splitRange[1];

		} else {
			this.test_name = this.navParams.get('tname');
			this.units = this.navParams.get('units');
			this.refRange = this.navParams.get('range');
			console.log(this.refRange)
			this.testBit = 0;
		}
		console.log("testid...  " + this.test_id);
		console.log(this.test_name);

			this.showreport();
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

	//ends here







	public showreport() {
		var Loader = this.loadingCtrl.create({
					content: 'Please wait...'	
				});
		Loader.present().then(() => {
	
		//var user_id = localStorage.getItem("user_id");
		this.test_id = this.navParams.get('test_id');
		var data_all = { id: this.test_id }

		var serialized_all = this.serializeObj(data_all);
		console.log(serialized_all);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options1 = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'users/patient';
		this.http.post(url, serialized_all, options1).map(res => res.json()).subscribe(response => {
			console.log(response);
			Loader.dismiss();
			if (response.error == 0) {


				if (response.data[0].PatientTest.report != null) {
					this.test_name = this.navParams.get('tname');

					//alert("here")
					this.values = response.data[0];
					console.log(this.values)

					if (this.test_name == 'PT/INR') {

						this.isData = 1;

						var split = this.values.PatientTest.report.split("/");
						this.PTval = split[0];
						this.INRval = split[1];

						var flagsplit = this.values.PatientTest.flag.split("/")
						this.inrflag = flagsplit[0];
						this.ptflag = flagsplit[1];


						var splitRange = this.refRange.split("/")
						this.ptRange = splitRange[0];
						console.log(this.ptRange);
						this.inrRange = splitRange[1];


						console.log(this.PT + '   ' + this.inrflag);

						this.data = {
							remarks: this.values.PatientTest.conclusion,
							PTreport: this.PTval,
							INRreport: this.INRval,
							inrflag: this.inrflag,
							ptflag: this.ptflag,
						};
						console.log(this.INR)
						console.log(this.PT)
						this.testBit = 1;

					}
					else {

						this.isData = 1;

						this.test_name = this.navParams.get('tname');
						this.data = {
							remarks: this.values.PatientTest.conclusion,
							report: this.values.PatientTest.report,
							flag: this.values.PatientTest.flag,
						};

						this.refRange = this.navParams.get('range');
						console.log(this.refRange)
						this.testBit = 0;
					}
				} else {
					this.isData = 0;
					this.data = {};
					//alert("else")
				}


			} else {

				this.isData = 0;
				this.data = {};
				
				//alert("TRY AGAIN!");
				this.showToast('Failed to fetch information')

			}

		});
	  });
	}




	reportSub(signup) {
		console.log(signup);
		//  this.Loader.present();
		this.test_id = this.navParams.get('test_id');
		var url: string = this.appsetting.base_url + 'patients/patientreport';

		console.log(signup.value.report)
		if (signup.value.report == undefined) {

			this.reportToSend = signup.value.PTreport + '/' + signup.value.INRreport;
			this.flagReport = signup.value.ptflag + '/' + signup.value.inrflag;
			console.log(this.reportToSend);

		} else {
			this.reportToSend = signup.value.report;
			this.flagReport = signup.value.flag;
		}
		var postdata = {
			id: this.test_id,
			report: this.reportToSend,
			flag: this.flagReport,
			conclusion: signup.value.remarks
		};

		var serialized = this.serializeObj(postdata);
		console.log(serialized);
		//	return false;
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });


		//return false;
		this.http.post(url, serialized, options).map(res => res.json())
			.subscribe(data => {

				this.data = data;
				console.log(this.data);

				if (data.error == 0) {
					//alert(data.msg)
					this.showToast(data.msg);
					this.navCtrl.pop();

				} else {
					//alert(data.msg)
					this.showToast(data.msg);

				}

			}, err => {
				console.log("Error");
				console.log("Error!:", err);
			});
	}


	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1500,
			position: 'middle'
		});
		toast.present();
	}



	doYourStuff() {

		this.navCtrl.pop()
	}


}
