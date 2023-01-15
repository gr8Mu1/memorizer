import { ExerciseState } from './exercise-state';
import {QuestionAnswerRecord} from "./question-answer-record";
import {RecordSchedule} from "./record-schedule";

describe('ExerciseState', () => {
  it('should create an instance', () => {
    let qa = new QuestionAnswerRecord('q1', 'a1');
    let key = qa.getHash();
    let r = new Map<string, QuestionAnswerRecord>();
    r.set(key, qa);
    let s = new Map<string, RecordSchedule>();
    s.set(key, new RecordSchedule());
    let q: string[] = [key];

    expect(new ExerciseState(r, s, q)).toBeTruthy();
  });
});
