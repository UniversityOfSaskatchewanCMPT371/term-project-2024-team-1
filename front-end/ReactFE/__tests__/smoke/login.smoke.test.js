import React from "react";
import { render } from "@testing-library/react-native";
import Login from "../../app/Screen/Login"; // Update with the actual path to your Login component

describe("<Login />", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Login />);

    // Check if the main view is rendered
    expect(getByTestId("loginPage")).toBeTruthy();

    // Verify input fields are rendered
    expect(getByTestId("userIdInput")).toBeTruthy();
    expect(getByTestId("passwordInput")).toBeTruthy();

    // Check if the login button is rendered
    expect(getByTestId("loginButton")).toBeTruthy();

    // Verify links are rendered
    expect(getByTestId("forgotPasswordLink")).toBeTruthy();
    expect(getByTestId("signUp")).toBeTruthy();
  });
});
