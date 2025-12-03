import { RadioButton } from "primereact/radiobutton";
import { BookingProps } from "../models/Booking";
import { useState } from "react";
import { InputAddress } from "./input-address";
import { EventClass } from "../models/Event";
import DateTimePicker from "./datetime-picker";

export const SecondEvent: React.FC<BookingProps> = ({
  booking,
  updateBooking,
}) => {
  function updateSecondEvent(value: boolean) {
    updateBooking("events", [booking.events[0]]);
    if (value) {
      updateBooking("events.1", new EventClass());
    }
  }

  return (
    <>
      <div>
        <p className="mb-4">
          Will there be a second event, such as a reception?
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex align-items-center">
            <RadioButton
              inputId="yes"
              name="secondEvent"
              value={true}
              onChange={(e) => updateSecondEvent(e.value)}
              checked={booking.events.length > 1}
            />
            <label htmlFor="yes" className="ml-2">
              Yes
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              inputId="no"
              name="secondEvent"
              value={false}
              onChange={(e) => updateSecondEvent(e.value)}
              checked={booking.events.length == 1}
            />
            <label htmlFor="no" className="ml-2">
              No
            </label>
          </div>
        </div>
      </div>

      {booking.events.length > 1 && (
        <>
          <InputAddress
            booking={booking}
            updateBooking={updateBooking}
            eventIndex={1}
          />
          <DateTimePicker
            booking={booking}
            updateBooking={updateBooking}
            eventIndex={1}
          />
        </>
      )}
    </>
  );
};
