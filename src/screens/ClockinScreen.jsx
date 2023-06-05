import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const ClockInScreen = () => {
    const [position, setPosition] = useState(null);
    const [isWithinRange, setIsWithinRange] = useState(false);

    const workLocation = {
        latitude: 41.4314327,
        longitude: 2.2184554,
    };

    const distance = (lat1, lon1, lat2, lon2) => {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        } else {
            let radlat1 = Math.PI * lat1 / 180;
            let radlat2 = Math.PI * lat2 / 180;
            let theta = lon1 - lon2;
            let radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            // Get in meters
            dist = dist * 1609.344;
            return dist;
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setPosition({
                latitude,
                longitude,
            });
            const dist = distance(latitude, longitude, workLocation.latitude, workLocation.longitude);
            setIsWithinRange(dist <= 100); // Check if the user is within 100 meters of the work location
        })();
    }, []);

    const handleClockIn = () => {
        if (isWithinRange) {
            console.log('Clock in user');
            // Clock in user
        } else {
            alert('You are not within range to clock in.');
        }
    };

    return (
        <View style={styles.container}>
            {position && (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: position.latitude,
                        longitude: position.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                        }}
                        title="Your location"
                    />
                </MapView>
            )}
            <Text>Latitude: {position?.latitude}</Text>
            <Text>Longitude: {position?.longitude}</Text>
            <Button onPress={handleClockIn} title="Clock In" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '50%',
    },
});

export default ClockInScreen;
