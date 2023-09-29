import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-infrastructure',
  templateUrl: './add-infrastructure.component.html',
  styleUrls: ['./add-infrastructure.component.css']
})
export class AddInfrastructureComponent implements OnInit {

  _schoolForm = new FormGroup({});
  _userDetails: any;
  tempInfraSt: { infraName: any; infraDesc: any; id: any, infraIconPath:any }[] = [];

  _schInfraMode: any;
  _schoolID: string;
  //for subscription
  _infraDesc:any;
  _user_id:number|string;
  _result:any;


  // Steps definition
  steps:any[] = [
    { title: 'Basic profile', value: '1', completed: false ,
      msg: 'Basic profile added.'  
    },
    { title: 'Address', value: '2', completed: false ,
      msg: 'Address added.'
    },
    { title: 'Level', value: '3', completed: false ,
      msg: 'Level added.'
    },
    { title: 'Timing', value: '4', completed: false ,
      msg: 'Timing added.'
    },
    { title: 'Documents', value: '5', completed: false ,
      msg: 'Documents added.'
    },
    { title: 'Academic Achievement', value: '6', completed: false ,
      msg: 'Academic Achievement added.'
    },
    { title: 'Infrastructure', value: '7', completed: false ,
      msg: 'Infrastructure added.'
    },
    // { title: 'Completed', value: '8', completed: false ,
    //   msg: 'All steps completed.'
    // },
  ];

  maxIndex: number;
  existingSteps: any = [];

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // this.hideShowCall();
    this.inItForm();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    this.addBlankParameterList();
    this._user_id=this._userDetails.userId;
    console.log("user id",this._user_id);
    this._schoolID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (this._userDetails) {
      // this.callSchoolByID(this._userDetails.schoolId)
      this.callSchoolByID(this._schoolID);
    }
    this._authService.request('post',`users/subscription/?User_id=${this._user_id}`).subscribe((res)=>{

      this._result=res.result;
      console.log(this._result);
      this._result=this._result.subcriptionMstVo?.id;
      console.log(this._result);
      this._infraDesc=this._result;
  })
  }

  callSchoolByID(id: any) {
    this.openLoader()
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      this.closeLoader();
      if (res) {
        console.log('School :', res);
        this.existingSteps = [];
        if(res.profileStepSet != null){
          this.existingSteps = res.profileStepSet; 
          this.callStepsCheck(res.profileStepSet);
        }
        if (res.schoolInfraDtlVo.length > 0) {
          this.addparameterList(res.schoolInfraDtlVo.length, res.schoolInfraDtlVo, 'schoolInfraSt');
        }
        else {
          this.getCommonInfraStructure()
        }
      }

    }, error => { this.closeLoader() })
  }

  getCommonInfraStructure() {
    this.openLoader();
    this._authService.request('get', 'commonMaster/getInfraList').subscribe((res) => {
      this.closeLoader();
      console.log('Common infra :', res);
      if (res.status == 200) {
        this.addparameterList(res.result.length, res.result, 'commonInfraSt');
      }


    }, error => {
      this.closeLoader();
    })
  }

  inItForm() {
    this._schoolForm = this.formBuilder.group({
      schoolInfraDtlVo: this.formBuilder.array([]),
    })
  }

  get parameterListArray(): FormArray {
    return this._schoolForm.get('schoolInfraDtlVo') as FormArray;
  }

  addBlankParameterList(size?: any, value?: any): void {
    if (this.parameterListArray.length > 1) {
      this.parameterListArray.push(this.fetchBlankParameterList('', '', false));
    }
  }

  fetchBlankParameterList(i?: any, value?: any, readMode?: any): FormGroup {
    return this.formBuilder.group({
      infraName: ['', Validators.compose([Validators.required])],
      infraDesc: ['', Validators.compose([Validators.required])],
      infraIconPath: ['DefalutInfraIcon.png'],
      id: [null],
      publishStatus: [''],
      readonly: readMode
    })
  }

  addparameterList(size?: any, value?: any, infraStMode?: any): void {
    this._schInfraMode = infraStMode;
    console.log('_schInfraMode :', this._schInfraMode);

    for (let i = 0; i < size; i++) {
      this.parameterListArray.push(this.fetchParameterList(i, value, infraStMode));
    }
  }
  fetchParameterList(i?: any, value?: any, infraStMode?: any): FormGroup {
    return this.formBuilder.group({
      infraName: value[i].infraName,
      infraDesc: (value[i].infraDesc),
      infraIconPath: value[i].infraIconPath,
      id: (infraStMode == 'schoolInfraSt' ? value[i].id : null),
      publishStatus: '',
      readonly: false
    })
  }

  addNewRow() {
    this.parameterListArray.push(this.fetchBlankParameterList('', '', true));
  }

  saveInfrastructure() {
    this.tempInfraSt = []
    const data = { ...this._schoolForm.value };
    data.id = this._schoolID;

    data.schoolInfraDtlVo.forEach((element: any) => {
      if (this._schInfraMode == 'commonInfraSt' && element.publishStatus == true) {
        this.tempInfraSt.push({
          infraName: element.infraName,
          infraDesc: element.infraDesc,
          id: element.id,
          infraIconPath: element.infraIconPath
        })
      }
      else if(this._schInfraMode == 'schoolInfraSt' && element.publishStatus == false){
        this.tempInfraSt.push({
          infraName: element.infraName,
          infraDesc: element.infraDesc,
          id: element.id,
          infraIconPath: element.infraIconPath
        })
      }
    })

    if (this.tempInfraSt.length > 0) {
      data.schoolInfraDtlVo = this.tempInfraSt;
      this.existingSteps.push("7");
      data.profileStepSet = this.existingSteps;
      console.log(data);
      // return
      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolInfraDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          // this.router.navigate(['/manage-infrastructure/infrastructure-list'])
          this._location.back();
          // this.openSnackBar(res.message);
          this.ngOnInit();
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:' Infrastructure has been updated'});

        }


      }, error => { this.closeLoader() })
    }
    else {
      console.log("select any one.");
      this.messageService.clear();
      this.messageService.add({severity:'error', summary:'', detail:' Please select any one.'});
      // this.openSnackBar("Please select any one.");
    }



  }

  callStepsCheck(state:any){
    const max = Math.max.apply(null, state.map((item: any) => +item));
    console.log(max);
    this.maxIndex = max - 1;
    if(state.length > 0){
      for(let i=0; i<this.steps.length; i++){
        const str = (i+1).toString();
        if(state.includes(str)){
          this.steps[i].completed = true;
        }else{
          this.steps[i].completed = false;
        }
      }
    }
    console.log(this.steps);
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }

  cancelButtonRoute(){
    if (this._userDetails.userType === 'ADMIN_USER') {
      this.router.navigate(['/manage-school/school-list/edit-school', this._schoolID])
    }else{
      this.router.navigate(['/manage-school/school-list/school-profile-edit', this._schoolID])
    }
  }

}
