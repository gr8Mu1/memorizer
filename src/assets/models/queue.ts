export class Queue {
   maxPerDay = 5; // TODO inject from configuration
  private _nextRebuildDate: Date;
  _hashAndRepetitions: HashAndRepetitions[];

  constructor(hashAndRepetitions: HashAndRepetitions[], nextRebuildDate: Date) {
    this._hashAndRepetitions = hashAndRepetitions;
    this._nextRebuildDate = nextRebuildDate;
  }

  /**
   *
   * @param answerOk
   * returns the hash of the task that was practised enough for today and hence has
   * been dropped from the queue
   */
  public updateFromAnswer(answerOk: boolean): string {
    if (this._hashAndRepetitions.length == 0) return null;
    let currentElement = this._hashAndRepetitions.splice(0, 1)[0];
    if (answerOk) {
      if (++currentElement.correctInARow >= this.maxPerDay) {
        return currentElement.taskHash;
      } else {
        let pos = this.newPositionFromAnswerCount(currentElement.correctInARow);
        this._hashAndRepetitions.splice(pos, 0, currentElement);
      }
    } else {
      this._hashAndRepetitions.splice(1, 0, currentElement);
    }
    return null;
  }

  /**
   * Get the hash of the current task
   */
  public getCurrentHash(): string {
    if (this._hashAndRepetitions.length == 0) return null;
    return this._hashAndRepetitions[0].taskHash;
  }

  public clear() {
    this._hashAndRepetitions = [];
  }

  public addHashes(hashes: string[], highPriority: boolean=false) {
    if (!hashes) {
      return;
    }
    let added: HashAndRepetitions[] = [];
    hashes.forEach(key => added.push({taskHash: key, correctInARow: 0}));

    if (highPriority){
      this._hashAndRepetitions = [...added, ...this._hashAndRepetitions];
    } else {
      this._hashAndRepetitions = [...this._hashAndRepetitions, ...added];
    }
  }

  private newPositionFromAnswerCount(x: number): number {
    return 1 + x * (x + 1) / 2;
  }

  /**
   * Returns in general tomorrow at 3pm, but today 3pm if `now` is between midnight and 3pm
   * @param now should only be provided in unit tests
   */
  public updateNextRebuildDate(now: Date = new Date()) {
    let tomorrow3pm = new Date(now.getTime() - 3*60*60*1000);
    tomorrow3pm = new Date(tomorrow3pm.setHours(27, 0, 0));
    this._nextRebuildDate = tomorrow3pm;
  }

  public shouldRebuildQueueForToday(): boolean {
    if (!this._nextRebuildDate) {
      return true;
    }
    return this._nextRebuildDate < new Date();
  }

  public getAllHashes(): string[] {
    let hashes: string[] = [];
    for (let element of this._hashAndRepetitions) {
      hashes.push(element.taskHash);
    }
    return hashes;
  }

  /**
   * re-arranges the queue, assuming the input is a correct partition
   * of the elements currently residing in the queue
   * @param frontHashes
   * @param rearHashes
   */
  public rearrangeQueue(frontHashes: string[], rearHashes: string[]) {
    let queueMap: Map<string, HashAndRepetitions> = new Map();
    for (let element of this._hashAndRepetitions) {
      queueMap.set(element.taskHash, element);
    }
    let hashRep: HashAndRepetitions[] = [];
    for (let hash of frontHashes) {
      hashRep.push(queueMap.get(hash))
    }
    for (let hash of rearHashes) {
      hashRep.push(queueMap.get(hash))
    }
    this._hashAndRepetitions = hashRep;
  }
}

export interface HashAndRepetitions {
  taskHash: string;
  correctInARow: number;
}
