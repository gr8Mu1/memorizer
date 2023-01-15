import hash from "object-hash";

export class QuestionAnswerRecord {
  private _question: string;
  private _answer: string;

  constructor(question: string, answer: string) {
    this._question = question;
    this._answer = answer;
  }

  get question(): string {
    return this._question;
  }

  set question(value: string) {
    this._question = value;
  }

  get answer(): string {
    return this._answer;
  }

  set answer(value: string) {
    this._answer = value;
  }

  getHash(): string {
    return hash(this, { encoding: 'base64' });
  }
}
