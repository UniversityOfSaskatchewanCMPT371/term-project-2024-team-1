
import React from 'react';
import { render, fireEvent, getByLabelText } from '@testing-library/react';
import TestBtn from '../src/TestBtn'



describe("BUtton mock",() =>{

    it("Calling OnPress",()=>{
        const mockOnPress = jest.fn();

        const { getByText } = render(<TestBtn label="mockTest" onClick={mockOnPress} />);
        const pressButton = getByText(/mockTest/i);
    
        fireEvent.click(pressButton)

        expect(mockOnPress).toHaveBeenCalled();

    })


})
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