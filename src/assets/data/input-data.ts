import {QuestionAnswerRecord} from "../models/question-answer-record";
import {RecordSchedule} from "../models/record-schedule";
import {ExerciseState} from "../models/exercise-state";

export {loadedExerciseState}

/**
 * the real loadExerciseState method should load the saved exercise state from file
 * this method creates exercises of the form ['q1', 'a1'],...
 * @param len
 */
function mockLoadExerciseState(len: number): ExerciseState {
  let r = new Map<string, QuestionAnswerRecord>();
  let s = new Map<string, RecordSchedule>();
  let q: string[] = [];
  for (let i = 0; i < len; i++) {
    let questionAnswerRecord = new QuestionAnswerRecord(`q${i}`, `a${i}`);
    let recordHash = questionAnswerRecord.getHash();
    r.set(recordHash, questionAnswerRecord);
    s.set(recordHash, new RecordSchedule());
    q.push(recordHash);
  }
  return new ExerciseState(r, s, q);
}

let loadedExerciseState: ExerciseState = mockLoadExerciseState(18);

