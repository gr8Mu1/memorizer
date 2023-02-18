import { AppState } from './app-state';
import {HashAndRepetitions, Queue} from "./queue";
import {TaskCollection, Task} from "./task-collection";
import {PauseUntil} from "./pause-until";

describe('AppState', () => {
  it('should create an instance', () => {
    expect(new AppState(null, null, null, null)).toBeTruthy();
  });

  it('should update queue', () => {
    let innerQ: HashAndRepetitions[] = [];
    let innerAllTasks = new Map<string, Task>();
    for (let i = 0; i < 4; i++) {
      let hash = `${i}`;
      innerQ.push({taskHash: hash, correctInARow:0})
      let task: Task = {question: `q${i}`, answer: `a${i}`};
      innerAllTasks.set(hash, task);
    }
    let appState = new AppState(new TaskCollection(innerAllTasks), new Queue(innerQ), new PauseUntil(new Map()), null);
    appState.processAnswerValidation(true);
    expect(appState._queue._hashAndRepetitions[0].taskHash).toEqual('1');
    expect(appState._queue._hashAndRepetitions[0].correctInARow).toEqual(0);
    expect(appState._queue._hashAndRepetitions[1].taskHash).toEqual('2');
    expect(appState._queue._hashAndRepetitions[2].taskHash).toEqual('0');
    expect(appState._queue._hashAndRepetitions[2].correctInARow).toEqual(1);
    expect(appState._queue._hashAndRepetitions[3].taskHash).toEqual('3');
    expect(appState._queue._hashAndRepetitions.length).toEqual(4);
  });

  it('should drop one element from the queue', () => {
    let innerQ: HashAndRepetitions[] = [];
    let innerAllTasks = new Map<string, Task>();
    for (let i = 0; i < 4; i++) {
      let hash = `${i}`;
      innerQ.push({taskHash: hash, correctInARow:4})
      let task: Task = {question: `q${i}`, answer: `a${i}`};
      innerAllTasks.set(hash, task);
    }
    let appState = new AppState(new TaskCollection(innerAllTasks), new Queue(innerQ), new PauseUntil(new Map()), null);
    appState.processAnswerValidation(true);
    expect(appState._queue._hashAndRepetitions[0].taskHash).toEqual('1');
    expect(appState._queue._hashAndRepetitions[0].correctInARow).toEqual(4);
    expect(appState._queue._hashAndRepetitions[1].taskHash).toEqual('2');
    expect(appState._queue._hashAndRepetitions[2].taskHash).toEqual('3');
    expect(appState._pauseUntil._dateAndCountByTaskHash.get('0').count).toEqual(1);
    expect(appState._pauseUntil._dateAndCountByTaskHash.size).toEqual(1);
  });
});
