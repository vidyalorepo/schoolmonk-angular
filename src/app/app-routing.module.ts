import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { CancellationRefundPolicyComponent } from './cancellation-refund-policy/cancellation-refund-policy.component';
import { CommonSearchComponent } from './common-search/common-search.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { HomeComponent } from './home/home.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RouteGuardService } from './router-guard-service';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AddSchoolComponent } from './add-school/add-school.component';
import { HelpDaskComponent } from './help-dask/help-dask.component';
import { SuitableSchoolComponent } from './suitable-school/suitable-school.component';

const routes: Routes = [
 
  // { path: '', redirectTo: '/auth/home', pathMatch: 'full' },
  { path: 'notice-details/:id', component: NoticeDetailsComponent },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home-mod/home-mod.module').then((m) => m.HomeModModule),
      },
    ]
    
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      // {
      //   path: 'home', component: HomeComponent,
      //   data: {
      //     seo: {
      //       title: 'Vidyalo',
      //       metaTags: [
      //         { property: 'og:title', content: 'vidyalo' },
      //         { name: 'keywords', content: 'kendriya vidyalaya,private schools near me,play school near me,international school,kindergarten near me,military school,best private schools in WB' },
      //         { name: 'description', content: 'Schools in West Bengal along with address and details of school. Vidyalo gives you the information on top English Medium Schools in Kolkata, Govt English Medium School, Private English Medium School etc.' }
      //         // { proprety: 'og:description', content: 'Some description goes here!!!!' },
      //       ]
      //     }
      //   }
      // },
      { path: 'notice-details/:id', component: NoticeDetailsComponent },
      { path: 'common-search/:schoolName', component: CommonSearchComponent, data: { breadcrumb: `Home >> Schools` } },
      { path: 'faq-details', component: FaqListComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'suitable-school', component: SuitableSchoolComponent },
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
      { path: 'cancellation-refund-policy', component: CancellationRefundPolicyComponent },
      { path: 'cookie-policy', component: CookiePolicyComponent },
      {path:'about-us',component:AboutUsComponent},
      {path:'add-school',component:AddSchoolComponent},
      {path:'help-desk',component:HelpDaskComponent},
      {
        path: 'home-details',
        loadChildren: () =>
          import('./home-details/home-details.module').then(
            (m) => m.HomeDetailsModule
          ),
      },
      {
        path: 'search-details',
        loadChildren: () =>
          import('./search-details/search-details.module').then(
            (m) => m.SearchDetailsModule
          ),
      },
      {
        path: 'student',
        loadChildren: () =>
          import('./main/student/student.module').then((m) => m.StudentModule),
      },
      {
        path: 'admission',
        loadChildren: () =>
          import('./main/admin/admission/admission.module').then(
            (m) => m.AdmissionModule
          ),
      },
      // {
      //   path: 'testimonials', loadChildren: () => import('./testimonials/testimonials.module').then((m) => m.TestimonialsModule)
      // },
      {
        path: 'testimonials',
        loadChildren: () =>
          import('./testimonials/testimonials.module').then(
            (m) => m.TestimonialsModule
          ),
      },
      {
        path: 'advertisements',
        loadChildren: () =>
        import('./advertisements/advertisements.module').then(
          (m) => m.AdvertisementsModule
        ),
      },
      
      {
        path: 'unconventional-courses',
        loadChildren: () =>
          import('./advanced-courses/advanced-courses.module').then(
            (m) => m.AdvancedCoursesModule
          ),
      },
      {
        path: 'scholarships-programs',
        loadChildren: () =>
          import('./progressive-programs/progressive-programs.module').then(
            (m) => m.ProgressiveProgramsModule
          ),
      },
      {
        path: 'study-abroad',
        loadChildren: () =>
          import('./online-education/online-education.module').then(
            (m) => m.OnlineEducationModule
          ),
      },
      {
        path: 'exam-tips',
        loadChildren: () =>
          import('./international-students/international-students.module').then(
            (m) => m.InternationalStudentsModule
          ),
      },
      {
        path:'news-articles',
        loadChildren:()=>
        import('./news-artical-home/news-artical-home.module').then(
          (m)=>m.NewsArticalHomeModule
        ),
      }
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'report',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('./main/admin/report/report.module').then(
            (m) => m.ReportModule
          ),
      },
      {
        path: 'list',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('./main/admin/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'admission',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/admission/admission.module').then(
            (m) => m.AdmissionModule
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('./main/admin/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'manage-school',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-school/manage-school.module').then(
            (m) => m.ManageSchoolModule
          ),
      },
      {
        path: 'manage-student',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-student/manage-student.module').then(
            (m) => m.ManageStudentModule
          ),
      },
      {
        path: 'manage-issues',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-issue/manage-issue.module').then(
            (m) => m.ManageIssueModule
          ),
      },

      {
        path: 'manage-infrastructure',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import(
            './main/admin/manage-infrastructure/manage-infrastructure.module'
          ).then((m) => m.ManageInfrastructureModule),
      },
      {
        path: 'manage-notice',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-notice/manage-notice.module').then(
            (m) => m.ManageNoticeModule
          ),
      },
      {
        path: 'manage-testimonials',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-testimonials/manage-testimonials.module').then(
            (m) => m.ManageTestimonialsModule
          ),
      },
      {
        path: 'payment',
        canActivate: [AuthGuardService],
        loadChildren: () =>
          import('./main/admin/payment/payment.module').then(
            (m) => m.PaymentModule
          ),
      },
      {
        path: 'manage-feedback',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-feedback/manage-feedback.module').then(
            (m) => m.ManageFeedbackModule
          ),
      },
      {
        path: 'manage-subscription',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-subscription/manage-subscription.module').then(
            (m) => m.ManageSubscriptionModule
          ),
      },
      {
        path: 'manage-student-bulk',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren: () =>
          import('./main/admin/manage-student-bulk/manage-student-bulk.module').then(
            (m) => m.ManageStudentBulkModule
          ),
      },
      {
        path:'news-artical',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/news-articles/news-articles.module').then(
          (m)=>m.NewsArticlesModule
        )
      },
      {
        path:'review',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/manage-review/manage-review.module').then(
          (m)=>m.ManageReviewModule
        )
      },
      {
        path:'blog',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/manage-blog/manage-blog.module').then(
          (m)=>m.ManageBlogModule
        )
      },
      {
        path:'advertisement',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/manage-advertisement/manage-advertisement.module').then(
          (m)=>m.ManageAdvertisementModule
        )
      },
      {
        path:'header-tag',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/manage-header-tag/manage-header-tag.module').then(
          (m)=>m.ManageHeaderTagModule
        )
      },
      {
        path:'guardian-enquiry',
        canActivate: [AuthGuardService, RouteGuardService],
        loadChildren:()=>
        import('./main/admin/manage-guardian-enquiry/manage-guardian-enquiry.module').then(
          (m)=>m.ManageGuardianEnquiryModule
        )
      }
    ],
  },
  // { path: '**', redirectTo: '/auth/home', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },

  // { path: 'home', component: HomeComponent },
  // { path: 'common-search/:schoolName', component: CommonSearchComponent },
  // { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  // {path: 'dashboard', loadChildren: () => import('./main/admin/dashboard/dashboard.module').then(m => m.DashboardModule)},
  // {path: 'report', loadChildren : () => import('./main/admin/report/report.module').then(m => m.ReportModule)},
  // {path: 'list', loadChildren : () => import('./main/admin/list/list.module').then(m => m.ListModule)},
  // {path: 'admission',loadChildren :() => import('./main/admin/admission/admission.module').then(m => m.AdmissionModule)},
  // {path: 'profile', loadChildren : () => import('./main/admin/profile/profile.module').then(m =>m.ProfileModule)},
  // {path: 'manage-school', loadChildren : () => import('./main/admin/manage-school/manage-school.module').then(m => m.ManageSchoolModule)},
  // {path: 'manage-student', loadChildren : () => import('./main/admin/manage-student/manage-student.module').then(m => m.ManageStudentModule)},
  // {path: 'home-details', loadChildren : () => import('./home-details/home-details.module').then(m => m.HomeDetailsModule)},
  // {path: 'search-details', loadChildren : () => import('./search-details/search-details.module').then(m => m.SearchDetailsModule)},
  // {path: 'student', loadChildren : () => import('./main/student/student.module').then(m => m.StudentModule)},
  // {path: 'manage-infrastructure', loadChildren : () => import('./main/admin/manage-infrastructure/manage-infrastructure.module').then(m => m.ManageInfrastructureModule)},

  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
      initialNavigation: 'enabled',
    }),
  ],
  providers: [AuthGuardService, RouteGuardService],
  exports: [RouterModule],
})
export class AppRoutingModule { 
  constructor(){
  }
}
