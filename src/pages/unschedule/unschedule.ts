import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormControl } from '@angular/forms';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController} from 'ionic-angular';
import { ViewdetailPage } from '../viewdetail/viewdetail'; 
import { PatientdetailPage } from '../patientdetail/patientdetail'; 
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-unschedule',
  templateUrl: 'unschedule.html'
})
export class UnschedulePage {
  public user_id; PatientList; customMsg; data; schedule = '';
  public myInput:string = '';
  public errorValue = '';
  searchControl: FormControl;
  public searchArray : '';
	public newarr = [];
  public Loader = this.loadingCtrl.create({
    content: 'Please wait...'
  
  }); 
  constructor( public navCtrl: NavController, public alertCtrl: AlertController, private modalCtrl: ModalController ,public http:Http, public loadingCtrl:LoadingController, public appsetting: Appsetting) {
  
	 //this.searchControl = new FormControl();
	 console.log('updated');
	 this.ListPatients();
  }
  
  
  
	
	serializeObj(obj) {

		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}
  
  
  
  public ListPatients() {
			var user_id = localStorage.getItem("user_id");
			var postdata = { id : user_id }
	   
		    var serialized = this.serializeObj(postdata); 
		    console.log(serialized);
		    let headers = new Headers();
		    headers.append('Content-Type',  'application/x-www-form-urlencoded;charset=utf-8');
		    let options= new RequestOptions({ headers: headers });
		    var url:string = this.appsetting.base_url+'patients/usercanceledpatientlist';
			
		    this.http.post(url, serialized, options).map(res=>res.json()).subscribe(data=>{
				
				  console.log(data);
				  if(data.error == 0){
					 
							console.log(data.msg);
							console.log(data.msg.length);
							this.PatientList = data.msg;
							for(var i = 0; i < data.msg.length; i++){
								console.log(data.msg[i].Patient.trackingid)
									if(data.msg[i].Patient.trackingid == (undefined || null)){
								
									} else {

										 			this.newarr.push(data.msg[i]);
													this.errorValue = '2';
									}
							}
							console.log("aqfter del"+data.msg.length);
							this.PatientList = this.newarr;
							console.log(this.PatientList);
				
				  }else{
					  
						this.errorValue = '1'
						console.log(this.errorValue)
				  }
		    });
		
		
	}
  
  
  
	// used to filter the list
  
	setFilteredItems(){
		
		console.log(this.myInput);
		//return this.myInput;
		var keyword = this.myInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
		  console.log(keyword);
		  console.log(keyword.length);
		  
		if(keyword.length == 0) {
			// this.ListScheduledPatients();
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
			if(this.PatientList != undefined){
				return this.PatientList.filter((patient) => {
							return patient.Patient.trackingid.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
					});   
			}

 
    }
  
  
  
  
  
  
  
  // var store_id = this.navParams.get('pat_id');
  
  viewPage(id,testid){
	this.navCtrl.push(ViewdetailPage,{pat_id : id , test_id : testid});
 }
  
detailsPage(id, patTest_id, testid) {
		this.navCtrl.push(PatientdetailPage, { pat_id: id, patTest_id: patTest_id, test_id: testid });
	}
  
showPrompt(reason) {
    let prompt = this.alertCtrl.create({
      title: "<p class='md title'>Reason for cancellation</p>",
      message: '<center>'+reason+'</center>',
      cssClass: 'myclass',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
				
      ]
    });
    prompt.present();
  }

  
  

}
