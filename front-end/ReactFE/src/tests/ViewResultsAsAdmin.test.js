import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViewResultsAsAdmin from '../../app/Screen/ViewResultsAsAdmin';

describe('ViewResultsAsAdmin Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<ViewResultsAsAdmin />);
    expect(getByText('ADMIN')).toBeDefined();
    expect(getByText('Survey Results')).toBeDefined();
  });

  test('opens modal when remind button is clicked', () => {
    const { getByText, queryByTestId } = render(<ViewResultsAsAdmin />);
    const remindButton = getByText('Remind Users');
    fireEvent.press(remindButton);
    expect(queryByTestId('reminder-modal')).toBeTruthy();
  });

  test('sets reminder title and message correctly', () => {
    const { getByPlaceholderText, getByText } = render(<ViewResultsAsAdmin />);
    const remindButton = getByText('Remind Users');
    fireEvent.press(remindButton);

    const titleInput = getByPlaceholderText('Title');
    const messageInput = getByPlaceholderText(
      'Your Animal Surveillance Survey is due soon...'
    );

    fireEvent.changeText(titleInput, 'Test Title');
    fireEvent.changeText(messageInput, 'Test Message');

    expect(titleInput.props.value).toBe('Test Title');
    expect(messageInput.props.value).toBe('Test Message');
  });

  test('shows confirmation modal when scheduling reminder', async () => {
    const { getByText, findByText } = render(<ViewResultsAsAdmin />);
    const remindButton = getByText('Remind Users');
    fireEvent.press(remindButton);

    const scheduleButton = getByText('Schedule');
    fireEvent.press(scheduleButton);

    const confirmationText = await findByText('Close');
    expect(confirmationText).toBeTruthy();
  });
});
