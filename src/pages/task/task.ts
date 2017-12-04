import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { FormControl } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AcceptmodalPage } from '../acceptmodal/acceptmodal';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


import { AlertController } from 'ionic-angular';
import { SchedulePage } from '../schedule/schedule';
import { ViewdetailPage } from '../viewdetail/viewdetail';
import { PatientdetailPage } from '../patientdetail/patientdetail';
import { UnschedulePage } from '../unschedule/unschedule';


@Component({
	selector: 'page-task',
	templateUrl: 'task.html',

})


export class TaskPage {

	public user_id; data; schedule = '';
	public myInput: string = '';
	public errorValue = '2';
	searchControl: FormControl;
	public PatientList: any;
	public searchArray: '';
	// public Loader = this.loadingCtrl.create({
	// 	content: 'Please wait...'

	// });

	public showLoader = this.loadingCtrl.create({
		content: 'Please wait...'

	});


	constructor(
		public navCtrl: NavController,
		public events: Events,
		public alertCtrl: AlertController,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		public toastCtrl: ToastController
	) {

		this.showprofile();
		this.ListPatients()
		this.schedule = "1";  // to disable the schedule button
		console.log(this.schedule)
		this.searchControl = new FormControl();

	}



	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}


	public showprofile() {
		var user_id = localStorage.getItem("user_id");
		console.log(user_id);

		var data_all = { id: user_id }

		var serialized_all = this.serializeObj(data_all);
		console.log(serialized_all);
		let headers = new Headers();

		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'users/userinfo';
		this.http.post(url, serialized_all, options).map(res => res.json()).subscribe(data => {
			console.log(data);
			if (data.error == 0) {
				console.log(data);
				console.log(data.msg.User);
				var USER = data.msg.User;
				localStorage.setItem('current_user', JSON.stringify(data.msg.User));
				localStorage.setItem('pro_pic', JSON.stringify(data.msg.User.image));
				this.events.publish('user:signedIn', 'login'); // create event get app.ts

				this.data = USER;
				console.log(this.data);
			} else {
				//	alert("TRY AGAIN!");
			}
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


	public ListPatients() {

		var user_id = localStorage.getItem("user_id");
		var postdata = { id: user_id }

		var serialized = this.serializeObj(postdata);
		console.log(serialized);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'patients/userpatientlist';
		var Loader = this.loadingCtrl.create({
			content: 'Listing...'
		});
		Loader.present().then(() => {
			this.http.post(url, serialized, options).map(res => res.json()).subscribe(data => {
				console.log(data);
				Loader.dismiss();
				if (data.error == 0) {
					console.log(data);
					console.log(data.msg[0]);
					this.PatientList = data.msg;
					console.log(this.PatientList)
					this.errorValue = '2';
					console.log(this.errorValue)

				} else {

					this.errorValue = '1'
					console.log(this.errorValue)
				}
			});
		})
	}

	//tasks/acceptdecline  dataID, test_id,
	public decline(patID, dataID, test_id, data, doc_ID) {

		//this.showLoader.present().catch();

		var user_id = localStorage.getItem("user_id");
		//alert(data)
		var postdata = {
			id: dataID,
			patientid: patID,
			testid: test_id,
			status: '3',
			reason: data,
			role: '',
			date: '',
			userid: user_id,
			doctorid: doc_ID
		}


		console.log(postdata)
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var serialized = this.serializeObj(postdata);
		console.log(serialized);
		var url: string = this.appsetting.base_url + 'tasks/acceptdecline';
		//return false;
		var Loader = this.loadingCtrl.create({
			content: 'Listing...'
		});
		Loader.present().then(() => {
			this.http.post(url, serialized, options).map(res => res.json()).subscribe(data => {
				console.log(data);
				Loader.dismiss();
				if (data.error == 0) {
					console.log(data);
					// alert('You have declined this task.')
					this.showToast('You have declined this task.')
					this.ListPatients();
				} else {
					console.log(this.errorValue)
				}
			});
		});
	}







	// used to filter the list
	setFilteredItems() {
		console.log(this.myInput);
		var keyword = this.myInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
		console.log(keyword);
		console.log(keyword.length);

		if (keyword.length == 0) {
			console.log('plz write something');
			this.errorValue = '2';
			console.log(this.errorValue);
		} else {

			this.searchArray = this.filterItems(keyword);
			console.log('Filtering');
			this.errorValue = '0';
			console.log(this.errorValue);
		}
	}



	filterItems(searchTerm) {
		console.log('searchTerm.... ' + searchTerm);
		console.log(this.PatientList);
		if (this.PatientList != undefined) {
			return this.PatientList.filter((patient) => {
				return patient.Patient.trackingid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
			});
		}

	}
	// end filter



	onCancel() {
		this.ListPatients();
	}

	detailsPage(id, patTest_id, testid) {
		this.navCtrl.push(PatientdetailPage, { pat_id: id, patTest_id: patTest_id, test_id: testid });
	}

	schPage() {
		this.navCtrl.push(SchedulePage);
	}

	unschPage() {
		this.navCtrl.push(UnschedulePage);
	}

	showPrompt() {
		let prompt = this.alertCtrl.create({
			title: 'Login',
			message: "Enter a name for this new album you're so keen on adding",

			inputs: [
				{
					name: 'title',
					placeholder: 'Title'
				},
			],


			buttons: [
				{
					text: 'Cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Save',
					handler: data => {
						console.log('Saved clicked');
					}
				}
			]
		});
		prompt.present();
	}


	showAlert(id, dataID, testID, docID) {
		console.log('patient id ' + id + ', data_id ' + dataID + ', test id' + testID + ', doc id' + docID);

		let alert = this.alertCtrl.create({
			//title: 'Decline Reason',dataID
			subTitle: 'Decline Reason',
			inputs: [
				{
					name: 'textarea',
					placeholder: 'Type Reason',
					type: 'textarea'
				}
			],

			buttons: [{
				text: 'OK',
				handler: data => {

					var patient_id = id;
					var data_ID = dataID;
					var test_ID = testID;
					var doc_ID = docID;
					console.log(patient_id + '  ' + data_ID + '   ' + test_ID)//test_ID,data_ID

					if (data.textarea == '') {
						this.showError();
					} else {
						console.log(data.textarea)
						this.decline(patient_id, data_ID, test_ID, data.textarea, doc_ID);
					}

				}
			}]
		});
		alert.present();

	}

	showError() {
		//alert("Please give a reason");
		this.showToast('Please give a reason')

	}


	// opens the acceptpagemodel 
	presentModal(id, dataID, testID, docID) {

		// var patient_id = id;
		// var data_ID = dataID;
		// var test_ID = testID;

		console.log('patient id ' + id + ', data_id ' + dataID + ', test id' + testID + ', ' + docID);
		let modal = this.modalCtrl.create(AcceptmodalPage, { patient_id: id, data_ID: dataID, test_ID: testID, doc_id: docID });

		modal.onDidDismiss(data => {
			this.ListPatients();
			console.log('updated the list')
		});

		modal.present();

	}

}
