import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private dataUrl = 'http://localhost:8080/api/patient';  // URL to web api

  constructor(private http: HttpClient) { }

  getPatients(): Observable<any[]> {
    return this.http.get<any>(`${this.dataUrl}`).pipe(
      map(response => response.content),
      tap(data => console.log('Data received:', data)),
      catchError(this.handleError<any[]>('getPatients', []))
    );
  }

  // getPatient(patientId: number): Observable<any> {
  //   return this.http.get<any>(`${this.dataUrl}/${patientId}`).pipe(
  //     tap(data => console.log(`Fetched patient id=${patientId}`)),
  //     catchError(this.handleError<any>('getPatient'))
  //   );
  // }

  createPatient(patient: any): Observable<any> {
    return this.http.post<any>(this.dataUrl, patient).pipe(
      tap(newPatient => console.log(`created patient w/ id=${newPatient.id}`)),
      catchError(this.handleError<any>('createPatient'))
    );
  }

  editPatient(patientId: number, patient: any): Observable<any> {
    return this.http.put<any>(`${this.dataUrl}/${patientId}`, patient).pipe(
      tap(_ => console.log(`updated patient id=${patientId}`)),
      catchError(this.handleError<any>('editPatient'))
    );
  }

  deletePatient(patientId: number): Observable<any> {
    return this.http.delete<any>(`${this.dataUrl}/${patientId}`).pipe(
      tap(_ => console.log(`deleted patient id=${patientId}`)),
      catchError(this.handleError<any>('deletePatient'))
    );
  }

  dischargePatient(patientId: number, dischargeReason: string): Observable<any> {
    const url = `${this.dataUrl}/${patientId}/discharge`;
    const body = { dischargeReason };
    return this.http.put<any>(url, body).pipe(
      tap(_ => console.log(`discharged patient id=${patientId} with reason=${dischargeReason}`)),
      catchError(this.handleError<any>('dischargePatient'))
    );
  }

  request(method: string, url: string, body?: any): Observable<any> {
    return this.http.request<any>(method, url, { body }).pipe(
      tap(_ => console.log(`Made ${method} request to ${url}`)),
      catchError(this.handleError<any>('request'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Log the error to the console
      console.error(`Failed to ${operation}: ${error.message}`);
  
      // If the error response has a status, log that as well
      if (error.status) {
        console.error(`Status code: ${error.status}`);
      }
  
      // If the error response has an error object, log that as well
      if (error.error) {
        console.error(error.error);
      }
  
      // Return the provided default result
      return of(result as T);
    };
  }
}