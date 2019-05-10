<template>
    <button v-on:click="handleConnect">Box verbinden</button>
</template>

<script>
    export default {
        methods: {
            deviceSupportsBluetooth() {
                return typeof window.navigator.bluetooth === 'object';
            },

            handleConnect() {
                if (this.deviceSupportsBluetooth()) {
                window.navigator.bluetooth.requestDevice({ 
                    //filters: [{ services: ['battery_service'] }],
                    acceptAllDevices: true
                })
                    .then(device => { window.alert(device); console.log(device) })
                    .catch(error => { window.alert(error); });
                }
            }
        }
    }
</script>