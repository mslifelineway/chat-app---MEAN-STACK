
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private webReqService: WebRequestService) { }

  //login user
  login(email: string, password: string) {
   return this.webReqService.post("users/login", { email, password });
  }

  //find all the users
  findAllUsers() {
    return this.webReqService.get("users");
  }

  //register new user
  signUp(name: string, email: string, password: string) {
    return this.webReqService.post('users/register', { name, email, password });
  }
}
