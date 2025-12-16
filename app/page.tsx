"use client";
import { useState } from "react";
import { BookingClass } from "./models/Booking";
import { useDeepState } from "./utils/useDeepState";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import DateTimePicker from "./components/datetime-picker";
import { CostCalculator } from "./utils/costCalculator";
import { SelectButton } from "primereact/selectbutton";
import { RadioButton } from "primereact/radiobutton";
import ContactInfo from "./components/contact-info";
import { ChildrenAndInfantsSelector } from "./components/children-and-infants-selector";
import { InputAddress } from "./components/input-address";
import { SecondEvent } from "./components/second-event";
import { getTotalHours } from "./models/Event";

export default function Home() {
  const [booking, updateBooking] = useDeepState<BookingClass>(
    new BookingClass()
  );
  // const [booking, setBooking] = useState<BookingClass>(new BookingClass());
  const [showSummary, setShowSummary] = useState(false);
  const [showError, setShowError] = useState(false);
  const calcs = new CostCalculator(
    booking.children,
    booking.infants,
    getTotalHours(booking.events)
  );

  const formValid = () => {
    const requiredFields = [
      { key: "firstName", value: booking.customer.firstName },
      { key: "lastName", value: booking.customer.lastName },
      { key: "phoneNumber", value: booking.customer.phoneNumber },
      { key: "email", value: booking.customer.email },
    ];
    const errors = requiredFields
      .filter((field) => field.value === "")
      .map((field) => field.key);
    updateBooking("errors", errors);
  };

  const submit = () => {
    updateBooking("showInvalidFields", true);
    if (!booking.formInvalid) {
      updateBooking("showInvalidFields", false);
      setShowSummary(true);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center h-fit gap-10 text-neutral-600 bg-white p-10 rounded-4xl shadow-xl z-1 w-full max-w-150">
        {!showSummary && (
          <>
            {" "}
            <ContactInfo booking={booking} updateBooking={updateBooking} />
            <ChildrenAndInfantsSelector
              booking={booking}
              updateBooking={updateBooking}
            />
            <InputAddress
              booking={booking}
              updateBooking={updateBooking}
              eventIndex={0}
            />
            <DateTimePicker
              booking={booking}
              updateBooking={updateBooking}
              eventIndex={0}
            />
            {Boolean(booking.events[0].endTime) && (
              <SecondEvent booking={booking} updateBooking={updateBooking} />
            )}
            <button
              className="w-full bg-[#f5dedf] rounded-2xl py-3 cursor-pointer hover:shadow-lg transition-shadow duration-300 shadow-neutral-100 disabled:opacity-70 disabled:cursor-default"
              onClick={(e) => {
                e.preventDefault();
                submit();
              }}
              type="submit"
            >
              Continue to summary
            </button>
            {booking.showInvalidFields && (
              <p className="text-red-500" id="error-message">
                {booking.durationsInvalid != null
                  ? booking.durationsInvalid
                  : "Please review the highlighted fields above."}
              </p>
            )}
          </>
        )}

        {showSummary && (
          <>
            <button
              className="text-blue-500 text-start w-fit"
              onClick={() => {
                setShowSummary(false);
              }}
            >
              Edit booking info
            </button>
            <div>
              <h1 className="text-2xl">Summary</h1>

              <p
                className="text-sm text-gray-500 mt-3"
                data-testid="DatePickerHelperText"
              >
                Please review your information before checkout.
              </p>
            </div>
            <div className="flex flex-col gap-1 bg-gray-100 p-5 rounded-xl">
              <h2 className="text-lg mb-2">Customer</h2>
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Name</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="customer-name"
                >
                  {booking.customer.firstName + " " + booking.customer.lastName}
                </h1>
              </div>
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Phone Number</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="customer-phone"
                >
                  {booking.customer.phoneNumber}
                </h1>
              </div>
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Email</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="customer-email"
                >
                  {booking.customer.email}
                </h1>
              </div>
            </div>

            {booking.events.map((event, idx) => (
              <div
                className="flex flex-col gap-1 bg-gray-100 p-5 rounded-xl"
                key={idx}
              >
                <h2 className="text-lg mb-2">
                  {idx === 0 ? "Primary Event" : "Secondary Event"}
                </h2>
                <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                  <p className="opacity-75">Address</p>
                  <h1
                    className="font-semibold tracking-wider"
                    data-testid={`event-${idx}-address`}
                  >
                    {event.address}
                  </h1>
                </div>
                <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                  <p className="opacity-75">Date</p>
                  <h1
                    className="font-semibold tracking-wider"
                    data-testid={`event-${idx}-date`}
                  >
                    {booking.events[0].date?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h1>
                </div>
                <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                  <p className="opacity-75">Time</p>
                  <h1
                    className="font-semibold tracking-wider"
                    data-testid={`event-${idx}-time`}
                  >
                    {event.startTime.name + " - " + event.endTime.name}
                  </h1>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-1 bg-gray-100 p-5 rounded-xl">
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Total Children</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="total-children"
                >
                  {calcs.totalKids + calcs.totalInfants}{" "}
                  {calcs.totalInfants > 0 && (
                    <span className="text-gray-400">
                      ({calcs.totalInfants} under 18 months)
                    </span>
                  )}
                </h1>
              </div>
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Total Nannies</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="total-nannies"
                >
                  {calcs.totalNannies}
                </h1>
              </div>
              <div className="flex justify-between items-center gap-3 text-neutral-600 w-full">
                <p className="opacity-75">Total Hours</p>
                <h1
                  className="font-semibold tracking-wider"
                  data-testid="total-hours"
                >
                  {calcs.totalHours}
                </h1>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3 text-neutral-600 w-full px-5">
              <p className="opacity-75">Subtotal</p>
              <h1
                className="font-semibold tracking-wider text-2xl"
                data-testid="subtotal"
              >
                ${calcs.clientSubtotal}
              </h1>
            </div>
            <div className="flex gap-5">
              <button
                className="w-full bg-gray-100 rounded-2xl py-3 cursor-pointer hover:shadow-lg transition-shadow duration-300 shadow-neutral-100 disabled:opacity-70 disabled:cursor-default"
                onClick={(e) => {
                  // e.preventDefault();
                  // submit();
                }}
              >
                Edit Booking
              </button>
              <button
                className="w-full bg-[#f5dedf] rounded-2xl py-3 cursor-pointer hover:shadow-lg transition-shadow duration-300 shadow-neutral-100 disabled:opacity-70 disabled:cursor-default"
                onClick={(e) => {
                  // e.preventDefault();
                  // submit();
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
      {!showSummary && (
        <div className="flex justify-between items-center gap-3 text-neutral-600 bg-white p-5 rounded-b-4xl shadow-xl text-center w-full max-w-150 -mt-15 pt-15">
          <p className="opacity-75">Subtotal</p>
          <h1 className="font-semibold tracking-wider text-2xl summary-price">
            ${calcs.clientSubtotal}
          </h1>
        </div>
      )}
    </>
  );
}
