import { Component } from '@angular/core';
import {questionsAndAnswers} from "../assets/data/input-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'memorizer';
  records = questionsAndAnswers;
}
