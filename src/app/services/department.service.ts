import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private dataUrl = 'assets/data.json';  // URL to web api

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.departments),
      catchError(this.handleError<any[]>('getDepartments', []))
    );
  }

  createDepartment(department: any): Observable<any> {
    // Here you would normally post to the backend
    return of(department).pipe(
      tap(newDepartment => console.log(`created department w/ id=${newDepartment.id}`)),
      catchError(this.handleError<any>('createDepartment'))
    );
  }

  editDepartment(department: any): Observable<any> {
    // Here you would normally put to the backend
    return of(department).pipe(
      tap(_ => console.log(`updated department id=${department.id}`)),
      catchError(this.handleError<any>('editDepartment'))
    );
  }

  deleteDepartment(id: number): Observable<any> {
    // Here you would normally delete from the backend
    return of({ id }).pipe(
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
