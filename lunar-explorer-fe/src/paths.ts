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
};

export const BOOKINS_SERVER_URL = "http://localhost:8000";
export const TRIPS_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/trips`;
export const BOOKINGS_REST_API_URL = `${BOOKINS_SERVER_URL}/api/v1/bookings`;

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
  },
};
