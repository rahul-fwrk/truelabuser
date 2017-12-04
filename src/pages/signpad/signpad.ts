import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Observable } from 'rxjs/Rx'
import { LoadingController } from 'ionic-angular';
import { AlertController, Platform } from "ionic-angular";
import { SignupPage } from '../signup/signup';
import { SchedulePage } from '../schedule/schedule';
import { ViewdetailPage } from '../viewdetail/viewdetail';
import { TaskPage } from '../task/task';
import { Storage } from '@ionic/storage';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ToastController } from 'ionic-angular';


@Component({
	selector: 'page-signpad',
	templateUrl: 'signpad.html'

})


export class SignpadPage {

	onSubmit() { };
	public user_id = '';
	public data = '';
	public user = '';
	public test_id; test_name = '';
	testBit = 0;
	reportToSend; imageToSend;src;
	signature = '';
	isDrawing = false;
	patient_id;

	@ViewChild(SignaturePad) signaturePad: SignaturePad;
	private signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
		'minWidth': 2,
		'canvasWidth': 400,
		'canvasHeight': 200,
		'backgroundColor': '#f6fbff',
		'penColor': '#666a73'
	};

	constructor(
		public navCtrl: NavController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		private menu: MenuController,
		public platform: Platform,
		public alertCtrl: AlertController,
	//	public nav: Nav,
		public storage: Storage,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public toastCtrl : ToastController,
		//private device: Device
	) { 
		//this.test_id = this.navParams.get('test_id'); 
		
		//this.savePad();
		this.src = this.navParams.get('src'); //'http://rakesh.crystalbiltech.com/truelab/MPDF57/pdf/1495780265.pdf'
		console.log(this.src) 
	}


	// ionViewDidEnter() {
	// 	this.menu.swipeEnable(false, 'menu1');
	// }


	ionViewDidEnter() {
		this.signaturePad.clear()
		this.menu.swipeEnable(false, 'menu1');
	//	this.signature = 'deomo'
		// this.storage.get('savedSignature').then((data) => {
		// 	this.signature = data;
		// });
	}

	drawComplete() {
		this.isDrawing = false;
	}

	drawStart() {
		this.isDrawing = true;
	}

	savePad() {

		this.signature = this.signaturePad.toDataURL();
		this.storage.set('savedSignature', this.signaturePad.toDataURL());

		let imgurl = this.storage.get('savedSignature');

		//console.log(" LOOK HERE!!!! "+ JSON.stringify(imgurl) );
		console.log(imgurl);
		imgurl.then((url) => {
			//console.log(url);
			if (url != null) {
				this.signature = this.signaturePad.toDataURL();
				console.log(this.signature);
				var test = url.split(',');
				var actualimg = test[1];
				this.imageToSend = actualimg;
				this.postSign(this.imageToSend);    //change this
			} else {
				console.log('err  ' + url);
				//alert('Please confirm by pressing again.');
				this.showToast('Please confirm by pressing again.')
			}
		}, function(err){

			console.log(err);
		})

	//	this.signaturePad.clear();

		// var base = this.storage.get('savedSignature')
		// console.log("BASE! " + base);
	}

	clearPad() {
		this.signaturePad.clear();
	}

	removeSign() {
		this.storage.remove('savedSignature');
	}

	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}
	//ends here

	
	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1500,
			position: 'bottom'
		});
		toast.present();
	}
	//ends here


	postSign(image) {
		console.log(image);
		//  this.Loader.present();
	//	this.test_id = this.navParams.get('test_id'); // just for redirection purpose
	//	this.patient_id = this.navParams.get('pat_id'); // just for redirection purpose

		let id = this.navParams.get('PatientTest_id'); 
		
		console.log(id)
		var url: string = this.appsetting.base_url + 'users/patientsignature';

		var postdata = {
			id: id,
			patientsignature: image
		};

		var serialized = this.serializeObj(postdata);
		//console.log(serialized);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });

		//return false;
		this.http.post(url, serialized, options).map(res => res.json())
			.subscribe(data => {

				this.data = data;
				console.log(this.data);

				if (data.msg == 'image is uploaded') {
					this.showToast('Signature saved.')
					//this.navCtrl.push(ViewdetailPage, { pat_id : this.patient_id , test_id : this.test_id});
					this.viewCtrl.dismiss();

				} else {
					//alert(data.msg)
				}

			}, err => {
				console.log("Error");
				console.log("Error!:", err);
			});
	}
	//ends here

	doYourStuff() {
		this.navCtrl.pop()
	}


}
