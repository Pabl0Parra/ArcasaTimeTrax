import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import loginBg from '../assets/loginBg.jpg';
import FingerprintScannerButton from '../components/FingerprintScannerButton';


export default function BioLogin({ navigation }) {

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
        // navigation.navigate('LogIn')
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
        Alert.alert("Bienvenido a CaixaForum", "Comienza tu jornada", [
            {
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "Entrar", onPress: () => {
                    navigation.navigate('Clockin')
                    console.log("Subscribe Pressed")
                }
            }
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
        if (biometricAuth) { TwoButtonAlert(navigation) }
        console.log({ isBiometricAvailable })
        console.log({ supportedBiometrics });
        console.log({ savedBiometrics });
        console.log({ biometricAuth });
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={loginBg} style={styles.backgroundImage}>
                <View style={styles.content}>
                    <Text style={styles.text}>
                        {isBiometricAvailable ? 'Biometric is available on this device' : 'Biometric is not available on this device'}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
                        {/* <Text style={styles.buttonText}>Log in with biometrics</Text>*/} <FingerprintScannerButton />
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        width: '100%',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: '100%',
        marginLeft: 0,
    },
    content: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 100,
        marginTop: -100,
        padding: 20,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#eb6909',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});




