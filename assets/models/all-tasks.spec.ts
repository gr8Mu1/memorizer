import {AllTasks, Task} from './all-tasks';

describe('ExerciseTasks', () => {
  it('should create an instance', () => {
    let m: Map<string, Task> = new Map();
    expect(new AllTasks(m)).toBeTruthy();
  });
});
