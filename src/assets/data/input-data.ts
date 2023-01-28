import {AppState} from "../models/app-state";
import {TaskCollection} from "../models/task-collection";
import {Task} from "../models/task-collection";
import {Queue} from "../models/queue";
import {PauseUntil} from "../models/pause-until";

export {loadedAppState}

/**
 * the real loadExerciseState method should load the saved exercise state from file
 * this method creates exercises of the form ['q1', 'a1'],...
 * @param len
 */
function mockLoadAppState(len: number): AppState {
  let tasksToImport: Task[] = [];
  for (let i = 0; i < len; i++) {
    tasksToImport.push({question: `q${i}`, answer: `a${i}`});
  }

  let allTasks = new TaskCollection(new Map<string, Task>());
  allTasks.addTasks(tasksToImport);

  let queue = new Queue([]).addHashes(allTasks.getAllHashes());

  return new AppState(allTasks, queue, PauseUntil.createEmpty())
}

let loadedAppState: AppState = mockLoadAppState(18);

