import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-runner',
    templateUrl: './runner.component.html',
    styleUrls: ['./runner.component.css']
})
export class RunnerComponent implements OnInit {
    isMobile = false;

    constructor(private dataService: DataService, private router: Router) {}

    ngOnInit() {
        this.isMobile = window.innerWidth <= 768;
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }


navigateToFirstChat() {
  this.dataService.fetchChatHistory().subscribe(
    (chatHistory) => {
      if (chatHistory.length > 0) {
        const firstChat = chatHistory[0];
        this.router.navigate(['/runner/chat', firstChat.chat_id]);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Chats',
          text: 'There are no chats available.',
          confirmButtonText: 'OK'
        });
      }
    },
    (error) => {
      console.error('Error fetching chat history:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load chats. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  );
}

logout() {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear JWT and any stored user data
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('jwt');
      localStorage.removeItem('token');

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        showConfirmButton: false,
        timer: 1500
      });

      // Redirect to login page
      this.router.navigate(['/login']);
    }
  });
}
}