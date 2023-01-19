import hash from "object-hash";

export class AllTasks {
  private readonly _taskByHash: Map<string, Task> = new Map();

  constructor(taskByHash: Map<string, Task>) {
    this._taskByHash = taskByHash;
  }

  public importQuestionAnswerPairs(tasks: Task[]): void {
    for (const task of tasks) {
      this._taskByHash.set(this.computeHash(task), task);
    }
  }

  private computeHash(task: Task): string {
    return hash(task, { encoding: 'base64' });
  }

  get tasks(): Map<string, Task> {
    return this._taskByHash;
  }

  public getTask(hash: string): Task {
    return this._taskByHash.get(hash);
  }
}

export interface Task {
  question: string;
  answer: string;
}
