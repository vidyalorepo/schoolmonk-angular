import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'primeng-lts/api';
import {
  FormBuilder,
  ValidatorFn,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { error } from 'console';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-advertisement-upload',
  templateUrl: './advertisement-upload.component.html',
  styleUrls: ['./advertisement-upload.component.css']
})
export class AdvertisementUploadComponent implements OnInit {

  customerDetailsList: any;
  _advertisementImageInvalidMsg: any = '';
  public _isValidAdvertisementImgRatio: boolean = false;
  _zoneID = '';
  _advertisementImageURL = { fileId: 0, filePath: '' };
  localFields = { text: 'value', value: 'code' };
  public isEditBtn: boolean = false;
  orderDetails: any;
  customerId: any;
  zoneId: any;
  percentDone: number;
  uploadSuccess: boolean;
  size: any;
  width: number;
  height: number;
  uploadedImage: any;
  advertisementImageInvalidMsg: string;
  orderID:any;
  adsId: any;
  fileId: any;
  @ViewChild("ImageInput") myInputVariable: ElementRef;
  files: any ;
  element: any;
  event: any;
 inputUrlarray : any[]=[];
 listOfImg:any []=[];

  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private _loader:LoaderService) { }

  ngOnInit(): void {
    this.orderID = this.route.snapshot.paramMap.get('id');
    this.getBuyerDetails();
  }
  
  getBuyerDetails(){
    this._authService.openRequest('get', `adsvertisement/fetchByAdd/${this.orderID}`)
    .subscribe((res) => {
      this.orderDetails = res.result;
    });
  }

  uploadAdvertisementImage(event: any, doc: any, id?: any, imgSize?: number, element?: any,index?:any) {
    this.event=event;
    this._advertisementImageInvalidMsg = '';
    this._isValidAdvertisementImgRatio = false;
    this.listOfImg[index]={index:index,values:event.target.files[0] , element:element}
    // this.files = event.target.files[0];
    // this.element=element;
  }
  upload(index:any){
    this.files=this.listOfImg[index]?.values;
    this.element=this.listOfImg[index]?.element;
    if (this.files && (this.files.type == "image/jpg" || this.files.type == "image/png" || this.files.type == "image/jpeg")) {
      if ((this.files.size <= 5120000)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = (rs: any) => {
            let uploadImageHeight = rs.currentTarget['height']+"px";
            let uploadImageWidth = rs.currentTarget['width']+"px";
            console.log(uploadImageHeight);
            console.log(uploadImageWidth);
            console.log(this.orderDetails.zoneId.heightPx);
            console.log(this.orderDetails.zoneId.heightPx);
            if (uploadImageHeight === this.orderDetails.zoneId.heightPx && uploadImageWidth === this.orderDetails.zoneId.widthPx ) {
              let formData = new FormData();
              formData.append('file', this.files, this.files.name);
              this._loader.openLoader();
              console.log(formData);
              this.uploadedImage = formData;
              const url=this.inputUrlarray[index]?.values;
              this._authService.fileRequest('post', `adsvertisement/uploadSingleFileInFolder?formCode=ads_media&txId=0&docType=advertisement_image&fileId=0&adsId=${this.orderDetails.id}&adsUrl=${url}`, formData).subscribe(fileRes => {
              this._loader.closeLoader();
              this.getBuyerDetails();
              this.element.value = "";
              }, error => {
                this._loader.closeLoader();
              })
            }
            else {
              console.log("Not Valid Ratio");
             alert("Invalid file dimension.");
              this.element.value = "";

            }
          }
        }
        reader.readAsDataURL(this.event.target.files[0]);
      }
      else {
        alert("Invalid file size.");
      }
    }
    else {
      if (this.element) {
        this.element.value = "";
      }
      alert("Invalid file type.")
    }
  }

  deleteImage(id: any) {
    this._loader.openLoader();
    this._authService.openRequest('get', `adsvertisement/attachment?fileId=${id}` )
    .subscribe((res) => {
      console.log(res);
      this._loader.closeLoader();
      if (res.status == 200) {
        this.getBuyerDetails();
        this.messageService.clear();
        this.messageService.add({severity:'success', summary:'', detail:"File has been deleted.."});
      }
      this.myInputVariable.nativeElement.value = "";

    }, error => {
      this._loader.closeLoader();
      this.messageService.clear();
      this.messageService.add({severity:'success', summary:'', detail:"File deleted failed."});
    });
  }
  
  getqty(qty: number): number[] {
    console.log(Array.from({ length: qty }, (_, i) => i + 1))
    return Array.from({ length: qty }, (_, i) => i + 1);
  }

  OnInputChange(event:any,i:any){
    const input=event.target as HTMLInputElement;
    const inputValues=input.value;

      this.inputUrlarray[i] ={index:i,values:inputValues}
    
    console.log(this.inputUrlarray);
  }
}
