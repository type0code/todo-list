import { Component, HostBinding, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IToDo } from './to-do';
import { formatDate } from '@angular/common';
import { ToDoListService } from './to-do-list.service';

const ALL_TASKS: IToDo[] = [
  {
    id: 0,
    title: 'To do something',
    done: false,
    today: false
  },
  {
    id: 1,
    title: 'To do something 2',
    done: true,
    today: true
  },
  {
    id: 2,
    title: 'To do something 3',
    done: false,
    today: true
  },
  {
    id: 3,
    title: 'To do something 4',
    done: false,
    today: false
  },
  {
    id: 4,
    title: 'To do something 5',
    done: false,
    today: false
  }
];

@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  @HostBinding('class.to-do-list') true;
  allTasks: IToDo[];
  todayTasks: IToDo[];
  newTaskForm: FormGroup;
  todayTasksForm: FormGroup;
  todayEnough: boolean;
  btnLoading: boolean;
  saved: boolean;

  get todayList(): FormArray {
    return this.todayTasksForm.get('tasks') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private toDoListSv: ToDoListService
  ) {
    this.allTasks = ALL_TASKS;
    this.todayTasks = [];
    this.todayEnough = false;
    this.btnLoading = false;
    this.saved = false;
  }

  ngOnInit() {
    this.initNewTaskForm();
    this.initTodayTasksForm(this.allTasks);
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
      this.allTasks.push({
        id: ID,
        title: form.value.taskTitle,
        today: false,
        done: false
      });

      this.newTaskForm.reset();
    }
  }

  // Remove tasks from "all tasks" || "today tasks"
  removeTask(tasks: IToDo[], id: number, allList: boolean = true) {
    tasks.forEach((task, index) => {
      if (task.id === id) {
        task.today ? this.todayEnough = false : null;

        if (allList) {
          tasks.splice(index, 1)
        } else {
          task.today = false;
          task.done = false;
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
      title: new FormControl(task.title),
      today: new FormControl(task.today),
      done: new FormControl(task.done)
    });
  }

  // Send today form
  sendTasks(form: FormGroup) {
    if (form.valid) {
      this.btnLoading = true;

      this.toDoListSv.sendDayTasks(form.value).subscribe(
        () => {
          console.log('Form sent');

          this.saved = true;

          setTimeout(() => {
            this.btnLoading = false;
          }, 500);
        },
        err => {
          console.log(err);

          setTimeout(() => {
            this.btnLoading = false;
          }, 500);
        }
      );
    }
  }

  // Send changed task
  changeDone(task: IToDo) {
    this.toDoListSv.doneTask(task).subscribe(
      () => {
        console.log('Changes was save');
      },
      err => {
        console.log(err);

        setTimeout(() => {
          this.btnLoading = false;
        }, 500);
      }
    );
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
