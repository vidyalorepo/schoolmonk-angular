import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng-lts/api';
import { HtmlEditorService, ImageService, LinkService, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-academic-save',
  templateUrl: './academic-save.component.html',
  styleUrls: ['./academic-save.component.css'],
  providers: [DatePipe,MessageService,ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,],
  
})
export class AcademicSaveComponent implements OnInit {

  _schoolForm = new FormGroup({});
  isSubmit: boolean = false;
  _userDetails: any;
  _academicYr: any;
  _academicYrArr: any=[];
  _schoolID: string;

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
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'Bold',
      'Italic',
      'Underline',
      '|',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateTable',
      'image',
      'CreateLink', 'RemoveLink'
    ],
  };

  public quickTools: object = {
    image: [
      'Replace',
      'Align',
      'Caption',
      'Remove',
      'InsertLink',
      '-',
      'Display',
      'AltText',
      'Dimension',
    ],
  };
  public iframe: object = { enable: true };
  maxIndex: number;
  existingSteps: any = [];

  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');

    this._schoolID = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.callSchoolByID(this._schoolID);
    this.generateAcademicYear();
    this.inItForm();
  }

  callSchoolByID(id: any) {
    this._authService.request('get', 'schooluser/school/' + id).subscribe((response) => {
      console.log(response);
      if (response) {
        this.existingSteps = [];
        if(response.profileStepSet != null){
          this.existingSteps = response.profileStepSet; 
          this.callStepsCheck(response.profileStepSet);
        }

      }
    }, error => {
      this.closeLoader();
    })
  }

  generateAcademicYear() {
    var currentYear = this.datePipe.transform(new Date(), 'yyyy');
    var currentMnt = (new Date().getMonth()) + 1;
    this._academicYr = (currentMnt > 3 ? (currentYear ) : ((+currentYear - 1)));
    
    for(let i=4; i>0; i--){
      let tempStr = (currentMnt > 3 ? ((+currentYear - i)) : ((+currentYear - i)));
      this._academicYrArr.push(tempStr);
    }
    this._academicYrArr.push(this._academicYr);
    console.log(this._academicYrArr);
    
    // console.log((currentMnt > 3 ? ((+currentYear - 2) + '-' + (+currentYear - 1)) : ((+currentYear - 2) + '-' + (currentYear))));
    // console.log((currentMnt > 3 ? ((+currentYear - 1) + '-' + (+currentYear)) : ((+currentYear - 1) + '-' + (currentYear))));
    

  }

  inItForm() {
    this._userDetails = JSON.parse(localStorage.getItem('userDetails') || '');

    this._schoolForm = this.formBuilder.group({
      schoolAcademicDtlVo: this.formBuilder.array([]),
    })
    this.addBlankParameterList()
  }

  get parameterListArray(): FormArray {
    return this._schoolForm.get('schoolAcademicDtlVo') as FormArray;
  }

  addBlankParameterList(size?: any, value?: any): void {
    this.isSubmit = false;
    this.parameterListArray.push(this.fetchBlankParameterList());
  }
  fetchBlankParameterList(i?: any, value?: any, readMode?: any): FormGroup {
    return this.formBuilder.group({
      academicYear: [this._academicYr, Validators.compose([Validators.required])],
      performanceTitle: ['',],
      academicInformation: ['', Validators.compose([Validators.required,Validators.maxLength(5000)])]
    })
  }
  removeRow(i?: any) {
    this.parameterListArray.removeAt(i);
  }
  saveAcademic() {
    this.isSubmit = true;

    if (this._schoolForm.status == 'VALID') {
      const data = { ...this._schoolForm.value };
      data.id = this._schoolID;
      this.existingSteps.push("6");
      data.profileStepSet = this.existingSteps;
      console.log(data);

      // return
      this.openLoader();
      this._authService.request('post', `schooluser/saveSchoolAcademicDtl`, data).subscribe(res => {
        this.closeLoader();
        console.log(res);
        if (res.status == 200) {
          // this.openSnackBar(res.message);
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"Academic performance has been added."});
          // this.router.navigate(['/manage-school/academic-list'])
          // this.ngOnInit();
          if (this._userDetails.userType === 'ADMIN_USER') {
            this.router.navigate(['/manage-school/school-list/edit-school', this._schoolID])
          }else{
            this.router.navigate(['/manage-school/school-list/school-profile-edit', this._schoolID])
          }
        }


      }, error => { this.closeLoader()
        console.log(error);
        if (error.error.status == 406) {
          this.messageService.clear();
          this.messageService.add({severity:'error', summary:'', detail:"Academic Year must be unique."});
        }
      })
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

  hideShowCall() {
    this._authService._adminSideNavBar.next({ show: true })
    this._authService._adminHeader.next({ show: true })
    this._authService._adminFooter.next({ show: true })
  }

  openLoader() { this._authService.loader.next({ load: true, }) }

  closeLoader() { this._authService.loader.next({ load: false }) }

  cancelButtonRoute(){
    if (this._userDetails.userType === 'ADMIN_USER') {
      this.router.navigate(['/manage-school/school-list/edit-school', this._schoolID])
    }else{
      this.router.navigate(['/manage-school/school-list/school-profile-edit', this._schoolID])
    }
  }

}
