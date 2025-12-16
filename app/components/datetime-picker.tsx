import {
  Calendar,
  CalendarPassThroughOptions,
  CalendarViewChangeEvent,
} from "primereact/calendar";
import { BookingEventProps } from "../models/Booking";
import { getMaxDate, getMinDate } from "../models/Event";
import { SyntheticEvent } from "react";
import times, { filteredEndTimes, filteredStartTimes } from "../models/Times";
import { Dropdown } from "primereact/dropdown";

const calendarPt: CalendarPassThroughOptions = {
  input: { root: { "data-testid": "DayPicker" } },
};

const DateTimePicker: React.FC<BookingEventProps> = ({
  booking,
  updateBooking,
  eventIndex,
}) => {
  const updateStartDate = (value: Date | null) => {
    updateBooking(
      eventIndex == 0 ? "events.0.startTime" : "events.1.startTime",
      value
    );
    updateBooking(eventIndex == 0 ? "events.0.endTime" : "events.1.endTime", 0);
  };

  return (
    <div data-testid="DatetimePickerComponent">
      <p className="font-thin mb-4">
        What is the date and time of your{" "}
        {eventIndex == 0 ? "wedding" : "second event"}?
      </p>
      <Calendar
        value={booking?.events[0]?.date}
        onChange={(e) => updateBooking(`events.0.date`, e.value)}
        className="block w-full p-inputtext-sm"
        variant="filled"
        placeholder={`${eventIndex == 0 ? "Wedding" : "Second Event"} Date`}
        minDate={getMinDate()}
        maxDate={getMaxDate()}
        pt={calendarPt}
        disabled={eventIndex != 0}
        invalid={booking.dateInvalid && booking.showInvalidFields}
        id={`date-picker-${eventIndex}`}
      />
      {eventIndex != 0 && (
        <p
          className="text-sm text-gray-500 mt-4"
          data-testid="DatePickerHelperText"
        >
          Secondary events must be on the same day as the primary event.
        </p>
      )}

      <div className="flex gap-5 mt-3">
        <div className="flex-1">
          <Dropdown
            value={booking?.events[eventIndex]?.startTime}
            onChange={(e) => updateStartDate(e.value)}
            options={filteredStartTimes(booking?.events, eventIndex)}
            optionLabel="name"
            placeholder="Start Time"
            className="block w-full p-inputtext-sm"
            disabled={!booking?.events[0]?.date}
            variant="filled"
            invalid={
              booking.startTimeInvalid(eventIndex) && booking.showInvalidFields
            }
            id={`start-time-picker-${eventIndex}`}
          />
        </div>

        <div className="flex-1">
          <Dropdown
            value={booking?.events[eventIndex]?.endTime}
            onChange={(e) => {
              updateBooking(`events.${eventIndex}.endTime`, e.value);
            }}
            options={filteredEndTimes(booking?.events, eventIndex)}
            optionLabel="name"
            placeholder="End Time"
            className="block w-full p-inputtext-sm"
            disabled={
              !booking?.events[0]?.date ||
              !booking?.events[eventIndex]?.startTime
            }
            variant="filled"
            invalid={
              booking.endTimeInvalid(eventIndex) && booking.showInvalidFields
            }
            id={`end-time-picker-${eventIndex}`}
          />
        </div>
      </div>
      <p
        className="text-sm text-gray-500 mt-4"
        data-testid="DatePickerHelperText"
      >
        Our nannies are available between 7:00 AM and 10:00 PM. Please note that
        bookings require a minimum of 4 hours and a maximum of 10 hours{" "}
        <b>between all events.</b>
      </p>
    </div>
  );
};

export default DateTimePicker;
