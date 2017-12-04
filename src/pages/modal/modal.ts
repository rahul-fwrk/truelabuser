import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';




@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {

	public dataID  = '';
	
    constructor(
		public navCtrl: NavController,
		private transfer: Transfer,
		private fileChooser: FileChooser,
		public navParams : NavParams ,
		public http : Http, 
		public loadingCtrl:LoadingController,
		public appsetting: Appsetting,	
    ) {
		
		this.dataID = this.navParams.get('dataID');
	    console.log("data ID...  "+this.dataID);
	}


	
	
	serializeObj(obj) {
			var result = [];
			for (var property in obj)
				result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

			return result.join("&");
	}
	
	
    uploadReport() {
			alert('open')
		  this.fileChooser.open()
		  .then(uri => 
		  {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			let options = new RequestOptions({ headers: headers });
			var URL:string = this.appsetting.base_url+'patients/uploadreport';
			
			alert(' uri : '+  uri);
			const fileTransfer: TransferObject = this.transfer.create();

			alert('file transer')
			alert(JSON.stringify(fileTransfer));
			this.dataID = this.navParams.get('dataID');
		
			// let options1: FileUploadOptions = {
				 // fileKey: 'image_upload_file',
				 // fileName: 'name.pdf',
				 // headers: {},
				 // params: {"app_key":"Testappkey"},
				 // chunkedMode : false
			// }
			let options1 = {
				id: this.dataID,
			}
			  
		    alert(JSON.stringify(options1));
			var serialized = this.serializeObj(options1); 
			
			alert(JSON.stringify(serialized))
			//, serialized
		    fileTransfer.upload(uri, URL, options1)
		    .then((data) => {
			  // success
			   alert("success"+JSON.stringify(data));
		    }, (err) => {
				// error
				alert("error"+JSON.stringify(err));
		    });

		  })
		  .catch(e => console.log(e));
    }	
	
	
	
	
	



  doYourStuff() {
    this.navCtrl.pop();  // remember to put this to add the back button behavior
  } 

}
