import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private dataUrl = 'assets/data.json';  // URL to web api

  constructor(private http: HttpClient) { }

  getAdmissions(patientId: number): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => {
        const patient = data.patients.find((p: any) => p.id === patientId);
        return patient ? patient.admissions : [];
      }),
      catchError(this.handleError<any[]>('getAdmissions', []))
    );
  }

  createAdmission(patientId: number, admission: any): Observable<any> {
    // Here you would normally post to the backend
    return of(admission).pipe(
      tap(newAdmission => console.log(`created admission for patient w/ id=${patientId} with admission id=${newAdmission.id}`)),
      catchError(this.handleError<any>('createAdmission'))
    );
  }

  editAdmission(patientId: number, admission: any): Observable<any> {
    // Here you would normally put to the backend
    return of(admission).pipe(
      tap(_ => console.log(`updated admission id=${admission.id} for patient id=${patientId}`)),
      catchError(this.handleError<any>('editAdmission'))
    );
  }

  deleteAdmission(patientId: number, admissionId: number): Observable<any> {
    // Here you would normally delete from the backend
    return of({ id: admissionId }).pipe(
      tap(_ => console.log(`deleted admission id=${admissionId} for patient id=${patientId}`)),
      catchError(this.handleError<any>('deleteAdmission'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
