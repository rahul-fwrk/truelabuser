import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { IonicNativePlugin } from '@ionic-native/camera';
//import { Camera,CameraOptions } from '@ionic-native/camera';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';


import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { ForgotpwPage } from '../pages/forgotpw/forgotpw';
import { TaskPage } from '../pages/task/task';
import { SchedulePage } from '../pages/schedule/schedule';
import { UnschedulePage } from '../pages/unschedule/unschedule';
import { ViewdetailPage } from '../pages/viewdetail/viewdetail';
import { ModalPage } from '../pages/modal/modal';
import { ReportPage } from '../pages/report/report';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AcceptmodalPage } from '../pages/acceptmodal/acceptmodal';
import { ReasonmodalPage } from '../pages/reasonmodal/reasonmodal';
import { ReschedmodalPage } from '../pages/reschedmodal/reschedmodal';
import { PatientdetailPage } from '../pages/patientdetail/patientdetail';
import { SignpadPage } from '../pages/signpad/signpad';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ToastController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { ChangepwdPage } from '../pages/changepwd/changepwd';

export class NotificationModel {
    public body: string;
    public title: string;
    public tap: boolean
}

@Component({
	templateUrl: 'app.html'
})


export class MyApp {
	public user = '';
	public user_id = '';
	public srcImage = '';
	public user_name = '';

	// timeout
	idleState = 'Not started.';
	timedOut = false;
	lastPing?: Date = null;
	// time out end

	@ViewChild(Nav) nav: Nav;

	rootPage: any = HomePage;

	pages: Array<{ title: string, component: any }>;
	pages2: any;

	constructor(public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		public push: Push,
		public alertCtrl: AlertController,
		private idle: Idle,
		private keepalive: Keepalive,
		public events: Events,
		public toastCtrl: ToastController,
		public firebase: Firebase,

	) {
		this.initializeApp();
		//this.initPushNotification();


		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Schedule', component: SchedulePage },
			{ title: 'Unschedule', component: UnschedulePage }, //ChangepwdPage
		];

		this.pages2 = {
			HomePage: HomePage,
			SchedulePage: SchedulePage,
			UnschedulePage: UnschedulePage,
			EditprofilePage: EditprofilePage,
			SigninPage: SigninPage,
			TaskPage: TaskPage,
			SignpadPage: SignpadPage,
			ChangepwdPage: ChangepwdPage
		}


		// idle timeout

		idle.setIdle(180);  // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
		idle.setTimeout(5); // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
		idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

		idle.onIdleEnd.subscribe(() => {
			this.idleState = 'No longer idle.'
			console.log(this.idleState);
			//alert(this.idleState)
		});

		idle.onTimeout.subscribe(() => {
			this.idleState = 'Timed out!';
			this.timedOut = true;
			// console.log(this.idleState)
			this.user = localStorage.getItem('current_user');
			console.log(this.user)
			if (this.user == null) {
				console.log('before reset....loggedout ' + this.idleState)
				this.reset();
				//console.log('after reset.......loggedout ' +this.idleState )
			} else {

				localStorage.removeItem('current_user');
				localStorage.removeItem('user_id');
				console.log('before reset...loggedin ' + this.idleState)
				this.reset();
				console.log('after reset.....loggedin ' + this.idleState)
				 this.nav.setRoot(this.pages2.SigninPage);
				this.TimeoutToast('Timed Out')


			}
		});



		idle.onIdleStart.subscribe(() => {
			this.idleState = 'You\'ve gone idle!'
			console.log(this.idleState)
			// alert(this.idleState)
		});


		idle.onTimeoutWarning.subscribe((countdown) => {
			this.idleState = 'You will time out in ' + countdown + ' seconds!'
			console.log(this.idleState);


		});

		this.reset();

		// idle timout ends



		events.subscribe('user:signedIn', (userEventData) => {

			this.user = localStorage.getItem('current_user');
			console.log("LOOK HERE ................!!!!!!" + this.user)
			if (this.user != null) {
				this.srcImage = JSON.parse(localStorage.getItem('pro_pic'));
				this.user_name = JSON.parse(this.user).firstname;
				console.log("also HERE ................!!!!!!" + this.srcImage)
			}
		});

	}



   


	public restart() {
		this.idle.onIdleStart.subscribe(() => {
			this.idleState = 'You\'ve gone idle!'
			console.log(this.idleState)
			//alert(this.idleState)
		});
	};

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			this.firebase.grantPermission();   // for push notifications

			if (this.platform.is('cordova')) {
				// Initialize push notification feature
				//alert("hiiii"+this.platform)
				if(this.platform.is('android')){
					//alert("android"+this.platform)
					this.initializeFireBaseAndroid()
				}else{
				//	alert("ios"+this.platform)
					this.initializeFireBaseIos();
				}
				//this.platform.is('android') ? this.initializeFireBaseAndroid() : this.initializeFireBaseIos();
			} else {
			//	alert(this.platform)
				console.log('Push notifications are not enabled since this is not a real device');
			}
		});
	}
private initializeFireBaseAndroid(): Promise<any> {
		return this.firebase.getToken()
			.catch(error => console.error('Error getting token', error))
			.then(token => {

				console.log(`The token is ${token}`);

				Promise.all([
					this.firebase.subscribe('firebase-app'), 	// Subscribe to the entire app
					this.firebase.subscribe('android'),			// Subscribe to android users topic
					this.firebase.subscribe('userid-1') 		// Subscribe using the user id (hardcoded in this example)
				]).then((result) => {
					if (result[0]) console.log(`Subscribed to FirebaseDemo`);
					if (result[1]) console.log(`Subscribed to Android`);
					if (result[2]) console.log(`Subscribed as User`);

					this.subscribeToPushNotificationEvents();
				});
			});
	}

	private initializeFireBaseIos(): Promise<any> {
		return this.firebase.grantPermission()
			.catch(error => console.error('Error getting permission', error))
			.then(() => {
				this.firebase.getToken()
					.catch(error => console.error('Error getting token', error))
					.then(token => {

						console.log(`The token is ${token}`);

						Promise.all([
							this.firebase.subscribe('firebase-app'),
							this.firebase.subscribe('ios'),
							this.firebase.subscribe('userid-2')
						]).then((result) => {

							if (result[0]) console.log(`Subscribed to FirebaseDemo`);
							if (result[1]) console.log(`Subscribed to iOS`);
							if (result[2]) console.log(`Subscribed as User`);

							this.subscribeToPushNotificationEvents();
						});
					});
			})

	}

	private saveToken(token: any): Promise<any> {
		// Send the token to the server
		console.log('Sending token to the server...');
		return Promise.resolve(true);
	}

	private subscribeToPushNotificationEvents(): void {
	//	alert("hello everyone");
		// Handle token refresh
		this.firebase.onTokenRefresh().subscribe(
			token => {
				console.log(`The new token is ${token}`);
				this.saveToken(token);
			},
			error => {
				console.error('Error refreshing token', error);
			});

		// Handle incoming notifications
		this.firebase.onNotificationOpen().subscribe(
			(notification: NotificationModel) => {
				//alert('alert - > '+ JSON.stringify(notification))

				!notification.tap
					?  console.log('The user was using the app when the notification arrived...') 
					: console.log('The app was closed when the notification arrived...')
					// alert starts
				

				let notificationAlert = this.alertCtrl.create({
					title: '<center>' + notification.title + '</center>',
					message: notification.body,
					buttons: [{
							text: 'Ignore',
							role: 'cancel'
						}, {
							text: 'View',
							handler: () => {
								//TODO: Your logic here
								this.user = localStorage.getItem('current_user');
								//alert('user' + this.user)
								if (this.user == undefined || this.user == null) {
									this.nav.push(SigninPage);
								} else {

									if(notification.title = 'Please change your password'){
										this.nav.push(ChangepwdPage, { message: notification }); 
									} else {
										this.nav.push(TaskPage, { message: notification }); 
									}
								}

							}
						}]
				});
				if(notification.title != undefined){
					notificationAlert.present();
				}

				// let confirmAlert = this.alertCtrl.create({
				// 		title: '<center>' + notification.aps.alert.title + '</center>',
				// 		message: '<center>' + notification.aps.alert.body + '</center>',
				// 		buttons: [{
				// 			text: 'Ignore',
				// 			role: 'cancel'
				// 		}, {
				// 			text: 'View',
				// 			handler: () => {
				// 				//TODO: Your logic here
				// 				this.user = localStorage.getItem('current_user');
				// 				//alert('user' + this.user)
				// 				if (this.user == undefined || this.user == null) {
				// 					//this.nav.push(SigninPage, {message: data.message});
				// 				} else {

				// 					this.nav.push(TaskPage, { message: notification.message }); //this.nav.setRoot(this.pages2.SchedulePage);
				// 				}

				// 			}
				// 		}]
				// 	});
				// 	confirmAlert.present();


				// alert ends
			},
			error => {
				console.error('Error getting the notification', error);
			});
	}

	public logOut(SigninPage) {
		localStorage.removeItem('current_user');
		localStorage.removeItem('user_id');
		//alert()
		this.showToast("Logged Out Successfully")
		this.nav.setRoot(this.pages2.SigninPage); //this.nav.push(SigninPage)
	}


	// idle time out reset
	reset() {
		this.idle.watch();
		this.idleState = 'Started.';
		this.timedOut = false;
		console.log("Reseted...")
	}

	// ends


	// toast
	TimeoutToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			//duration: 2000,
			position: 'middle',
			closeButtonText: 'Ok',
			showCloseButton: true
		});
		toast.present();
	}


	showToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 1200,
			position: 'middle',
		});
		toast.present();
	}


	// to display name in the side menu
	displayName() {

		this.user = localStorage.getItem('current_user');
		console.log("LOOK HERE ................!!!!!!" + this.user)
		if (this.user != null) {
			this.srcImage = JSON.parse(localStorage.getItem('pro_pic'));
			this.user_name = JSON.parse(this.user).firstname;
			console.log("also HERE ................!!!!!!" + this.srcImage)
		}
	}


/*
	initPushNotification() {
		// alert('opened')
		if (!this.platform.is('cordova')) {
			console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
			// alert('Push notifications not initialized. ')
			return;
		}
		const options: PushOptions = {
			android: {
				senderID: '2727505737'
			},
			ios: {
				alert: "true",
				badge: false,
				sound: "true"
			},
			windows: {}
		};
		const pushObject: PushObject = this.push.init(options);

		// pushObject.on('registration').subscribe((data: any) => {
		// console.log("device token ->", data.registrationId);
		// alert(data.registrationId)
		// this.Dvictoken = data.registrationId
		// TODO - send device token to server
		// });

		pushObject.on('notification').subscribe((data: any) => {
			console.log('message', data.message);
			//if user using app and push notification comes
			if (data.additionalData.foreground) {
				// if application open, show popup
				let confirmAlert = this.alertCtrl.create({
					title: 'True Lab',
					message: '<center>' + data.message + '</center>',
					buttons: [{
						text: 'Ignore',
						role: 'cancel'
					}, {
						text: 'View',
						handler: () => {
							//TODO: Your logic here
							// this.nav.push(TaskPage, {message: data.message});
							this.user = localStorage.getItem('current_user');
							//alert('user' + this.user)
							if (this.user == undefined || this.user == null) {
								this.nav.setRoot(this.pages2.SigninPage);
							} else {

								this.nav.setRoot(this.pages2.SchedulePage);
							}


						}
					}]
				});
				confirmAlert.present();
			} else {
				//if user NOT using app and push notification comes
				//TODO: Your logic on click of push notification directly
				//alert("Push notification clicked");
				this.nav.setRoot(this.pages2.SigninPage);
				this.user = localStorage.getItem('current_user');
				//alert('user' + this.user)
				if (this.user == undefined || this.user == null) {
					this.nav.setRoot(this.pages2.SigninPage, { message: data.message });
					//this.nav.push(SigninPage, {message: data.message});
				} else {

					this.nav.setRoot(this.pages2.SchedulePage, { message: data.message });
					//				this.nav.push(SchedulePage, {message: data.message}); //this.nav.setRoot(this.pages2.SchedulePage);
				}

			}
		});

		pushObject.on('error').subscribe(error => {
			console.error('Error with Push plugin', error)
			this.showToast(JSON.stringify(error))
		})
	}


*/






 getnotification(){

    }

}
