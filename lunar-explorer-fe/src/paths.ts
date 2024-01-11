export const paths = {
  home() {
    return "/";
  },
  tripsList(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      return "/trips";
    }
    return `/trips?startDate=${startDate}&endDate=${endDate}`;
  },
  booking(tripId: string) {
    return `/booking/${tripId}`;
  },
  profile() {
    return "/me/profile";
  },
  myBookings() {
    return "/me/bookings";
  },
  myBookingDetail(bookingNumber: string) {
    return `/me/bookings/${bookingNumber}`;
  },
  auth: {
    login() {
      return "/api/auth/signin";
    },
    signOut() {
      return "/api/auth/signout";
    },
  },
};

export const BOOKINS_SERVER_URL = "http://localhost:8000";
export const TRIPS_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/trips`;
export const BOOKINGS_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/bookings`;
export const AUTH_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/auth`;
export const MY_USER_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/users/me`;

export const restApi = {
  trips: {
    list(query: string) {
      return `${TRIPS_REST_API_URL}?${query}`;
    },
    getById(tripId: string) {
      return `${TRIPS_REST_API_URL}/${tripId}`;
    },
  },
  bookings: {
    create() {
      return BOOKINGS_REST_API_URL;
    },
    getByBookingNumber(bookingNumber: string) {
      return `${BOOKINGS_REST_API_URL}/${bookingNumber}`;
    },
  },
  user: {
    listBookings() {
      return `${MY_USER_REST_API_URL}/bookings`;
    },
    profile() {
      return `${MY_USER_REST_API_URL}`;
    },
  },
  auth: {
    signup() {
      return `${AUTH_REST_API_URL}/signup`;
    },
    login() {
      return `${AUTH_REST_API_URL}/login`;
    },
    logout() {
      return `${AUTH_REST_API_URL}/logout`;
    },
    refresh() {
      return `${AUTH_REST_API_URL}/refresh`;
    },
  },
};
