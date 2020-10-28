import { Component, ElementRef, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { MessageService } from 'src/app/services/message.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  currentUser: User;
  otherUsers: User[];
  messages: Message[];
  senderId: string;
  receiverId: string;
  localStorageUser;
  /** AUTO SCROLLING CODE START (VARIABLE DECLARATIONS)
     * ( Element -> Scrollable div or element)
     * GOAL: since 'ngAfterViewChecked()' executes every almost 20 seconds. so if you scroll up and wait then it will scroll at the bottom within 20 sec
     * which we don't want.
     * ----- SOLUTION TO PREVENT THIS ISSUE ---
     * Logic: Element will scroll on component load and at the time of component we will store all the messages on 'messages' variable
     * but once all the messages will be shown
     * then we check the difference between the new message (fetched from database) and 'messages' variable (which stored old messages)
     * and set the 'numberOfMessagesChanged' as condition.
     * if there is difference that means messages are updated so we will scroll again otherwise not.
     */
  numberOfMessagesChanged: boolean;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  private iterableDiffer;
  /** AUTO SCROLLING CODE START */

  //VARIABLE FOR TARGETTING THE INPUT MESSAGE FIELD BY ID : #messageInput WHICH IS USED TO CLEAR THE INPUT TEXT AFTER SENDING THE MESSAGE
  @ViewChild('messageInput') private messageInputField: ElementRef;

  socket;

  /** CONSTRUCTOR START */
  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService, private messageService: MessageService,
    private iterableDiffers: IterableDiffers
  ) {
    this.senderId = undefined;
    this.receiverId = undefined;
    //initialization of iterale differences
    this.iterableDiffer = this.iterableDiffers.find([]).create(null);

    //socket initialization
    this.socket = io("http://localhost:3000");


    //GET THE LOGGED IN USER FROM LOCAL STORAGE AND CHECK IF USER HAS NOT LOGGED IN THEN REDIRECT TO LOGIN PAGE
    this.localStorageUser = localStorage.getItem('USER');
    if (!this.localStorageUser) {
      // user not found in local storage, so let's redirect to login page
      this.router.navigate(['/login']);
    }
  }
  /** CONSTRUCTOR END */

  /** ngOnInit() method executes on page load or component load */
  ngOnInit(): void {

    
    //parsing the localStorage in json format to use it's properties
    this.currentUser = JSON.parse(this.localStorageUser);
    this.senderId = this.currentUser._id;

    //FIND ALL THE MESSAGES
    this.route.params.subscribe(
      (params: Params) => {
        if (params.senderId && params.receiverId) {
          this.senderId = params.senderId;
          this.receiverId = params.receiverId;
          this.showConversation(params.senderId, params.receiverId);
        } else {
          this.messages = undefined;
        }
      }
    )


    //GET ALL THE USERS
    this.userService.findAllUsers().subscribe((usersResult: any) => {
      if (usersResult) {
        //this user result is including the current logged in user
        this.otherUsers = usersResult.result;//get all the users from the result usersResult : is json type
      }
    });


  
    /** --- SOCKET EMIT HANDLER ---- */
    this.socket.on('NewMessageAdded', () => {
      this.showConversation(this.senderId, this.receiverId);
    });

    this.socket.on('AMessageDeleted', () => {
      this.showConversation(this.senderId, this.receiverId);
    });
    /** --- SOCKET EMIT HANDLER ---- */
  }
  /** ngOnInit code end here */


  /** AUTO SCROLLING CODE START */
  ngDoCheck(): void {
    if (this.iterableDiffer.diff(this.messages)) {
      this.numberOfMessagesChanged = true;
    }
  }

  ngAfterViewChecked(): void {
    // this.showConversation(this.senderId, this.receiverId);
    const isScrolledDown = Math.abs(this.myScrollContainer.nativeElement.scrollHeight - this.myScrollContainer.nativeElement.scrollTop - this.myScrollContainer.nativeElement.clientHeight) <= 3.0;

    if (this.numberOfMessagesChanged && !isScrolledDown) {
      this.scrollToBottom();
      this.numberOfMessagesChanged = false;
    }
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  }
  isBottomScrollable() {
    let element = this.myScrollContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (atBottom) {
      return false;
    } else {
      return true;
    }
  }
  /** AUTO SCROLLING CODE END */

  //logout
  logout() {
    //logout means simply clear the local storage and navigate user to login page
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  //find the conversations between sender and selected user i.e. receiver
  showConversation(senderId: string, receiverId: string) {
    if (receiverId !== "" && senderId !== "") {
      //now let's find the messages/conversations
      this.messageService.findConversations(senderId, receiverId).subscribe((messagesResult: any) => {
        if (messagesResult) {
          if (messagesResult.status == true) {
            //messages found with no error
            this.messages = messagesResult.result;
          } else {
            // error occure
            this.messages = undefined;
          }
        } else {
          // error occure
          this.messages = undefined;
        }
      });
    }
  }

  //send a message
  sendMessage(message: string) {
    if (((this.senderId !== "" || this.receiverId !== "") || (typeof this.receiverId !== 'undefined' || typeof this.senderId !== 'undefined')) && message.trim() != "") {
      this.messageService.sendMessage(this.senderId, this.receiverId, message).subscribe((messageSentResult: any) => {
        if (messageSentResult) {
          //now clear text from input
          this.resetInputMessage();
        }
      });
    }
  }

  //this method will clear the input text to after sending the message
  resetInputMessage() {
    this.messageInputField.nativeElement.value = "";
  }

  //delete a message by messageId and senderId , for the security that message belongs to this user or not who is deleting the message
  deleteMessage(messageId: string) {
    this.messageService.deleteMessage(messageId, this.senderId).subscribe((response: any) => {
      //nothing to do
    });
  }
}
