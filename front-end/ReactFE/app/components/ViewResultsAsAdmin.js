import React from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DrawerButton from '../navigation/CustomDrawerButton';
import { ScreenStyles } from './Screen';
import { useEffect, useState, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { date } from 'yup';
import { logger } from "react-native-logs";

const log = logger.createLogger();



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
            log.info(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])

    // Preconditions: Ensure the required fields are not empty before scheduling a notification
    async function schedulePushNotification() {
        try {
            if (!reminderDate) {
                log.warn('Reminder date is not set. Cannot schedule push notification.');
                return;
            }
    
            if (!reminderTime) {
                log.warn('Reminder time is not set. Cannot schedule push notification.');
                return;
            }
    
            if (!remindTitle) {
                log.warn('Reminder title is not set. Cannot schedule push notification.');
                return;
            }
    
            if (!remindMessage) {
                log.warn('Reminder message is not set. Cannot schedule push notification.');
                return;
            }
    
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remindTitle,
                    body: remindMessage,
                },
                trigger: { seconds: delayInSeconds },
            });
            log.info('Reminder Notification Created Successfully for', { triggerDate });
        } catch (error) {
            log.error('Error creating Reminder Notification', error);
            log.warn('Failed to schedule push notification');
            log.debug('Error details:', error);
        }
    }
    
    
    // Preconditions: Ensure proper permissions are granted before retrieving push token
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
            log.info(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    // Preconditions: Reminder Modal must be opened
    // Postconditions: Show the date picker
    const showDatePicker = () => {
        try {
            log.debug('Showing date picker');
            setDatePickerVisibility(true);
        } catch (error) {
            log.error('Error while showing date picker:', error);
        }
    };

    // Preconditions: Reminder Modal must be opened
    // Postconditions: Hide the date picker 
    const hideDatePicker = () => {
        try {
            log.debug('Hiding date picker');
            setDatePickerVisibility(false);
        } catch (error) {
            log.error('Error while hiding date picker:', error);
        }
    };
    
    // Preconditions: Reminder Modal must be opened
    // Postconditions: Set the selected date as the reminder date
    const handleConfirm = (date) => {
        try {
            log.debug('Confirming date:', date);
            setReminderDate(date.toISOString().split('T')[0]);
            hideDatePicker();
        } catch (error) {
            log.error('Error while confirming date:', error);
        }
    };
    
    // Preconditions: Reminder Modal must be opened
    // Postconditions: Show the time picker
    const showTimePicker = () => {
        try {
            log.debug('Showing time picker');
            setTimePickerVisibility(true);
        } catch (error) {
            log.error('Error while showing time picker:', error);
        }
    };
    
    // Preconditions: Reminder Modal must be opened
    // Postconditions: Show the time picker
    const hideTimePicker = () => {
        try {
            log.debug('Hiding time picker');
            setTimePickerVisibility(false);
        } catch (error) {
            log.error('Error while hiding time picker:', error);
        }
    };
    
    // Preconditions: Reminder Modal must be opened
    // Postconditions: Set the selected time as the reminder time
    const handleTimeConfirm = (time) => {
        try {
            const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            log.debug('Confirming time:', formattedTime);
            setReminderTime(formattedTime);
            hideTimePicker();
        } catch (error) {
            log.error('Error while confirming time:', error);
        }
    };
    
    // TO DO: Implement as part of download results feature
    const handleDownloadButton = async (id) => {
        try {
            log.info('Download Button clicked', { id });
        } catch (error) {
            log.error('Error during download button click:', error);
        }
    };
    
    // Preconditions: Reminder Modal is closed
    // Postconditions: Open the reminder modal
    const handleRemindButton = async (id) => {
        try {
            log.info('Remind Button clicked', { id });
            setModalVisible(true);
        } catch (error) {
            log.error('Error during remind button click:', error);
        }
    };
    


    
    /*  Preconditions: id, onDownloadPress, and onRemindPress functions must be provided and working correctly
                       styleSheet must contain required properties
        PostConditions: Creates Components with buttons that triggers a download page or opens a Reminder Modal
    */
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

    /*  
    Preconditions: The confirmModalVisible, reminderDate, reminderTime, remindTitle, and remindMessage 
    states must be provided and working correctly; styleSheet must contain required properties
    PostConditions: The modal is opened with the confirmation message displaying the reminder details.
    */
    const confirmRemindModal = () => {
        log.info('Opening ConfirmReminderModal for Survey');

        return (

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
    }


    /*  
        Preconditions: All needed states must be provided and working correctly; styleSheet must contain required properties
        PostConditions: A reminder notification is scheduled when schedule button is clicked. Otherwise nothing when canceled button is clicked.
    */
    const reminderModal = ({ id }) => {
        log.info('Opening reminderModal for Survey', { id });
    
        if (modalVisible) {
            log.warn('reminderModal is visible unexpectedly');
        }
    
        return (
            <Modal
                animationType="scale"
                visible={modalVisible}
                onRequestClose={() => {
                    log.debug('Closing reminderModal');
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
    }

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