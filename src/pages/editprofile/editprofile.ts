import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TaskPage } from '../task/task';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';



@Component({
	selector: 'page-editprofile',
	templateUrl: 'editprofile.html',
})

export class EditprofilePage {
	public user_id = '';
	public base64Image: string;
	srcImage: string;
	public CameraPopoverOptions;
	public imgTosend; finalImg: '';
	// cameraData: string;
	// photoTaken: boolean;
	// cameraUrl: string;
	// photoSelected: boolean;
	submitted = false;
	onSubmit() { this.submitted = true; }
	public data = '';

	public Loader = this.loadingCtrl.create({
		content: 'Please wait...'
	});

	public showLoader = this.loadingCtrl.create({
		content: 'Saving...'
	});


	constructor(
		public navCtrl: NavController,
		private camera: Camera,
		public actionSheetCtrl: ActionSheetController,
		private modalCtrl: ModalController,
		public http: Http,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		public toastCtrl : ToastController,
	) {

		this.showprofile();

	}


	// public takePicture(){
	// alert("camera")
	// const options: CameraOptions = {
	// quality: 20,
	// destinationType: this.camera.DestinationType.DATA_URL,
	// encodingType: this.camera.EncodingType.JPEG,
	// mediaType: this.camera.MediaType.PICTURE
	// }
	// this.camera.getPicture(options)
	// .then((imageData)=>{
	// alert('imgData : '+imageData);

	// this.srcImage = 'data:image/jpeg;base64,' + imageData;
	// alert(this.srcImage);
	// }, (err) => {
	////Handle error
	// alert(err);
	// alert(JSON.stringify(err));
	// })
	// }


	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1500,
			position: 'bottom'
		});
		toast.present();
	}


	CameraAction() {
		console.log('opening');
		let actionsheet = this.actionSheetCtrl.create({
			title: "Choose Album",
			buttons: [{
				text: 'Camera',
				handler: () => {
					this.Loader.present();
					const options: CameraOptions = {
						quality: 8,
						sourceType: 1,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}
					this.camera.getPicture(options).then((imageUri) => {

						//alert('img   '+imageUri);
						this.srcImage = 'data:image/jpeg;base64,' + imageUri;
						this.imgTosend = imageUri;
						this.Loader.dismiss();
					}, (err) => {
						//	alert(err);
						this.Loader.dismiss();
						console.log(err);
					});
				}
			},
			{
				text: 'Gallery',
				handler: () => {
					console.log("Gallery Clicked");
					//alert("get Picture")
					this.Loader.present();
					const options: CameraOptions = {
						quality: 20,
						sourceType: 0,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}
					this.camera.getPicture(options).then((imageData) => {
						//alert('img   '+imageData);
						// this.srcImage = 'data:image/jpeg;base64,' + imageData;
						this.srcImage = 'data:image/jpeg;base64,' + imageData;
						this.imgTosend = imageData;
						this.Loader.dismiss();
					}, (err) => {
						this.Loader.dismiss();

						// Handle error
					});
				}
			},
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
					//  actionsheet.dismiss();

				}
			}]
		});

		actionsheet.present();
	}





	serializeObj(obj) {

		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
		return result.join("&");
	}





	public showprofile() {
		this.Loader.present();
		var user_id = localStorage.getItem("user_id");
		console.log(user_id);

		var data_all = { id: user_id }

		var serialized_all = this.serializeObj(data_all);
		console.log(serialized_all);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options1 = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'users/userinfo';
		this.http.post(url, serialized_all, options1).map(res => res.json()).subscribe(data => {
			console.log(data);
			this.Loader.dismiss();
			if (data.error == 0) {
				console.log(data);
				console.log(data.msg.User);
				var USER = data.msg.User;
				localStorage.setItem('current_user', JSON.stringify(data.msg.User));
				localStorage.setItem('pro_pic', JSON.stringify(data.msg.User.image));
				this.data = USER;
				this.srcImage = data.msg.User.image;
				console.log(this.srcImage);
				console.log(this.data);
			} else {

				//alert("TRY AGAIN!");
				this.showToast('Failed to fetch information')
			}
		});
	}




	editprofile(editForm) {
		var user_id = localStorage.getItem("user_id");
		if (this.imgTosend == undefined) {
			this.imgTosend = '';
			//alert('image not changed')
		} else {
			//alert(this.imgTosend);
			//alert("Img changed");
		}
		
		var data_Profile = {
			id: user_id,
			firstname: editForm.value.firstname,
			lastname: editForm.value.lastname,
			email: editForm.value.email,
			phonenumber: editForm.value.phonenumber,
			image: this.imgTosend,
			address: editForm.value.address,
			address2: editForm.value.address2,
			city: editForm.value.city,
			state: editForm.value.state,
			zipcode: editForm.value.zipcode,
		}
		// alert(JSON.stringify(data_Profile));

		var serialized = this.serializeObj(data_Profile);
		console.log(serialized);
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var url: string = this.appsetting.base_url + 'users/editprofile';

		this.showLoader.present().catch();
		this.http.post(url, serialized, options).map(res => res.json())
			.subscribe(data => {
				console.log(data);
		this.showLoader.dismiss().catch();
				// alert(JSON.stringify(data));
				if (data.error == 0) {
					this.showToast("Profile has been updated")
					
					
					this.navCtrl.push(TaskPage);
				} else {
					this.showToast("Profile failed to update")
					//this.Loader.dismiss();
				}


			}, err => {

				alert(err);
				//this.hide();
				console.log("Error");
				console.log("Error!:", err);
			});

	}



	show() {

		this.showLoader.present().catch();
	}

	hide(){
		this.showLoader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'))
	}



}
