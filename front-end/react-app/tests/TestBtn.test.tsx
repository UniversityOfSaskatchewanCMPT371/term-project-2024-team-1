
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TestBtn from '../src/TestBtn'


describe('Button Component', () => {
  it('should match the snapshot', () => {
    const { asFragment, getByText } = render(
      <TestBtn label="Click me" onClick={() => console.log('Button clicked')} />
    );

    // Assert that the rendered component matches the snapshot
    expect(asFragment()).toMatchSnapshot();

  

    // Optionally, you can simulate user interaction and test the resulting changes
    fireEvent.click(getByText('Click me'));

    // After user interaction, assert that the updated component matches the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});