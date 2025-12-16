import { BookingEventProps, BookingProps } from "../models/Booking";
import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";

export const InputAddress: React.FC<BookingEventProps> = ({
  booking,
  updateBooking,
  eventIndex,
}) => {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const apiKey = "AIzaSyC_LU3fBcPS_H7RAuEPgNpxxnhJTPV8r6s";

  // Fetch places from Google Places API
  const searchPlaces = async (event: { query: string }) => {
    const q = event.query;
    if (q.length > 2) {
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-FieldMask": "places.displayName,places.formattedAddress",
            },
            body: JSON.stringify({ textQuery: q }),
          }
        );
        const data = await response.json();
        setPlaces(data.places || []);
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]);
      }
    } else {
      setPlaces([]);
    }
  };

  // Handle selection from autocomplete
  const handleSelect = (e: any) => {
    setQuery(e.value.formattedAddress);
    updateBooking(`events.${eventIndex}.address`, e.value.formattedAddress);
  };

  return (
    <div>
      <p className="font-thin mb-4">What is the address of your wedding?</p>
      <AutoComplete
        value={query ? query : booking.events[eventIndex].address}
        suggestions={places}
        completeMethod={searchPlaces}
        field="displayName.text"
        onChange={(e) => setQuery(e.value)}
        onSelect={handleSelect}
        placeholder="1234 Newlyweds Ave."
        className="block w-full p-inputtext-sm"
        variant="filled"
        itemTemplate={(item: any) => (
          <div className={item.index}>
            <div className="font-medium">{item.displayName?.text}</div>
            <div className="text-xs text-gray-500">{item.formattedAddress}</div>
          </div>
        )}
        pt={{
          input: { root: { className: `w-full address-input-${eventIndex}` } },
        }}
        invalid={
          booking.addressInvalid(eventIndex) && booking.showInvalidFields
        }
      />
    </div>
  );
};
