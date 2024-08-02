import { CurrencyPipe, PercentPipe } from '@angular/common';
import {
  Component,
  afterNextRender,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Todo } from '../@types/classes/Todo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PercentPipe, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  todoList = signal<Todo[]>([]);
  newTodoText = signal<string>('');
  updateTodo = signal<Todo | undefined>(undefined);

  total = computed(() => this.todoList().length);

  constructor() {
    afterNextRender(() => {
      const storedTodo = localStorage?.getItem('todoList');
      if (storedTodo) {
        this.todoList.set(JSON.parse(storedTodo));
      }
    });
    effect(() => {
      console.log(this.todoList().length % 2 ? 'Odd' : 'Even');
    });
  }

  handleNewTodoTextOnChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.updateTodo()) {
      this.updateTodo.update((prev) =>
        prev ? { ...prev, title: input.value } : undefined
      );
    } else {
      this.newTodoText.set(input.value);
    }
  }

  handleNewTodoTextOnKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.updateTodo()) {
        this.handleUpdateEditedTodo();
      } else {
        this.handleAddTodo();
      }
    }
  }

  handleAddTodo() {
    const newTodo = this.newTodoText().trim();
    if (newTodo) {
      const lastTodoItemId =
        (this.todoList()[this.todoList().length - 1]?.id ?? 0) + 1;

      const todo: Todo = new Todo({ id: lastTodoItemId, title: newTodo });

      // Add newTodo to todoList signal
      this.todoList.update((prev) => {
        const curr = [...prev, todo];

        localStorage?.setItem('todoList', JSON.stringify(curr));

        return curr;
      });

      // Clear the newTodoText signal
      this.newTodoText.set('');
    }
  }

  handleToggleTodoComplete(id: number) {
    this.todoList.update((prev) => {
      const curr = prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      localStorage?.setItem('todoList', JSON.stringify(curr));

      return curr;
    });
  }

  handleUpdateEditedTodo() {
    const updatedTodo = this.updateTodo();
    if (updatedTodo) {
      this.todoList.update((prev) => {
        const curr = prev.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );

        localStorage?.setItem('todoList', JSON.stringify(curr));

        return curr;
      });

      this.updateTodo.set(undefined);
    }
  }

  handleDeleteTodo(id: number) {
    if (id === this.updateTodo()?.id) {
      this.updateTodo.set(undefined);
    }
    this.todoList.update((prev) => {
      const curr = prev.filter((todo) => todo.id !== id);

      localStorage?.setItem('todoList', JSON.stringify(curr));

      return curr;
    });
  }
}
