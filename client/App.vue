<template>
    <div class="cmp-app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { Component } from 'vue-property-decorator';

    @Component
    export default class App extends Vue {
        mounted() {
            this.$router.beforeEach((to, from, next) => {
                next(to.path + '?token=' + window.localStorage.getItem('tatooine'));
            });
        }
    }
</script>

<style lang="scss">
    @import './App';
    
    @font-face {
        font-family: "Open Sans";
        font-style: normal;
        font-weight: 400;
        src: local("Open Sans"), local("OpenSans"), url("https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf") format("truetype");
    }

    html, body {
        width: 100%;
        height: 100%;
        scroll-behavior: smooth;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        background-color: $background;
        color: #fff;
    }
</style>
