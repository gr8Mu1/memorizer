import hash from "object-hash";

export class TaskCollection {
  private readonly _taskByHash: Map<string, Task> = new Map();

  constructor(taskByHash: Map<string, Task>) {
    this._taskByHash = taskByHash;
  }

  public addTasks(tasks: Task[]): void {
    for (const task of tasks) {
      this._taskByHash.set(TaskCollection.computeHash(task), task);
    }
  }

  public static computeHash(task: Task): string {
    return hash(task, { encoding: 'base64' });
  }

  get tasks(): Map<string, Task> {
    return this._taskByHash;
  }

  public getTaskByHash(hash: string): Task {
    return this._taskByHash.get(hash);
  }
}

export interface Task {
  question: string;
  answer: string;
}
