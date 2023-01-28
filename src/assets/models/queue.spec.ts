import {HashAndRepetitions, Queue} from './queue';

describe('Queue', () => {
  it('should create an instance', () => {
    let q: HashAndRepetitions[] = [];
    expect(new Queue(q)).toBeTruthy();
  });

  it('should move to pos1', () => {
    let q = new Queue([
      {taskHash:'1', correctInARow:4},
      {taskHash:'2', correctInARow:0},
      {taskHash:'3', correctInARow:0},
      {taskHash:'4', correctInARow:0},
      ]
    )
    q.updateFromAnswer(false);
    expect(q._hashAndRepetitions[0].taskHash).toEqual('2');
    expect(q._hashAndRepetitions[1].taskHash).toEqual('1');
    expect(q._hashAndRepetitions[2].taskHash).toEqual('3');
    expect(q._hashAndRepetitions[2].correctInARow).toEqual(0);
  });

  it('should move to pos2', () => {
    let q = new Queue([
      {taskHash:'1', correctInARow:0},
      {taskHash:'2', correctInARow:0},
      {taskHash:'3', correctInARow:0},
      {taskHash:'4', correctInARow:0},
      ]
    )
    q.updateFromAnswer(true);
    expect(q._hashAndRepetitions[0].taskHash).toEqual('2');
    expect(q._hashAndRepetitions[1].taskHash).toEqual('3');
    expect(q._hashAndRepetitions[2].taskHash).toEqual('1');
    expect(q._hashAndRepetitions[2].correctInARow).toEqual(1);
  });

  it('should remove first element', () => {
    let inner: HashAndRepetitions[] = [];
    for (let i = 0; i < 4; i++) {
        inner.push({taskHash: `${i}`, correctInARow:4})
    }
    let q = new Queue(inner);
    let removed = q.updateFromAnswer(true);

    expect(removed).toEqual('0');
    expect(q._hashAndRepetitions[0].taskHash).toEqual('1');
    expect(q._hashAndRepetitions[1].taskHash).toEqual('2');
    expect(q._hashAndRepetitions[2].taskHash).toEqual('3');
    expect(q._hashAndRepetitions.length).toEqual(3);

  });
});
