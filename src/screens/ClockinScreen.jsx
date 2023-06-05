import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { Biometrics } from 'react-native-biometrics';

const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 10,
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
    map: {
        // Add the styles for the map component
    },
});

export default function ClockinScreen() {
    const [location, setLocation] = useState(null);
    const [message, setMessage] = useState('');
    const [withinRange, setWithinRange] = useState(false);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
    };

    const handleCheckLocation = () => {
        getLocation();
    };

    const handleClockin = async () => {
        try {
            // Check if user's current location is available
            if (location) {
                const correctLocation = { latitude: 41.431469, longitude: 2.2218431 }; // Replace with correct location coordinates
                const distance = haversineDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    correctLocation.latitude,
                    correctLocation.longitude
                );

                if (distance < 10000) {
                    // Prompt user for biometric authentication
                    Biometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
                        .then((resultObject) => {
                            const { success } = resultObject;

                            if (success) {
                                console.log('Successful biometrics provided');
                                // Perform the check-in logic here
                            } else {
                                console.log('User cancelled biometric prompt');
                            }
                        })
                        .catch(() => {
                            console.log('Biometrics failed');
                        });
                } else {
                    // User is not within the correct range
                    setMessage("You are not at the correct location to check in.");
                    setWithinRange(false);
                }
            }
        } catch (error) {
            console.log(error);
            setMessage("An error occurred while trying to check in.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clock In</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={handleCheckLocation}>
                <Text style={styles.buttonText}>Check Again</Text>
            </TouchableOpacity>
            {location && (
                <Image
                    style={styles.map}
                // Add the code to display the map with the current location
                />
            )}
        </View>
    );
}
