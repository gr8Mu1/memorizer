import {QuestionAnswerRecord} from "./question-answer-record";
import {RecordSchedule} from "./record-schedule";

export class ExerciseState {
  records_: Map<string, QuestionAnswerRecord>;
  schedule_: Map<string, RecordSchedule>;
  queue_: string[];

  constructor(records: Map<string, QuestionAnswerRecord>, schedule: Map<string, RecordSchedule>, queue: string[]) {
    this.records_ = records;
    this.schedule_ = schedule;
    this.queue_ = queue;
  }

  reInitQueue(): void {
    // TODO take the current date into consideration when loading available records
  }

  getCurrentRecord(): QuestionAnswerRecord {
    return this.records_.get(this.queue_[0]);
  }
  getScheduleOfCurrentRecord(): RecordSchedule {
    return this.schedule_.get(this.queue_[0]);
  }

  public onUnsatisfactorilyAnswered(): void {
    this.getScheduleOfCurrentRecord().answeredSatisfactorily(false);
    let current = this.queue_.splice(0, 1);
    this.queue_.splice(1, 0, current[0]);
  }

  public onSatisfactorilyAnswered(): void {
    let correctInARow = this.getScheduleOfCurrentRecord().answeredSatisfactorily(true);
    let current = this.queue_.splice(0, 1);
    if (this.getScheduleOfCurrentRecord().practiseToday()) {
      let pos = this.newPositionFromAnswerCount(correctInARow);
      this.queue_.splice(pos, 0, current[0]);
    }
  }

  private newPositionFromAnswerCount(x: number): number {
    return 1 + x * (x + 1) / 2;
  }

}
