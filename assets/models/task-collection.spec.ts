import {TaskCollection, Task} from './task-collection';

describe('TaskCollection', () => {
  it('should create an instance', () => {
    let m: Map<string, Task> = new Map();
    expect(new TaskCollection(m)).toBeTruthy();
  });

  it('should add all elements', () => {
    let m: Map<string, Task> = new Map();
    let taskCollection = new TaskCollection(m);
    let tasks: Task[] = [];
    for (let i = 0; i < 5; i++) {
      tasks.push({question: `q${i}`, answer: `a${i}`});
    }
    let [addedActual, allActual] = taskCollection.addTasks(tasks);
    expect(addedActual.length).toEqual(tasks.length);
    expect(allActual.length).toEqual(tasks.length);
  });

  it('should add all elements only once', () => {
    let m: Map<string, Task> = new Map();
    let taskCollection = new TaskCollection(m);
    let tasks: Task[] = [];
    for (let i = 0; i < 5; i++) {
      tasks.push({question: `q${i}`, answer: `a${i}`});
    }
    taskCollection.addTasks(tasks);
    let tasks2 = tasks.slice(2, 4);
    let [addedActual, allActual] = taskCollection.addTasks(tasks2);
    expect(addedActual.length).toEqual(0);
    expect(allActual.length).toEqual(tasks2.length);
  });
});
