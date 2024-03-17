import { render } from '@testing-library/react-native';
import '@testing-library/jest-dom/extend-expect';
import CreateSurvey from '../../app/Screen/CreateSurvey'; 

describe('CreateSurvey', () => {
  it('renders without crashing', () => {
    const mockNavigation= {
       navigate: jest.fn(), 
       addListener: jest.fn() };
    const { getByTestId } = render(<CreateSurvey navigation={mockNavigation} />);

    // Basic assertions to ensure the component rendered
    expect(getByTestId('PreviewButton')).toBeTruthy();
    expect(getByTestId('DoneButton')).toBeTruthy();

  });
});
