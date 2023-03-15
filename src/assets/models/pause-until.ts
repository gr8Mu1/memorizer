import {filter} from "rxjs/operators";
import {HashAndRepetitions} from "./queue";

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
    pauseCount++;
    let daysToAdd = this.daysToPause(pauseCount);
    let pauseUntilDate = new Date();
    pauseUntilDate.setDate(pauseUntilDate.getDate() + daysToAdd);
    pauseUntilDate.setHours(5);
    this._dateAndCountByTaskHash.set(taskHash, {date: pauseUntilDate, count: pauseCount})
  }

  public daysToPause(x: number):number {
    // 3rd order fit to the differences of power(x,x), so it will be x^x accumulated i.e. in the running sum.
    // 1^1, 2^2, 3^3, 4^4 days from the beginning
    return -2079 + x * (3862 + 1 / 3 + x * (-2155 + (374 + 2 / 3) * x));
  }

  public filterAvailable(taskHashes: string[]): HashAndRepetitions[] {
    let today = new Date();
    let filtered = taskHashes.filter((taskHash) => (this._dateAndCountByTaskHash.has(taskHash))
      ? this._dateAndCountByTaskHash.get(taskHash).date < today
      : true);
    let hashAndRepetitions: HashAndRepetitions[] = [];
    filtered.forEach(hash => {
      hashAndRepetitions.push({taskHash: hash, correctInARow: this._dateAndCountByTaskHash.has(hash)?this._dateAndCountByTaskHash.get(hash).count:0})
    });
    return hashAndRepetitions;
  }

  public remove(taskHash: string) {
    this._dateAndCountByTaskHash.delete(taskHash);
  }
}

export interface DateAndCount {
  date: Date;
  count: number;
}
