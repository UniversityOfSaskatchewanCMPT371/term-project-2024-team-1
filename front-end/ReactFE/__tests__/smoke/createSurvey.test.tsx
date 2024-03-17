import React from 'react';
import { render } from '@testing-library/react-native';
import CreateSurvey from '../../app/Screen/CreateSurvey'; 

describe('CreateSurvey', () => {
  it('renders without crashing', () => {
    const navigationMock = { navigate: jest.fn(), addListener: jest.fn() };
    const { getByTestId } = render(<CreateSurvey navigation={navigationMock} />);

    // Basic assertions to ensure the component rendered
    expect(getByTestId('PreviewButton')).toBeTruthy();
    expect(getByTestId('DoneButton')).toBeTruthy();

  });
});
