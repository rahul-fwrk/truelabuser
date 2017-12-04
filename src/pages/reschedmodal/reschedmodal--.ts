import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController,Platform } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { SchedulePage } from '../schedule/schedule';
//import { Toast } from 'ionic-native';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-reschedmodal',
  templateUrl: 'reschedmodal.html'
})



export class ReschedmodalPage {
	
	public myDate; data_ID; myDate1;doc_id ;test_ID; errorValue;  minDate; patient_id :any;
	public data ='';
	window;
	public value; reason1 = '';
	dPipe = new DatePipe('en-US');
	
    constructor(
		public navCtrl: NavController,
		public navParams : NavParams ,
		public http : Http, 
		public loadingCtrl:LoadingController,
		public appsetting: Appsetting,
		public viewCtrl: ViewController,
		public platform : Platform,	
		public toastCtrl : ToastController	
	) {
		this.minDate = this.dPipe.transform(new Date(), 'yyyy-MM-dd');
		this.myDate = this.minDate;
		
		this.patient_id = this.navParams.get('patient_id');
	    this.data_ID = this.navParams.get('data_ID');
	    this.test_ID = this.navParams.get('test_ID');
		this.doc_id = this.navParams.get('doc_id');
		console.log("data_ID...  "+this.data_ID);
	    console.log("patient_id...  "+this.patient_id);
	    console.log("test_ID...  "+this.test_ID);
		console.log("doc_id...  "+this.doc_id);

		
	}


	getdata(reason, role, getdate, getTime) {
		
		console.log(getdate + ' ' +getTime);

		if(!reason){
			console.log("reason undeinfed")
			 this.errorValue = '1';
		}else {
			
			console.log(getdate);
			
		 	if(getdate == undefined || getTime == undefined){
			  this.errorValue = '3';
			  
			} else {
				
				this.reason1 = reason;
				//this.errorValue = '';
				// var test1=getdate.split("T")
				// var test2=test1[1].replace("Z", "");
				// var test3 =test1[0]+" "+test2;
				// let selectedDate = this.dPipe.transform(test3, 'yyyy-MM-dd HH:mm:ss'); 
				let selectedDate = getdate + ' ' +getTime; 
				
				console.log(selectedDate);

				var reasonValid = this.reason1.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
						this.reSchedule(patient_id, data_ID, test_ID, reasonValid, selectedDate, role, doc_id)  
					}
				} else {
					this.reason1 = '';
					this.errorValue = '1';	 
				}
				
			
			}
		}

	}
	
	
	
	getdate(getdate) {
		console.log(getdate)
		if(getdate == undefined){
			this.errorValue = 1;
		} else {
			this.errorValue = '';
			var test1=getdate.split("T")
			var test2=test1[1].replace("Z", "");
			var test3 =test1[0]+" "+test2;
			let selectedDate = this.dPipe.transform(test3, 'yyyy-MM-dd HH:mm:ss'); 
			console.log(selectedDate);
		   
  		    var patient_id = this.navParams.get('patient_id');
			var data_ID = this.navParams.get('data_ID');
			var test_ID = this.navParams.get('test_ID');
			console.log("data_ID...  "+this.data_ID);
			console.log("patient_id...  "+this.patient_id);
			console.log("test_ID...  "+this.test_ID);

		}
	}
	
	
	
	
	serializeObj(obj) {

		var result = [];
		for (var property in obj)
		result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}

	
	public reSchedule(patID, dataID, test_id, reasonValid,selectedDate, role,doc_id) {
			var user_id = localStorage.getItem("user_id");
			//alert(data)
			var postdata = { id : dataID ,
							 patientid : patID,
							 testid: test_id,
							 status : '2',
							 reason	: reasonValid,
							 date   : selectedDate,
							 role : role,
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
					// alert('You have rescheduled the task.')
					this.showToast('You have rescheduled the task.');
					 // this.ListScheduledPatients();
					 // var test2="abc";
					 this.viewCtrl.dismiss();
					 // this.navCtrl.push(SchedulePage);
				
					 
				  }else{
						console.log(this.errorValue)
				  }
		    }, (err) => {
				
				console.log(err)
			});
		
		
	}
	
	
	showToast(text){
		let toast = this.toastCtrl.create({
						message: text,
						duration: 2000,
						position: 'top'
					});
		toast.present();
	}

	// showToast(message, position) {
	// 	Toast.show(message, "short", position).subscribe(
	// 		toast => {
	// 			console.log(toast);
	// 		}
	// 	);
	// }
	
		
	doYourStuff() {
		this.navCtrl.pop();  // remember to put this to add the back button behavior
	} 
	
	

}
