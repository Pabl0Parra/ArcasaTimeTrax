import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Biometrics } from 'react-native-biometrics';


const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
};


export default function ClockinScreen() {
    const [location, setLocation] = React.useState(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
    };

    const handleClockin = async () => {
        try {
            // Get user's current location
            await getLocation();

            console.log(location);

            // Check if user is within 5 meters of the correct location
            if (location) {
                const correctLocation = { latitude: 41.431469, longitude: 2.2218431 }; // Replace with correct location coordinates
                const distance = haversineDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    correctLocation.latitude,
                    correctLocation.longitude
                );
                if (distance < 1000) {
                    // Prompt user for biometric authentication
                    Biometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
                        .then((resultObject) => {
                            const { success } = resultObject

                            if (success) {
                                console.log('successful biometrics provided')
                            } else {
                                console.log('user cancelled biometric prompt')
                            }
                        })
                        .catch(() => {
                            console.log('biometrics failed')
                        })
                } else {
                    // User is not within 5 meters of the correct location
                    alert("You are not within range of the correct location to clock in.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clock In</Text>
            <TouchableOpacity style={styles.button} onPress={handleClockin}>
                <Text style={styles.buttonText}>Clock In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});