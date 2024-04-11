import { render } from "@testing-library/react";
import Providers from "@/app/providers";
import { App } from "./App";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" };
    }),
  };
});

describe("App", () => {
  test("renders correctly", () => {
    expect(() =>
      render(
        <Providers>
          <App />
        </Providers>
      )
    ).not.toThrow();
  });
});
