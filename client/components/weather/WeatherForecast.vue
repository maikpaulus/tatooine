<template>
    <div class="cmp-weather-forecast" :style="getHeight">
        <h3>5-Tage-Vorschau</h3>
        <md-layout md-gutter>
            <forecast-element
                v-for="(forecast, key) in getForecast"
                v-bind:key="key"
                v-bind:time="forecast.time"
                v-bind:temperature="forecast.temperature"
                v-bind:rangeMax="forecastRange.max">
            </forecast-element>
        </md-layout>
    </div>
</template>

<script>
    import ForecastElement from './ForecastElement.vue';
    import ForecastChart from './ForecastChart.vue';
    import moment from 'moment';

    export default {
        beforeMount () {
            this.$store.dispatch('fetchWeatherForecast');
        },

        computed: {
            getForecast () {
                return this.$store.getters.get('forecast').data;
            },

            forecastLoaded() {
                return this.$store.getters.get('forecastLoaded');
            },

            forecastRange() {
                return this.$store.getters.get('forecast').range;
            }
        },

        watch: {
            getHeight: function () {
                let range = this.$store.getters.get('forecast').range;
                return 'height: ' + (500 + 10 * (range.max - range.min)) + 'px'; 
            }
            /*getForecast() {
                let temperatures = this.$store.getters.get('forecast').data.map(
                    measure => measure.temperature
                );

                return {
                    labels: ['a', 'b', 'c'],
                    datasets: [
                        {
                            backgroundColor: '#f87979',
                            data: temperatures
                        }
                    ]
                };
            },*/
        },

        components: {
            ForecastElement,
            ForecastChart
        }
    }
</script>

<style>
    .cmp-weather-forecast {
        position: fixed;
        bottom: 0;
        background: #fff;
        color: #35393c;
        height: 10em;
        width: 100%;
        padding: 0.25rem 0.5rem;
    }

    .cmp-weather-forecast h3 {
        margin: 0.5rem 0;
        font-size: 1rem;
    }
</style>