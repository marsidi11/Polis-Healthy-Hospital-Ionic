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
  private dataUrl = 'assets/data.json';  // URL to web api
  private admissions: Admission[] = []; // In-memory storage for admissions

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.departments),
      catchError(this.handleError<Department[]>('getDepartments', []))
    );
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.patients),
      catchError(this.handleError<any[]>('getPatients', []))
    );
  }

  getAdmissionByPatientId(patientId: number): Observable<Admission | undefined> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => {
        const patient = data.patients.find((p: any) => p.id === patientId);
        if (patient && patient.department) {
          const department = data.departments.find((d: Department) => d.name === patient.department);
          if (department) {
            return { patientId, departmentId: department.id, cause: '' };
          }
        }
        return undefined;
      }),
      catchError(this.handleError<Admission>('getAdmissionByPatientId'))
    );
  }

  admitPatient(admission: Admission): Observable<Admission> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => {
        // Update the patient data in the json
        const patient = data.patients.find((p: any) => p.id === admission.patientId);
        if (patient) {
          const department = data.departments.find((d: Department) => d.id === admission.departmentId);
          if (department) {
            patient.department = department.name;
          }
        }
        this.admissions = this.admissions.filter(a => a.patientId !== admission.patientId);
        this.admissions.push(admission);
        return admission;
      }),
      tap(_ => console.log(`admitted patient id=${admission.patientId} to department id=${admission.departmentId}`)),
      catchError(this.handleError<Admission>('admitPatient'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
