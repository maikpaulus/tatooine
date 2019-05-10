<template>
    <div class="cmp-weather">
        <light-control></light-control>
        <bluetooth></bluetooth>
        <weather-navigation :stationId="getStationId"></weather-navigation>
        <weather-display :stationId="getStationId"></weather-display>
        <weather-forecast v-if="$store.getters.get('forecastEnabled')"></weather-forecast>
    </div>
</template>

<script>
    import WeatherNavigation from './WeatherNavigation.vue';
    import WeatherDisplay from './WeatherDisplay.vue';
    import WeatherForecast from './WeatherForecast.vue';
    import LightControl from './../light/LightControl.vue';
    import Bluetooth from './../bluetooth/Connection.vue';
    
    export default {
        components: {
            WeatherNavigation,
            WeatherDisplay,
            WeatherForecast,
            LightControl,
            Bluetooth
        },

        beforeMount () {
            this.$store.dispatch('fetchWeatherData');
        },

        methods: {
            changeStationId (id) {
                this.$store.commit('changeStationId', id);
            }
        },

        computed: {
            getStationId () {
                return this.$store.getters.get('stationId');
            }
        }
    };
</script>