import "jest-canvas-mock"; // mock the Canvas API in Node.js env
import "@testing-library/jest-dom";

// Mock the ResizeObserver API in Node.js env
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the fetch API in Node.js env
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from "@next/env";

export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};
