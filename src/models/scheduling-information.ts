export class SchedulingInformation {
  /**
   * After that many correct answers in a row postpone the question for another day
   * TODO later make this configurable in the app or a config file
   */
  public static maxRepetitionsPerDay = 5;

  /**
   * How many times the question was answered satisfactory today (in a row).
   */
  _successivelyToday: number = 0;

  /**
   * From what date on the question will be asked again
   */
  _askAgainDays: Date[] = [];

  public answered(satisfactorily: boolean): void {
    if (satisfactorily) {
      this._successivelyToday ++;
      if (this._successivelyToday == SchedulingInformation.maxRepetitionsPerDay) {
        this._successivelyToday = 0;
        let askAgain = new Date();
        askAgain.setDate(askAgain.getDate() + Math.pow(3, this._askAgainDays.length));
        askAgain.setHours(5);
        this._askAgainDays.push(askAgain);
      }
    } else {
      this._successivelyToday = 0;
    }
  }

}
