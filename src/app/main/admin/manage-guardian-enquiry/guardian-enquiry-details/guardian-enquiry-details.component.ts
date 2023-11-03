import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/_services/loader.service';

@Component({
  selector: 'app-guardian-enquiry-details',
  templateUrl: './guardian-enquiry-details.component.html',
  styleUrls: ['./guardian-enquiry-details.component.css']
})
export class GuardianEnquiryDetailsComponent implements OnInit {

  addGuardianEnquiryDetailsForm: FormGroup;
  guardianId: any = '';
  guardian: any = {};
  constructor(private _authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _datePipe: DatePipe,
    private _loader:LoaderService) { }

  ngOnInit(): void {
    this.initAddGuardianEnquiryDetailsForm();
    this.guardianId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getguardianEnquiryDetails(this.guardianId);
  }

  initAddGuardianEnquiryDetailsForm = () => {
    this.addGuardianEnquiryDetailsForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      dob: [''],
      schoolType: [''],
      board: [''],
      medium: [''],
      city: [''],
      postalCode: [''],
      createdTs: ['']
    });
  }

  getguardianEnquiryDetails(id: any) {
    this._loader.openLoader();
    this._authService.loader.next({ load: true });
    this._authService.request('get', 'parentenquiry/findbyid/' + id).subscribe(
      (response) => {
        this._loader.closeLoader();
        if (response && response.result) {
          console.log(response);
          this.guardian = response; 
          this.patchForm(response.result);
        }
      },
      (error) => {
        this._loader.closeLoader();
      }
    );
  }

  patchForm(details: any) {
    this.addGuardianEnquiryDetailsForm.patchValue({
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone,
      dob: this._datePipe.transform( details.dob, "d MMM y") ,
      schoolType: details.schoolType,
      board: details.board,
      medium: details.medium,
      city: details.city,
      postalCode: details.postalCode,
      // createdTs: details.createdTs,
      createdTs: this._datePipe.transform( details.createdTs, "d MMM y") ,
    });
  }

}
