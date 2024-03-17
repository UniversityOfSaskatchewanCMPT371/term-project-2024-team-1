import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DrawerButton from '../navigation/CustomDrawerButton';
import { ScreenStyles } from './Screen';
import { useEffect, useState, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export default function ViewResultsAsAdmin() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [remindTitle, setRemindTitle] = useState('');
    const [remindMessage, setRemindMessage] = useState('')
    const reminderMessagePlaceholder = 'Your Animal Surveillance Survey is due soon. Please remember to complete it by <date>. \n\n Survey Link: <link>'
    const [hours, minutes] = reminderTime.split(':');
    const [year, month, day] = reminderDate.split('-');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);


    const triggerDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
    );

    const delayInSeconds = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

    useEffect(() => {

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])


    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: remindTitle,
                body: remindMessage,
            },
            trigger: { seconds: delayInSeconds },
        });
    }

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setReminderDate(date.toISOString().split('T')[0]);
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleTimeConfirm = (time) => {
        const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        setReminderTime(formattedTime);
        hideTimePicker();
    };


    const handleDownloadButton = async (id) => {
        try {
            console.log('Download Button clicked', { id })
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    const handleRemindButton = async (id) => {
        try {
            setModalVisible(true);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }


    

    const surveyResultContainer = ({ id, onDownloadPress, onRemindPress }) => (
        <View style={styles.container} id={id}>
            <Text style={styles.Text}>Quarter {id} Survey</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        onDownloadPress(id);
                    }}>
                    <Text style={styles.buttonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        onRemindPress(id);
                    }}>
                    <Text style={styles.buttonText}>Remind Users</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const confirmRemindModal = () => (
        <Modal
            animationType="slide"
            visible={confirmModalVisible}
            transparent={true}
            onRequestClose={() => setConfirmModalVisible(false)}
        >
            <View style={[styles.centeredView, { backgroundColor: "rgba(128, 128, 128, 0.5)", flex: 1 }]}>

                <View style={{ margin: 30, marginTop: 50, borderWidth: 3, borderEndWidth: 2 }}>
                    <View style={[{ backgroundColor: "#ffffff", padding: 20 }]}>
                        <Text style={styles.modalTitle}>The following reminder will be sent on {reminderDate} at {reminderTime}: </Text>
                        <View style={{ borderWidth: 1, padding: 5 }}>
                            <Text style={{ fontWeight: 'bold', borderBottomWidth: 1 }}>{remindTitle}</Text>
                            <Text style={styles.modalMessage}>{remindMessage}</Text>
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[{ backgroundColor: "#1EC4B0", borderRadius: 10, padding: 10, margin: 10, alignContent: 'center' }]}
                                onPress={() => {
                                    setConfirmModalVisible(false);
                                }}
                            >
                                <Text style={{ textAlign: 'center' }}>Close</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        </Modal>
    );


    const reminderModal = ({ id }) => (
        <Modal
            animationType="scale"
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={[styles.centeredView, { padding: 20, height: '100%' }, { backgroundColor: '#8093F1' }]}>
                <View style={[styles.modalView]}>
                    <Text style={[styles.Text, { paddingBottom: 15 }]}>Create Reminder for Quarter Survey {id}</Text>

                    <View style={[styles.inputContainer, { flexDirection: 'column' }, { padding: 10 }]}>
                        <TextInput
                            style={[{ borderBottomWidth: 1 }, { fontWeight: 'bold' }, { fontSize: 16 }]}
                            placeholder='Title'
                            onChangeText={setRemindTitle}
                        />
                        <TextInput
                            style={{ textAlignVertical: 'top', paddingTop: 5 }}
                            multiline={true}
                            placeholder={reminderMessagePlaceholder}
                            onChangeText={setRemindMessage}
                        />
                    </View>

                    <TouchableOpacity style={[styles.inputContainer, { height: 35 }]} onPress={showDatePicker}
                    >
                        <Text style={[styles.logoContainer]}>📆</Text>
                        <TextInput
                            style={[styles.input, { marginLeft: 5 }]}

                            editable={true}
                            onFocus={showDatePicker}
                            placeholder="YYYY-MM-DD"
                            value={reminderDate}
                            onChangeText={text => setReminderDate(text)}

                        />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />



                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.inputContainer, { height: 35 }]} onPress={showTimePicker}
                    >
                        <Text style={[styles.logoContainer]}>⏰</Text>
                        <TextInput
                            style={[styles.input, { marginLeft: 5 }]}
                            // onChangeText={text => setReminderDate(text)}
                            editable={true}
                            onFocus={showTimePicker}
                            placeholder="HH-MM AM"
                            value={reminderTime}

                        />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                    />




                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={{ ...styles.button, backgroundColor: "#2196F3" }}
                            onPress={async () => {
                                setConfirmModalVisible(true);
                                await schedulePushNotification();
                            }}


                        >
                            <Text style={styles.buttonText}>Schedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.button, backgroundColor: "#FF5733" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);

                            }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )

    const styles = StyleSheet.create({
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
    
    return (
        <View style={[ScreenStyles.ScreenStyle, { justifyContent: "start", paddingTop: 40 }]}>
            <DrawerButton />
            <Text style={{ color: "#fff", fontSize: 40, fontWeight: "bold" }}>ADMIN</Text>
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>Survey Results</Text>
            <View style={{ marginTop: "10%" }} >


                <View >
                    {surveyResultContainer({ id: "1", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton })}
                    {reminderModal({ id: 1 })}
                </View>

                <View >
                    {surveyResultContainer({ id: "2", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton })}
                    {reminderModal({ id: 2 })}
                </View>

                <View >
                    {surveyResultContainer({ id: "3", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton })}
                    {reminderModal({ id: 3 })}
                </View>

                <View >
                    {surveyResultContainer({ id: "4", onDownloadPress: handleDownloadButton, onRemindPress: handleRemindButton })}
                    {reminderModal({ id: 4 })}
                </View>


                {confirmRemindModal()}


                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}>

                </View>


            </View>
        </View>
    )
}