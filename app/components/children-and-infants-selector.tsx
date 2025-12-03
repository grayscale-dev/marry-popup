import { BookingProps } from "../models/Booking";

export const ChildrenAndInfantsSelector: React.FC<BookingProps> = ({
  booking,
  updateBooking,
}) => {
  return (
    <>
      <div>
        <p className="font-thin mb-4">How many children are in your party?</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {Array.from({ length: 20 }, (_, i) => (
            <button
              key={i}
              className={`bg-gray-100 rounded-md p-2 hover:bg-white cursor-pointer hover:shadow-md transform-color duration-300 transform-shadow border ${
                booking?.children == i + 1
                  ? "border-[#F5DEDF] bg-white shadow-md"
                  : "border-gray-300"
              }`}
              onClick={() => {
                updateBooking("children", i + 1);
                updateBooking("infants", 0);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-thin mb-4">
          How many of those children are 0-18 months?
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {Array.from({ length: booking?.children + 1 }, (_, i) => (
            <button
              key={i}
              className={`bg-gray-100 rounded-md p-2 hover:bg-white cursor-pointer hover:shadow-md transform-color duration-300 transform-shadow border ${
                booking?.infants == i
                  ? "border-[#F5DEDF] bg-white shadow-md"
                  : "border-gray-300"
              }`}
              onClick={() => updateBooking("infants", i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
