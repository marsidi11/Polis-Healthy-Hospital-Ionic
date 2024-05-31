import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private dataUrl = 'assets/data.json';  // URL to web api

  constructor(private http: HttpClient) { }

  getPatients(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.patients),
      catchError(this.handleError<any[]>('getPatients', []))
    );
  }

  createPatient(patient: any): Observable<any> {
    // Here you would normally post to the backend
    return of(patient).pipe(
      tap(newPatient => console.log(`created patient w/ id=${newPatient.id}`)),
      catchError(this.handleError<any>('createPatient'))
    );
  }

  editPatient(patient: any): Observable<any> {
    // Here you would normally put to the backend
    return of(patient).pipe(
      tap(_ => console.log(`updated patient id=${patient.id}`)),
      catchError(this.handleError<any>('editPatient'))
    );
  }

  deletePatient(id: number): Observable<any> {
    // Here you would normally delete from the backend
    return of({ id }).pipe(
      tap(_ => console.log(`deleted patient id=${id}`)),
      catchError(this.handleError<any>('deletePatient'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
