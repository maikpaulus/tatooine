<template>
    <div class="cmp-weather-display">
        <div class="data-container" v-if="dataLoaded">
            <h2 class="label">
                {{getWeatherData.label || 'Unbekannt'}}
            </h2>
            <div class="temperature">{{Math.round(getWeatherData.temperature) || 0}}°</div>
            <md-layout class="additional" md-gutter>
                <md-layout md-flex-xsmall="25" md-flex-small="25" md-flex-medium="25">
                    <span>
                        <md-icon md-iconset="fa fa-percent"></md-icon>{{getWeatherData.humidity}}
                    </span>
                </md-layout>
                <md-layout md-flex-xsmall="50" md-flex-small="50" md-flex-medium="50">
                    <span>
                        <md-icon md-iconset="fa fa-clock-o"></md-icon>{{getWeatherData.time}}
                    </span>
                </md-layout>
                <md-layout md-flex-xsmall="25" md-flex-small="25" md-flex-medium="25">
                    <span>
                        <md-icon md-iconset="fa fa-battery"></md-icon>{{getWeatherData.battery}}
                    </span>
                </md-layout>
            </md-layout>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            stationId: {
                type: Number
            }
        },

        computed: {
            getWeatherData () {
                let stationId = this.$store.getters.get('stationId');
                return this.$store.getters.get('weather')[stationId];
            },

            dataLoaded () {
                return this.$store.getters.get('dataLoaded');
            }
        },
    }
</script>

<style>
    .data-container {
        margin: 0 auto;
        max-width: 640px;
        width: 100%;
        text-align: center;
    }  

    .data-container .label {
        font-size: 2.5em;
        line-height: 1.5em;
        margin: 1em 0 0;
        font-weight: normal;
    }

    .data-container .temperature {
        padding: 1em 0 0.75em;
        font-size: 6.5rem;
        font-weight: bold;
    }

    .data-container .additional {
        padding: 0.5rem 0;
        font-size: 1rem;
    }

    .data-container .additional .md-layout > span {
        width: 100%;
        text-align: center;
        display: inline-block;
    }

    .data-container .additional .md-layout .md-icon {
        padding-right: .5rem;
        position: relative;
        top: 2px;
    }
</style>