import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { emailValidator } from '../_validators/Generic.validator';
import { LoaderService } from '../_services/loader.service';
import { MessageService } from 'primeng-lts/api';


@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.css'],
  providers: [MessageService]
})
export class AddSchoolComponent implements OnInit {
  _addSchoolForm: FormGroup;
  _successMessage: string=null;
  isAgreeChecked: any = false;
   _boardList: any[];
  _mediumList: any[];
  _schoolTypeList: any[];
  captche: boolean =false;
  _districtList:any[];
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private loader: LoaderService) {
    this.initaddSchoolForm();
  }

  ngOnInit(): void {
    this.getBoardList();
    this.getMediumList();
    this.getSchoolType();
    this.getDistrictList();
  }

  initaddSchoolForm() {
    this._addSchoolForm = this.formBuilder.group({
      contactPhone: [''],
      contactEmail: [''],
      schoolName: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      isAgree: ['', Validators.compose([Validators.required])],
      schoolBoard:['', Validators.compose([Validators.required])],
      schoolMedium:['', Validators.compose([Validators.required])],
      schoolType:['', Validators.compose([Validators.required])],
      schoolAddress:['', Validators.compose([Validators.required])],
      postalCode:['',Validators.compose([Validators.required])],
      district:['',Validators.compose([Validators.required])],
      aboutSchool:[''],
      initiatorsName:['', Validators.compose([Validators.required])],
      initiatorsEmail:['',Validators.compose([Validators.required])],
      initiatorsPhoneNo:['']
    });
  }
  submitAddSchoolData() {
    if (!this._addSchoolForm.valid) return;
    this.loader.openLoader();
    const data = this._addSchoolForm.value;
    data.schoolBoard=data.schoolBoard.toString();
    data.schoolMedium=data.schoolMedium.toString();
    data.schoolType=data.schoolType.toString();
    console.log('submitData', data);
    this.authService
      .request('post','commonMaster/saveSchoolDtl', data)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.loader.closeLoader();
          console.log(' this._successResponse: ', response.result);
          // this._successMessage = `Yohoo!!...Your request has sent to the Admin.`
          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: '', detail: 'Thank you so much for taking the time to fill out your school information.Your request has sent to the Admin and will validate.'});
          this._addSchoolForm.reset();
          window.scrollTo(0,0);
        }
      }, (err) => {
        this.loader.closeLoader();
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: '', detail: err.error.message});
        console.log(err);

      });
  }

  isAgree(event: any) {
    this.isAgreeChecked = event.target.checked;
    console.log(event.target.checked);
  }
  getBoardList() {
    this._boardList = []
    this.authService.openRequest('get', 'commonMaster/getBoards').subscribe((response) => {
      if (response.status == 200) {
        this._boardList = response.result
      }
    })
  }

  getMediumList() {
    this._mediumList = []
    this.authService.openRequest('get', 'commonMaster/getMediums').subscribe((response) => {
      if (response.status == 200) {
        this._mediumList = response.result
      }
    })
  }
  
  getSchoolType() {
    this._schoolTypeList = []
    this.authService.openRequest('get', 'commonMaster/getSchoolTypes').subscribe((response) => {

      if (response.status == 200) {
        this._schoolTypeList = response.result
      }
    })
  }
  getDistrictList(){
    this._districtList = []
    this.authService.openRequest('get', 'commonMaster/getDistrictListByState?stateName=' + 'West Bengal').subscribe((response) => {
      console.log(response);
      this._districtList=response.result;        
    })
  }
  showResponse(event:any){
      this.captche=true;
      console.log("Show Response",event);
  }

}

