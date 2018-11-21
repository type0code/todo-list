export interface IToDo {
  id: number;
  title: string;
  today: boolean;
  done?: boolean;
  key?: string;
}

export interface IDayTasks {
  sendTime: string;
  data: string;
  tasks: IToDo[];
}
