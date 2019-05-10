<template>
    <md-layout :class="'cmp-navigation-element' + this.isActive" md-flex-xsmall="20" md-flex-small="20" md-flex-medium="20">
        <span v-on:click="changeWeatherId">
            <md-icon :md-iconset="'fa ' + this.icon"></md-icon> {{Math.round(this.temperature)}}°
        </span>
    </md-layout>
</template>

<script>
    export default {
        props: {
            id: {
                type: Number
            },

            temperature: {
                type: Number
            },

            icon: {
                type: String
            }
        },

        computed: {
            isActive () {
                return (this.id === this.$store.getters.get('stationId')) ? ' active' : '';
            }
        },

        methods: {
            changeWeatherId () {
                this.$store.dispatch('changeStationId', this.id);
            }
        },
    }
</script>

<style>
    .cmp-weather-navigation .cmp-navigation-element {
        cursor: pointer;
    }

    .cmp-weather-navigation .cmp-navigation-element span {
        border: 2px solid #fff;
        width: 100%;
        margin: 0.5em;
        padding: 0.5rem;
        text-align: center;
        cursor: pointer;
    }

    .cmp-weather-navigation .cmp-navigation-element.active span {
        background-color: #fff;
        color: #35393c;
    }

    .cmp-weather-navigation .cmp-navigation-element span .md-icon {
        position: relative;
        top: 4px;
    }
</style>