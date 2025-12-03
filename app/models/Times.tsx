import { EventClass } from "./Event";

type TimeOption = {
  name: string;
  code: number;
};

const times: TimeOption[] = [
  { name: "7:00 am", code: 0 },
  { name: "7:15 am", code: 0.25 },
  { name: "7:30 am", code: 0.5 },
  { name: "7:45 am", code: 0.75 },
  { name: "8:00 am", code: 1 },
  { name: "8:15 am", code: 1.25 },
  { name: "8:30 am", code: 1.5 },
  { name: "8:45 am", code: 1.75 },
  { name: "9:00 am", code: 2 },
  { name: "9:15 am", code: 2.25 },
  { name: "9:30 am", code: 2.5 },
  { name: "9:45 am", code: 2.75 },
  { name: "10:00 am", code: 3 },
  { name: "10:15 am", code: 3.25 },
  { name: "10:30 am", code: 3.5 },
  { name: "10:45 am", code: 3.75 },
  { name: "11:00 am", code: 4 },
  { name: "11:15 am", code: 4.25 },
  { name: "11:30 am", code: 4.5 },
  { name: "11:45 am", code: 4.75 },
  { name: "12:00 pm", code: 5 },
  { name: "12:15 pm", code: 5.25 },
  { name: "12:30 pm", code: 5.5 },
  { name: "12:45 pm", code: 5.75 },
  { name: "1:00 pm", code: 6 },
  { name: "1:15 pm", code: 6.25 },
  { name: "1:30 pm", code: 6.5 },
  { name: "1:45 pm", code: 6.75 },
  { name: "2:00 pm", code: 7 },
  { name: "2:15 pm", code: 7.25 },
  { name: "2:30 pm", code: 7.5 },
  { name: "2:45 pm", code: 7.75 },
  { name: "3:00 pm", code: 8 },
  { name: "3:15 pm", code: 8.25 },
  { name: "3:30 pm", code: 8.5 },
  { name: "3:45 pm", code: 8.75 },
  { name: "4:00 pm", code: 9 },
  { name: "4:15 pm", code: 9.25 },
  { name: "4:30 pm", code: 9.5 },
  { name: "4:45 pm", code: 9.75 },
  { name: "5:00 pm", code: 10 },
  { name: "5:15 pm", code: 10.25 },
  { name: "5:30 pm", code: 10.5 },
  { name: "5:45 pm", code: 10.75 },
  { name: "6:00 pm", code: 11 },
  { name: "6:15 pm", code: 11.25 },
  { name: "6:30 pm", code: 11.5 },
  { name: "6:45 pm", code: 11.75 },
  { name: "7:00 pm", code: 12 },
  { name: "7:15 pm", code: 12.25 },
  { name: "7:30 pm", code: 12.5 },
  { name: "7:45 pm", code: 12.75 },
  { name: "8:00 pm", code: 13 },
  { name: "8:15 pm", code: 13.25 },
  { name: "8:30 pm", code: 13.5 },
  { name: "8:45 pm", code: 13.75 },
  { name: "9:00 pm", code: 14 },
  { name: "9:15 pm", code: 14.25 },
  { name: "9:30 pm", code: 14.5 },
  { name: "9:45 pm", code: 14.75 },
  { name: "10:00 pm", code: 15 },
  { name: "10:15 pm", code: 15.25 },
  { name: "10:30 pm", code: 15.5 },
  { name: "10:45 pm", code: 15.75 },
  { name: "11:00 pm", code: 16 },
];

export default times;

export const filteredStartTimes = (
  events: EventClass[],
  eventIndex: number
) => {
  if (eventIndex == 0) {
    return times.filter((time) => time.code <= 12);
  }
  return times.filter((time) => time.code >= events[0].endTime.code);
};

export const filteredEndTimes = (events: EventClass[], eventIndex: number) => {
  if (eventIndex == 0) {
    return times.filter(
      (time) =>
        time.code >= events[0]?.startTime.code + 4 &&
        time.code <= events[0].startTime.code + 10
    );
  }
  return times.filter(
    (time) =>
      time.code > events[1]?.startTime.code &&
      time.code <=
        events[1].startTime.code +
          (10 - (events[0].endTime.code - events[0].startTime.code))
  );
};
