export class Queue {
   maxPerDay = 5; // TODO inject from configuration
  _hashAndRepetitions: HashAndRepetitions[];

  constructor(hashAndRepetitions: HashAndRepetitions[]) {
    this._hashAndRepetitions = hashAndRepetitions;
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
    // TODO what if _queue is empty?
    return this._hashAndRepetitions[0].taskHash;
  }

  public clear() {
    this._hashAndRepetitions = [];
  }

  public addHashes(hashes: string[], highPriority: boolean=false) {
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

}

export interface HashAndRepetitions {
  taskHash: string;
  correctInARow: number;
}
