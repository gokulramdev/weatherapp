

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';





interface WeatherState {
    loading: boolean;
    data: any;
    error: string | null;
}

const initialState: WeatherState = {
    loading: false,
    data: [],
    error: null,
};

export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: latitude,
                lon: longitude,
                cnt: 5,
                units: 'metric',
                appid: 'db1bc17e4c3438999e1e5617dd85690b',
            },
        });
        return response.data;
    }
);

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch weather data';
            });
    },
});

export default weatherSlice.reducer;