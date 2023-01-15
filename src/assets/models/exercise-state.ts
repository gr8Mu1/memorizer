import {QuestionAnswerRecord} from "./question-answer-record";
import {RecordSchedule} from "./record-schedule";

export class ExerciseState {
  records_: Map<string, QuestionAnswerRecord>;
  schedule_: Map<string, RecordSchedule>;
  queue_: string[];


  constructor(records: Map<string, QuestionAnswerRecord>, schedule: Map<string, RecordSchedule>, queue: string[]) {
    this.records_ = records ?? new Map<string, QuestionAnswerRecord>();
    this.schedule_ = schedule ?? new Map<string, RecordSchedule>();
    this.queue_ = queue ?? [];
  }

  updateQueue(): void {
    // TODO take the current date into consideration when loading available records
  }
}
