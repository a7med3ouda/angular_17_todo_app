import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, afterNextRender, computed, effect, signal } from '@angular/core';
import { Task } from '../../@types/classes/task';
import { TaskComponent } from '../../components/task/task.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PercentPipe, CurrencyPipe, TaskComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  taskList = signal<Task[]>([]);
  newTaskText = signal<string>('');
  updateTask = signal<Task | undefined>(undefined);

  total = computed(() => this.taskList().length);
  completedCount = computed(() => this.taskList().filter((x) => x.completed).length);

  constructor() {
    afterNextRender(() => {
      const storedTask = localStorage?.getItem('taskList');
      if (storedTask) {
        this.taskList.set(JSON.parse(storedTask));
      }
    });
    effect(() => {
      console.log(this.taskList().length % 2 ? 'Odd' : 'Even');
    });
  }

  handleNewTaskTextOnChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.updateTask()) {
      this.updateTask.update((prev) => (prev ? { ...prev, title: input.value } : undefined));
    } else {
      this.newTaskText.set(input.value);
    }
  }

  handleNewTaskTextOnKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.updateTask()) {
        this.handleUpdateEditedTask();
      } else {
        this.handleAddTask();
      }
    }
  }

  handleAddTask() {
    const newTask = this.newTaskText().trim();
    if (newTask) {
      const lastTaskItemId = (this.taskList()[this.taskList().length - 1]?.id ?? 0) + 1;

      const task: Task = new Task({ id: lastTaskItemId, title: newTask });

      // Add newTask to taskList signal
      this.taskList.update((prev) => {
        const curr = [...prev, task];

        localStorage?.setItem('taskList', JSON.stringify(curr));

        return curr;
      });

      // Clear the newTaskText signal
      this.newTaskText.set('');
    }
  }

  handleToggleTaskComplete(id: number) {
    this.taskList.update((prev) => {
      const curr = prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));

      localStorage?.setItem('taskList', JSON.stringify(curr));

      return curr;
    });
  }

  handleUpdateEditedTask() {
    const updatedTask = this.updateTask();
    if (updatedTask) {
      this.taskList.update((prev) => {
        const curr = prev.map((task) => (task.id === updatedTask.id ? updatedTask : task));

        localStorage?.setItem('taskList', JSON.stringify(curr));

        return curr;
      });

      this.updateTask.set(undefined);
    }
  }

  handleDeleteTask(id: number) {
    if (id === this.updateTask()?.id) {
      this.updateTask.set(undefined);
    }
    this.taskList.update((prev) => {
      const curr = prev.filter((task) => task.id !== id);

      localStorage?.setItem('taskList', JSON.stringify(curr));

      return curr;
    });
  }
}
