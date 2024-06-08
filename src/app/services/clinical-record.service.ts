import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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

  createClinicalRecord(patientId: number, record: string): Observable<ClinicalRecord> {
    const body = { clinicalRecord: record };
    return this.http.post<ClinicalRecord>(`${this.dataUrl}/${patientId}/clinical`, body).pipe(
      tap(newClinicalRecord => console.log(`Added clinical record for patient id=${patientId}`)),
      catchError(this.handleError<ClinicalRecord>('addClinicalRecord'))
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
      tap(_ => console.log(`deleted clinical record id=${recordId}`)),
      catchError(this.handleError<any>('deleteClinicalRecord'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = `Failed to ${operation}: ${error.message}`;
      if (error.error) {
        errorMessage = `${error.error.message || errorMessage}`;
      }
      return throwError(errorMessage);
    };
  }
}
