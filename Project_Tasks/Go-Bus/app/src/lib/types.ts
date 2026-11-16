export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type ApiRes<T> = {
  success: boolean;
  count?: number;
  data: T;
};
export type Category = "first_class" | "business_class" | "economy_class";
export type Size = "large" | "medium";
export type scheduleType = "manual" | "daily" | "weekly" | "monthly";
export type Status = "scheduled" | "active" | "completed";
export type BookingStatus = "reserved" | "confirmed";

export type Trip = {
  _id: string;
  source: string;
  destination: string;
  busModelId: {
    _id: string;
    category: Category;
    size: Size;
    capacity: number;
    totalBusesCount: number;
    layoutDetails: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  availableSeats: number;
  bookedSeatsCount: number;
  price: number;
  tripDate: string;
  tripTime: string;
  scheduleType: scheduleType;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type TripDetails = Trip & {
  tripBooking: {
    seatNumbers: number[];
    status: "confirmed" | "reserved";
  }[];
};

export type RegisterUser = {
  name: string;
  phone: string;
  username: string;
  password: string;
};
export type LoginUser = {
  username: string;
  password: string;
};
export type UserRes = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      phone: string;
      username: string;
      role: string;
    };
    token: string;
  };
};
