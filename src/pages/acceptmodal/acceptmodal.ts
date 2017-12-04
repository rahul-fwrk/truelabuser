import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { TaskPage } from '../task/task';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-acceptmodal',
  templateUrl: 'acceptmodal.html'
})
export class AcceptmodalPage {

	public myDate; data_ID; test_ID; doc_id; errorValue; patient_id; minDate; currentdate:any;
	dPipe = new DatePipe('en-US');

   public Loader = this.loadingCtrl.create({
		content: 'Please wait...'
	});

    constructor (
		public navCtrl: NavController,
		public navParams : NavParams ,
		public http : Http, 
		public loadingCtrl:LoadingController,
		public appsetting: Appsetting,
		public viewCtrl: ViewController,
		public toastCtrl : ToastController			
	) {
	  
	    this.currentdate = new Date();
	    console.log(this.currentdate)
	    this.minDate = this.dPipe.transform(new Date(), 'yyyy-MM-dd');
	    this.myDate = this.minDate;
	    this.patient_id = this.navParams.get('patient_id');
	    this.data_ID = this.navParams.get('data_ID');
	    this.test_ID = this.navParams.get('test_ID');
		this.doc_id = this.navParams.get('doc_id');
	    console.log("data_ID...  "+this.data_ID);
	    console.log("patient_id...  "+this.patient_id);
	    console.log("test_ID...  "+this.test_ID);
		console.log("test_ID...  "+this.doc_id);
    }
   

	getdate(getdate,getTime) {
		console.log(getdate + ' ' + getTime)
		if(getdate == undefined || getTime == undefined){
			this.errorValue = 1;
		} else {
			this.errorValue = '';
			// var test1=getdate.split("T")
			// var test2=test1[1].replace("Z", "");
			// var test3 =test1[0]+" "+test2;
			//let selectedDate = this.dPipe.transform(test3, 'yyyy-MM-dd HH:mm:ss'); 
			let selectedDate = 	getdate + ' ' + getTime
			console.log(selectedDate);
		   
  		    var patient_id = this.navParams.get('patient_id');
			var data_ID = this.navParams.get('data_ID');
			var test_ID = this.navParams.get('test_ID');
			var doc_id = this.navParams.get('doc_id');
			console.log("data_ID...  "+this.data_ID);
			console.log("patient_id...  "+this.patient_id);
			console.log("test_ID...  "+this.test_ID);
			
			
			this.accept(patient_id ,data_ID ,test_ID, selectedDate,doc_id)

		}
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
			duration: 2000,
			position: 'middle'
		});
		toast.present();
	}


	public accept(patID, dataID, test_id, date,doc_id) {
		var	Loader = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		Loader.present().then(()=>{
			var user_id = localStorage.getItem("user_id");
			var postdata = { id : dataID ,
							 patientid : patID,
							 testid: test_id,
							 status : '2',
							 role : '',
							 reason	: '',
							 date   : date,
							 userid : user_id,
							 doctorid : doc_id}
							 
			
			console.log(postdata)
				
			
		    let headers = new Headers();
		    headers.append('Content-Type',  'application/x-www-form-urlencoded;charset=utf-8');
		    let options= new RequestOptions({ headers: headers });
			var serialized = this.serializeObj(postdata); 
			console.log(serialized);
		    var url:string = this.appsetting.base_url+'tasks/acceptdecline';
			
		    this.http.post(url, serialized, options).map(res=>res.json()).subscribe(data=>{
				  console.log(data);
				  Loader.dismiss();
				  if(data.error == 0){
					 console.log(data);

					 this.showToast('You have accepted this task.');
					 //alert()
					// this.ListPatients();
					// this.navCtrl.push(TaskPage);
					// this.doYourStuff();
					this.viewCtrl.dismiss();
				  }else{
					  	this.showToast('Oops. Please try again');
						//this.errorValue = '1'
						console.log(this.errorValue)
				  }
		    }, (err)=>{
				Loader.dismiss();
				console.log(err)
				 this.showToast('Oops. Please try again');
			});
		
		});
	}
	
	
	
	
	
	
	

	public doYourStuff(){
		
		this.navCtrl.pop();  
	} 

}
