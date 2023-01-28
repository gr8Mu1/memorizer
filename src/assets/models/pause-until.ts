export class PauseUntil {
  _dateAndCountByTaskHash: Map<string, DateAndCount> = new Map();

  constructor(dateByTaskHash: Map<string, DateAndCount>) {
    this._dateAndCountByTaskHash = dateByTaskHash;
  }

  public static createEmpty(): PauseUntil {
    return new PauseUntil(new Map<string, DateAndCount>());
  }

  public pause(taskHash: string) {
    let pauseCount = (this._dateAndCountByTaskHash.has(taskHash)) ?
      this._dateAndCountByTaskHash.get(taskHash).count: 0;
    let daysToAdd = Math.pow(3, pauseCount);
    let pauseUntilDate = new Date();
    pauseUntilDate.setDate(pauseUntilDate.getDate() + daysToAdd);
    pauseUntilDate.setHours(5);
    this._dateAndCountByTaskHash.set(taskHash, {date: pauseUntilDate, count: ++pauseCount})
  }

  public filterAvailableNow(taskHashes: string[]) {
    // TODO write a test
    let today = new Date();
    return taskHashes.filter((taskHash) => (this._dateAndCountByTaskHash.has(taskHash))
      ? this._dateAndCountByTaskHash.get(taskHash).date < today
      : true);
  }
}

export interface DateAndCount {
  date: Date;
  count: number;
}
