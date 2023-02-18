import { PauseUntil } from './pause-until';

describe('PauseUntil', () => {
  it('should create an instance', () => {
    expect(new PauseUntil(null)).toBeTruthy();
  });

  it('should add an entry', () => {
    let pauseUntil = new PauseUntil(new Map());
    pauseUntil.pause('1')
    // TODO filterAvailable...
    // expect(pauseUntil.isAvailableNow('asf')).toBeTrue();
    // expect(pauseUntil.isAvailableNow('1')).not.toBeTrue();
  });
});
