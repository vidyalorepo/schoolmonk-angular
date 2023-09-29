import { DatePipe,Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HtmlEditorService, ImageService, LinkService, TableService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { MessageService } from 'primeng-lts/api';
import { AuthService } from 'src/app/_services/auth.service';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-academic-edit',
  templateUrl: './academic-edit.component.html',
  styleUrls: ['./academic-edit.component.css'],
  providers: [DatePipe,MessageService,ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    TableService,],
})
export class AcademicEditComponent implements OnInit {
  _academicForm = new FormGroup({});
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
  isSubmit: boolean =false;
  public _schoolID:any;
  _academicYr: any;
  _academicYrArr: any=[];
  _academicId: string;
  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDedectionRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private _loader:LoaderService,
    private location: Location) {
      this.inItForm();
     }

  ngOnInit(): void {
    this._academicId = this.activatedRoute.snapshot.paramMap.get('id');
    this._schoolID= this.activatedRoute.snapshot.paramMap.get('schoolid');
    
    this.getAcademicDtlbyId();
    this.generateAcademicYear();
  }

  inItForm() {
    this._academicForm = this.formBuilder.group({
      id: [''],
      academicYear: ['', Validators.compose([Validators.required])],
      performanceTitle: ['',],
      academicInformation: ['', Validators.compose([Validators.required,Validators.maxLength(5000)])]
    })
  }
  getAcademicDtlbyId(){
    this._loader.openLoader();
    this._authService.request('get',`schooluser/getAcademicdtlById/${this._academicId}`).subscribe((res)=>{
      const data=res.result;
      console.log(data);
      this._academicForm.patchValue({
        id: data.id,
        academicYear: data.academicYear,
        performanceTitle: data.performanceTitle,
        academicInformation: data.academicInformation
      })
      this._loader.closeLoader();
    },(e)=>{
      this._loader.closeLoader();
    })
  }
  updateAcademic() {
    if (this._academicForm.status == 'VALID') {
      const data = { schoolAcademicDtlVo: [{}], id: '' };
      data.schoolAcademicDtlVo = []
      data.schoolAcademicDtlVo.push(this._academicForm.value)
      data.id = this._schoolID;

      console.log(data);
      this._loader.openLoader();
      this._authService.request('post', `schooluser/updateSchoolAcademicDtl`, data).subscribe(res => {
       this._loader.closeLoader();
        console.log(res);
        if (res.status == 200) {
          this.messageService.clear();
          this.messageService.add({severity:'success', summary:'', detail:"School Academic Achievement has been updated successful."});
          this.router.navigate([`manage-school/school-list/edit-school/${this._schoolID}`]);
        }


      }, error => { this._loader.closeLoader(); 
        this.messageService.clear();
        this.messageService.add({severity:'error', summary:'', detail:error.error.message});
      })
     
    }
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
  back(){
    this.location.back();
  }
}
