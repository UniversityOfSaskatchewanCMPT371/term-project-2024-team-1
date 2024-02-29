// AdminDashboard.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AdminDashboard from "../app/Screen/AdminDashboard";

// Mock the console.log function
global.console = {
  log: jest.fn(),
};

describe("AdminDashboard", () => {
  it("renders correctly", () => {
    // Render the AdminDashboard component
    const { getByText } = render(<AdminDashboard />);

    // Check if the main text is rendered
    expect(getByText("ADMIN CASI")).toBeTruthy();
  });

  it("handles button presses", () => {
    // Render the AdminDashboard component
    const { getByText } = render(<AdminDashboard />);

    // Simulate pressing the 'Create Survey' button
    fireEvent.press(getByText("+ Create Survey"));

    // Expect that console.log was called with 'Create Survey Pressed'
    expect(global.console.log).toHaveBeenCalledWith("Create Survey Pressed");
  });
});
