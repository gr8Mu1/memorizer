import { QuestionAnswerRecord } from './question-answer-record';

describe('QuestionAnswerRecord', () => {
  it('should create an instance', () => {
    expect(new QuestionAnswerRecord('question', 'answer')).toBeTruthy();
  });

  it('should have the same hash', () => {
    let r1 = new QuestionAnswerRecord('question', 'answer');
    let r2 = new QuestionAnswerRecord('question', 'answer');

    expect(r1.getHash()).toEqual(r2.getHash());
  });

  it('should have a different hash', () => {
    let r1 = new QuestionAnswerRecord('question', 'answer');
    let r2 = new QuestionAnswerRecord('q', 'answer');

    expect(r1.getHash()).not.toEqual(r2.getHash());
  });
});
