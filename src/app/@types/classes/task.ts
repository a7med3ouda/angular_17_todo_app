import { ITask } from '../interfaces/itask';

export class Task implements ITask {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority?: number;
  percentageCompleted?: number;

  constructor({ id = Date.now(), title = '', completed = false, dueDate, priority, percentageCompleted }: ITask = {}) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.dueDate = dueDate;
    this.priority = priority;
    this.percentageCompleted = percentageCompleted;

    if (dueDate) {
      const now = new Date();
      const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      this.percentageCompleted = Math.min(100, Math.floor((daysLeft / 30) * 100));
    }
  }
}
