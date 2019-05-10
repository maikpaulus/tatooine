<template>
    <div class="cmp-weather-navigation">
        <md-layout md-gutter>
            <navigation-element
                v-for="(station, key) in getWeatherData"
                v-bind:key="key"
                v-bind:id="station.id"
                v-bind:temperature="station.temperature"
                v-bind:icon="station.icon"
            ></navigation-element>
        </md-layout>
    </div>
</template>

<script>
    import NavigationElement from './NavigationElement.vue';

    export default {
        methods: {
            changeWeatherId (stationId) {
                this.$store.dispatch('changeStationId', stationId);
            }
        },

        computed: {
            getWeatherData () {
                return this.$store.getters.get('weather');
            }
        },

        components: {
            NavigationElement
        }
    }
</script>