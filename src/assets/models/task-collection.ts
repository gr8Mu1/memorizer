import hash from "object-hash";

export class TaskCollection {
  private readonly _taskByHash: Map<string, Task> = new Map();

  constructor(taskByHash: Map<string, Task>) {
    this._taskByHash = taskByHash;
  }

  public addTasks(tasks: Task[]): string[] {
    let addedHashes: string[] = [];
    for (const task of tasks) {
      let taskHash = this.computeHash(task);
      if (!this._taskByHash.has(taskHash)) {
        addedHashes.push(taskHash);
      }
      this._taskByHash.set(taskHash, task);
    }
    return addedHashes;
  }

  public removeTasks(tasks: Task[]): void {
    for (const task of tasks) {
      this._taskByHash.delete(this.computeHash(task));
    }
  }

  private computeHash(task: Task): string {
    return hash(task, { encoding: 'base64' });
  }

  public getAllHashes(): string[] {
    return Array.from(this._taskByHash.keys());
  }

  public getTaskByHash(hash: string): Task {
    return this._taskByHash.get(hash);
  }
}

export interface Task {
  question: string;
  answer: string;
}
