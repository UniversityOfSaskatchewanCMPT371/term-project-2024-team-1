import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import DrawerButton from '../navigation/CustomDrawerButton';
import { ScreenStyles } from './Screen';
import NotificationsReminderModal from './NotificationsReminderModal';
import { styles } from "../Styles/NotificationStyles";

export default function ViewResultsAsAdmin() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalId, setModalId] = useState(null);

    const handleDownloadButton = async (id) => {
        try {
            console.info('Download Button clicked', { id });
        } catch (error) {
            console.error('Error during download button click:', error);
        }
    };

    const handleRemindButton = async (id) => {
        try {
            console.info('Remind Button clicked', { id });
            setModalId(id);
            setModalVisible(true);
        } catch (error) {
            console.error('Error during remind button click:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const surveyResultContainer = ({ id }) => (
        <View style={styles.container} id={id}>
            <Text style={styles.Text}>Quarter {id} Survey</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        handleDownloadButton(id);
                    }}>
                    <Text style={styles.buttonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        handleRemindButton(id);
                    }}>
                    <Text style={styles.buttonText}>Remind Users</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const openReminderModal = (id) => (
        <View>
            {console.info('Loading reminderModal for Survey', { id })}
            {surveyResultContainer({ id })}
            {modalVisible && (
                <NotificationsReminderModal
                    id={modalId}
                    isVisible={modalVisible}
                    closeModal={closeModal}
                />
            )}
        </View>
    );
    
    return (
        <View style={[ScreenStyles.ScreenStyle, { justifyContent: "start", paddingTop: 40 }]}>
            <DrawerButton />
            <Text style={{ color: "#fff", fontSize: 40, fontWeight: "bold" }}>ADMIN</Text>
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>Survey Results</Text>
            <View style={{ marginTop: "10%" }} >

                <View>
                    {openReminderModal("1")}
                    {openReminderModal("2")}
                    {openReminderModal("3")}
                    {openReminderModal("4")}
                </View>

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
