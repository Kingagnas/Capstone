import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  detailsForm: FormGroup;

  collectingMap: L.Map | null = null;
  deliveryMap: L.Map | null = null;
  collectingMarker: L.Marker | null = null;
  deliveryMarker: L.Marker | null = null;

  basePrice: number = 50;       // Base price
  deliveryCharge: number = 50;  // Delivery charge
  serviceCharge: number = 0;    // 10% of base + delivery
  totalPrice: number = 0;       // Total including tip

  mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: L.latLng(14.5995, 120.9842) // Manila coordinates
  };

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    this.detailsForm = this.fb.group({
      collectingLocation: ['', Validators.required],
      taskDescription: ['', Validators.required],
      tip: [0, [Validators.required, Validators.min(0)]],
      deliveryLocation: ['', Validators.required],
      collectingLatLng: [''],
      deliveryLatLng: ['']
    });

    // Recalculate total whenever tip changes
    this.detailsForm.get('tip')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initializeMaps();
      this.calculateTotalPrice(); // Initial calculation
    }, 100);
  }

  initializeMaps() {
    // Initialize collecting map
    this.collectingMap = L.map('collectingMap', this.mapOptions);
    this.deliveryMap = L.map('deliveryMap', this.mapOptions);

    // Add click handlers if needed
  }

  handleMapClick(e: L.LeafletMouseEvent, mapType: 'collecting' | 'delivery') {
    if (mapType === 'collecting') {
      if (this.collectingMarker) this.collectingMap?.removeLayer(this.collectingMarker);
      this.collectingMarker = L.marker(e.latlng).addTo(this.collectingMap!);
      this.detailsForm.patchValue({ collectingLatLng: `${e.latlng.lat},${e.latlng.lng}` });
    } else {
      if (this.deliveryMarker) this.deliveryMap?.removeLayer(this.deliveryMarker);
      this.deliveryMarker = L.marker(e.latlng).addTo(this.deliveryMap!);
      this.detailsForm.patchValue({ deliveryLatLng: `${e.latlng.lat},${e.latlng.lng}` });
    }
  }

  calculateTotalPrice() {
    const tip = Number(this.detailsForm.get('tip')?.value) || 0;

    // Service charge = 10% of (base price + delivery)
    this.serviceCharge = Number(((this.basePrice + this.deliveryCharge) * 0.10).toFixed(2));

    // Total price = base + delivery + service charge + tip
    this.totalPrice = Number((this.basePrice + this.deliveryCharge + this.serviceCharge + tip).toFixed(2));
  }

  onStepChange(event: any) {
    if (event.selectedIndex === 1) {
      this.calculateTotalPrice();
    }
  }

  submitErrand() {
    if (!this.detailsForm.valid) return;

    const errandData = {
      collecting_location: this.detailsForm.get('collectingLocation')?.value,
      collecting_latlng: this.detailsForm.get('collectingLatLng')?.value,
      task_description: this.detailsForm.get('taskDescription')?.value,
      tip: Number(this.detailsForm.get('tip')?.value),
      delivery_location: this.detailsForm.get('deliveryLocation')?.value,
      delivery_latlng: this.detailsForm.get('deliveryLatLng')?.value,
      total_price: this.totalPrice,
      service_charge: this.serviceCharge
    };

    this.dataService.createErrand(errandData).subscribe(
      (response: any) => {
        if (!response?.errand_id) {
          Swal.fire('Error', 'Unexpected server response', 'error');
          return;
        }

        const errandId = response.errand_id;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Errand posted successfully!',
        }).then(() => {
          Swal.fire({
            title: 'Waiting for a runner...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          const polling = setInterval(() => {
            this.dataService.checkErrandStatus(errandId).subscribe(
              (status: any) => {
                if (status?.is_accepted === 1) {
                  clearInterval(polling);

                  Swal.fire(
                    'Runner Found!',
                    `A Sibat Runner accepted your errand.`,
                    'info'
                  ).then(() => {
                    this.router.navigate(['/chat']);
                  });
                }
              },
              (error) => {
                console.error('Error checking errand status:', error);
              }
            );
          }, 5000);
        });
      },
      (error) => {
        console.error('Failed to post errand', error);
        Swal.fire('Error', 'Failed to post errand', 'error');
      }
    );
  }
}
