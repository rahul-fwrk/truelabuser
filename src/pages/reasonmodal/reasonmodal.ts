import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-reasonmodal',
  templateUrl: 'reasonmodal.html'
})
export class ReasonmodalPage {
	
	public myDate; data_ID; doc_id;user; patient; test_ID; errorValue; patient_id :any;
	public data ='';
	public value; reason1 = '';
    constructor(
		public navCtrl: NavController,
		public navParams : NavParams ,
		public http : Http, 
		public loadingCtrl:LoadingController,
		public appsetting: Appsetting,
		public viewCtrl: ViewController,
		public toastCtrl : ToastController
	) {
		
		this.patient_id = this.navParams.get('patient_id');
	    this.data_ID = this.navParams.get('data_ID');
	    this.test_ID = this.navParams.get('test_ID');
		this.doc_id = this.navParams.get('doc_id');
		console.log("data_ID...  "+this.data_ID);
	    console.log("patient_id...  "+this.patient_id);
	    console.log("test_ID...  "+this.test_ID);
		console.log("doc_id...  "+this.doc_id);
		
	}



	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 2000,
			position: 'middle'
		});
		toast.present();
	}
 
	getdata(reason, role) {
		
		if(!reason){
			console.log("reason undeinfed")
			 this.errorValue = '1';
		}else {
			this.reason1 = reason;
			var reasonValid = this.reason1.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
			console.log(reasonValid)
			if(reasonValid) {
			 
			  console.log('reason '+reason + ',' + ' role ' + role)
			  this.errorValue = '0';
			  if(role == undefined){
				  
				  this.errorValue = '2';
 
			  }else {
				  
				  console.log("ALL GOOD");
				  var patient_id = this.navParams.get('patient_id');
				  var data_ID = this.navParams.get('data_ID');
				  var test_ID = this.navParams.get('test_ID');
				  var doc_id = this.navParams.get('doc_id');
				  
				  this.reSchedule(patient_id, data_ID, test_ID, reasonValid,role,doc_id)
				  
			  }
			  
			  
			} else {
				this.reason1 = '';
				this.errorValue = '1';	 
			}
		}


	}
	
	
	
	serializeObj(obj) {

		var result = [];
		for (var property in obj)
		result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}

	
	public reSchedule(patID, dataID, test_id, reasonValid, role,doc_id) {
			var user_id = localStorage.getItem("user_id");
			//alert(data)
			var postdata = { id : dataID ,
							 patientid : patID,
							 testid: test_id,
							 status : 4,
							 reason	: reasonValid,
							 role : role,
							 date   : '',
							 userid : user_id,
							 doctorid : doc_id
							}
							 
			
			console.log(postdata)
				
			
		    let headers = new Headers();
		    headers.append('Content-Type',  'application/x-www-form-urlencoded;charset=utf-8');
		    let options= new RequestOptions({ headers: headers });
			var serialized = this.serializeObj(postdata); 
			console.log(serialized);
		    var url:string = this.appsetting.base_url+'tasks/acceptdecline';
			//return false;
		    this.http.post(url, serialized, options).map(res=>res.json()).subscribe(data=>{
				  console.log(data);
				  if(data.error == 0){
					 console.log(data);
					 this.showToast('You have declined the task.')
					 // alert('You have declined the task.')
					 // this.ListScheduledPatients();
					 this.viewCtrl.dismiss();
					 //  this.doYourStuff()
				  }else{
						console.log(this.errorValue)
				  }
		    });
		
		
	}
	
	
	
	
		
	doYourStuff() {
		this.navCtrl.pop();  // remember to put this to add the back button behavior
	} 
	
	

}
