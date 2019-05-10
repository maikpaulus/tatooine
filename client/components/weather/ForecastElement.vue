<template>
    <md-layout :class="'cmp-forecast-element'" md-flex-xsmall="5" md-flex-small="5" md-flex-medium="5">
        <span class="temperature" :style="getPosition">{{this.temperature}}°</span>
    </md-layout>
</template>

<script>
    export default {
        props: {
            temperature: {
                type: Number
            },
            time: {
                type: String
            },
            rangeMax: {
                type: Number
            }
        },

        computed: {
            getPosition() {;
                return 'top: ' + 4 * (this.rangeMax - this.temperature) + 'px'; 
            }
        }
    }
</script>

<style>
    .cmp-forecast-element span {
        position: relative;
        text-align: center;
        width: 100%;
    }
</style>