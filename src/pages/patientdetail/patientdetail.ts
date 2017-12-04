import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import {LoadingController} from 'ionic-angular';
import { ModalPage } from '../modal/modal';
// import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
// import { FileChooser } from '@ionic-native/file-chooser';


@Component({
  selector: 'page-patientdetail',
  templateUrl: 'patientdetail.html'
})
export class PatientdetailPage {

	public user_id; data; patient_id; test_id;patienttestid; schedule = '';
	public PatientDetail = '';
	public testDetails = '';
	public testName = '';
    agencyDetails;
	public Loader = this.loadingCtrl.create({
	content: 'Please wait...'
	
	});

	constructor(
			public navCtrl: NavController,
			private modalCtrl: ModalController,
			public navParams : NavParams,
			public http:Http,
			public loadingCtrl:LoadingController,
			public appsetting: Appsetting,
		    // private transfer: Transfer,
		    // private fileChooser: FileChooser,
	) {
			 this.test_id = this.navParams.get('test_id');
		    console.log("testid...  "+this.test_id);
			this.patienttestid = this.navParams.get('patTest_id');
			console.log(this.patienttestid)
		    this.patientinfo()
		   
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
			console.log(this.patient_id)
			this.patienttestid = this.navParams.get('patTest_id');
			console.log(this.patienttestid)
			var postdata = { id: this.patient_id, testid: this.test_id,patienttestid : this.patienttestid };
	   
		    var serialized = this.serializeObj(postdata); 
		    console.log(serialized);
		    let headers = new Headers();
		    headers.append('Content-Type',  'application/x-www-form-urlencoded;charset=utf-8');
		    let options= new RequestOptions({ headers: headers });
		    var url:string = this.appsetting.base_url+'users/userinfoacctotest';

		    this.http.post(url, serialized, options).map(res=>res.json()).subscribe(data=>{
				
				  console.log(data);
				  if(data.error == 0){
					 
					 this.PatientDetail = data.msg.Patient;
					 this.testDetails = data.msg1[0].PatientTest;
					 this.agencyDetails = data.msg1[0].User;
					 this.testName =  data.msg1[0].Test;
					
				  }else{
					  
				
				  }
		    });
		
		
	}
	

	
	

	
	
	

  
	  
	presentModal(dataID) {
		var data_id = dataID;
		let modal = this.modalCtrl.create(ModalPage, { dataID : data_id});
		modal.present();
	}

	doYourStuff(){
		
		this.navCtrl.pop();  // remember to put this to add the back button behavior
	} 

}
