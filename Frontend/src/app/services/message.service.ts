import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private webReqService: WebRequestService) { }

  //find conversations by two ids (sender id and receiver id)
  findConversations(senderId: string, receiverId: string) {
    return this.webReqService.get('messages/' + senderId + "/" + receiverId);
  }

  //send a message or save a message
  sendMessage(senderId: string, receiverId: string, message: string) {
    return this.webReqService.post("messages", { senderId, receiverId, message});
  }

  //delete a message
  deleteMessage(messageId: string, senderId: string) {
    return this.webReqService.delete("messages/" + messageId + "/" + senderId);
  }
}
