export const checkIfFullyBooked = (trip: {
  occupancy: number;
  capacity: number;
}) => {
  return trip.occupancy === trip.capacity;
};
