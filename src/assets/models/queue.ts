import {AllTasks} from "./all-tasks";
import {PauseUntil} from "./pause-until";

export class Queue {
   maxPerDay = 5; // TODO inject from configuration
  _queue: HashAndRepetitions[];

  constructor(queue: HashAndRepetitions[]) {
    this._queue = queue;
  }

  public static buildFromTasks(allTasks: AllTasks): Queue {
    let hashAndRep: HashAndRepetitions[] = [];
    Array.from(allTasks.tasks.keys()).forEach(key => hashAndRep.push({taskHash: key, correctInARow: 0}));

    return new Queue(hashAndRep);
  }

  public static buildFromTasksAndPauseUntil(allTasks: AllTasks, pauseUntil: PauseUntil): Queue {
    return null; // TODO implement
  }

  /**
   *
   * @param answerOk
   * returns the hash of the task that was practised enough for today and hence has
   * been dropped from the queue
   */
  public updateFromAnswer(answerOk: boolean): string {
    if (this._queue.length == 0) return null;
    let currentElement = this._queue.splice(0, 1)[0];
    if (answerOk) {
      if (++currentElement.correctInARow >= this.maxPerDay) {
        return currentElement.taskHash;
      } else {
        let pos = this.newPositionFromAnswerCount(currentElement.correctInARow);
        this._queue.splice(pos, 0, currentElement);
      }
    } else {
      this._queue.splice(1, 0, currentElement);
    }
    return null;
  }

  public getCurrentHash(): string {
    return this._queue[0].taskHash;
  }

  private newPositionFromAnswerCount(x: number): number {
    return 1 + x * (x + 1) / 2;
  }

  public clear() {
    this._queue = [];
  }

}

export interface HashAndRepetitions {
  taskHash: string;
  correctInARow: number;
}
