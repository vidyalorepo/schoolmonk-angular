import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseUrl: any;
  public token: any;
  loader: BehaviorSubject<any>;
  searchSchool: BehaviorSubject<any>;
  _adminSideNavBar: BehaviorSubject<any>;
  _adminHeader: BehaviorSubject<any>;
  _normalHeader: BehaviorSubject<any>;
  _adminFooter: BehaviorSubject<any>;
  _userName: BehaviorSubject<any>;
  MAPS_ENDPOINT: string;
  MAPS_API_KEY: string;
  classList = [
    { code: 0, class: 'Nursery' },
    { code: 1, class: 'I' },
    { code: 2, class: 'II' },
    { code: 3, class: 'III' },
    { code: 4, class: 'IV' },
    { code: 5, class: 'V' },
    { code: 6, class: 'VI' },
    { code: 7, class: 'VII' },
    { code: 8, class: 'VIII' },
    { code: 9, class: 'IX' },
    { code: 10, class: 'X' },
    { code: 11, class: 'XI' },
    { code: 12, class: 'XII' },
  ];

  classRangeList: { code: any; class: any }[] = [];

  _academicYr: any;

  constructor(private http: HttpClient, private _router: Router) {
    //*************************VIDYALO LOCAL*****************************************

    // this.baseUrl = 'http://localhost:9085/api';

    // ***************************VIDYALO QA*****************************************

    // this.baseUrl = 'http://20.1.1.208:9085';
    // this.baseUrl = 'http://vidyalodev.dccil.com/api';

    // ********************Vidyalo DEV********************************************

      // this.baseUrl = 'http://65.1.125.231:9085/api';
      this.baseUrl = 'http://52.66.6.218:9085/api';

    // *************************VIDYALO PROD****************************************

    // this.baseUrl = 'http://43.205.64.116:9085/api';
    // this.baseUrl = 'https://43.204.27.110:9085/api';
    //  this.baseUrl = 'https://vidyalo.com/api';

   //********************************************************************************


    this.MAPS_ENDPOINT =
      'https://maps.googleapis.com/maps/api/geocode/json?address=';
    this.MAPS_API_KEY = 'AIzaSyCyLqMQHPUnmZYntJHt3kUPoZuCpYli518';

    this.loader = new BehaviorSubject([]);
    this.searchSchool = new BehaviorSubject([]);
    this._adminSideNavBar = new BehaviorSubject([]);
    this._adminHeader = new BehaviorSubject([]);
    this._normalHeader = new BehaviorSubject([]);
    this._adminFooter = new BehaviorSubject([]);
    this._userName = new BehaviorSubject([]);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  /**
   * Method for handle HTTP Request.
   * Method to Handle all kind of HTTP Request.
   * @param method: Parameter to get HTTP Request Method.
   * @param type: Parameter to get URL of HTTP Request.
   * @param data: Parameter to get body for Post method which is optional.
   */

  public authRequest(
    method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file',
    type: String,
    data?: any
  ): Observable<any> {
    let base;
    base = this.http.post(`${this.baseUrl}/${type}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    return base;
  }

  public getAuthRequest(type: String, data?: any): Observable<any> {
    let base;
    base = this.http.get(`${this.baseUrl}/${type}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    return base;
  }

  public fileRequest(
    method: 'post',
    type: String,
    data?: any
  ): Observable<any> {
    let fileUpload;
    // if (method === 'post') {
    const header = {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    };
    fileUpload = this.http.post(
      `${this.baseUrl}/${type}`,
      data,
      this.getToken() ? header : {}
    );
    return fileUpload;
    // }
  }

  public openRequest(
    method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file',
    type: String,
    data?: any
  ): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${this.baseUrl}/${type}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (method === 'get') {
      base = this.http.get(`${this.baseUrl}/${type}`, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return base;
  }
  public request(
    method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file',
    type: String,
    data?: any
  ): Observable<any> {
    let base;

    if (method === 'post') {
      if (
        type === 'users/login' ||
        type === 'users/register' ||
        type == 'users/validate'
      ) {
        base = this.http.post(`${this.baseUrl}/${type}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        if (localStorage.getItem('token')) {
          base = this.http.post(`${this.baseUrl}/${type}`, data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.getToken()}`,
            },
          });
        } else {
          base = this.http.post(`${this.baseUrl}/${type}`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }
    } else if (method === 'put') {
      base = this.http.put(`${this.baseUrl}/${type}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    } else if (method === 'patch') {
      base = this.http.put(`${this.baseUrl}/${type}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    } else if (method === 'delete') {
      base = this.http.delete(`${this.baseUrl}/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    } else if (method === 'file') {
      base = this.http.post(`${this.baseUrl}/${type}`, data, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    } else {
      if (data) {
        base = this.http.get(`${this.baseUrl}/${type}`, {
          params: data,
          headers: { Authorization: `Bearer ${this.getToken()}` },
        });
      } else {
        // console.log("this.getToken() -->>", this.getToken());
        base = this.http.get(`${this.baseUrl}/${type}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getToken()}`,
          },
        });
        // base = this.http.get('http://localhost:9085/schooluser/getschoolbyuser/54', { headers: { Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2MTkxMDQxOTksImlhdCI6MTYxOTAxNzc5OX0.vnZwkcTfu2r6AtYIcnoBiyAUkB9tM_qOvNhSM1jDHtlYHAuvjhsh7pMk-87shJIDRPb0qWICzYU5z-1xZPZo0w` } });
        // console.log("base-->>", base);
      }
    }

    return base;
  }

  public request1(
    method: 'post' | 'get' | 'put' | 'delete' | 'patch' | 'file',
    type: String,
    data?: any
  ): Observable<any> {
    let base;

    if (method === 'post') {
      if (
        type === 'users/login' ||
        type === 'users/register' ||
        type == 'users/validate'
      ) {
        base = this.http.post(`${this.baseUrl}/${type}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        base = this.http.post(`${this.baseUrl}/${type}`, data);
      }
    } else if (method === 'put') {
      base = this.http.put(`${this.baseUrl}/${type}`, data);
    } else if (method === 'patch') {
      base = this.http.put(`${this.baseUrl}/${type}`, data);
    } else if (method === 'delete') {
      base = this.http.delete(`${this.baseUrl}/${type}`);
    } else if (method === 'file') {
      base = this.http.post(`${this.baseUrl}/${type}`, data);
    } else {
      if (data) {
        base = this.http.get(`${this.baseUrl}/${type}`, { params: data });
      } else {
        base = this.http.get(`${this.baseUrl}/${type}`);
      }
    }

    return base;
  }

  userDetails: any;
  canNavigate() {
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails') || '')
      : '';
    let url;
    if (
      localStorage.getItem('token') &&
      this.userDetails.userType == 'SCHOOL_USER'
    ) {
      url =
        '/manage-school/school-list/school-profile-edit/' +
        this.userDetails.schoolId;
    } else if (
      localStorage.getItem('token') &&
      this.userDetails.userType == 'ADMIN_USER'
    ) {
      url = '/dashboard/admin-dashboard';
    }

    return url;
  }

  resetPassword(data: any) {
    return this.http.post<any>(
      this.baseUrl + '/users/sendResetPasswordMailLink',
      data
    );
  }
  fileDownloadRequest(url: string) {
    return this.http.get(this.baseUrl + url,{headers: {
      Authorization: `Bearer ${this.getToken()}`,
    },responseType: 'blob'});
  }
  getValidResetPasswordToken(ResetToken: string) {
    return this.http.get<any>(
      this.baseUrl + '/users/validateToken?token=' + ResetToken
    );
    // return this.http.get<any>(this.baseUrl + '/users/validateToken/token' + ResetToken);
  }

  setNewPassword(data: any) {
    return this.http.post<any>(this.baseUrl + '/users/resetPassword', data);
  }

  logout(){
    localStorage.clear();
    this._router.navigate(['']).then(() => {
      window.location.reload()
    });
  }
}
