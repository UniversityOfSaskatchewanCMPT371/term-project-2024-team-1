import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 300,
        height: 100,
        backgroundColor: '#e0e0e0',
        padding: 10,
        paddingTop: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    button: {
        backgroundColor: '#1EC4B0',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        height: 30,
        margin: 3,
        borderColor: '#000000',
        borderWidth: 0.5,

    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    Text: {
        fontSize: 24
    },
    inputContainer: {
        backgroundColor: '#ffffff',
        padding: 0,
        marginBottom: 10,
        borderColor: '#000000',
        flexDirection: 'row',
        height: 300,
        borderRadius: 10,
        fontSize: 16
    },
    logoContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        fontSize: 22,
        backgroundColor: '#e0e0e0',

    }
});