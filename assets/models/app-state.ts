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

  public getCurrentTask(): Task {
    return this._allTasks.getTask(this._queue.getCurrentHash());
  }
}
