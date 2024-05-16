import { render } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import * as nextAuth from "next-auth/react";
import { App } from "./App";

let mockExpTime = 1000;

jest.mock("../../constants", () => ({
  __esModule: true,
  get CHECK_SESSION_EXP_TIME() {
    return mockExpTime;
  },
  CHECK_SESSION_INTERVAL: 500, // 0.5 seconds
}));

describe("App", () => {
  test("renders correctly", () => {
    const expiresAt = new Date(Date.now() + 2 * 86400).toISOString();
    expect(() =>
      render(
        <SessionProvider
          session={{
            expires: expiresAt,
            user: {
              accessToken: "test",
              refreshTokenCookie: "test",
              expiresAt: expiresAt,
            },
          }}
        >
          <App />
        </SessionProvider>
      )
    ).not.toThrow();
  });

  describe("user session handling", () => {
    const expiresAt = new Date(Date.now() + 2000).toISOString(); // 2 seconds
    const mockSession = {
      expires: expiresAt,
      user: {
        accessToken: "test",
        refreshTokenCookie: "test",
        expiresAt: expiresAt,
      },
    };
    const updateSpy = jest.fn().mockResolvedValue(mockSession);
    jest.spyOn(nextAuth, "useSession").mockReturnValue({
      data: mockSession,
      update: updateSpy,
    });

    const signOutSpy = jest
      .spyOn(nextAuth, "signOut")
      // @ts-ignore We don't need to implement the signOut function
      .mockImplementation(() => {}); // fixes any issues about environment

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test("updates the sesion if token close to expiry", () => {
      render(
        <SessionProvider session={mockSession}>
          <App />
        </SessionProvider>
      );

      jest.advanceTimersByTime(1500);
      expect(updateSpy).toHaveBeenCalled();
    });

    test("signs out the user if token expired", () => {
      mockExpTime = 0;
      render(
        <SessionProvider session={mockSession}>
          <App />
        </SessionProvider>
      );

      jest.advanceTimersByTime(2000);
      expect(signOutSpy).toHaveBeenCalled();
    });
  });
});
