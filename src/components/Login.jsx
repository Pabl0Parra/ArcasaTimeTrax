import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';


export default function Login({ navigation }) {

    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

    // for face detection or fingerprint scan
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricAvailable(compatible);
        })();
    });

    const fallBackToDefaultAuth = () => {
        console.log('fall back to default authentication')
    }

    const alertComponent = (title, msg, btnTxt, btnFunc) => {
        Alert.alert(
            title,
            msg,
            [
                { text: btnTxt, onPress: btnFunc }
            ]
        )
    }

    const TwoButtonAlert = () => {
        Alert.alert("Welcome to the app", "Subscribe now", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Subscribe", onPress: () => console.log("Subscribe Pressed") }
        ])
    }

    const handleBiometricAuth = async () => {
        // check if device supports biometric authentication
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
        // fall back to default authentication method if biometric is not available
        if (!isBiometricAvailable) {
            alertComponent('Error', 'Biometric authentication is not supported on this device', 'OK', fallBackToDefaultAuth);
            return;
        }
        // check what type of biometric authentication is available
        let supportedBiometrics;
        if (isBiometricAvailable) {
            supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
        }

        // check biometrics are saved on the device
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (!savedBiometrics) {
            alertComponent('Error', 'No biometrics are enrolled on this device', 'OK', fallBackToDefaultAuth);
            return;
        }
        // authenticate with biometrics
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Log in with biometrics',
            cancelLabel: 'Cancel',
            disabledDeviceFallback: true,
        });
        // log the user in on successful authentication
        if (biometricAuth) { TwoButtonAlert() }
        console.log({ isBiometricAvailable })
        console.log({ supportedBiometrics });
        console.log({ savedBiometrics });
        console.log({ biometricAuth });
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text>
                    {isBiometricAvailable
                        ? 'Biometric is available on this device'
                        : 'Biometric is not available on this device'}
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
                    <Text style={styles.buttonText}>Log in with biometrics</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',

    },
});


