import { RecordSchedule } from './record-schedule';

describe('SchedulingInformation', () => {
  it('should create an instance', () => {
    expect(new RecordSchedule()).toBeTruthy();
  });

  it('should reset the count and change nothing else', () => {
    let s = new RecordSchedule();
    s.answered(true);
    s.answered(false);
    expect(s._successivelyToday).toEqual(0);
    expect(s._askAgainDays.length).toEqual(0);
  });

  it('should correctly count correct answers in a row', () => {
    let s = new RecordSchedule();
    s.answered(true);
    s.answered(true);
    s.answered(false);
    s.answered(true);
    expect(s._successivelyToday).toEqual(1);
  });

  it('should reset the count and add a date', () => {
    let s = new RecordSchedule();
    for (let days = 1; days <= 4; days++) {
      for (let i = 0; i < 5; i++) {
        s.answered(true);
      }
      expect(s._successivelyToday).toEqual(0);
      expect(s._askAgainDays.length).toEqual(days);
    }
  });

});
