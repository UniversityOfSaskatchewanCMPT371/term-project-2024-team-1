import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUp from '../app/Screen/SignUp'; 

describe('SignUp Component', () => {
  test('renders the SignUp component', () => {
    const { getByTestId } = render(<SignUp />);
    
    expect(getByTestId('SignUpPage')).toBeDefined();
  });

  test('captures user input for email, password, and clinic', () => {
    const { getByTestId } = render(<SignUp />);

    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');
    const clinicInput = getByTestId('clinicInput');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(clinicInput, 'MyClinic');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
    expect(clinicInput.props.value).toBe('MyClinic');
  });

  test('captures user input for agreeing to ethics checkbox', () => {
    const { getByTestId } = render(<SignUp />);

    const ethicsCheckbox = getByTestId('ethicsCheckbox');

    fireEvent.press(ethicsCheckbox);

    expect(ethicsCheckbox.props.style[0].borderColor).toBe('black'); // Assuming the checkbox border color changes when checked
  });

  test('calls handleSignUp function when Sign Up button is pressed', () => {
    const handleSignUpMock = jest.fn();
    const { getByTestId } = render(<SignUp />);
    
    const signUpButton = getByTestId('signUpButton');

    fireEvent.press(signUpButton);

    expect(handleSignUpMock).toHaveBeenCalled();
  });
});
