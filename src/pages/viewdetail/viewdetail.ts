import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { FileChooser } from '@ionic-native/file-chooser';
import { ReportPage } from '../report/report';  //
import { SignpadPage } from '../signpad/signpad';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
@Component({
	selector: 'page-viewdetail',
	templateUrl: 'viewdetail.html'
})
export class ViewdetailPage {

	public user_id; data; scheduledDate;patienttestid;clientsignIMG; scheduledTime; patient_id; units; test_id; schedule = '';
	public PatientDetail = '';
	public testDetails = '';
	public testName = '';
	public tname; id = '';
	public errorValue = 0;
	agencyDetails;src;patientsignIMG;range;
	// public fileTransfer :  any;

	// public Loader = this.loadingCtrl.create({
	// 	content: 'Please wait...'

	// });

	constructor(
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		public navParams: NavParams,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		// private transfer: Transfer,
		private fileChooser: FileChooser,
		private transfer: Transfer,
		private file: File,
		private camera: Camera
	) {
		//   const fileTransfer: TransferObject = this.transfer.create();
		this.patientinfo()
		this.test_id = this.navParams.get('test_id');
		this.patienttestid = this.navParams.get('patTest_id');
		console.log("testid...  " + this.test_id);
		console.log("patienttestid...  " + this.patienttestid);
		//this.navCtrl.pop()
	//	alert('sdfsdf');

	}



	serializeObj(obj) {

		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}




	//patients/viewpatients
	public patientinfo() {

		this.patient_id = this.navParams.get('pat_id');
		this.test_id = this.navParams.get('test_id');
		this.patienttestid = this.navParams.get('patTest_id');
		console.log(this.patient_id)
		var postdata = { id: this.patient_id, testid: this.test_id,patienttestid : this.patienttestid };

		var serialized = this.serializeObj(postdata);
		console.log(serialized);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'users/userinfoacctotest';

		var Loader = this.loadingCtrl.create({
			content: 'Please wait...'

		});
	    Loader.present().then(() => {

		this.http.post(url, serialized, options).map(res => res.json()).subscribe(data => {

			console.log(data);
			//return false;
			Loader.dismiss();
			if (data.error == 0) {

				this.PatientDetail = data.msg.Patient;
				// console.log(this.PatientDetail.fasting)
				this.testDetails = data.msg1[0].PatientTest;
				this.agencyDetails = data.msg1[0].User;
				console.log(this.agencyDetails);
				console.log(this.agencyDetails.agencyname);
				console.log(this.agencyDetails.agencyphonenumber)

				this.testName = data.msg1[0].Test;
				this.id = data.msg1[0].PatientTest.id;
				this.tname = data.msg1[0].Test.test;
				this.range = data.msg1[0].Test.referencerange;
				this.units = data.msg1[0].Test.units;
				console.log(this.testDetails)
				var getdate = data.msg1[0].PatientTest.date;
				var patientSign = data.msg1[0].PatientTest.patientsignature;
				var clientSign = data.msg1[0].PatientTest.clientsignature;
				this.src = data.msg1[0].PatientTest.paidreport;
				console.log(patientSign)
				console.log(clientSign)
				console.log(this.src);
			
				if(clientSign == null || clientSign == '' ){
						this.clientsignIMG = '';
						this.errorValue = 1;
				} else {
					    this.clientsignIMG = data.msg1[0].PatientTest.clientsignature;
						this.errorValue = 0;
				}
				if(patientSign == null || patientSign == '' || clientSign == null){
						this.errorValue = 1;
						this.patientsignIMG = '';
					
				} else {
					this.patientsignIMG = data.msg1[0].PatientTest.patientsignature;
					this.errorValue = 0;
					 
				}


				console.log(getdate);
				var test1 = getdate.split(" ");
				this.scheduledDate = test1[0];
				this.scheduledTime = test1[1];

				console.log(this.scheduledDate + '  ' + this.scheduledTime);

			} else {


			}
		 });
		});

	}





	presentModal(dataID) {
		var data_id = dataID;
		let modal = this.modalCtrl.create(ModalPage, { dataID: data_id });
		modal.present();
	}

	reportPage() {
		let id = this.id;
		let t_name = this.tname;
		let unit = this.units;
		let range = this.range;
		console.log('name ... ' + this.tname)
		this.navCtrl.push(ReportPage, { test_id: id, tname: t_name, units: unit, range : this.range })
	};

	// signaturePad() {
	// 	let id = this.id;
	// 	let test_ID = this.navParams.get('test_id');
	// 	this.patient_id = this.navParams.get('pat_id');
	// 	this.navCtrl.push(SignpadPage, { PatientTest_id: id, test_id : test_ID , pat_id : this.patient_id});
	// }



 signaturePad() {
		let id = this.id;
		let src = this.src
		this.patient_id = this.navParams.get('pat_id');
		console.log(this.patient_id)
		let modal = this.modalCtrl.create(SignpadPage, {PatientTest_id: id, src : this.src , pat_id : this.patient_id});
		
		modal.onDidDismiss(data => {
			this.patientinfo();
			console.log('updated the list')
		});
		modal.present();
    }




	doYourStuff() {

		this.navCtrl.pop();  // remember to put this to add the back button behavior
	}

}
