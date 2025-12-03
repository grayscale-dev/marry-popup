import { InputText } from "primereact/inputtext";
import { BookingProps } from "../models/Booking";
import { InputMask } from "primereact/inputmask";

const ContactInfo: React.FC<BookingProps> = ({ booking, updateBooking }) => {
  return (
    <>
      <div className="flex gap-10 sm:gap-5 flex-col sm:flex-row">
        <div className="flex-1">
          <p className="font-thin mb-2">First Name</p>
          <InputText
            value={booking?.customer.firstName}
            onChange={(e) =>
              updateBooking("customer.firstName", e.target.value)
            }
            placeholder="John"
            className="block w-full p-inputtext-sm"
            variant="filled"
            invalid={booking.firstNameInvalid && booking.showInvalidFields}
          />
        </div>

        <div className="flex-1">
          <p className="font-thin mb-2">Last Name</p>
          <InputText
            value={booking?.customer.lastName}
            onChange={(e) => updateBooking("customer.lastName", e.target.value)}
            placeholder="Doe"
            className="block w-full p-inputtext-sm"
            variant="filled"
            invalid={booking.lastNameInvalid && booking.showInvalidFields}
          />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-thin mb-2">Phone</p>
        <InputMask
          value={booking.customer.phoneNumber}
          onChange={(e) =>
            updateBooking("customer.phoneNumber", e.target.value)
          }
          mask="+1 (999)-999-9999"
          placeholder="+1 (801)-555-1234"
          className="block w-full p-inputtext-sm"
          variant="filled"
          invalid={booking.phoneNumberInvalid && booking.showInvalidFields}
        />
      </div>
      <div className="flex-1">
        <p className="font-thin mb-2">Email</p>
        <InputText
          value={booking.customer.email}
          onChange={(e) => updateBooking("customer.email", e.target.value)}
          placeholder="janedoe@gmail.com"
          className="block w-full p-inputtext-sm"
          variant="filled"
          type="email"
          invalid={booking.emailInvalid && booking.showInvalidFields}
        />
      </div>
    </>
  );
};

export default ContactInfo;
