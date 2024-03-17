import TestButton from "../app/testButton"

import {render, fireEvent} from "@testing-library/react-native"


describe("TestButton",() =>{

    it("Calling OnPress",()=>{
        const mockOnPress = jest.fn();

        const { getByTestId } = render(<TestButton onPress={mockOnPress} />);
        const pressButton = getByTestId("TestButton:Button:Click");
    
        fireEvent.press(pressButton)

        expect(mockOnPress).toHaveBeenCalled();

    })


})