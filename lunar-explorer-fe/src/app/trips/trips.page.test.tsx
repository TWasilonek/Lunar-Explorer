import { screen, render } from "@testing-library/react";
import { restApi } from "@/paths";
import { SimpleTripResponse } from "@bookings-server/types";
import { redirect } from "next/navigation";
import TripsPage from "@/app/trips/page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// jest.mock("@/paths", () => ({
//   restApi: {
//     trips: {
//       list: jest.fn(),
//     },
//   },
// }));

describe("Trips page", () => {
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  test("Displays correctly without search params", async () => {
    render(
      <TripsPage
        searchParams={{
          startDate: "2024-05-01",
          endDate: "2024-10-15",
        }}
      />
    );

    expect(
      await screen.findByRole("heading", { name: "Choose your trip" })
    ).toBeInTheDocument();
    screen.logTestingPlaygroundURL();
  });

  test("returns trips when valid search params are provided", async () => {
    const searchParams = {
      startDate: "2022-01-01",
      endDate: "2022-01-07",
    };

    const trips = [
      { id: 1, name: "Trip 1" },
      { id: 2, name: "Trip 2" },
    ];

    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(trips),
    });

    global.fetch = mockFetch;

    const result = await getTrips(searchParams);

    expect(mockFetch).toHaveBeenCalledWith(
      `${restApi.trips.list}?startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`
    );
    expect(result).toEqual(trips);
  });

  test("redirects to /trips when invalid search params are provided", async () => {
    const searchParams = {
      startDate: "invalid-date",
      endDate: "2022-01-07",
    };

    const mockFetch = jest.fn();

    global.fetch = mockFetch;

    await getTrips(searchParams);

    expect(redirect).toHaveBeenCalledWith("/trips");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
