import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admission-eligibility-edit',
  templateUrl: './admission-eligibility-edit.component.html',
  styleUrls: ['./admission-eligibility-edit.component.css']
})
export class AdmissionEligibilityEditComponent implements OnInit {

  _userDetails: any;
  _schoolLevelInfoList: any;
  submitted: boolean = false;
  _admissionDtlID: string;
  _admissionDtlVo: any;
  subjectOptionsVoArr: any;
  _boardList: any;

  _selectedFiles: any;
  _formData!: FormData;
  _uploadDocUrl: any;

  constructor(
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }


  editAdmissionForm = new FormGroup({})
  ngOnInit(): void {

    this.inItForm();
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');
    if (this._userDetails) {
      this.callClassByID(this._userDetails.schoolId);
      this.callSchoolByID(this._userDetails.schoolId);
    }
    this._admissionDtlID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.callAdmissionDtlData(this._admissionDtlID);
  }

  callSchoolByID(id: any) {
    this._authService.request('get', 'schooluser/school/' + id).subscribe((res) => {
      console.log(res);
      if (res.schoolBoard !== '') {
        this._boardList = res.schoolBoard.split(',');
      }
      console.log("this._boardList --> ", this._boardList);

    }, error => { this.closeLoader() })
  }

  callAdmissionDtlData(_admissionDtlID: any) {
    if (_admissionDtlID) {
      this._authService.request('get', `schooluser/admissionFindById?id=${_admissionDtlID}`).subscribe(res => {
        if (res.status === 200) {
          console.log(res);
          this._admissionDtlVo = res.result;
          this.setAdmissionDtlData(this._admissionDtlVo);
        }

      }, error => {
        this.closeLoader();
        console.log(error);

      })
    }
  }

  // Start of patching........................................

  setAdmissionDtlData(_admissionDtlVo: any) {
    this.editAdmissionForm.patchValue({
      id: _admissionDtlVo.id,
      board: _admissionDtlVo.board,
      classRange: _admissionDtlVo.classRange,
      admissionStartDate: new Date(_admissionDtlVo.admissionStartDate).toISOString().slice(0, 10),
      admissionEndDate: new Date(_admissionDtlVo.admissionEndDate).toISOString().slice(0, 10),
      minDOB: new Date(_admissionDtlVo.minDOB).toISOString().slice(0, 10),
      maxDOB: new Date(_admissionDtlVo.maxDOB).toISOString().slice(0, 10),
      convenieceFee: _admissionDtlVo.convenieceFee,
      actualConvenieceFee: _admissionDtlVo.actualConvenieceFee,
      actualGst: _admissionDtlVo.actualConvenieceFee,
      feesAmount: _admissionDtlVo.feesAmount,
      otherChargesAmount: _admissionDtlVo.otherChargesAmount,
    })
    this.addSchoolStreamVo(_admissionDtlVo.schoolStreamDtlVo.length, _admissionDtlVo.schoolStreamDtlVo);

  }

  addSchoolStreamVo(size: any, data: any) {
    this.parameterListArrayStream.clear();
    for (let i = 0; i < size; i++) {
      console.log(Object.values(data[i].subjectOptionsVo));

      // ((this.parameterListArrayStream.get('schoolStreamDtlVo') as FormArray).at(i) as FormGroup).get('id').patchValue(data[i]?.id);
      this.parameterListArrayStream.push(this.patchStreamForm(i, data));
      let groupByArr: any[] = [];
      // groupByArr = this.groupBy(data[i].schoolStreamSubjectDtlVo, 'subjectType');
      groupByArr = (Object.values(data[i].subjectOptionsVo));
      console.log(groupByArr);
      // this.addSchoolStreamSubjectVo(i, data[i].schoolStreamSubjectDtlVo.length, data[i].schoolStreamSubjectDtlVo);
      this.addSchoolStreamSubjectVo(i, groupByArr.length, groupByArr);

    }
  }

  // Patch stream form values
  patchStreamForm(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      id: value[i].id,
      streamName: [value[i].streamName, Validators.required],
      schoolStreamSubjectDtlVo: this.formBuilder.array([])
    })

  }

  groupBy(array: any[], key: string | number) {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, []); // empty object is the initial value for result object
  };

  addSchoolStreamSubjectVo(streamIndex?: number, size?: any, data?: any[]): void {
    console.log(streamIndex, data);
    this.parameterListArrayStreamSubject(streamIndex).clear();
    // let groupByArr:any[] = [];
    // groupByArr = this.groupBy(data, 'subjectType');
    // groupByArr.splice(0,1);
    // console.log(groupByArr);
    // data.filter(res => +res.subjectType === 1 )


    for (let i = 0; i < data.length; i++) {
      const subjectOptionsVoObj = [];
      const tempTempArrGrpBy = data[i];
      for (let j = 0; j < tempTempArrGrpBy.length; j++) {
        // console.log(tempTempArrGrpBy[j]);
        // data.length
        console.log(data.length);
        if (this.parameterListArrayStreamSubject(streamIndex).length < data.length) {
          this.parameterListArrayStreamSubject(streamIndex).push(this.patchStreamSubjectForm(streamIndex, j, tempTempArrGrpBy[j]));
        }
        subjectOptionsVoObj.push({
          id: tempTempArrGrpBy[j].id,
          subjectNameOption: tempTempArrGrpBy[j].subjectName,
          subjectTypeOption: tempTempArrGrpBy[j].subjectType,
          streamIndexOption: streamIndex,
        })
      }
      // subjectOptionsVoObj.push({
      //   subjectNameOption: data[i].subjectName,
      //   subjectTypeOption: data[i].subjectType,
      //   streamIndexOption: streamIndex,
      // })


      // console.log(subjectOptionsVoObj, 'StreamIndex: ', streamIndex);
      this.addSchoolStreamSubjectOptionVo(streamIndex, i, subjectOptionsVoObj.length, subjectOptionsVoObj);
      // this.addSchoolStreamSubjectOptionVo(streamIndex, i, subjectOptionsVoObj.length, subjectOptionsVoObj);  
    }
    for (let i = this.parameterListArrayStreamSubject(streamIndex).length; i < 6; i++) {
      this.parameterListArrayStreamSubject(streamIndex).push(this.fetchBlankParameterListStreamSubject());
    }


    // this.seperateSubjectOptions(streamIndex, subjectOptionsVoObj);

    // for(let i=0; i<groupByArr.length; i++){
    //   const subjectOptionsVoObj = [];
    //   const tempTempArrGrpBy = groupByArr[i];
    //     for(let j=0; j<tempTempArrGrpBy.length; j++){
    //       console.log(tempTempArrGrpBy[j]);
    //       this.parameterListArrayStreamSubject(streamIndex).push(this.patchStreamSubjectForm(streamIndex, j, tempTempArrGrpBy[j]));
    //       subjectOptionsVoObj.push({
    //         subjectNameOption: tempTempArrGrpBy[j].subjectName,
    //         subjectTypeOption: tempTempArrGrpBy[j].subjectType,
    //         streamIndexOption: streamIndex,
    //       })
    //     }
    //   console.log(subjectOptionsVoObj, 'StreamIndex: ', streamIndex);
    //   this.addSchoolStreamSubjectOptionVo(streamIndex, i, subjectOptionsVoObj.length, subjectOptionsVoObj);  
    // }

  }

  seperateSubjectOptions(streamIndex: any, data: any[]) {
    let sameSubjectTypeArr = [];
    const arrLen = Math.max.apply(Math, data.map(function (o) { return +o.subjectTypeOption; }));
    for (let i = 0; i < arrLen; i++) {
      // if(data[i].subjectTypeOption > i){
      sameSubjectTypeArr = [];
      if (data.filter(t => +t.subjectTypeOption === i + 1).length > 0) {
        sameSubjectTypeArr = data.filter(t => +t.subjectTypeOption === i + 1);
      }
      // console.log(sameSubjectTypeArr);
      // }
      this.addSchoolStreamSubjectOptionVo(streamIndex, i, sameSubjectTypeArr.length, sameSubjectTypeArr);

    }
    // this.addSchoolStreamSubjectOptionVo(streamIndex, index, data.length, data);
  }

  // Patch stream subject form values
  patchStreamSubjectForm(streamIndex?: number, i?: any, value?: any): FormGroup {
    console.log(value);

    return this.formBuilder.group({
      id: value.id,
      subjectName: value.subjectName,
      subjectType: value.subjectType,
      streamIndex: +value.subjectType,
      subjectOptionsVo: this.formBuilder.array([])
    })
  }

  addSchoolStreamSubjectOptionVo(streamIndex: any, streamSubjectIndex: any, size: any, data: any): void {
    // console.log(data, streamIndex, streamSubjectIndex);

    for (let i = 0; i < size; i++) {
      this.arrayOptionSubject(streamIndex, streamSubjectIndex).push(this.patchOptionSubject(i, data));
    }

  }
  patchOptionSubject(i?: any, value?: any): FormGroup {
    // console.log(value[i]);

    return this.formBuilder.group({
      id: value[i].id,
      subjectNameOption: value[i].subjectNameOption,
      subjectTypeOption: value[i].subjectTypeOption,
      streamIndexOption: value[i].streamIndexOption,
    })
  }


  // End of patching........................................

  // Init Forms
  inItForm() {
    this.editAdmissionForm = this.formBuilder.group({
      id: [''],
      board: ['', [Validators.required]],
      classRange: ['', [Validators.required]],
      admissionStartDate: ['', [Validators.required]],
      admissionEndDate: ['', [Validators.required]],
      minDOB: ['', [Validators.required]],
      maxDOB: ['', [Validators.required]],
      feesAmount: ['', [Validators.required]],
      convenieceFee: [''],
      actualConvenieceFee: [''],
      actualGst: [''],
      otherChargesAmount: [''],
      schoolStreamDtlVo: this.formBuilder.array([])
    })

  }

  // Stream FormArray
  get parameterListArrayStream(): FormArray {
    return this.editAdmissionForm.get('schoolStreamDtlVo') as FormArray;
  }

  getControlsArrayStream() {
    return (<FormArray>this.editAdmissionForm.get('schoolStreamDtlVo')).controls;
  }

  addBlankParameterListStream(): void {
    // this.submitted = false;
    // this.getControlsArrayStream().push(this.fetchBlankParameterListStream());
    this.parameterListArrayStream.push(this.fetchBlankParameterListStream());
    this.addBlankParameterListSubject(this.parameterListArrayStream.length - 1);
  }
  fetchBlankParameterListStream(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      id: [''],
      streamName: ['', [Validators.required]],
      schoolStreamSubjectDtlVo: this.formBuilder.array([])
    })

  }

  removeStreamForm(ids?: any, i?: any) {
    const data = {
      id: ids
    }
    if (ids) {
      this.openLoader();
      this._authService.request('post', `schooluser/deleteStream`, data).subscribe((res) => {
        this.closeLoader();
        if (res.status === 200) {
          this.parameterListArrayStream.removeAt(i);
          this.ngOnInit();
        }

      }, error => { this.closeLoader() })
    } else {
      this.parameterListArrayStream.removeAt(i);
    }
  }

  // Subject FormArray
  parameterListArrayStreamSubject(streamIndex: number): FormArray {
    return this.parameterListArrayStream.at(streamIndex).get("schoolStreamSubjectDtlVo") as FormArray
  }

  addBlankParameterListSubject(streamIndex?: number): void {
    this.submitted = false;
    // this.parameterListArrayStreamSubject(streamIndex).push(this.fetchBlankParameterListStreamSubject());
    for (let i = 0; i < 6; i++) {
      this.parameterListArrayStreamSubject(streamIndex).push(this.fetchBlankParameterListStreamSubject());
      this.addArrayOptionSubject(streamIndex, i);
    }
  }
  fetchBlankParameterListStreamSubject(i?: any, value?: any): FormGroup {
    return this.formBuilder.group({
      id: [''],
      subjectName: [''],
      subjectType: [''],

      streamIndex: [''],
      subjectOptionsVo: this.formBuilder.array([])
    })
  }

  removeStreamFormSubject(streamIndex?: number, index?: any, id?: any) {
    console.log(streamIndex, index);
    if (id) {
      const data = {
        schoolStreamDtlVo: {
          id: id
        },
        subjectType: index + 1
      }
      console.log(data);
      return
      this.openLoader();
      this._authService.request('post', `schooluser/deleteSubjectByType`, data).subscribe((res) => {
        this.closeLoader();
        if (res.status === 200) {
          this.parameterListArrayStreamSubject(streamIndex).removeAt(index);
        }

      }, error => { this.closeLoader() })
    } else {
      this.parameterListArrayStreamSubject(streamIndex).removeAt(index);
    }

  }

  // ---------------------------------------------


  //Add Subjects Options ---------------------------------------------
  arrayOptionSubject(streamIndex: any, streamSubjectIndex: any): FormArray {
    // return this.editAdmissionForm.get('subjectOptionsVo') as FormArray;
    return this.parameterListArrayStreamSubject(streamIndex).at(streamSubjectIndex).get("subjectOptionsVo") as FormArray
  }

  addArrayOptionSubject(streamIndex: any, streamSubjectIndex: any): void {
    this.submitted = false;
    console.log("streamIndex -> ", streamIndex, "streamSubjectIndex -> ", streamSubjectIndex);
    this.arrayOptionSubject(streamIndex, streamSubjectIndex).push(this.fetchBlankArrayOptionSubject(streamSubjectIndex));
    console.log(this.arrayOptionSubject.length);

  }
  fetchBlankArrayOptionSubject(i?: any, value?: any): FormGroup {
    let vaidatorTemp = [Validators.required];
    if (i === 5) {
      vaidatorTemp = [];
    }
    return this.formBuilder.group({
      id: [''],
      subjectNameOption: ['', vaidatorTemp],
      subjectTypeOption: [''],
      streamIndexOption: [''],
    })
  }

  removeArrayOptionSubject(streamIndex: any, streamSubjectIndex: any, index?: number, id?: any) {
    console.log(id);
    if (id) {
      const data = {
        id: id
      }
      // return
      this.openLoader();
      this._authService.request('post', `schooluser/deleteSubject`, data).subscribe((res) => {
        this.closeLoader();
        if (res.status === 200) {
          this.errorSnackBar('Subject deleted!');
          this.arrayOptionSubject(streamIndex, streamSubjectIndex).removeAt(index);
        }

      }, error => { this.closeLoader() })
    } else {
      this.arrayOptionSubject(streamIndex, streamSubjectIndex).removeAt(index);
      console.log(this.arrayOptionSubject(streamIndex, streamSubjectIndex));
    }

  }



  inputArrayTemp: any[] = [1];
  insertInputText(index: any) {
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

  get f() {
    // return this.editAdmissionForm.controls;
    return (this.editAdmissionForm.get('schoolStreamDtlVo') as FormArray).controls;
  }

  submitAdmissionEligibleForm() {
    this.submitted = true;
    if (this.editAdmissionForm.invalid) {
      this.errorSnackBar('Please fill required fields');
      return
    }

    const data = { ...this.editAdmissionForm.value };
    data.publishStatus = 'N';
    console.log("form data-> ", JSON.stringify(data));
    // return
    const streamData = data.schoolStreamDtlVo;
    console.log("streamData -> ", streamData);
    let finalData = {};
    if (streamData.length > 0) {
      const arrStreamSubject = [];
      for (let i = 0; i < streamData.length; i++) {
        const schoolStreamSubjectDtlVoData = streamData[i].schoolStreamSubjectDtlVo;
        // console.log("schoolStreamSubjectDtlVoData-> ", schoolStreamSubjectDtlVoData);

        for (let j = 0; j < schoolStreamSubjectDtlVoData.length; j++) {
          // const tempStreamName = streamData[i].schoolStreamSubjectDtlVo[j].streamName;
          // console.log(schoolStreamSubjectDtlVoData);
          // console.log(streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length);
          for (let k = 0; k < streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length; k++) {
            const tempObj = {
              id: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].id,
              subjectName: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].subjectNameOption,
              subjectType: j + 1,
              streamIndex: i + 1
            }
            arrStreamSubject.push(tempObj);
          }
        }
      }
      console.log("arrStreamSubject-> ", arrStreamSubject);

      for (let i = 0; i < streamData.length; i++) {
        const tempArrStreamSub = [];
        for (let j = 0; j < arrStreamSubject.length; j++) {
          if (arrStreamSubject[j].streamIndex === i + 1) {
            tempArrStreamSub.push(arrStreamSubject[j])
          }
        }
        streamData[i].schoolStreamSubjectDtlVo = tempArrStreamSub;

      }
      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo: [data]
      }

      console.log(this.editAdmissionForm.controls, this.f[0]);

    } else if (data.classRange !== 'XI') {
      data.schoolStreamDtlVo = [];
      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo: [data]
      }
    } else if (streamData.length === 0 && data.classRange === 'XI') {
      this.errorSnackBar('Please add atleast one stream details');
    }

    console.log(data);
    // return
    if (this.editAdmissionForm.invalid) {
      return
    } else {
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

  publishAdmissionEligibleForm() {
    this.submitted = true;
    if (this.editAdmissionForm.invalid) {
      this.errorSnackBar('Please fill required fields');
      return
    }
    const data = { ...this.editAdmissionForm.value };
    data.publishStatus = 'Y';
    console.log("form data-> ", JSON.stringify(data));
    // return
    const streamData = data.schoolStreamDtlVo;
    console.log("streamData -> ", streamData);

    let finalData = {}

    if (streamData.length > 0 && data.classRange === 'XI') {
      const arrStreamSubject = [];
      for (let i = 0; i < streamData.length; i++) {
        const schoolStreamSubjectDtlVoData = streamData[i].schoolStreamSubjectDtlVo;
        // console.log("schoolStreamSubjectDtlVoData-> ", schoolStreamSubjectDtlVoData);

        for (let j = 0; j < schoolStreamSubjectDtlVoData.length; j++) {
          // const tempStreamName = streamData[i].schoolStreamSubjectDtlVo[j].streamName;
          // console.log(schoolStreamSubjectDtlVoData);
          // console.log(streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length);
          for (let k = 0; k < streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo.length; k++) {
            const tempObj = {
              id: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].id,
              subjectName: streamData[i].schoolStreamSubjectDtlVo[j].subjectOptionsVo[k].subjectNameOption,
              subjectType: j + 1,
              streamIndex: i + 1
            }
            arrStreamSubject.push(tempObj);
          }
        }
      }
      console.log("arrStreamSubject-> ", arrStreamSubject);

      for (let i = 0; i < streamData.length; i++) {
        const tempArrStreamSub = [];
        for (let j = 0; j < arrStreamSubject.length; j++) {
          if (arrStreamSubject[j].streamIndex === i + 1) {
            tempArrStreamSub.push(arrStreamSubject[j])
          }
        }
        streamData[i].schoolStreamSubjectDtlVo = tempArrStreamSub;

      }

      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo: [data]
      }


    } else if (data.classRange !== 'XI') {
      data.schoolStreamDtlVo = [];
      finalData = {
        id: this._userDetails.schoolId,
        schoolAdmissionDtlVo: [data]
      }
    } else if (streamData.length === 0 && data.classRange === 'XI') {
      this.errorSnackBar('Please add atleast one stream details');
    }

    console.log(finalData);
    // console.log(this.editAdmissionForm.controls);
    // return
    if (this.editAdmissionForm.invalid) {
      this.errorSnackBar('Please fill required fields');
      return
    } else {
      console.log("in valid form");
      // return
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
      `fe/uploadSingleFileInFolder?formCode=notice_media&txId=${txId}&docType=notice_doc&fileId=${this._admissionDtlVo.document?.fileId != undefined ? this._admissionDtlVo.document?.fileId: ''}`,
      formData
    )
    .subscribe((res) => {
      console.log(res);

      this._uploadDocUrl = res[0];

      console.log('Response: ', this._uploadDocUrl);
    });
}

downloadDoc(){
  // console.log(this.noticeDtl.document?.filePath);
  
  window.open(`${this._admissionDtlVo.document?.filePath}`, '_blank');
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
   this.editAdmissionForm.patchValue({
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
