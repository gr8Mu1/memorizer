export class PauseUntil {
  _dateByTaskHash: Map<string, DateAndCount> = new Map();

  constructor(dateByTaskHash: Map<string, DateAndCount>) {
    this._dateByTaskHash = dateByTaskHash;
  }

  public static createEmpty(): PauseUntil {
    return new PauseUntil(new Map<string, DateAndCount>());
  }

  public pause(taskHash: string) {
    let pauseCount = (this._dateByTaskHash.has(taskHash)) ?
      this._dateByTaskHash.get(taskHash).count: 0;
    let daysToAdd = Math.pow(3, pauseCount);
    let pauseUntilDate = new Date();
    pauseUntilDate.setDate(pauseUntilDate.getDate() + daysToAdd);
    pauseUntilDate.setHours(5);
    this._dateByTaskHash.set(taskHash, {date: pauseUntilDate, count: pauseCount})
  }
}

export interface DateAndCount {
  date: Date;
  count: number;
}
