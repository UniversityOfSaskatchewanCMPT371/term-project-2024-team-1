import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Admin from "../app/Screen/Admin";

describe("AdminDashboard", () => {
  // Spy on console.log before the tests run
  const logSpy = jest.spyOn(console, "log");

  afterEach(() => {
    // Clear mock (spy) calls after each test
    logSpy.mockClear();
  });

  afterAll(() => {
    // Restore original console.log behavior after all tests
    logSpy.mockRestore();
  });

  it("renders correctly", () => {
    const { getByText } = render(<Admin/>);
    expect(getByText("ADMIN CASI")).toBeTruthy();
  });

  it("handles 'Create Survey' button press", () => {
    const { getByText } = render(<Admin />);

    fireEvent.press(getByText("+ Create Survey"));
    expect(logSpy).toHaveBeenCalledWith("Create Survey Pressed");
  });

  it("handles 'Download Results' button press", () => {
    const { getByText } = render(<Admin />);

    fireEvent.press(getByText("Download Results"));
    expect(logSpy).toHaveBeenCalledWith("Download Results Pressed");
  });

  it("handles 'ID Requests' button press", () => {
    const { getByText } = render(<Admin />);

    fireEvent.press(getByText("ID Requests"));
    expect(logSpy).toHaveBeenCalledWith("ID Requests Pressed");
  });
});
