import {Component} from '@angular/core';
import {loadedAppState} from "../assets/data/input-data";
import {AppState} from "../assets/models/app-state";
import {saveAs} from "file-saver";
import {Queue} from "../assets/models/queue";
import {Task, TaskCollection} from "../assets/models/task-collection";
import {PauseUntil} from "../assets/models/pause-until";
import {Tag} from "../assets/models/tag-collection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'memorizer';
  appState: AppState;
  curQuestion: string;
  curAnswer: string;
  answerVisible = false;
  availableTags: Tag[] = [];
  selectedTags: Tag[] = [];
  tagsOfCurrentTask: Tag[] = [];

  ngOnInit() {
    this.appState = loadedAppState;
    this.updateViewModel();
  }

  onUnhappyClicked() {
    if (this.appState.shouldRebuildQueueForToday()) {
      this.appState.rebuildQueue();
    } else {
      this.appState.processAnswerValidation(false);
    }
    this.updateViewModel()
  }

  toggleAnswerVisible() {
    this.answerVisible = !this.answerVisible;
  }

  onHappyClicked() {
    if (this.appState.shouldRebuildQueueForToday()) {
      this.appState.rebuildQueue();
    } else {
      this.appState.processAnswerValidation(true);
    }
    this.updateViewModel();
  }

  updateViewModel(): void {
    let currentTask = this.appState.getCurrentTask();
    if (!currentTask) {
      this.curQuestion = null;
      this.curAnswer = null;
      return;
    }
    this.curQuestion = currentTask.question;
    this.curAnswer = currentTask.answer;
    this.answerVisible = false;
    this.tagsOfCurrentTask = this.appState.getTagsOfCurrentTask();
    this.availableTags = this.appState.getAvailableTags();
  }

  public importQuestionAnswerPairsFromTxtFile(event: Event, withTags:boolean = false) {
    let tags: Tag[] = (withTags) ? [this.availableTags[0], this.availableTags[1]] : [];
    // let tags: Tag[] = (withTags) ? this.selectedTags : []; // TODO

    if (event.target instanceof HTMLInputElement && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.appState.parseAndImportQuestionAnswerPairsWithTags(reader.result as string, tags);
        this.updateViewModel();
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  importTagsFromTxtFile(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.appState.parseAndImportTags(reader.result as string);
        this.updateViewModel();
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  exportAppState() {
    const blob = new Blob([JSON.stringify(this.appState, replacer)], {type: "application/json"});
    const date= new Date();
    saveAs(blob, `${date.toISOString().substring(0, 19)}_appState.json`);
  }

  importAppState(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // TODO think about a more elegant way to revive the objects, no import of Queue etc. should be necessary
        let imported = JSON.parse(reader.result as string, reviver);
        this.appState._queue = new Queue(imported._queue._hashAndRepetitions, imported._queue._nextRebuildDate);
        let tasks: Task[] = [];
        imported._allTasks._taskByHash.forEach((value) => tasks.push(value));
        let taskCollection: TaskCollection = new TaskCollection(new Map());
        taskCollection.addTasks(tasks);
        this.appState._allTasks = taskCollection;
        this.appState._pauseUntil = new PauseUntil(imported._pauseUntil._dateAndCountByTaskHash);
        if (this.appState.shouldRebuildQueueForToday()) {
          this.appState.rebuildQueue();
        }
        this.updateViewModel();
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  prioritizeQueue() {
    this.appState.prioritizeTags([this.availableTags[0], this.availableTags[1]]);
    // this.appState.prioritizeTags(this.selectedTags); // TODO
    this.updateViewModel();
  }

  forceQueueRebuild() {
    this.appState.rebuildQueue();
  }

  deleteCurrentPair() {
    this.appState.deleteCurrentPair();
    this.updateViewModel();
  }
}

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  const dateFormat: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d*)*Z/;
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  } else if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
}
