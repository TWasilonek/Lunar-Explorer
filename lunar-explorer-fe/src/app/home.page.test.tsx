import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

const pushSpy = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
  }),
}));

describe("Home", () => {
  const user = userEvent.setup();

  it("renders correctly and allows user to go to Trips page", async () => {
    render(<Home />);

    // scene 1
    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent(
      /This is what you know/i
    );
    const scene2StartBtn = await screen.findByRole("button", {
      name: /We can change it/i,
    });

    // start scene 2
    await user.click(scene2StartBtn);

    expect(
      await screen.findByText(/You can now see the Earth from the Moon!/i)
    ).toBeInTheDocument();

    const goToTripsBtn = await screen.findByRole("button", {
      name: /Choose your trip/i,
    });
    await user.click(goToTripsBtn);

    // There is a fade-out animation before the page is redirected, so we should wait until it completes
    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith("/trips");
    });
  });
});
