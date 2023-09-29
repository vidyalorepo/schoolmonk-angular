import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-admission-eligibility-form',
  templateUrl: './admission-eligibility-form.component.html',
  styleUrls: ['./admission-eligibility-form.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class AdmissionEligibilityFormComponent implements OnInit {
  _userDetails: any;
  _schoolLevelInfoList: any;
  submitted: boolean = false;
  _boardList: any;
  _selectedFiles: any;
  _formData!: FormData;
  _uploadDocUrl: any;
  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) { }


  addAdmissionForm = new FormGroup({})
  ngOnInit(): void {

    this.inItForm();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callClassByID(this._userDetails.schoolId);
      this.callSchoolByID(this._userDetails.schoolId);
    }
  }

  callSchoolByID(id: any) {
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      console.log(res);
      if(res.schoolBoard !== ''){
        this._boardList = res.schoolBoard.split(',');
      }
      console.log("this._boardList --> ", this._boardList);

    }, error => { this.closeLoader() })
  }

  inItForm() {
    this.addAdmissionForm = this.formBuilder.group({
      board: ['',[Validators.required]],
      classRange: ['',[Validators.required]],
      admissionStartDate: ['',[Validators.required]],
      admissionEndDate: ['',[Validators.required]],
      minDOB: ['',[Validators.required]],
      maxDOB: ['',[Validators.required]],
      feesAmount: ['',[Validators.required]],
      otherChargesAmount: [''],
      convenieceFee: [''],
      actualConvenieceFee: [''],
      actualGst: [''],
      schoolStreamDtlVo : this.formBuilder.array([])
    })
    
  }

  // Stream FormArray

  get parameterListArrayStream(): FormArray {
    return this.addAdmissionForm.get('schoolStreamDtlVo') as FormArray;
  }

  getControlsArrayStream() {
    return (<FormArray>this.addAdmissionForm.get('schoolStreamDtlVo')).controls;
  }

  addBlankParameterListStream(): void {
    // this.submitted = false;
    // this.getControlsArrayStream().push(this.fetchBlankParameterListStream());
    this.parameterListArrayStream.push(this.fetchBlankParameterListStream());
    this.addBlankParameterListSubject(this.parameterListArrayStream.length - 1);
    
  }
  fetchBlankParameterListStream(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      streamName: ['',[Validators.required]],
      schoolStreamSubjectDtlVo: this.formBuilder.array([])
    })
    
  }

  removeStreamForm(i?: any) {
    this.parameterListArrayStream.removeAt(i);
  }

  // Subject FormArray
  parameterListArrayStreamSubject(streamIndex: number): FormArray {
    return this.parameterListArrayStream.at(streamIndex).get("schoolStreamSubjectDtlVo") as FormArray
  }

  addBlankParameterListSubject(streamIndex?: number): void {
    this.submitted = false;
    for(let i=0; i<6; i++){
     this.parameterListArrayStreamSubject(streamIndex).push(this.fetchBlankParameterListStreamSubject());
     this.addArrayOptionSubject(streamIndex, i);
      }
    }
  fetchBlankParameterListStreamSubject(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      subjectName: [''],
      subjectType: [''],
      
      streamIndex: [''],
      subjectOptionsVo: this.formBuilder.array([])
    })
  }

  removeStreamFormSubject(streamIndex?: number, index?:any) {
    this.parameterListArrayStreamSubject(streamIndex).removeAt(index);
  }

  // ---------------------------------------------

  
  //Add Subjects Options ---------------------------------------------
  arrayOptionSubject(streamIndex:any, streamSubjectIndex:any): FormArray {
    // return this.addAdmissionForm.get('subjectOptionsVo') as FormArray;
    return this.parameterListArrayStreamSubject(streamIndex).at(streamSubjectIndex).get("subjectOptionsVo") as FormArray
  }

  addArrayOptionSubject(streamIndex:any, streamSubjectIndex:any): void {
    this.submitted = false;
    console.log("streamIndex -> ", streamIndex ,"streamSubjectIndex -> ", streamSubjectIndex);
    this.arrayOptionSubject(streamIndex, streamSubjectIndex).push(this.fetchBlankArrayOptionSubject(streamSubjectIndex));
    console.log(this.arrayOptionSubject.length);
    
  }
  fetchBlankArrayOptionSubject(i?: any, value?: any): FormGroup {
    let vaidatorTemp = [Validators.required];
    if(i === 5){
      vaidatorTemp = [];
    }
    return this.formBuilder.group({
      subjectNameOption: ['',vaidatorTemp],
      subjectTypeOption: [''],
      streamIndexOption: [''],
    })
  }

  removeArrayOptionSubject(streamIndex:any, streamSubjectIndex:any, index?:number) {
    this.arrayOptionSubject(streamIndex, streamSubjectIndex).removeAt(index);
  }



  inputArrayTemp:any[] = [1];
  insertInputText(index:any){
    this.inputArrayTemp.push(this.inputArrayTemp.length + 1);
  }
  // ---------------------------------------------

  callClassByID(id: any) {
    this.openLoader()
    this._authService.request('get', `schooluser/getClassList?schoolID=${id}`).subscribe((res) => {
      this.closeLoader();
      if (res !== null) {
        console.log('School class:', res);
        this._schoolLevelInfoList = res;
        console.log("this._schoolLevelInfoList--> ", this._schoolLevelInfoList);
        
      }

    }, error => { this.closeLoader() })
  }

  

  submitAdmissionEligibleForm(){
    this.submitted = true;
    if(this.addAdmissionForm.invalid){
      return
    }
    const data = this.addAdmissionForm.value;
    data.publishStatus = 'N';

    const streamData = data.schoolStreamDtlVo;
    console.log("streamData -> ", streamData);
    let finalData = {};
    if(streamData.length > 0 && data.classRange === 'XI'){
      const arrStreamSubject = [];
    for(let i=0; i<streamData.length; i++){
      const schoolStreamSubjectDtlVoData = streamData[i].schoolStreamSubjectDtlVo;
      console.log("schoolStreamSubjectDtlVoData-> ", schoolStreamSubjectDtlVoData);
      
      for(let j=0; j<schoolStreamSubjectDtlVoData.length; j++){
        const tempStreamName = streamData[i].schoolStreamSubjectDtlVo[j].streamName;
        for(let k=0; k<streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length; k++){
          const tempObj = {
            subjectName: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].subjectNameOption,
            subjectType: j+1,
            streamIndex: i+1
          }
          arrStreamSubject.push(tempObj);
        }
      }
    }
    console.log("arrStreamSubject-> ", arrStreamSubject);

    for(let i=0; i<streamData.length; i++){
      const tempArrStreamSub = [];
      for(let j=0; j<arrStreamSubject.length; j++){
        if(arrStreamSubject[j].streamIndex === i+1){
          tempArrStreamSub.push(arrStreamSubject[j])
        }
      }
      streamData[i].schoolStreamSubjectDtlVo = tempArrStreamSub;

    }

     finalData = {
      id: this._userDetails.schoolId,
      schoolAdmissionDtlVo : [data]
    }
    

    }else if(data.classRange !== 'XI'){
      data.schoolStreamDtlVo = [];
      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo : [data]
      }
    }else if(streamData.length === 0 && data.classRange === 'XI'){
      this.errorSnackBar('Please add atleast one stream details');
    }

    console.log(this.addAdmissionForm.controls);
    
    // return
    if(this.addAdmissionForm.invalid){
      return
    }else{
      this._authService.request('post', 'schooluser/saveSchoolAdmissionEligibilityDtl', finalData).subscribe((res) => {
        this.closeLoader();
        if (res.status == 200) {
          console.log('res :', res);
          // const isSomethingUploaded =
          //   this._selectedFiles.length != 0 ? true : false;
          if (this._selectedFiles) {
            console.log('Started Upload Process');
            const txId = res.result.id;
            this.uploadSingleFile(this._formData, txId);
          }
          this.openSnackBar('Drafted Successfully');
          this.router.navigate(['/admission/admission-lists'])
        }
  
      }, error => { 
        this.closeLoader();
        console.log(error);
         
      })
    }
    
    
  }

  publishAdmissionEligibleForm(){
    if(this.addAdmissionForm.invalid){
      return
    }
    this.submitted = true;
    const data = this.addAdmissionForm.value;
    data.publishStatus = 'Y';
    console.log("form data-> ", data);

    const streamData = data.schoolStreamDtlVo;
    console.log("streamData -> ", streamData);
    
    let finalData = {};
    
    if(streamData.length > 0 && data.classRange === 'XI'){
    const arrStreamSubject = [];
    for(let i=0; i<streamData.length; i++){
      const schoolStreamSubjectDtlVoData = streamData[i].schoolStreamSubjectDtlVo;
      console.log("schoolStreamSubjectDtlVoData-> ", schoolStreamSubjectDtlVoData);
      
      for(let j=0; j<schoolStreamSubjectDtlVoData.length; j++){
        const tempStreamName = streamData[i].schoolStreamSubjectDtlVo[j].streamName;
        for(let k=0; k<streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length; k++){
          const tempObj = {
            subjectName: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].subjectNameOption,
            subjectType: j+1,
            streamIndex: i+1
          }
          arrStreamSubject.push(tempObj);
        }
      }
    }
    console.log("arrStreamSubject-> ", arrStreamSubject);

    for(let i=0; i<streamData.length; i++){
      const tempArrStreamSub = [];
      for(let j=0; j<arrStreamSubject.length; j++){
        if(arrStreamSubject[j].streamIndex === i+1){
          tempArrStreamSub.push(arrStreamSubject[j])
        }
      }
      streamData[i].schoolStreamSubjectDtlVo = tempArrStreamSub;

    }
    
    finalData = {
      id: this._userDetails.schoolId,
      schoolAdmissionDtlVo : [data]
    }
    }else if(data.classRange !== 'XI'){
      data.schoolStreamDtlVo = [];
      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo : [data]
      }
    }else if(streamData.length === 0 && data.classRange === 'XI'){
      this.errorSnackBar('Please add atleast one stream details');
    }

    console.log(finalData);
    console.log(this.addAdmissionForm.controls);
    // return
    if(this.addAdmissionForm.invalid){
      return
    }else{
      this._authService.request('post', 'schooluser/saveSchoolAdmissionEligibilityDtl', finalData).subscribe((res) => {
        this.closeLoader();
        if (res.status == 200) {
          console.log('res :', res);
          // const isSomethingUploaded =
          //   this._selectedFiles.length != 0 ? true : false;
          if (this._selectedFiles) {
            console.log('Started Upload Process');
            const txId = res.result.id;
            this.uploadSingleFile(this._formData, txId);
          }
          this.openSnackBar('Published Successfully');
          this.router.navigate(['/admission/admission-lists'])
        }
  
      }, error => { 
        this.closeLoader();
        console.log(error);
         
      })
    }
    
  }

  onFileChanged(event:any) {
    const files = event.target.files;
    console.log(files);
    
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    console.log(mimeType);
    // if (mimeType.match(/image\/*/) == null) {
    //     this.message = "Only images are supported.";
    //     return;
    let targetElement = event.target as HTMLInputElement;
    this._selectedFiles = targetElement.files;
    // }
    this._formData = new FormData();
    for (let i = 0; i < this._selectedFiles.length; i++) {
      this._formData.append('file', this._selectedFiles[i]);
    }
    console.log(this._formData);
}

uploadSingleFile(formData: FormData, txId: number) {
  this.openLoader();
  this._authService
    .fileRequest(
      'post',
      `fe/uploadSingleFileInFolder?formCode=notice_media&txId=${txId}&docType=notice_doc`,
      formData
    )
    .subscribe((res) => {
      console.log(res);

      this._uploadDocUrl = res[0];

      console.log('Response: ', this._uploadDocUrl);
    });
}

  getConvenienceFee(fee:any){
   let conFee:any = ((fee * 10)/100).toFixed(2);
  //  console.log(conFee);
   
    if(conFee > +100){
      conFee = 100;
    }
    const tentativeGST = ((conFee * 18)/100)
    // console.log(Math.ceil(+conFee + +tentativeGST));
    const convenieceFeeTemp = Math.ceil(+conFee + +tentativeGST);
    const actualConvenieceFee = ((convenieceFeeTemp * 100)/118).toFixed(2);
    console.log("convenieceFee --> ", convenieceFeeTemp);
    console.log("actualConvenieceFee --> ", actualConvenieceFee);
    console.log("actualGST -Gov-> ", (+convenieceFeeTemp - +actualConvenieceFee).toFixed(2));
    this.addAdmissionForm.patchValue({
      convenieceFee : convenieceFeeTemp,
      actualConvenieceFee : actualConvenieceFee,
      actualGst : (+convenieceFeeTemp - +actualConvenieceFee).toFixed(2)
    })
  }

  openSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  errorSnackBar(message: any) {
    this._snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: ['danger-snackbar']
    });
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

}
