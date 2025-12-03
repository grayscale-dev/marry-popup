export class EventClass {
  id: string;
  date: Date | null;
  endTime: any = 0;
  startTime: any = 0;
  address: string;

  constructor() {
    this.id = "";
    this.date = null;
    this.address = "";
  }
}

export function getMinDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

export function getMaxDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

export function getTotalHours(events: EventClass[]): number {
  if (events.length === 1) {
    if (
      events[0].startTime?.code !== undefined &&
      events[0].endTime?.code !== undefined
    ) {
      return events[0].endTime.code - events[0].startTime.code;
    } else {
      return 4;
    }
  } else if (events.length > 1) {
    let total = 0;
    for (const event of events) {
      if (
        event.startTime?.code !== undefined &&
        event.endTime?.code !== undefined
      ) {
        total += event.endTime.code - event.startTime.code;
      } else {
        total += 4;
      }
    }
    return total;
  }
  return 4;
}
