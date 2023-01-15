import {QuestionAnswerRecord} from "../models/question-answer-record";

export {questionsAndAnswers}

function initQuestionsAndAnswers(len: number): QuestionAnswerRecord[] {
  let r: QuestionAnswerRecord[] = [];
  for (let i = 0; i < len; i++) {
    r.push(new QuestionAnswerRecord(`q${i}`, `a${i}`));
  }
  return r;
}



let questionsAndAnswers: QuestionAnswerRecord[] = initQuestionsAndAnswers(18);

