import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  private apiUrl = 'http://localhost:8080/ratings';

  constructor(private http: HttpClient) {}

  getRatings(page: number = 1, limit: number = 5): Observable<{ ratings: Rating[], total: number }> {
    return this.http.get<{ ratings: Rating[], total: number }>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getRatingsByCalendar(calendarId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/calendar/${calendarId}`);
  }

  createRating(rating: Partial<Rating>): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating);
  }

  updateRating(id: string, rating: Partial<Rating>): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${id}`, rating);
  }

  deleteRating(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
