import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Expect } from "detox/detox";
// import TestLoginScreen from "./components/TestLoginScreen";
// describe("Login Screen", () => {
//   test("renders login page with input fields and buttons", () => {
//     const { getByTestId } = render(<TestLoginScreen />);
//     expect(getByTestId("loginPage")).toBeDefined();
//     expect(getByTestId("userIdInput")).toBeDefined();
//     expect(getByTestId("passwordInput")).toBeDefined();
//     expect(getByTestId("loginButton")).toBeDefined();
//     expect(getByTestId("forgotPasswordLink")).toBeDefined();
//   });

//   test("login with valid credentials", () => {
//     const { getByTestId, queryByText } = render(<TestLoginScreen />);
//     fireEvent.changeText(getByTestId("userIdInput"), "your_generated_ID");
//     fireEvent.changeText(
//       getByTestId("passwordInput"),
//       "your_generated_password"
//     );
//     fireEvent.press(getByTestId("loginButton"));

//     // Add assertions for successful logins
//     /* const welcomeMessage = queryByText("Welcome, to CASI"); 
//     expect(welcomeMessage).toBeTruthy();
//     */

//     // Assertion for if theres a link to home page after successful log in
//     /*
//     const homePage = getByTestId("homePage");
//     expect(homePage).toBeDefined();
//     */
//   });

//   test('clicking "Forgot Password" link should navigate to the reset password page', () => {
//     const { getByTestId } = render(<TestLoginScreen />);
//     fireEvent.press(getByTestId("forgotPasswordLink"));

//     // assertion to check if the user is on the reset password page
//     /*
//      const resetPasswordPage = getByTestId("resetPasswordPage");
//      expect(resetPasswordPage).toBeDefined();
//      */
//   });

//   test("reset password with valid information", () => {
//     const { getByTestId } = render(<TestLoginScreen />);
//     fireEvent.press(getByTestId("forgotPasswordLink"));

//     // Implement the reset password test, similar to login test
//   });
// });
