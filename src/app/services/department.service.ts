import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private dataUrl = 'http://localhost:8080/api/department';  // URL to web api

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<any[]> {
    return this.http.get<any>(`${this.dataUrl}`).pipe(
      map(response => response.content),
      tap(data => console.log('Data received:', data)),
      catchError(this.handleError<any[]>('getDepartments', []))
    );
  }

  createDepartment(department: any): Observable<any> {
    return this.http.post<any>(this.dataUrl, department).pipe(
      tap(newDepartment => console.log(`created department w/ id=${newDepartment.id}`)),
      catchError(this.handleError<any>('createDepartment'))
    );
  }

  editDepartment(id: number, department: any): Observable<any> {
    return this.http.put<any>(`${this.dataUrl}/${id}`, department).pipe(
      tap(_ => console.log(`updated department id=${id}`)),
      catchError(this.handleError<any>('editDepartment'))
    );
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.dataUrl}/${id}`).pipe(
      tap(_ => console.log(`deleted department id=${id}`)),
      catchError(this.handleError<any>('deleteDepartment'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // Default error message in case 'errorMsg' is not available in the response
      let errorMessage = `Failed to ${operation}: ${error.message}`;
      if (error.error && typeof error.error === 'object' && 'errorMsg' in error.error) {
        // Use only the 'errorMsg' from the server response
        errorMessage = error.error.errorMsg;
      }
  
      // Return the provided default result
      return of(result as T);
    };
  }
}
