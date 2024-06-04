import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
