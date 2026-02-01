import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = "https://sibatapi2.loophole.site/Capstone/backend/routes.php";

  constructor(private http: HttpClient) {}

  // Login Request
  login(loginData: { username: string; password: string }): Observable<any> {
    return new Observable((observer) => {
      this.http.post<any>(`${this.apiUrl}?route=auth/login`, loginData).subscribe(
        (data) => {
          if (data.token && data.role) {
            // 🔹 Store the JWT token, user role, and userid in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userid', data.userid || data.uid || '');

            observer.next(data);
            observer.complete();
          } else {
            observer.error({ error: 'Login failed' });
          }
        },
        (error) => {
          console.error('Login error:', error);
          observer.error({ error: 'Something went wrong' });
        }
      );
    });
  }

  

  // Register Request
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?route=auth/register`, userData);
  }

  verifyUser(data: { email: string; verification_code: string }) {
    return this.http.post<any>(`${this.apiUrl}?route=verify-email`, data);
  }
  
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve JWT token
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'User not logged in' });
      });
    }
  
    return this.http.get<any>(`${this.apiUrl}?route=getUserData`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilepic', file); // Append file
  
    const token = localStorage.getItem('token');
  
    return this.http.post<any>(`${this.apiUrl}?route=uploadProfilePic`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  updateUserProfile(userData: { first_name: string; last_name: string; email: string; location: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}?route=updateUserProfile`, userData, { headers });
  }


  applyAsRunner(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // ✅ Retrieve the token
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}?route=applyAsRunner`, formData, { headers });
  }
  
  
  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}?route=getAllUsers`, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.delete(`${this.apiUrl}?route=deleteUser&userid=${userId}`, { headers });
  }


  editUser(userData: {
    userid: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    role: string;
    location: string;
  }): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}?route=editUser`, userData, { headers });
  }

  changePassword(passwordData: { userid: number; new_password: string }): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}?route=changePassword`, passwordData, { headers });
  }

  getRunnerApplications(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}?route=getRunnerApplications`, { headers });
  }

  approveApplication(applicationData: { application_id: number; userid: number }): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}?route=approveApplication`, applicationData, { headers });
  }
  
  rejectApplication(applicationId: number): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}?route=rejectApplication`, { application_id: applicationId }, { headers });
  }




  getRunnerTasks(): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}?route=getRunnerTasks`, { headers });
  }
  
  getRunnerNotifications(): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}?route=getRunnerNotifications`, { headers });
  }
  
  completeTask(taskId: number): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}?route=completeTask`, { task_id: taskId }, { headers });
  }


  createErrand(errandData: {
    collecting_location: string;
    task_description: string;
    tip: number;
    delivery_location: string;
  }): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post(`${this.apiUrl}?route=createErrand`, errandData, { headers });
  }


  checkErrandStatus(errandId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get(`${this.apiUrl}?route=checkErrandStatus&errand_id=${errandId}`, { headers });
  }

  getErrands(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get(`${this.apiUrl}?route=getErrands`, { headers });
  }

  acceptErrand(errandId: number, runnerId: number): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post(`${this.apiUrl}?route=acceptErrand`, { errand_id: errandId, runner_id: runnerId }, { headers });
  }


  fetchMessages(chatId: number): Observable<{ 
    message_id: number; 
    senderId: number; 
    sender: string; 
    content: string; 
    type: string; 
    created_at: string; 
  }[]> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get<{ 
      message_id: number; 
      senderId: number; 
      sender: string; 
      content: string; 
      type: string; 
      created_at: string; 
    }[]>(`${this.apiUrl}?route=getMessages&chatId=${chatId}`, { headers });
  }

 
  fetchChatHistory(): Observable<{ chat_id: number; name: string }[]> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      return new Observable((observer) => {
        observer.error({ error: 'Missing token' });
      });
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get<{ chat_id: number; name: string }[]>(
      `${this.apiUrl}?route=getChatHistory`,
      { headers }
    );
  }


  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`https://chatapi.loophole.site/upload`, formData);
  }




markChatAsDone(chatId: number, rating: number, rateNotes: string = ''): Observable<any> {
  return this.http.post(
    `https://chatapi.loophole.site/api/chats/${chatId}/done`,
    { rating, rateNotes }
  );
}

rateChat(chatId: number, rating: number, rateNotes: string = ''): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.post(
    `${this.apiUrl}?route=rateChat`,
    { chat_id: chatId, rating: rating, rate_notes: rateNotes },
    { headers }
  );
}

isRunner(): Observable<{ isRunner: boolean }> {
  const token = localStorage.getItem('token');
  if (!token) {
    return new Observable((observer) => {
      observer.error({ error: 'Missing token' });
    });
  }
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<{ isRunner: boolean }>(`${this.apiUrl}?route=isRunner`, { headers });
}


errandDone(chatId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}?route=errandDone`, { chat_id: chatId });
}

getIsUser(): Observable<{ isUser: boolean, userId: number | null }> {
  const token = localStorage.getItem('token');
  if (!token) {
    return new Observable((observer) => {
      observer.error({ error: 'Missing token' });
    });
  }
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<{ isUser: boolean, userId: number | null }>(`${this.apiUrl}?route=getIsUser`, { headers });
}


  // Get errands history for logged-in runner
  getErrandsHistory(): Observable<any> {
    // No authorization required since JWT was removed
    return this.http.get<any>(`${this.apiUrl}?route=getErrandsHistory`);
  }

// data.service.ts
uploadRemittanceProof(formData: FormData) {
  return this.http.post(`${this.apiUrl}?route=uploadRemittanceProof`, formData);
}























}








