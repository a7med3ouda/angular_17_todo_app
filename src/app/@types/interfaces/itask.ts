export interface ITask {
  id?: number;
  title?: string;
  completed?: boolean;
  dueDate?: Date;
  priority?: number;
  percentageCompleted?: number;
}
