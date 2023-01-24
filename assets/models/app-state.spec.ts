import { AppState } from './app-state';
import {HashAndRepetitions, Queue} from "./queue";
import {AllTasks, Task} from "./all-tasks";
import {PauseUntil} from "./pause-until";

describe('AppState', () => {
  it('should create an instance', () => {
    expect(new AppState(null, null, null)).toBeTruthy();
  });

  it('should update queue', () => {
    let innerQ: HashAndRepetitions[] = [];
    let innerAllTasks = new Map<string, Task>();
    for (let i = 0; i < 4; i++) {
      innerQ.push({taskHash: `${i}`, correctInARow:0})
      let task: Task = {question: `q${i}`, answer: `a${i}`};
      innerAllTasks.set(AllTasks.computeHash(task), task);
    }
    let appState = new AppState(new AllTasks(innerAllTasks), new Queue(innerQ), new PauseUntil(new Map()));
    appState.processAnswerValidation(true);
    expect(appState._queue._queue[0].taskHash).toEqual('1');
    expect(appState._queue._queue[0].correctInARow).toEqual(0);
    expect(appState._queue._queue[1].taskHash).toEqual('2');
    expect(appState._queue._queue[2].taskHash).toEqual('0');
    expect(appState._queue._queue[2].correctInARow).toEqual(1);
    expect(appState._queue._queue[3].taskHash).toEqual('3');
    expect(appState._queue._queue.length).toEqual(4);
  });

  it('should drop one element from the queue', () => {
    let innerQ: HashAndRepetitions[] = [];
    let innerAllTasks = new Map<string, Task>();
    for (let i = 0; i < 4; i++) {
      innerQ.push({taskHash: `${i}`, correctInARow:4})
      let task: Task = {question: `q${i}`, answer: `a${i}`};
      innerAllTasks.set(AllTasks.computeHash(task), task);
    }
    let appState = new AppState(new AllTasks(innerAllTasks), new Queue(innerQ), new PauseUntil(new Map()));
    appState.processAnswerValidation(true);
    expect(appState._queue._queue[0].taskHash).toEqual('1');
    expect(appState._queue._queue[0].correctInARow).toEqual(4);
    expect(appState._queue._queue[1].taskHash).toEqual('2');
    expect(appState._queue._queue[2].taskHash).toEqual('3');
    expect(appState._pauseUntil._dateAndCountByTaskHash.get('0').count).toEqual(1);
    expect(appState._pauseUntil.isAvailableNow('0')).toBeFalse();
    expect(appState._pauseUntil.isAvailableNow('1')).toBeTrue();
  });
});
