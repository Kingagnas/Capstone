import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { RegisterRunnerComponent } from './register-runner/register-runner.component';
import { AdminComponent } from './admin/admin.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ApplicationsComponent } from './applications/applications.component';
import { RunnerComponent } from './runner/runner.component';
import { TasksComponent } from './tasks/tasks.component';
import { PostComponent } from './post/post.component';
import { ChatComponent } from './chat/chat.component';
import { ErrandHistoryComponent } from './errand-history/errand-history.component';
import { RemitanceComponent } from './remitance/remitance.component';
import { AllErrandsComponent } from './all-errands/all-errands.component';

const routes: Routes = [
  // Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'verify-user', component: VerifyUserComponent },
  { path: 'registration-runner', component: RegisterRunnerComponent },
  { path: 'post', component: PostComponent },

  // Runner routes
  { path: 'runner', component: RunnerComponent, canActivate: [AuthGuard], children: [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TasksComponent },
    { path: 'chat/:chatId', component: ChatComponent },
    { path: 'profile', component: ProfileComponent }, // Add ProfileComponent here
    { path: 'history', component: ErrandHistoryComponent }, // Add ProfileComponent here
    { path: 'remitance', component: RemitanceComponent }, // Add ProfileComponent here


    
  ] },

  // Admin routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protect admin routes
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'all-errands', component: AllErrandsComponent },
    ]
  },

  // Protected routes
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // Protect layout
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'chat', component: ChatComponent }, // Add ChatComponent here

    ]
  },

  // Catch-all route
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule { }