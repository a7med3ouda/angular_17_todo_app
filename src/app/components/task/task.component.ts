import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../@types/classes/task';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() markComplete: EventEmitter<number> = new EventEmitter();
  @Output() editTask: EventEmitter<Task> = new EventEmitter();
  @Output() deleteTask: EventEmitter<number> = new EventEmitter();

  handleToggleTaskComplete(id: number) {
    this.markComplete.emit(id);
  }

  handleEditTask(task: Task) {
    this.editTask.emit(task);
  }

  handleDeleteTask(id: number) {
    this.deleteTask.emit(id);
  }
}
