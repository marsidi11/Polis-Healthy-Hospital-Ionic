import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Department {
  id: number;
  name: string;
}

export interface Admission {
  patientId: number;
  departmentId: number;
  cause: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private departmentsUrl = 'assets/data.json';  // URL to web api
  private admissions: Admission[] = []; // In-memory storage for admissions

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(this.departmentsUrl).pipe(
      map(data => data.departments),
      catchError(this.handleError<Department[]>('getDepartments', []))
    );
  }

  admitPatient(admission: Admission): Observable<Admission> {
    this.admissions = this.admissions.filter(a => a.patientId !== admission.patientId);
    this.admissions.push(admission);
    return of(admission).pipe(
      tap(_ => console.log(`admitted patient id=${admission.patientId} to department id=${admission.departmentId}`)),
      catchError(this.handleError<Admission>('admitPatient'))
    );
  }

  getAdmissionByPatientId(patientId: number): Observable<Admission | undefined> {
    const admission = this.admissions.find(a => a.patientId === patientId);
    return of(admission);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
