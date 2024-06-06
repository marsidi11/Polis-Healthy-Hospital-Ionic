import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ClinicalRecord {
  id: number;
  clinicalRecord: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicalRecordService {
  private dataUrl = 'http://localhost:8080/api/patient';  // URL to web api

  constructor(private http: HttpClient) { }

  getClinicalRecords(patientId: number): Observable<any[]> {
    return this.http.get<any>(`${this.dataUrl}/${patientId}/clinical`).pipe(
      tap(data => console.log(`Fetched clinical records for patient id=${patientId}`)),
      catchError(this.handleError<any>('getClinicalRecords'))
    );
  }

  createClinicalRecord(patientId: number, record: any): Observable<any> {
    return this.http.post<any>(`${this.dataUrl}/${patientId}/clinical`, record).pipe(
      tap(newClinicalRecord => console.log(`added clinical record for patient id=${patientId}`)),
      catchError(this.handleError<any>('addClinicalRecord'))
    );
  }

  editClinicalRecord(recordId: number, record: any): Observable<any> {
    return this.http.put<any>(`${this.dataUrl}/clinical/${recordId}`, record).pipe(
      tap(_ => console.log(`updated clinical record for patient id=${recordId}`)),
      catchError(this.handleError<any>('editClinicalRecord'))
    );
  }

  deleteClinicalRecord(recordId: number): Observable<any> {
    return this.http.delete<any>(`${this.dataUrl}/clinical/${recordId}`).pipe(
      tap(_ => console.log(`deleted clinical record id=${recordId} for patient id=${recordId}`)),
      catchError(this.handleError<any>('deleteClinicalRecord'))
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
