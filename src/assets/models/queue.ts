import {TaskCollection} from "./task-collection";
import {PauseUntil} from "./pause-until";

export class Queue {
   maxPerDay = 5; // TODO inject from configuration
  _queue: HashAndRepetitions[];

  constructor(queue: HashAndRepetitions[]) {
    this._queue = queue;
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

  /**
   * Get the hash of the current task
   */
  public getCurrentHash(): string {
    // TODO what if _queue is empty?
    return this._queue[0].taskHash;
  }

  public clear() {
    this._queue = [];
  }

  public addHashes(hashes: string[]): Queue {
    let hashAndRep: HashAndRepetitions[] = [];
    hashes.forEach(key => hashAndRep.push({taskHash: key, correctInARow: 0}));

    return new Queue(hashAndRep);
  }

  public static buildFromTasksAndPauseUntil(allTasks: TaskCollection, pauseUntil: PauseUntil): Queue {
    return null; // TODO implement
  }

  private newPositionFromAnswerCount(x: number): number {
    return 1 + x * (x + 1) / 2;
  }

}

export interface HashAndRepetitions {
  taskHash: string;
  correctInARow: number;
}
