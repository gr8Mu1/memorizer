import { Component } from '@angular/core';
import {loadedExerciseState} from "../assets/data/input-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'memorizer';
  exerciseState = loadedExerciseState;
  curQuestion = loadedExerciseState.getCurrentRecord().question;
  curAnswer = loadedExerciseState.getCurrentRecord().answer;

  ngOnInit() {
  }

  onRepeatClicked() {
    this.exerciseState.onUnsatisfactorilyAnswered();
    this.updateCurrentExercise();
  }

  onHappyClicked() {
    this.exerciseState.onSatisfactorilyAnswered();
    this.updateCurrentExercise();
  }

  updateCurrentExercise(): void {
    this.curQuestion = loadedExerciseState.getCurrentRecord().question;
    this.curAnswer = loadedExerciseState.getCurrentRecord().answer;
  }
}
