import { Component, OnInit } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { MessageService } from 'primeng-lts/api';
import { LoaderService } from 'src/app/_services/loader.service';
import { FormBuilder,
  ValidatorFn,
  Validators,
  FormGroup,
  ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-suitable-school',
  templateUrl: './suitable-school.component.html',
  styleUrls: ['./suitable-school.component.css']
})
export class SuitableSchoolComponent implements OnInit {

  suitableSchoolSearchForm: FormGroup;
  isHuman: boolean = false;
  isAgreeChecked: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private reactiveForm: ReactiveFormsModule,
    private matRadioModule: MatRadioModule,
    public router: Router,
    private _authService: AuthService,
    private messageService: MessageService,
    private _loader:LoaderService,) { }

  ngOnInit(): void {
    this.initSuitableSchoolSearchForm();
  }

  showResponse(event:any){
    console.log(event);
    this.isHuman=true;
  }

  isAgree(event:any){
    this.isAgreeChecked=event.target.checked;
    console.log(event.target.checked);
  }

  initSuitableSchoolSearchForm() {
    this.suitableSchoolSearchForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      dob: [''],
      schoolType: [''],
      board: [''],
      medium: [''],
      city: [''],
      postalCode: [''],
      isAgree: [this.isAgreeChecked]
    });
  }

  // submitSuitableSchoolSearchData(){
  //   console.log(this.suitableSchoolSearchForm.value);
  //   const queryParams = this.suitableSchoolSearchForm.value;
  //   console.log(queryParams);
  //   if (!this.suitableSchoolSearchForm.valid) {
  //     this._authService
  //       .request('post', 'parentenquiry' , queryParams)
  //       .subscribe(
  //         (res) => {
  //           this.suitableSchoolSearchForm.reset();
  //           this.router.navigate([`/auth/common-search/${queryParams.city}&${queryParams.board}&&&${queryParams.medium}&${queryParams.schoolType}&${queryParams.postalCode}`]); 
  //         },          (error) => {
  //           console.error();
  //           this.router.navigate([`/auth/common-search/${queryParams.city}&${queryParams.board}&&&${queryParams.medium}&${queryParams.schoolType}&${queryParams.postalCode}`]); 
  //           this._loader.closeLoader();
  //         }
  //       ); 
  //       this.router.navigate([`/auth/common-search/${queryParams.city}&${queryParams.board}&&&${queryParams.medium}&${queryParams.schoolType}&${queryParams.postalCode}`]); 
  //   }
  // } 

  submitSuitableSchoolSearchData(){
    console.log(this.suitableSchoolSearchForm.value);
    if (!this.suitableSchoolSearchForm.valid) return;
      this._loader.openLoader();
      const queryParams ={... this.suitableSchoolSearchForm.value};
      queryParams.board = queryParams.board.toUpperCase();
      console.log('submitData',queryParams);
      this._authService
        .request('post', 'parentenquiry', queryParams)
        .subscribe((response: any) => {
          if (response.status === 200) {
          this.suitableSchoolSearchForm.reset();
            console.log('Submit Response: ', response);
            this._loader.closeLoader();
            this.router.navigate([`/auth/common-search/${queryParams.city}&${queryParams.board}&${queryParams.medium}&&&${queryParams.schoolType}&${queryParams.postalCode}`]);
          }
        },(err) =>{
          //this.router.navigate([`/auth/common-search/${queryParams.city}&${queryParams.board}&${queryParams.medium}&&&${queryParams.schoolType}&${queryParams.postalCode}`]);
          this._loader.closeLoader();
          console.log(err);
        });
  }

}
