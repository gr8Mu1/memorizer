import { Component } from '@angular/core';
import {loadedAppState} from "../assets/data/input-data";
import {AppState} from "../assets/models/app-state";
import {saveAs} from "file-saver";
import {Queue} from "../assets/models/queue";
import {Task, TaskCollection} from "../assets/models/task-collection";
import {PauseUntil} from "../assets/models/pause-until";

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

  ngOnInit() {
    this.appState = loadedAppState;
    this.updateCurrentTask();
  }

  onUnhappyClicked() {
    if (this.appState.shouldRebuildQueueForToday()) {
      this.appState.rebuildQueue();
    } else {
      this.appState.processAnswerValidation(false);
    }
    this.updateCurrentTask()
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
    this.updateCurrentTask();
  }

  updateCurrentTask(): void {
    let currentTask = this.appState.getCurrentTask();
    if (!currentTask) {
      this.curQuestion = null;
      this.curAnswer = null;
      return;
    }
    this.curQuestion = currentTask.question;
    this.curAnswer = currentTask.answer;
    this.answerVisible = false;
  }

  importTxtFile(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.appState.parseAndImportQuestionAnswerPairs(reader.result as string);
        this.updateCurrentTask();
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
        this.appState._queue = new Queue(imported._queue._hashAndRepetitions);
        let tasks: Task[] = [];
        imported._allTasks._taskByHash.forEach((value) => tasks.push(value));
        let taskCollection: TaskCollection = new TaskCollection(new Map());
        taskCollection.addTasks(tasks);
        this.appState._allTasks = taskCollection;
        let pauseUntil: PauseUntil = new PauseUntil(new Map());
        pauseUntil.replaceData(imported._pauseUntil._dateAndCountByTaskHash);
        this.appState._pauseUntil = pauseUntil;
        this.updateCurrentTask();
      };
      reader.readAsText(event.target.files[0]);
    }
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
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
