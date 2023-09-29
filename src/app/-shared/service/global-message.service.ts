import { Injectable } from '@angular/core';
import { MessageService } from 'primeng-lts/api';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {

  constructor(private messageService: MessageService) { }

  addSuccessMeg(msg:any) {
    this.messageService.clear();
    this.messageService.add({severity:'success', summary:'' ,detail:msg});
  }

  addErrorMessage(msg:any){
    this.messageService.add({severity:'error', summary:'', detail:msg});
  }
}
