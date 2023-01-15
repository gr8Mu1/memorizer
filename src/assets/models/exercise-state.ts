import {QuestionAnswerRecord} from "./question-answer-record";
import {RecordSchedule} from "./record-schedule";

export class ExerciseState {
  records_: Map<string, QuestionAnswerRecord>;
  schedule_: Map<string, RecordSchedule>;
  queue_: string[];
  key_: string;


  constructor(records: Map<string, QuestionAnswerRecord>, schedule: Map<string, RecordSchedule>, queue: string[]) {
    this.records_ = records;
    this.schedule_ = schedule;
    this.queue_ = queue;
    this.key_ = queue[0];
  }

  reInitQueue(): void {
    // TODO take the current date into consideration when loading available records
  }

  getCurrentRecord(): QuestionAnswerRecord {
    return this.records_.get(this.key_);
  }
  getCurrentSchedule(): RecordSchedule {
    return this.schedule_.get(this.key_);
  }
}
