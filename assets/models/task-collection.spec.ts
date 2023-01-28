import {TaskCollection, Task} from './task-collection';

describe('TaskCollection', () => {
  it('should create an instance', () => {
    let m: Map<string, Task> = new Map();
    expect(new TaskCollection(m)).toBeTruthy();
  });
});
