import { Component } from '@angular/core';
import {loadedAppState} from "../assets/data/input-data";
import {AppState} from "../assets/models/app-state";
import {saveAs} from "file-saver";

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
    this.appState.processAnswerValidation(false);
    this.updateCurrentTask()
  }

  toggleAnswerVisible() {
    this.answerVisible = !this.answerVisible;
  }

  onHappyClicked() {
    this.appState.processAnswerValidation(true);
    this.updateCurrentTask();
  }

  updateCurrentTask(): void {
    let currentTask = this.appState.getCurrentTask();
    this.curQuestion = currentTask.question;
    this.curAnswer = currentTask.answer;
    this.answerVisible = false;
  }

  contents = '';

  importTxtFile(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.contents = reader.result as string;
        this.appState.parseAndImportQuestionAnswerPairs(reader.result as string);
        this.updateCurrentTask();
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  save() {
    const blob = new Blob(['Hello, World!']);
    saveAs(blob, 'out.txt');
  }

  clearQueue() {
    // TODO properly implement, update appState, ngIf -> no tasks loaded
  }
}
