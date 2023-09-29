import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsListComponent } from './events-list/events-list.component';
import { EventAddComponent } from './event-add/event-add.component';
import { EventEditComponent } from './event-edit/event-edit.component';



@NgModule({
  declarations: [EventsListComponent, EventAddComponent, EventEditComponent],
  imports: [
    CommonModule
  ]
})
export class ManageEventsModule { }
