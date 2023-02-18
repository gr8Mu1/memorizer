import { PauseUntil } from './pause-until';

describe('PauseUntil', () => {
  it('should create an instance', () => {
    expect(new PauseUntil(null)).toBeTruthy();
  });

  it('should add an entry', () => {
    let pauseUntil = new PauseUntil(new Map());
    pauseUntil.pause('1');
    let filtered = pauseUntil.filterAvailable(['0', '1', '2']);
    expect(filtered).toEqual(['0', '2']);
    expect(pauseUntil._dateAndCountByTaskHash.get('1').count).toEqual(1);
  });

  it('should update count', () => {
    let pauseUntil = new PauseUntil(new Map());
    pauseUntil.pause('1');
    pauseUntil.pause('2');
    pauseUntil.pause('1');
    let filtered = pauseUntil.filterAvailable(['0', '1', '2']);
    expect(filtered).toEqual(['0']);
    expect(pauseUntil._dateAndCountByTaskHash.get('1').count).toEqual(2);
    expect(pauseUntil._dateAndCountByTaskHash.get('2').count).toEqual(1);
  });
});
