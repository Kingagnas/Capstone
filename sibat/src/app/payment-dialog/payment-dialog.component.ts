import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  proofFile: File | null = null;
  runnerId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { amount: number, weekStart: string, weekEnd: string },
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // Decode JWT to get runner ID exactly like TasksComponent
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'You are not logged in.', 'error');
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      // SAME logic as TasksComponent
      this.runnerId = decodedToken.userid || decodedToken.uid || decodedToken.id;

      if (!this.runnerId) {
        Swal.fire('Error', 'Unable to determine your runner ID. Please log in again.', 'error');
        console.error('Decoded JWT but no runner ID found:', decodedToken);
      } else {
        console.log('Runner ID decoded from JWT:', this.runnerId);
      }

    } catch (err) {
      console.error('Error decoding JWT:', err);
      Swal.fire('Error', 'Failed to decode token. Please log in again.', 'error');
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.proofFile = event.target.files[0];
    }
  }

  submitPayment() {
    if (!this.runnerId) {
      Swal.fire('Error', 'Cannot determine runner ID.', 'error');
      return;
    }

    if (!this.proofFile) {
      Swal.fire('Error', 'Please upload proof of payment.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('proof', this.proofFile);
    formData.append('weekStart', this.data.weekStart);
    formData.append('weekEnd', this.data.weekEnd);
    formData.append('runnerId', this.runnerId.toString()); // send same runnerId as TasksComponent

    this.dataService.uploadRemittanceProof(formData).subscribe(
      (res: any) => {
        if (res.success) {
          Swal.fire('Success', res.message, 'success').then(() => {
            this.dialogRef.close(true);
          });
        } else {
          Swal.fire('Error', res.error || 'Upload failed', 'error');
        }
      },
      (err) => {
        console.error('Upload error:', err);
        Swal.fire('Error', 'Upload failed. Please try again.', 'error');
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
