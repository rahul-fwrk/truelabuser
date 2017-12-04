import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { FormControl } from '@angular/forms';
import { Appsetting } from '../../providers/appsetting';
import {LoadingController} from 'ionic-angular';
import { ReasonmodalPage } from '../reasonmodal/reasonmodal';
import { ReschedmodalPage } from '../reschedmodal/reschedmodal';
import {Observable} from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { ViewdetailPage } from '../viewdetail/viewdetail';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
//import { File } from '@ionic-native/file';
import 'rxjs/add/operator/share';
import { ToastController } from 'ionic-angular';



@Component({ 
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

	public user_id; PatientList; customMsg; data; schedule = '';
	

	public myInput:string = '';
	public errorValue = '2';
	searchControl: FormControl;
	public searchArray : '';
	public testRadioOpen; testRadioResult = '';
	nativepath: string;

	// public Loader = this.loadingCtrl.create({
	// 	content: 'Please wait...'	
	// });

	constructor( 
		public navCtrl: NavController, 
		public alertCtrl: AlertController, 
		private modalCtrl: ModalController,
		public http:Http, 
		public loadingCtrl:LoadingController, 
		public appsetting: Appsetting,
		public transfer: Transfer,
		//public file: File,
		private fileChooser: FileChooser,
		public toastCtrl : ToastController	
	) {
	    this.ListScheduledPatients();
			
	    this.searchControl = new FormControl();
	}
  


		showToast(text) {
			let toast = this.toastCtrl.create({
				message: text,
				duration: 2000,
				position: 'middle',
				//cssClass
			});
			toast.present();
		}


  
	serializeObj(obj) {

		var result = [];
		for (var property in obj)
		result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}
  
   
  
	public ListScheduledPatients() {
		
			var user_id = localStorage.getItem("user_id");
			var postdata = { id : user_id }
		    var serialized = this.serializeObj(postdata); 
		    console.log(serialized);
		    let headers = new Headers();
		    headers.append('Content-Type',  'application/x-www-form-urlencoded;charset=utf-8');
		    let options= new RequestOptions({ headers: headers });
		    var url:string = this.appsetting.base_url+'patients/useracceptpatientlist';
				var Loader = this.loadingCtrl.create({
					content: 'Please wait...'	
				});
				Loader.present().then(() => {
						this.http.post(url, serialized, options).map(res=>res.json()).subscribe(data=>{
							Loader.dismiss();
							console.log(data);
							if(data.error == 0){
								
							console.log(data.msg[0]);
							this.PatientList = data.msg;
							console.log(this.PatientList);
				
							this.errorValue = '2';
							console.log(this.errorValue)
							
							}else{
								
							this.errorValue = '1'
							console.log(this.errorValue)
							
							}
						});
		 });
		// });
	}
	
	
	
  
  
    //used to filter the list
	setFilteredItems(){
		
		console.log(this.myInput);
		var keyword = this.myInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
		console.log(keyword);
		console.log(keyword.length);
		  
		if(keyword.length == 0) {
			 //this.ListScheduledPatients();
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
  
  
	filterItems(searchTerm){
			console.log('searchTerm.... ' +searchTerm )
			console.log(this.PatientList)
			
		if(this.PatientList != undefined){
				return this.PatientList.filter((patient) => {
					return patient.Patient.trackingid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
				});  
		}    
 
    }
	// end filter
	
	
	onCancel() {
		 this.ListScheduledPatients();
	}
  
  
	showAlert() {
		 // console.log(id + dataID + testID)
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
				  
					// var patient_id = id;
					 // var data_ID = dataID;
					 // var test_ID = testID;
					//console.log(patient_id + '  ' + data_ID + '   ' + test_ID)test_ID,data_ID
					
					// if(data.textarea == ''){
						// this.showError();
					// } else {
						// console.log(data.textarea)
						// this.decline(patient_id,data_ID,test_ID,data.textarea);	
					// }	
			  }
			}]
		});
		alert.present();
	}
  
	
	viewPage(id,patTest_id, testid){
		this.navCtrl.push(ViewdetailPage,{pat_id : id, patTest_id: patTest_id, test_id : testid});
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

	
	
	
	

	
	
	
	
	
	
	
	presentModal(id,dataID, testID, docID) {
	
		console.log('patient id '+id + ', data_id '+ dataID +', test id' + testID +', doc id' + docID);
		let modal = this.modalCtrl.create(ReasonmodalPage, { patient_id : id , data_ID : dataID, test_ID : testID, doc_id : docID});
		modal.onDidDismiss(data => {
			this.ListScheduledPatients();
			console.log('updated the list')
		});
		modal.present();
    }
  
  
    reSchedModal(id,dataID, testID, docID) {
		console.log('patient id '+id + ', data_id '+ dataID +', test id' + testID + 'doc id ...' + docID);
		let modal = this.modalCtrl.create(ReschedmodalPage,{ patient_id : id , data_ID : dataID, test_ID : testID, doc_id : docID});
		
		modal.onDidDismiss(data => {
			this.ListScheduledPatients();
			console.log('updated the list')
		});
		modal.present();
    }
}
  