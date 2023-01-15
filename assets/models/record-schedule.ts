export class RecordSchedule {
  /**
   * After that many correct answers in a row postpone the question for another day
   * TODO later make this configurable in the app or a config file
   */
  public static maxRepetitionsPerDay = 5;

  /**
   * How many times the question was answered satisfactory today (in a row).
   */
  _successivelyToday: number;

  /**
   * From what date on the question will be asked again
   */
  _askAgainDays: Date[];


  constructor(successivelyToday?: number, askAgainDays?: Date[]) {
    this._successivelyToday = successivelyToday ?? 0;
    this._askAgainDays = askAgainDays ?? [];
  }

  public answeredSatisfactorily(satisfactorily: boolean): number {
    if (satisfactorily) {
      this._successivelyToday ++;
      if (this._successivelyToday == RecordSchedule.maxRepetitionsPerDay) {
        this._successivelyToday = 0;
        let askAgain = new Date();
        askAgain.setDate(askAgain.getDate() + Math.pow(3, this._askAgainDays.length));
        askAgain.setHours(5);
        this._askAgainDays.push(askAgain);
      }
    } else {
      this._successivelyToday = 0;
    }
    return this._successivelyToday;
  }

  practiseToday() {
    let today = new Date();
    let resumeDate = (this._askAgainDays.length == 0) ?
      today : this._askAgainDays[this._askAgainDays.length - 1];
    return (today >= resumeDate)
  }

}
