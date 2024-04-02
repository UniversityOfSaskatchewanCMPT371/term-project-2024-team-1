import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';
import { styles } from "../Styles/NotificationStyles";
import axios from 'axios';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function NotificationsReminderModal({ id, isVisible, closeModal }) {
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [modalVisible, setModalVisible] = useState(isVisible);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [remindTitle, setRemindTitle] = useState('');
    const [remindMessage, setRemindMessage] = useState('')
    const reminderMessagePlaceholder = 'Your Animal Surveillance Survey is due soon. Please remember to complete it by <date>. \n\n Survey Link: <link>'
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const triggerDate = new Date(
        parseInt(reminderDate.split('-')[0]),
        parseInt(reminderDate.split('-')[1]) - 1,
        parseInt(reminderDate.split('-')[2]),
        parseInt(reminderTime.split(':')[0]),
        parseInt(reminderTime.split(':')[1])
    );

    const delayInSeconds = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.info(response);
        });

        setModalVisible(isVisible);
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [isVisible])

    async function schedulePushNotification() {
        // Send Notifications to users with UserID 1,2,3
        try {
            if (!reminderDate) {
                console.warn('Reminder date is not set. Cannot schedule push notification.');
                return;
            }

            if (!reminderTime) {
                console.warn('Reminder time is not set. Cannot schedule push notification.');
                return;
            }

            if (!remindTitle) {
                console.warn('Reminder title is not set. Cannot schedule push notification.');
                return;
            }

            if (!remindMessage) {
                console.warn('Reminder message is not set. Cannot schedule push notification.');
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remindTitle,
                    body: remindMessage,
                },
                trigger: { seconds: 2 },
            });
            console.info('Reminder Notification Created Successfully for', { triggerDate });
        } catch (error) {
            console.warn('Failed to schedule push notification');
            console.error('Error creating Reminder Notification', error);
            console.debug('Error details:', error);
        }
    }

    const showDatePicker = () => {
        try {
            console.info('Showing date picker');
            setDatePickerVisibility(true);
        } catch (error) {
            console.error('Error while showing date picker:', error);
        }
    };

    const hideDatePicker = () => {
        try {
            console.info('Hiding date picker');
            setDatePickerVisibility(false);
        } catch (error) {
            console.error('Error while hiding date picker:', error);
        }
    };

    const handleConfirm = (date) => {
        try {
            console.info('Confirming date:', date);
            setReminderDate(date.toISOString().split('T')[0]);
            hideDatePicker();
        } catch (error) {
            console.error('Error while confirming date:', error);
        }
    };

    const showTimePicker = () => {
        try {
            console.info('Showing time picker');
            setTimePickerVisibility(true);
        } catch (error) {
            console.error('Error while showing time picker:', error);
        }
    };

    const hideTimePicker = () => {
        try {
            console.info('Hiding time picker');
            setTimePickerVisibility(false);
        } catch (error) {
            console.error('Error while hiding time picker:', error);
        }
    };

    const handleTimeConfirm = (time) => {
        try {
            const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            console.info('Confirming time:', formattedTime);
            setReminderTime(formattedTime);
            hideTimePicker();
        } catch (error) {
            console.error('Error while confirming time:', error);
        }
    };

    /*  
    Preconditions: The confirmModalVisible, reminderDate, reminderTime, remindTitle, and remindMessage 
    states must be provided and working correctly; styleSheet must contain required properties
    PostConditions: The modal is opened with the confirmation message displaying the reminder details.
    */
    const confirmRemindModal = () => {
        console.info('Opening ConfirmReminderModal for Survey');

        return (
            <Modal
                animationType="slide"
                visible={confirmModalVisible}
                transparent={true}
                onRequestClose={closeModal}
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

    const reminderModal = ({ id }) => {
        return (
            <Modal
                animationType="scale"
                visible={modalVisible}
                onRequestClose={() => {
                    console.debug('Closing reminderModal');
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
                        <TouchableOpacity style={[styles.inputContainer, { height: 35 }]} onPress={showDatePicker}>
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
                        <TouchableOpacity style={[styles.inputContainer, { height: 35 }]} onPress={showTimePicker}>
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
                                    closeModal();
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

    return (
        <View>
            {reminderModal({ id })}
            {confirmRemindModal()}
        </View>
    )
}
