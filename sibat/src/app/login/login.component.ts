import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VerifyUserComponent } from '../verify-user/verify-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  // Registration Fields
  firstName = '';
  lastName = '';
  username = '';
  registerEmail = '';
  contactNumber = '';
  registerPassword = '';
  role = 'user'; // Default role

  errorMessage = '';
  isRegisterMode = false; // Controls animation

  constructor(
    private dataService: DataService, 
    private snackBar: MatSnackBar, 
    private dialog: MatDialog,
    private router: Router // 🔹 Inject Router for navigation



  ) {}

  toggleForm() {
    this.isRegisterMode = !this.isRegisterMode;
  }
  onSubmitLogin() {
  if (!this.username || !this.password) {
    this.snackBar.open('Username and password are required', 'Close', { duration: 3000 });
    return;
  }

  const loginData = {
    username: this.username,
    password: this.password
  };

  this.dataService.login(loginData).subscribe(
    (response) => {
      this.snackBar.open('Login Successful', 'Close', { duration: 3000 });

      // 🔹 Store token, role, and userid in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userid', response.userid || response.uid || '');

      // 🔹 Log the stored userid to check
      console.log('Stored userid in localStorage:', localStorage.getItem('userid'));

      // 🔹 Redirect user based on their role
      switch (response.role) {
        case 'user':
          this.router.navigate(['/home']);
          break;
        case 'runner':
          this.router.navigate(['/runner']);
          break;
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/home']); // Default to home if role is unknown
      }
    },
    (error) => {
      this.snackBar.open(error.error || 'Invalid username or password', 'Close', { duration: 3000 });
    }
  );
}

  
  
  

  onSubmitRegister() {
    const userData = {
      first_name: this.firstName,
      last_name: this.lastName,
      username: this.username,
      email: this.registerEmail,
      contact_number: this.contactNumber,
      password: this.registerPassword,
      role: this.role
    };

    this.dataService.register(userData).subscribe(
      (response) => {
        this.snackBar.open('Registration Successful! Please verify your email.', 'Close', { duration: 3000 });
        
        this.dialog.open(VerifyUserComponent, {
          width: '600px',
          data: { email: this.registerEmail }
        });
        console.log(response);
      },
      (error) => {
        this.errorMessage = 'Registration Failed';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      }
    );
  }
}
