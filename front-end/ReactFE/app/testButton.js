import {Button} from "react-native"


export default TestButton = (props) => {
    return(
        <Button
            testID="TestButton:Button:Click"
            title="Click here"
            onPress={props.onPress}
        
        />
    )
}