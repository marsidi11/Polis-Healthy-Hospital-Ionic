import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClinicalRecordService {
  private dataUrl = 'assets/data.json';  // URL to web api

  constructor(private http: HttpClient) { }

  getClinicalRecords(patientId: number): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => {
        const patient = data.patients.find((p: any) => p.id === patientId);
        return patient ? [patient.clinicalRecord] : [];
      }),
      catchError(this.handleError<any[]>('getClinicalRecords', []))
    );
  }

  addClinicalRecord(patientId: number, record: any): Observable<any> {
    return of(record).pipe(
      tap(newRecord => console.log(`added clinical record for patient id=${patientId}`)),
      catchError(this.handleError<any>('addClinicalRecord'))
    );
  }

  editClinicalRecord(patientId: number, record: any): Observable<any> {
    return of(record).pipe(
      tap(_ => console.log(`updated clinical record for patient id=${patientId}`)),
      catchError(this.handleError<any>('editClinicalRecord'))
    );
  }

  deleteClinicalRecord(patientId: number, recordId: number): Observable<any> {
    return of({ id: recordId }).pipe(
      tap(_ => console.log(`deleted clinical record id=${recordId} for patient id=${patientId}`)),
      catchError(this.handleError<any>('deleteClinicalRecord'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
