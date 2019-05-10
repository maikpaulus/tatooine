<template>
    <div class="cmp-page cmp-page-room">
        <header>
            <a class="back" v-on:click="$router.push('/')"><i class="fas fa-home"></i></a>
            <h2 class="room-name">{{ this.name }}</h2>
            <a class="settings" v-on:click="$router.push('/settings')"><i class="fas fa-cogs"></i></a>
        </header>
        <main>
            <div class="room-image">
                <img v-bind:src="this.image">       
            </div>
            
            <h3 v-if="sensors.length" class="sensors-title">Sensoren</h3>
            <div class="sensors" v-if="sensors.length">
                <div class="sensor" v-bind:key="sensor.id" v-for="sensor in sensors">
                    <div class="inner">
                        <h4>{{ sensor.name }}</h4>
                        <i v-bind:class="getIcon(sensor)"></i>
                        <div class="value">{{ sensor.value }}</div>
                    </div>
                </div>
            </div>

            <h3 v-if="devices.length" class="devices-title">Geräte</h3>
            <div v-if="devices.length" class="devices">
                <div class="device" v-bind:key="device.id" v-for="device in devices">
                    <div class="inner">
                        <h4>{{ device.name }}</h4>
                        <i v-bind:class="getIcon(device)"></i>
                        <div class="value">ID: {{ device.value }}</div>
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <!-- &copy; 2019 | smarthome | familie paulus | made with &hearts in munich; -->
        </footer>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: ''
            },
            image: {
                type: String,
                default: '',
            }
        },

        mounted() {
            /* Notification.requestPermission((result) => {
                alert(result);
            })
            window.setTimeout(() => {
                var notification = new Notification('123', { body: '123 Polizei'});
            }, 10000); */
        },

        data() {
            return {
                meta: {
                    name: this.$props.name,
                    image: this.$props.image,
                },
                sensors: [
                    {
                        sensor: 'temperature',
                        name: 'Temperatur',
                        icon: 'fa-thermometer-quarter',
                        value: '21 °C'
                    },
                    {
                        sensor: 'humidity',
                        name: 'Luftfeuchte',
                        icon: 'fa-tint',
                        value: '21 °C'
                    },
                    {
                        sensor: 'window',
                        name: 'Fenster',
                        icon: 'fa-windows',
                        value: 'Offen'
                    }
                ],
                devices: [
                    {
                        id: 1,
                        device: 'hygrometer',
                        icon: 'fas fa-thermometer',
                        name: 'Thermo-Hygrometer',
                        value: 1
                    },
                    {
                        id: 2,
                        device: 'thermostat',
                        icon: 'fas fa-fire',
                        name: 'Thermostat',
                        value: '00:1A:22:0F:59:FD'
                    }
                ]
            }
        },

        methods: {
            getIcon(element) {
                let faBaseClasses = {
                    fas: element.icon !== 'fa-windows',
                    fab: element.icon === 'fa-windows'
                };

                faBaseClasses[element.icon] = true;
                return faBaseClasses;
            }
        }
    }
</script>

<style lang="scss">
    @import './../App';
    
    .cmp-page-room {
        display: grid;
        grid-template-rows: 3.5em 1fr 2em;
        height: 100%;
        margin: 0 $content-padding;

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 (-$content-padding);
            padding: 0 $content-padding;
            background: rgba(4, 130, 214, 0.1);
            border-bottom: 1px solid rgba(4, 130, 214, 0.5);

            a {
                font-size: 1.25em;
                text-align: center;
                color: $text;

                i {
                    color: $text;
                }
            }

            h2 {
                text-align: center;
                font-size: 1.1em;
                font-weight: normal;
            }
        }

        main {
            display: flex;
            flex-wrap: wrap;

            padding: $content-padding 0;

            justify-content: space-evenly;

            .room-image {
                overflow: hidden; 
                border-radius: 5px;
                max-height: 20em;

                img {
                    width: 100%;
                    border-radius: 5px;
                    transition: transform 1s ease-out;
                }

                img:hover {
                    transform: scale(1.1);
                }
            }

            h3 {
                margin: 1em 0 0;
                text-align: left;
                text-transform: uppercase;
                
                &.sensors-title {
                    color: rgba(4, 130, 214, 0.5);
                }

                &.devices-title {
                    color: rgba(93, 253, 1, 0.5);
                }
            }

            .devices, .sensors {
                display: flex;
                justify-content: space-between;
                align-content: space-between;
                flex-wrap: wrap;
                width: 100%;
            }
            
            .device, .sensor {
                text-align: center;
                width: 50%;

                .inner {
                    display: block;
                    background: rgba(4, 130, 214, 0.1);
                    padding: $content-padding $content-padding/2;
                    margin: 0 $content-padding/4 $content-padding/2 $content-padding/4;
                    border-radius: 5px;
                    border: 1px solid rgba(4, 130, 214, 0.5);

                    h4 {
                        width: 100%;
                        margin: 0;
                        text-transform: uppercase;
                        font-size: 0.8em;
                        font-weight: normal;
                    }

                    i {
                        font-size: 2em;
                        line-height: 2em;
                        color: rgba(4, 130, 214, 0.5);
                    }
                }

                &:nth-of-type(2n) .inner {
                    margin-right: 0;
                }

                &:nth-of-type(2n+1) .inner {
                    margin-left: 0;
                }

                &:nth-of-type(1) .inner,
                &:nth-of-type(2) .inner {
                    margin-top: $content-padding;
                }
            }

            .device .inner {
                background: rgba(93, 253, 1, 0.1);
                border: 1px solid rgba(93, 253, 1, 0.5);

                i {
                    color:rgba(93, 253, 1, 0.5);
                }
            }
        }

        footer {

            text-align: center;
        }
    }

</style>