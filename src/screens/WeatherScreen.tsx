import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/weatherSlice';
import { RootState, AppDispatch } from '../redux/store';

const WeatherScreen: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const weather = useSelector((state: RootState) => state.weather);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    setError('Location permission denied');
                }
            } else {
                getCurrentLocation();
            }
        };

        requestLocationPermission();
    }, []);

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                dispatch(fetchWeather({ latitude, longitude }));
            },
            (error) => {
                setError(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    if (weather.loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (error || weather.error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>{error || weather.error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Weather Forecast</Text>
            <FlatList
                data={weather.data.list}
                keyExtractor={(item) => item.dt.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.dateText}>{new Date(item.dt * 1000).toLocaleDateString()}</Text>
                        <Text style={styles.tempText}>Temperature: {item.main.temp} °C</Text>
                        <Text style={styles.tempText}>Feels Like: {item.main.feels_like} °C</Text>
                        <Text style={styles.weatherText}>Weather: {item.weather[0].description}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
        color: "#000"
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#000"
    },
    tempText: {
        fontSize: 16,
    },
    weatherText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default WeatherScreen;