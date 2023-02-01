import {TaskCollection, Task} from "./task-collection";
import {Queue} from "./queue";
import {PauseUntil} from "./pause-until";
import {TagCollection} from "./tag-collection";

export class AppState {
  _allTasks: TaskCollection;
  _queue: Queue;
  _pauseUntil: PauseUntil;
  _allTags: TagCollection;

  constructor(allTasks: TaskCollection, queue: Queue, pauseUntil: PauseUntil, allTags: TagCollection) {
    this._allTasks = allTasks;
    this._queue = queue;
    this._pauseUntil = pauseUntil;
    this._allTags = allTags;
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

  public shouldRebuildQueueForToday():boolean {
    return this._queue.shouldRebuildQueueForToday();
  }

  public rebuildQueue() {
    let allHashes = this._allTasks.getAllHashes();
    let filteredHashes = this._pauseUntil.filterAvailable(allHashes);
    this._queue.addHashes(filteredHashes, true);
    this._queue.updateNextRebuildDate();
  }

  public prioritizeTag(tagHash: string) {
    let allHashesInQueue = this._queue.getAllHashes();
    let front: string[];
    let rear: string[];
    [front, rear] = this._allTags.filterByTag(allHashesInQueue, tagHash);
    this._queue.rearrangeQueue(front, rear);
  }
}
