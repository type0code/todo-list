import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IDayTasks, IToDo } from './to-do';

@Injectable({
  providedIn: 'root'
})
export class ToDoListService {
  constructor(private http: HttpClient) {}

  sendDayTasks(data: IDayTasks) {
    const URL: string = '';

    return this.http.post(URL, data).pipe(
      tap((res: any) => { return res }),
      catchError(this.handleError)
    );
  }

  doneTask(task: IToDo) {
    const URL: string = '';

    return this.http.post(URL, task).pipe(
      tap((res: any) => { return res }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    return observableThrowError(error.error || 'Server error');
  }
}
