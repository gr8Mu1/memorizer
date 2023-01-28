import {AllTasks, Task} from "./all-tasks";
import {Queue} from "./queue";
import {PauseUntil} from "./pause-until";

export class AppState {
  _allTasks: AllTasks;
  _queue: Queue;
  _pauseUntil: PauseUntil;

  constructor(allTasks: AllTasks, queue: Queue, pauseUntil: PauseUntil) {
    this._allTasks = allTasks;
    this._queue = queue;
    this._pauseUntil = pauseUntil;
  }

  public processAnswerValidation(correctlyAnsered: boolean) {
    let droppedHash = this._queue.updateFromAnswer(correctlyAnsered);
    if (droppedHash != null) {
      this._pauseUntil.pause(droppedHash);
    }
  }

  public clearQueue() {
    this._queue.clear();
    // TODO
  }

  public getCurrentTask(): Task {
    return this._allTasks.getTask(this._queue.getCurrentHash());
  }

  public importQuestionAnswerPairs(allTasks: Task[]) {
    this._allTasks.importQuestionAnswerPairs(allTasks);
  }

  public parseAndImportQuestionAnswerPairs(qaPairs: string) {
    let tasks:Task[] = [];
    const lines = qaPairs.split(/\r?\n|\r|\n/g);
    lines.forEach(line =>  {
      let qna = line.split(" --- ");
      tasks.push({question: qna[0], answer: qna[1]}
      );
    });
    this._allTasks.importQuestionAnswerPairs(tasks);
  }

  updateQueue() {
    // TODO
  }
}
