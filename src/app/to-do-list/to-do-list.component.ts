import { Component, HostBinding, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { IToDo } from './to-do';
import { ToDoListService } from './to-do-list.service';

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  @HostBinding('class.to-do-list') true;
  newTaskForm: FormGroup;
  todayTasksForm: FormGroup;
  todayEnough: boolean;
  btnLoading: boolean;
  saved: boolean;
  allTasks: IToDo[];

  get todayList(): FormArray {
    return this.todayTasksForm.get('tasks') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private toDoListSv: ToDoListService
  ) {
    this.todayEnough = false;
    this.btnLoading = false;
    this.saved = false;
  }

  ngOnInit() {
    this.toDoListSv.getAllTasks().subscribe(
      data => {
        this.allTasks = data;

        this.initNewTaskForm();
        this.initTodayTasksForm(data);
      },
      err => {
        this.allTasks = [];

        console.log(err);
      }
    );
  }

  // Init add new task form
  initNewTaskForm() {
    this.newTaskForm = this.formBuilder.group({
      taskTitle: [null]
    });
  }

  // Add task to "all tasks"
  addTask(form: FormGroup) {
    const ID: number = this.randomId();

    if (this.allTasks && this.allTasks.length < 100000 && form.value.taskTitle) {
      const NEW_TASK: IToDo = {
        id: ID,
        title: form.value.taskTitle,
        today: false,
        done: false
      };

      this.toDoListSv.addTask(NEW_TASK);
      this.allTasks.push(NEW_TASK);
      this.newTaskForm.reset();
    }
  }

  // Remove tasks from "all tasks" || "today tasks"
  removeTask(tasks: IToDo[], id: number, allList: boolean = true) {
    tasks.forEach((task, index) => {
      if (task.id === id) {
        task.today ? this.todayEnough = false : null;

        if (allList) {
          this.toDoListSv.removeTask(task.key);
          tasks.splice(index, 1)
        } else {
          task.today = false;
          task.done = false;
          this.toDoListSv.updateTask(task.key, task);
        }
      }
    });

    this.removeTodayTask(id);
  }

  // Toggle task's state from "all tasks list"
  toggleState(item: IToDo, tasks: IToDo[]) {
    let todayCount: number = tasks.filter(task => {
      return task.today;
    }).length || 0;

    if (item.today) {
      this.addTodayTask(item);
    } else {
      item.done = false;
      this.removeTodayTask(item.id);
    }

    this.toDoListSv.updateTask(item.key, item);
    this.todayEnough = (todayCount < 5) ? false : true;
  }

  // ** Today form **

  // Init today form
  initTodayTasksForm(tasks: IToDo[]) {
    this.todayTasksForm = this.formBuilder.group({
      sendTime: formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss Z', 'en'),
      data: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
      tasks: new FormArray([], Validators.required)
    });

    tasks.forEach(task => {
      if (task.today) {
        this.todayList.push(this.initTodayTask(task));
      }
    });

    // Form change detect
    this.todayTasksForm.valueChanges.subscribe(changedData => {
      this.saved = false;
    });
  }

  // Init tasks list for today form
  initTodayTask(task: IToDo) {
    return new FormGroup({
      id: new FormControl(task.id),
      key: new FormControl(task.key),
      title: new FormControl(task.title),
      today: new FormControl(task.today),
      done: new FormControl(task.done)
    });
  }

  // Send today form
  sendTasks(form: FormGroup) {
    if (form.valid) {
      this.btnLoading = true;

      this.toDoListSv.sendDayTasks(form.value);
      this.saved = true;

      setTimeout(() => {
        this.btnLoading = false;
      }, 500);
    }
  }

  // Send changed task
  changeDone(task: IToDo) {
    this.toDoListSv.updateTask(task.key, task);
  }

  // Add today task
  addTodayTask(task: IToDo) {
    task.today ? this.todayList.push(this.initTodayTask(task)) : null;
  }

  // Remove today form control
  removeTodayTask(taskId: number, controls: any = this.todayTasksForm.get('tasks')) {
    let index: number = controls.value.findIndex(control => {
      return control.id === taskId;
    });

    index >= 0 ? controls.removeAt(index) : null;
  }

  // Random task id
  randomId(allTasks: IToDo[] = this.allTasks) {
    let id: number = Math.floor(Math.random() * 100000);

    allTasks.forEach(task => {
      id === task.id ? id = this.randomId() : null;
    });

    return id;
  }
}
