import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginInfo: string;
  emailError: string;
  passwordError: string;
  userInLocalStorage: User;
  constructor(private userService: UserService, private router: Router) {
    this.loginInfo = "";
    this.userInLocalStorage = localStorage.getItem('USER');
    if (this.userInLocalStorage != null) {
      //this is user object
      this.userInLocalStorage = JSON.parse(this.userInLocalStorage);
      //now since user is logged in already that means user is in session so let's redirect to the chat page
      router.navigate(['/chat-world/' + this.userInLocalStorage._id]);
    } else {
      console.log("User has not logged in...");
    }
  }

  ngOnInit(): void {
  }

  loginUser(email: string, password: string) {
    if (email.trim() === "") {
      this.emailError = "Please enter your email!";
    } else if (password.trim() === "") {
      this.emailError = "";
      this.passwordError = "Please enter your password!";
    } else if (password.length < 7) {
      this.emailError = "";
      this.passwordError = "Password must contains minimum 8 chars.";
    } else {
      this.emailError = "";
      this.passwordError = "";
      this.userService.login(email, password).subscribe((loggedInUserResult: any) => {
        if (loggedInUserResult) {
          //check for any error message
          this.loginInfo = "";
          if (loggedInUserResult.status) {
            //status is true, means user has logged in
            //now add loggedIn user in session
            localStorage.setItem('USER', JSON.stringify(loggedInUserResult.result));
            //now reload the current window
            window.location.reload();
          } else {
            //false, means error occure
            this.loginInfo = loggedInUserResult.message;
          }
        }
      });
    }

  }

}
