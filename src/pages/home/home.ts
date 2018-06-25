import { Component,Injectable } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FormControl,FormBuilder,FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../../node_modules/ng-email-validation';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})



export class HomePage {

  loading: any;
  loginData ={ email:'',password:'' };
  data: any;
  apiUrl : 'http://127.0.0.1:3333/';
  private isOn: boolean = false;
  searchControl: FormControl;
  public userform : FormGroup;
 
  
 

  constructor(public http: Http,public navCtrl: NavController,public userformbuilder : FormBuilder, public navParams: NavParams,public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  this.searchControl = new FormControl();
  this.http = http;
  this.userform = userformbuilder.group({
     'email' : ['', Validators.compose([Validators.required, EmailValidator.emailValidator])],
    'password' : ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
  });
   }

   login(data) {
    return new Promise((resolve, reject) => {
       
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrl+'verifyuser', JSON.stringify(data.value), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }
  doLogin() {
  
    this.showLoader();
    this.login(this.userform).then((result) => {
      this.loading.dismiss();
      this.presentToast('User Credententials are Verified');
      this.navCtrl.pop();
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
        content: 'Authenticating...'
    });

    this.loading.present();
  }
  toggleDetails() {
    this.isOn = !this.isOn;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'center',
      dismissOnPageChange: true
    });
  }
}
