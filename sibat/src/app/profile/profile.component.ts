import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  editMode = false; // Toggle form visibility
  profileForm: FormGroup;
  averageRating: number = 0; // 🔹 New property for rating

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      location: [''],
      email: [''],
      contact_number: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.dataService.getUserProfile().subscribe(
      (data) => {
        this.user = data;

        // 🔹 If runner, store average rating
        if (data.role === 'runner') {
          this.averageRating = data.average_rating || 0;
        }

        // Populate form with user data
        if (data) {
          this.profileForm.patchValue({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            location: data.location || '',
            email: data.email || '',
            contact_number: data.contact_number || ''
          });
        }
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.dataService.uploadProfilePicture(file).subscribe(
        (response) => {
          this.user.profilepic = response.profilepic; // Update image URL
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.profileForm.patchValue({
        first_name: this.user.first_name || '',
        last_name: this.user.last_name || '',
        location: this.user.location || '',
        email: this.user.email || '',
        contact_number: this.user.contact_number || ''
      });
    }
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.dataService.updateUserProfile(this.profileForm.value).subscribe(
        (response) => {
          this.user = { ...this.user, ...this.profileForm.value };
          this.editMode = false;
        },
        (error) => {
          console.error('Update error:', error);
        }
      );
    }
  }

  // 🔹 Helper to create array for stars
  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
}
