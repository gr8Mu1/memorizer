import { SchedulingInformation } from './scheduling-information';

describe('SchedulingInformation', () => {
  it('should create an instance', () => {
    expect(new SchedulingInformation()).toBeTruthy();
  });

  it('should reset the count and change nothing else', () => {
    let s = new SchedulingInformation();
    s.answered(true);
    s.answered(false);
    expect(s._successivelyToday).toEqual(0);
    expect(s._askAgainDays.length).toEqual(0);
  });

  it('should correctly count correct answers in a row', () => {
    let s = new SchedulingInformation();
    s.answered(true);
    s.answered(true);
    s.answered(false);
    s.answered(true);
    expect(s._successivelyToday).toEqual(1);
  });

  it('should reset the count and add a date', () => {
    let s = new SchedulingInformation();
    for (let days = 1; days <= 4; days++) {
      for (let i = 0; i < 5; i++) {
        s.answered(true);
      }
      expect(s._successivelyToday).toEqual(0);
      expect(s._askAgainDays.length).toEqual(days);
    }
  });

});
