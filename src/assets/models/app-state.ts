import {TaskCollection, Task} from "./task-collection";
import {Queue} from "./queue";
import {PauseUntil} from "./pause-until";
import {Tag, TagCollection} from "./tag-collection";

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

  public parseAndImportQuestionAnswerPairsWithTags(qaPairs: string, tags: Tag[] = []) {
    let tasks:Task[] = [];
    const lines = qaPairs.split(/\r?\n|\r|\n/g);
    lines.forEach(line =>  {
      let qna = line.split(" --- ");
      if ('' === qna[0].trim()) return;
      tasks.push({question: qna[0], answer: qna[1]}
      );
    });
    let [addedTaskHashes, allTaskHashes] = this._allTasks.addTasks(tasks);
    let filteredHashes = this._pauseUntil.filterAvailable(addedTaskHashes);
    this._queue.addHashes(filteredHashes, true); // TODO add UI element to select priority
    if (!tags) {
      return;
    }
    let tagHashes = this._allTags.getHashesFor(tags);
    for (let taskHash of allTaskHashes) {
      this._allTags.addTagsToTask(taskHash, tagHashes);
    }
  }

  public parseAndImportTags(tagDefinitions: string) {
    let tags:Tag[] = [];
    const lines = tagDefinitions.split(/\r?\n|\r|\n/g);
    lines.forEach(line =>  {
      let tag = line.split(" --- ");
      if ('' === tag[0].trim()) return;
      tags.push({shortName: tag[0], description: tag[1]}
      );
    });
    for (let tag of tags) {
      this._allTags.addTag(tag);
    }
  }

  public getCurrentTask(): Task {
    return this._allTasks.getTaskByHash(this._queue.getCurrentHash());
  }

  public getTagsOfCurrentTask(): Tag[] {
    return this._allTags.getTagsOfTask(this._queue.getCurrentHash());
  }

  public shouldRebuildQueueForToday():boolean {
    return this._queue.shouldRebuildQueueForToday();
  }

  public rebuildQueue() {
    let allHashes = this._allTasks.getAllHashes();
    let filteredHashes = this._pauseUntil.filterAvailable(allHashes);
    this._queue.clear();
    this._queue.addHashes(filteredHashes, true);
    this._queue.updateNextRebuildDate();
  }

  public prioritizeTags(tags: Tag[]) {
    let tagHashes = this._allTags.getHashesFor(tags);
    let allHashesInQueue = this._queue.getAllHashes();
    let front: string[];
    let rear: string[];
    [front, rear] = this._allTags.filterByTags(allHashesInQueue, tagHashes);
    this._queue.rearrangeQueue(front, rear);
  }

  public getAvailableTags(): Tag[] {
    return this._allTags.getAllTags();
  }

  deleteCurrentPair() {
    let currentHash = this._queue.getCurrentHash();
    this._queue.removeCurrent();
    this._allTasks.remove(currentHash);
    this._pauseUntil.remove(currentHash);
    this._allTags.removeAllTagsFromTask(currentHash);
  }
}
