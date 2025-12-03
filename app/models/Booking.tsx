import { CustomerClass } from "./Customer";
import { EventClass } from "./Event";

export class BookingClass {
  customer: CustomerClass;
  events: EventClass[];
  children: number;
  infants: number;
  showInvalidFields: boolean = false;

  constructor() {
    this.customer = new CustomerClass();
    this.events = [new EventClass()];
    this.children = 1;
    this.infants = 0;
  }

  get formInvalid() {
    this.showInvalidFields = true;
    return (
      !this.allAddressesValid ||
      !this.allStartTimesValid ||
      !this.allEndTimesValid ||
      this.firstNameInvalid ||
      this.lastNameInvalid ||
      this.phoneNumberInvalid ||
      this.emailInvalid ||
      this.dateInvalid
    );
  }

  get firstNameInvalid() {
    return this.customer.firstName == "";
  }

  get lastNameInvalid() {
    return this.customer.lastName == "";
  }

  get phoneNumberInvalid() {
    return this.customer.phoneNumber == "";
  }

  get emailInvalid() {
    return (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.customer.email) &&
      this.showInvalidFields
    );
  }

  get dateInvalid() {
    return !this.events[0].date;
  }
  addressInvalid(eventIndex: number) {
    return this.events[eventIndex].address == "";
  }

  startTimeInvalid(eventIndex: number) {
    return !this.events[eventIndex].startTime;
  }

  endTimeInvalid(eventIndex: number) {
    return !this.events[eventIndex].endTime;
  }

  get allAddressesValid() {
    const hasInvalid = this.events.some((event, index) =>
      this.addressInvalid(index)
    );
    if (hasInvalid) {
      return false;
    }
    return true;
  }

  get allStartTimesValid() {
    const hasInvalid = this.events.some((event, index) =>
      this.startTimeInvalid(index)
    );
    if (hasInvalid) {
      return false;
    }
    return true;
  }

  get allEndTimesValid() {
    const hasInvalid = this.events.some((event, index) =>
      this.endTimeInvalid(index)
    );
    if (hasInvalid) {
      return false;
    }
    return true;
  }
}

export type BookingProps = {
  booking: BookingClass;
  updateBooking: Function;
};

export interface BookingEventProps extends BookingProps {
  eventIndex: number;
}
