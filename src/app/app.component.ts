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


}
