import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { IDayTasks, IToDo } from './to-do';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class ToDoListService {
  tasksRef: AngularFireList<any>;
  todayTasksRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.tasksRef = db.list('allTasks');
    this.todayTasksRef = db.list('todayTasks');
  }

  // get all tasks
  getAllTasks() {
    return this.tasksRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  // add new task
  addTask(task: IToDo) {
    this.tasksRef.push(task);
  }

  // Remove task
  removeTask(key: string) {
    this.tasksRef.remove(key);
  }

  // Update task
  updateTask(key: string, data: IToDo) {
    this.tasksRef.update(key, data);
  }

  // set today tasks
  sendDayTasks(data: IDayTasks) {
    this.todayTasksRef.set(`updated-${data.sendTime}`, data);
  }
}
