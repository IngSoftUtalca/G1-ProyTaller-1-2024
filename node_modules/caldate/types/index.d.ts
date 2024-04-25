declare module 'caldate' {
  export interface Options {
    year?: string | number;
    month?: string | number;
    day?: string | number;
    hour?: string | number;
    minute?: string | number;
    second?: string | number;
    duration?: string | number;
  }

  class CalDate {
    constructor(opts?: Date | Options);

    set(opts?: Date | Options): CalDate;
    isEqualDate(calDate: CalDate): boolean;
    getDay(): number;
    setOffset(number: number, unit?: string): CalDate;
    setTime(hour?: number, minute?: number, second?: number): CalDate;
    setDuration(duration: number): CalDate;
    update(): CalDate;
    toEndDate(): CalDate;
    toTimezone(timezone?: string): Date;
    fromTimezone(dateUTC: Date, timezone?: string): CalDate;
    toDate(): Date;
    toISOString(): string;
    toString(): string;
  }

  export default CalDate;
}
