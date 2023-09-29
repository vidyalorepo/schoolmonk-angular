import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolSubscriptionComponent } from './school-subscription/school-subscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UpgradeSubscriptionComponent } from './upgrade-subscription/upgrade-subscription.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';

export const route: Routes = [
  { path: 'school-subscription', component: SchoolSubscriptionComponent },
  { path: 'upgrade-subscription', component: UpgradeSubscriptionComponent },
  { path: 'view-subscription', component: SubscriptionDetailsComponent }
];

@NgModule({
  declarations: [SchoolSubscriptionComponent, UpgradeSubscriptionComponent, SubscriptionDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ManageSubscriptionModule { }
