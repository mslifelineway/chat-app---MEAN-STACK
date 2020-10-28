import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpInfo: string;
  nameError: string;
  emailError: string;
  passwordError: string;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
  }

  signUp(name: string, email: string, password: string) {

    if (name.trim() === "") {
      this.nameError = "Please enter your name!";
    } else if (email.trim() === "") {
      this.nameError = "";
      this.emailError = "Please enter your email!";
    } else if(password.trim() === "") {
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "Please enter your password!";
    } else if(password.trim().length < 7) {
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "Password must contains minimum 8 chars.";
    } else {
      //everything is ok , then signing up
      this.nameError = "";
      this.emailError = "";
      this.passwordError = "";
      //call a method in user service to signUp
      this.userService.signUp(name, email, password).subscribe((registeredUserResult: any) => {
        if(registeredUserResult) {
          //check for any error message
          
          if (registeredUserResult.status) {
            //status is true, means user has registered successfully
            //simply show an info that account created
            this.signUpInfo = "Account registered successfully!";
          } else {
            //false, means error occure
            this.signUpInfo = registeredUserResult.message;
          }
        }
      });
    }

  }

}
