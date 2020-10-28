import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "chat-world/messages/:senderId/:receiverId",
    component: ChatComponent,
  },
  {
    path: "chat-world/:userId",
    component: ChatComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    redirectTo: "signup",
    pathMatch: "full"
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
