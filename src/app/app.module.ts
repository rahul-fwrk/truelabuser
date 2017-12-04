import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Appsetting } from '../providers/appsetting';
//import { IonicNativePlugin } from '@ionic-native/camera';
import { Camera } from '@ionic-native/camera';
import { Push } from "@ionic-native/push";
// import { Transfer } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { ForgotpwPage } from '../pages/forgotpw/forgotpw';
import { TaskPage } from '../pages/task/task';
import { SchedulePage } from '../pages/schedule/schedule';
import { UnschedulePage } from '../pages/unschedule/unschedule';
import { ViewdetailPage } from '../pages/viewdetail/viewdetail';
import { ModalPage } from '../pages/modal/modal';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AcceptmodalPage } from '../pages/acceptmodal/acceptmodal';
import { SignpadPage } from '../pages/signpad/signpad';
import { ReasonmodalPage } from '../pages/reasonmodal/reasonmodal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReschedmodalPage } from '../pages/reschedmodal/reschedmodal';
import { PatientdetailPage } from '../pages/patientdetail/patientdetail';
import { ReportPage } from '../pages/report/report';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { Firebase } from '@ionic-native/firebase';
import { ChangepwdPage } from '../pages/changepwd/changepwd';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ForgotpwPage,
    TaskPage,
    SchedulePage,
    UnschedulePage,
    ViewdetailPage,
    ModalPage,
    EditprofilePage,
    AcceptmodalPage,
    ReasonmodalPage,
    ReschedmodalPage,
    PatientdetailPage,
    ReportPage,
    SignpadPage,
    PdfViewerComponent,
    ChangepwdPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    SignaturePadModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ForgotpwPage,
    TaskPage,
    SchedulePage,
    UnschedulePage,
    ViewdetailPage,
    ModalPage,
    EditprofilePage,
    AcceptmodalPage,
    ReasonmodalPage,
    ReschedmodalPage,
    PatientdetailPage,
    ReportPage,
    SignpadPage,
    ChangepwdPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Appsetting,
    Camera,
    Transfer,
    FileChooser,
    Push,
    InAppBrowser,
    Firebase,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

}
