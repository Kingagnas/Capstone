import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-errand-history',
  templateUrl: './errand-history.component.html',
  styleUrls: ['./errand-history.component.css']
})
export class ErrandHistoryComponent implements OnInit {
  chatHistory: any[] = [];
  filteredHistory: any[] = [];
  statusFilter: string = ''; // filter by status

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.loadChatHistory();
  }

  loadChatHistory() {
    this.ds.getErrandsHistory().subscribe({
      next: (res) => {
        this.chatHistory = res.chat_history;  // store all history
        this.applyFilter();                   // apply any filter
      },
      error: (err) => {
        console.error('Failed to load chat history', err);
      }
    });
  }

  applyFilter() {
    if (this.statusFilter) {
      this.filteredHistory = this.chatHistory.filter(ch => ch.status === this.statusFilter);
    } else {
      this.filteredHistory = [...this.chatHistory];
    }
  }

  // Handle filter change from dropdown
  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value;
    this.applyFilter();
  }
}
