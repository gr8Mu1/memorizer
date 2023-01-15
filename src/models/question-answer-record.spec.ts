import { QuestionAnswerRecord } from './question-answer-record';

describe('QuestionAnswerRecord', () => {
  it('should create an instance', () => {
    expect(new QuestionAnswerRecord('question', 'answer')).toBeTruthy();
  });
});
