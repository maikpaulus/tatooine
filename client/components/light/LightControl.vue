<template>
    <div> 
        <button v-on:click="schalteLichtAn">Licht an</button>
        <button v-on:click="schalteLichtAus">Licht aus</button>
        <button v-on:click="spieleEinTor">TOOOOOOOOOR!!!</button>
        <audio class="audio" controls>
            <source src="/assets/audio/werder-jingle.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>

<script>
    export default {
        methods: {
            schalteLichtAn() {
                this.$http.post('/licht/an')
            },

            schalteLichtAus() {
                this.$http.post('/licht/aus')
            },

            spieleEinTor() {
                this.$http.post('/licht/tor').then(() => {
                    setTimeout(() => {
                        document.getElementsByTagName('audio')[0].play(); 
                    }, 450)
                })
            }
        }
    }
</script>