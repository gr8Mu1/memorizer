import { Component } from '@angular/core';
import {loadedAppState} from "../assets/data/input-data";
import {AppState} from "../assets/models/app-state";

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
}
