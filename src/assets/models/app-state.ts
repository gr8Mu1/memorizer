import {TaskCollection, Task} from "./task-collection";
import {Queue} from "./queue";
import {PauseUntil} from "./pause-until";

export class AppState {
  _allTasks: TaskCollection;
  _queue: Queue;
  _pauseUntil: PauseUntil;

  constructor(allTasks: TaskCollection, queue: Queue, pauseUntil: PauseUntil) {
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

  public parseAndImportQuestionAnswerPairs(qaPairs: string) {
    let tasks:Task[] = [];
    const lines = qaPairs.split(/\r?\n|\r|\n/g);
    lines.forEach(line =>  {
      let qna = line.split(" --- ");
      if ('' === qna[0].trim()) return;
      tasks.push({question: qna[0], answer: qna[1]}
      );
    });
    let addedHashes = this._allTasks.addTasks(tasks);
    let filteredHashes = this._pauseUntil.filterAvailable(addedHashes);
    this._queue.addHashes(filteredHashes, true); // TODO add UI element to select priority
  }

  public getCurrentTask(): Task {
    return this._allTasks.getTaskByHash(this._queue.getCurrentHash());
  }
}
