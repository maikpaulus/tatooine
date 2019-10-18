<template>
    <div class="cmp-page cmp-page-thermostat">
        <header>
            <div class="header-wrapper">
                <a class="back" href="/"><i class="fas fa-home"></i></a>
                <h2 class="room-name">{{ this.mac }}</h2>
                <span class="save-state">
                    <i class="fas fa-save"></i>
                    <span class="state" v-if="save.process || save.state">
                        <i v-if="save.state === 'successful'" class="fas fa-check"></i>
                        <i v-if="save.state === 'failed'" class="fas fa-times"></i>
                        <i v-if="save.process" class="fas fa-cog"></i>
                    </span>
                </span>
            </div>
        </header>
        <main>
            <div class="actions">
                <div class="action temperature-controller-wrapper">
                    <div class="inner">
                        <h4><i class="fas fa-thermometer-quarter"></i>Temperaturregler</h4>
                        <div class="temperature-controller">
                            <div class="range">
                                <div class="target">
                                    <span class="current">{{ meta.temperature }} °C</span>
                                    <span class="temperature">{{ device.targetTemperature }} °C</span>
                                </div>
                            </div>
                            <div class="controller"></div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="actions">
                <div class="action half">
                    <div class="inner switch" v-on:click="saveMode">
                        <h4>Modus</h4>
                        <div class="option" v-if="device.mode === 'manual'">
                            <i class="fas fa-hand-paper"></i>
                            <span>Manuell</span>
                        </div>
                        <div class="option" v-if="device.mode === 'auto'">
                            <i class="fas fa-magic"></i>
                            <span>Auto</span>
                        </div>
                    </div>
                </div>
                <div class="action half">
                    <div class="inner switch" v-on:click="saveLocked">
                        <h4>Sperre</h4>
                        <div class="option" v-if="device.locked === true">
                            <i class="fas fa-lock"></i>
                            <span>An</span>
                        </div>
                        <div class="option" v-if="device.locked === false">
                            <i class="fas fa-lock-open"></i>
                            <span>Aus</span>
                        </div>
                    </div>
                </div>
                <div class="action half">
                    <div class="inner switch" v-on:click="saveBoost">
                        <h4>Boost</h4>
                        <div class="option" v-if="device.boost === true">
                            <i class="fas fa-rocket"></i>
                            <span>An</span>
                        </div>
                        <div class="option" v-if="device.boost === false">
                            <i class="fas fa-couch"></i>
                            <span>Aus</span>
                        </div>
                    </div>
                </div>
                <div class="action half">
                    <div class="inner slider">
                        <h4>Offset</h4>
                        <input class="offset-slider" v-model="device.offset" type="range" min="-3.5" max="3.5" step="0.5">
                        <span>{{ device.offset }} °C</span>
                    </div>
                </div>
                <div class="action">
                    <div class="inner scheduler">
                        <h4><i class="fas fa-clock"></i>Zeitsteuerung</h4>
                        <ul>
                            <li data-value="mon" v-on:click="setSelection('mon')" v-bind:class="{active: this.scheduler.selection === 'mon'}">mo</li>
                            <li data-value="tue" v-on:click="setSelection('tue')" v-bind:class="{active: this.scheduler.selection === 'tue'}">di</li>
                            <li data-value="wed" v-on:click="setSelection('wed')" v-bind:class="{active: this.scheduler.selection === 'wed'}">mi</li>
                            <li data-value="thu" v-on:click="setSelection('thu')" v-bind:class="{active: this.scheduler.selection === 'thu'}">do</li>
                            <li data-value="fri" v-on:click="setSelection('fri')" v-bind:class="{active: this.scheduler.selection === 'fri'}">fr</li>
                            <li data-value="sat" v-on:click="setSelection('sat')" v-bind:class="{active: this.scheduler.selection === 'sat'}">sa</li>
                            <li data-value="sun" v-on:click="setSelection('sun')" v-bind:class="{active: this.scheduler.selection === 'sun'}">so</li>
                        </ul>
                        <div class="schedule-option" v-bind:key="key" v-for="(option, key) in device.timer[scheduler.selection]">
                            <input v-if="key !== 0" v-on:change="syncTimeFromTo(key)" v-model="option.from" type="time" v-bind:min="getMinTimeForFromField(scheduler.selection, key)" v-bind:max="getMaxTimeForFromField(scheduler.selection, key)" step="600">
                            <span v-else class="time">{{ option.from }}</span>
                            
                            <span v-if="key === device.timer[scheduler.selection].length - 1" class="temperature-display">{{ option.temperature }} °C</span>
                            <span v-else v-on:click="removeTimer(key);" class="temperature-display">{{ option.temperature + '° C' }}</span>
                            
                            <input v-if="device.timer[scheduler.selection][key+1]" v-on:change="syncTimeToFrom(key)" v-model="device.timer[scheduler.selection][key].to" type="time" min="04:50" step="600">
                            <span v-else class="time">{{ device.timer[scheduler.selection][device.timer[scheduler.selection].length - 1].to }}</span>
                            
                            <input v-if="key === device.timer[scheduler.selection].length - 1" class="temperature-slider" v-model="option.temperature" v-on:change="syncTemperature(key)" type="range" min="4" max="30" step="0.5">
                            <input v-else class="temperature-slider" v-model="option.temperature" v-on:change="syncTemperature(key)" type="range" min="4" max="30" step="0.5">
                        </div>
                        <div class="schedule-actions">
                            <button v-if="device.timer[scheduler.selection].length < 7" type="click" v-on:click="addTimer"><i class="fas fa-plus"></i></button>
                            <button type="click" v-on:click="saveSchedule"><i class="fas fa-save"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer>
            <!-- &copy; 2019 | smarthome | familie paulus | made with &hearts in munich; -->
        </footer>
    </div>
</template>

<script lang="ts">
    
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator';

    export enum ModeSelection {
        Manual = 'manual',
        Auto = 'auto'
    }

    export enum SaveResult {
        Successful = 'successful',
        Failed = 'failed'
    }

    export enum DaySelection {
        Monday = 'mon',
        Tuesday = 'tue',
        Wednesday = 'wed',
        Thursday = 'thu',
        Friday = 'fri',
        Saturday = 'sat',
        Sunday = 'sun',
    }

    export interface Timer {
        from: string;
        to: string;
        temperature: number;
    }

    export interface Device {
        targetTemperature: number;
        mode: ModeSelection;
        locked: boolean;
        boost: boolean;
        offset: number;
        valve: number;
        timer: {
            [key in DaySelection]: Array<Timer>
        }
    }

    export interface SaveState {
        process: boolean;
        state: SaveResult | boolean;
    }

    export interface SliderState {
        draggable: boolean;
    }

    export interface SchedulerState {
        selection: DaySelection;
    }

    export interface MetaState {
        temperature: number;
    }
    
    declare global {
        interface Element {
            offsetLeft: number;
            offsetWidth: number;
            offsetTop: number;
            offsetHeight: number;
            style: {
                transform: string;
            };
            
            onmousedown: (event: Event) => any;
            onmouseup: (event: Event) => any;
            ontouchstart: (event: Event) => any;
            ontouchend: (event: Event) => any;
        }

        interface VueConstructor {
            $http: {
                get: (
                    url: string, 
                    data?: any, 
                    options?: any
                ) => any
            }
        }

        interface PromiseLike<T> {
            then(
                onfulfilled?: (value: any) => void | PromiseLike<void>,
                onrejected?: (reason: any) => PromiseLike<never>
            ): any
        }
    }

    declare global {
    }

    @Component
    export default class Thermostat extends Vue {
        @Prop() private mac: String = '';

        private save: SaveState = {
            process: false,
            state: undefined
        }

        private slider: SliderState = {
            draggable: false
        }

        private scheduler: SchedulerState = {
            selection: DaySelection.Monday
        };

        private meta: MetaState = {
            temperature: 0
        }

        private device: Device = {
                targetTemperature: 20,
                mode: ModeSelection.Auto,
                locked: false,
                boost: false,
                offset: 0,
                valve: 0,
                timer: {
                    mon: [
                        {
                            from: '00:00',
                            to: '07:00',
                            temperature: 20
                        }
                    ],
                    tue: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ],
                    wed: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ],
                    thu: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ],
                    fri: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ],
                    sat: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ],
                    sun: [
                        {
                            from: '00:00',
                            temperature: 20,
                            to: '24:00'
                        }
                    ]
                }
        }
        
        private mounted() {
            this.mac = this.mac || this.$route.params.mac;
            const border = document.getElementsByClassName('temperature-controller')[0];
            const controller = document.getElementsByClassName('controller')[0];
            const slider = document.getElementsByClassName('offset-slider')[0];

            const centerX = border.offsetLeft + border.offsetWidth / 2;
            const centerY = border.offsetTop + border.offsetHeight / 2; 

            const quotient = 290 / 52;

            border.onmousedown = border.ontouchstart = (event) => {
                this.slider.draggable = true;
            };

            window.onmousemove = window.ontouchmove = (event) => {
                if (!this.slider.draggable) {
                    return;
                }

                let touch = undefined;
                if (event.touches) {
                    touch = event.touches[0]
                }

                const posX = event.clientX || touch.clientX;
                const posY = event.clientY || touch.clientY;

                let angle = Math.atan2(centerY - posY, centerX - posX) * (180 / Math.PI) - 180;
                
                if (angle < 0) {
                    angle = 360 + angle
                }

                angle = Math.round(angle);
                
                if (angle >= 55 && angle <= 125) {
                    return; 
                }

                let position = angle < 126 ? 360 - 126 + angle : angle - 126;
                this.device.targetTemperature = 4 + 0.5*Math.round(position / quotient);

                controller.style.transform = `rotate(${angle}deg)`;
            };

            border.onmouseup = border.ontouchend = () => {
                this.slider.draggable = false;
                this.saveTargetTemperature();
            };

            slider.onmouseup = slider.ontouchend = () => {
                this.saveOffset();
            };

            this.save.process = true;
        
            this.$http.get('http://weather.smarthome.maraundmaik.de/')
                .then((response) => {
                    this.meta.temperature = Math.round(response.data.response.current[1].temperature * 10) / 10;
                }) 
                .then(() => {
                    this.$http.get('http://weather.smarthome.maraundmaik.de/device/thermostat/' + this.mac)
                        .then((response) => {
                            this.device = response.data.response.device;
                            let angle = Math.round(126 + (this.device.targetTemperature - 4) * 2 * quotient);
                            controller.style.transform = `rotate(${angle}deg)`;
                        })
                })
                .then(() => {
                    this.$http.post('/api/thermostat/' + this.mac, {
                        type: 'others',
                        command: 'json'
                    })
                    .then((response) => {
                        const data = response.data.response;

                        this.device.targetTemperature = data.temperature;
                        this.device.mode = data.mode.auto ? ModeSelection.Auto : ModeSelection.Manual;
                        this.device.locked = data.mode.locked;
                        this.device.boost = data.mode.boost;
                        this.device.valve = data.valve;

                        for (let day in data.timers) {
                            this.device.timer[day.toLowerCase()] = data.timers[day];
                        }

                        let angle = Math.round(126 + (data.temperature - 4) * 2 * quotient);
                        controller.style.transform = `rotate(${angle}deg)`;

                        this.setSaveMode(false, SaveResult.Successful, true);
                    })
                })
                .catch((err) => {
                    this.setSaveMode(false, SaveResult.Failed);
                });
        }

        saveTargetTemperature() {
            this.save.process = true;
            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'temperature',
                command: 'temp',
                parameters: [ this.device.targetTemperature ]
            }).then((response) => {
                this.setSaveMode(false, SaveResult.Successful, true);
            }).catch((err) => {
                this.setSaveMode(false, SaveResult.Failed);
            });
        }

        saveLocked() {
            this.device.locked = !this.device.locked;
            this.save.process = true;
        
            let command = this.device.locked ? 'lock' : 'unlock';
            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'others',
                    command
            }).then((response) => {
                this.setSaveMode(false, SaveResult.Successful, true);
            }).catch((err) => {
                this.setSaveMode(false, SaveResult.Failed);
            });
        }

        saveBoost() {
            this.device.boost = !this.device.boost;
            this.save.process = true;
        
            let command = this.device.boost ? 'boost' : 'boost_off';
            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'temperature',
                    command
            }).then((response) => {
                this.setSaveMode(false, SaveResult.Successful, true);
            }).catch((err) => {
                this.setSaveMode(false, SaveResult.Failed);
            });
        }

        saveMode() {
            this.save.process = true;

            if (this.device.mode === ModeSelection.Manual) {
                this.device.mode = ModeSelection.Manual;
                this.$http.post('/api/thermostat/' + this.mac, {
                    type: 'mode',
                    command: 'auto'
                }).then((response) => {
                    this.setSaveMode(false, SaveResult.Successful, true);
                }).catch((err) => {
                    this.setSaveMode(false, SaveResult.Failed);
                });
            }
            else {
                this.device.mode = ModeSelection.Manual;
                this.$http.post('/api/thermostat/' + this.mac, {
                    type: 'mode',
                    command: 'manual'
                }).then((response) => {
                    this.setSaveMode(false, SaveResult.Successful, true);
                }).catch((err) => {
                    this.setSaveMode(false, SaveResult.Failed);
                });
            }
        }

        saveOffset() {
            this.save.process = true;
            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'configuration',
                command: 'offset',
                parameters: [ this.device.offset ]
            }).then((response) => {
                this.setSaveMode(false, SaveResult.Successful, true);
            }).catch((err) => {
                this.setSaveMode(false, SaveResult.Failed);
            });
        }

            
        saveToDatabase(callback) {
            this.$http.post('http://weather.smarthome.maraundmaik.de/device/thermostat/' + this.mac, {
                body: this.device
            }).then((response) => {
                callback(null, response);
            }).catch((err) => {
                callback(err);
            });
        }

        setSaveMode(process, state, saveToDB = false) {
            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'sync',
                command: 'sync'
            })
            .then(() => {
                if (saveToDB && state === 'successful') {
                    this.saveToDatabase((err) => {
                        this.save.process = process;
                        if (err) {
                            this.save.state = SaveResult.Failed;
                        }

                        this.save.state = state;
                        window.setTimeout(() => {
                            if (!this.save.process) {
                                this.save.process = false;
                                this.save.state = false;
                            }
                        }, 2000);
                    });
                }
                else {
                    this.save.process = process;
                    this.save.state = state;
                    window.setTimeout(() => {
                        if (!this.save.process) {
                            this.save.process = false;
                            this.save.state = false;
                        }
                    }, 2000);
                }
            })
        }

        setSelection(day) {
            this.scheduler.selection = day;
        }

        getMinTimeForFromField(option, key) {
            if (this.device.timer[option][key-1]) {
                return this.device.timer[option][key-1].from;
            }

            return '00:00';
        }

        getMaxTimeForFromField(option, key) {
            return '23:59';
        }

        getMinTimeForToField(option, key) {
            return this.device.timer[option][key].from;
        }

        getMaxTimeForToField(option, key) {
            return '23:59';
        }

        getTimeFieldModel(option, key) {
            if (this.device.timer[option][key+1]) {
                return this.device.timer[option][key+1].from;
            }

            return undefined;
        }

        saveSchedule() {
            this.save.process = true;
            const current = this.device.timer[this.scheduler.selection];
            
            let parameters = [];
            parameters = current.map((item, key) => [ item.temperature, item.to ]);
            parameters = parameters.reduce((acc, item) => acc.concat(item), []);
            parameters = [this.scheduler.selection].concat(parameters);

            this.$http.post('/api/thermostat/' + this.mac, {
                type: 'timers',
                command: 'timer',
                parameters
            }).then((response) => {
                this.setSaveMode(false, 'successful', true);
            }).catch((err) => {
                this.setSaveMode(false, 'failed');
            });
        }

        addTimer() {
            const current = this.device.timer[this.scheduler.selection]; 
            
            current[current.length-1].to = current[current.length-1].from;
            
            current.push({
                from: current[current.length-1].from,
                temperature: current[0].temperature,
                to: '24:00'
            });
        }

        removeTimer(key) {
            let current = this.device.timer[this.scheduler.selection];
            if (current.length === 1) {
                return;
            }

            if (key > 0 && key < current.length - 1) {
                current[key-1].to = current[key+1].from;
            }

            this.device.timer[this.scheduler.selection] = current.slice(0, key).concat(current.slice(key+1));
            
            this.device.timer[this.scheduler.selection][0].from = '00:00';
            this.device.timer[this.scheduler.selection][this.device.timer[this.scheduler.selection].length-1].to = '24:00';
        }

        syncTimeFromTo(key) {
            this.device.timer[this.scheduler.selection][key-1].to = this.device.timer[this.scheduler.selection][key].from;
        }

        syncTimeToFrom(key) {
            this.device.timer[this.scheduler.selection][key+1].from = this.device.timer[this.scheduler.selection][key].to;
        }

        syncTemperature(key) {
            let current = this.device.timer[this.scheduler.selection];
            if (key === 0) {
                current[this.device.timer[this.scheduler.selection].length-1].temperature = current[0].temperature;
            }

            if (key === this.device.timer[this.scheduler.selection].length - 1) {
                current[0].temperature = current[this.device.timer[this.scheduler.selection].length-1].temperature;
            }
        }
    }
</script>
<style lang="scss">
    @import '../App';

    $controller-width: 18rem;
    $thickness: 4rem;

    .cmp-page-thermostat {
        display: grid;
        grid-template-rows: 3.5em 1fr 2em;
        height: 100%;
        margin: 0 $content-padding;

        header {
            margin: 0 (-$content-padding);
            background: #012135;
            border-bottom: 1px solid rgba(4, 130, 214, 0.5);
            width: 100%;
            position: fixed;
            z-index: 1000;
            height: 3em;

            .header-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 $content-padding;
            }

            a {
                font-size: 1.25em;
                text-align: center;
                text-decoration: none;

                i {
                    color: rgba(4, 130, 214, 1);
                }
            }

            span.save-state {
                font-size: 1.5em;
                color: rgba(4, 130, 214, 1);
                position: relative;

                .state {
                    i {
                        font-size: 1rem;
                        position: absolute;
                        left: -0.5em;
                        top: 0;
                    }
                }

                i.fa-check { color: rgb(4, 209, 4); }
                i.fa-times { color: red; }

                @keyframes rotation {
                    from {
                        transform: rotate(0deg);
                    }

                    50% {
                        transform: rotate(180deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                i.fa-cog { 
                    color: #fff; 
                    transform: rotate(0deg);
                    animation: rotation 2s linear infinite;
                }
            }

            h2 {
                text-align: center;
                font-size: 1.1em;
                font-weight: normal;
            }
        }

        h4 {
            color: #fff;
            margin-top: 0;
            text-transform: uppercase;
            line-height: 1.5em;
            display: flex;
            justify-content: center;

            i {
                font-size: 1.5em;
                display: inline-block;
                padding-right: 0.5em;
                color: rgba(4, 130, 214, 1);
            }
        }

        main {
            margin-top: 3em;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-content: flex-start;

            .temperature-controller-wrapper {
                width: 100%;

                .inner {
                    margin-bottom: 0;
                }
            }

            .temperature-controller {
                position: relative;
                width: $controller-width;
                height: $controller-width;
                margin: 0 auto;
                touch-action: none;
            }

            .range {
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, blue, blue 15%,red 85%, red);
                border-radius: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow:hidden;

                .target {
                    display: flex;
                    align-items: center;
                    align-content: center;
                    flex-wrap: wrap;
                    justify-content: center;
                    background: $background;
                    width: calc(100% - #{($thickness - 1rem)});
                    height: calc(100% - #{($thickness - 1rem)});
                    border-radius: 100%;
                    position: absolute;
                    z-index: 100;

                    span, i {
                        width: 100%;
                        text-align: center;
                        position: relative;
                        z-index:200;
                    }

                    .current {
                        font-size: 1.5em;
                        color: rgb(4, 130, 214);
                    }

                    .temperature {
                        font-size: 3em;
                    }

                    &::after {
                        content: '';
                        width: 0;
                        height: 0;
                        bottom: -3.5rem;
                        background: transparent;
                        position: absolute;
                        z-index: 99;
                        border-width: $controller-width / 2;
                        border-style: solid;
                        border-color: transparent;
                        border-bottom-color: $background; 
                    }
                }
            }

            .controller {
                position: absolute;
                width: 100%;
                height: $thickness/2;
                top: calc(50% - #{($thickness / 4)});
                left: 0;
                transform: rotate(0deg);
                z-index: 100;

                &::before {
                    content: '';
                    position: absolute;
                    width: $thickness/2;
                    height: $thickness/2;
                    top: 0;
                    left: calc(100% - #{($thickness / 2) - 0.25});
                    background: radial-gradient(#aaa, #ccc);
                    z-index: 300;
                    border-radius:100%;
                    box-shadow: 0 0 0 1px #044d7c;
                }
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                width: 100%;

                .action {
                    text-align: center;
                    width: 100%;

                    .inner {
                        padding: $content-padding;
                        margin: $content-padding 0 0;
                        background: rgba(4, 130, 214, 0.1);
                        border: 1px solid rgba(4, 130, 214, 0.5);
                        border-radius: 5px;

                        &.switch {
                            h4 {
                                margin: 0;
                            }
                            div {
                               span, i {
                                    width: 100%;
                                    text-align: center;
                                    position: relative;
                                }

                                i {
                                    margin: 1rem 0;
                                    font-size: 1.5em;
                                    color: rgba(4, 130, 214, 1);
                                }

                                span {
                                    text-transform: uppercase;
                                    font-size: 0.9em;
                                }
                            }
                        }

                        &.slider {
                            h4 {
                                margin: 0;
                            }

                            input {
                                margin: 1rem 0;
                                font-size: 1.5em;
                                height: 1em;
                            }

                            span {
                                width: 100%;
                                display: block;
                                font-size: 0.9em
                            }
                        }

                        &.scheduler {
                            .schedule-option {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                flex-wrap: wrap;
                                padding: $content-padding/2;
                                background-color: rgba(4, 130, 214, 0.1);
                                border: 1px solid rgba(4, 130, 214, 0.5);
                                border-radius: 5px;
                                margin: $content-padding/2 0 0;

                                .time {
                                    font-size: 0.9em;
                                    color: rgba(4, 130, 214, 1);
                                    padding: 0 2.1em;
                                }
                            }

                            ul {
                                display: flex;
                                width: 100%;
                                margin: 0;
                                padding: 0;
                                justify-content: center;

                                li {
                                    list-style-type: none;
                                    text-align: center;
                                    cursor: pointer;
                                    border: 1px solid rgba(4, 130, 214, 0.5);
                                    border-radius: 5px;
                                    color: rgba(4, 130, 214, 1);
                                    flex-grow: 1;
                                    flex-basis: 0;
                                    margin: 0 $content-padding/4;
                                    padding: $content-padding/2 0;
                                    text-transform: uppercase;
                                    background-color: rgba(4, 130, 214, 0.1);

                                    &:first-child { margin-left: 0;}
                                    &:last-child { margin-right: 0;}

                                    &.active {
                                        background: rgba(4, 130, 214, 1);
                                        color: #fff;
                                    }
                                }
                            }

                            .schedule-actions {
                                display: flex;
                                justify-content: flex-end;
                                padding: $content-padding/2 0 0;

                                button {
                                    -webkit-appearance: none;
                                    cursor: pointer;
                                    background: rgba(4, 130, 214, 1);
                                    color: #fff;
                                    padding: $content-padding/2 $content-padding;
                                    font-size: 1em;
                                    border-radius: 5px;
                                    border: 1px solid rgba(4, 130, 214, 0.5);
                                    margin: 0 0 0 $content-padding/2;

                                    &:focus {
                                        outline: 0
                                    }
                                }
                            }

                            .temperature-slider {
                                width: 100%;
                                margin: 0.5em 0 0.25em;
                            }

                            .temperature-display {
                                font-size: 0.9em;
                                cursor: pointer;
                                line-height: 1.8em;
                            }
                        }
                    }

                    &.half {
                        width: 50%;

                        .inner {
                            margin: $content-padding $content-padding/2 0 $content-padding/2;
                        }

                        &:nth-of-type(2n) .inner {
                            margin-right: 0;
                        }

                        &:nth-of-type(2n+1) .inner {
                            margin-left: 0;
                        }
                    }
                }
            }
        }

        input[type=range],
        input[type=time] {
            -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
            background: transparent; /* Otherwise white in Chrome */
            font-size: 1.5em;
        }

        input[type=range]:focus {
            outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
        }

        input[type=range]::-webkit-slider-runnable-track {
            height: 0.5em;
            cursor: pointer;
            background: rgba(4, 130, 214, 1);
            border-radius: 5px;
            border: 0.2px solid #010101;
        }

        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 1.5rem;
            width: 1.5rem;
            font-size: 1em;
            border-radius: 100%;
            background: radial-gradient(#aaa, #ccc);
            margin-top: -0.25em;
            cursor: pointer;
            box-shadow: 1px 1px 1px #0775be, 0px 0px 1px #0775be; /* Add cool effects to your sliders! */
        }

        input[type=time] {
            display: inline-block;
            border: 1px solid rgba(4, 130, 214, 0.5);
            color: rgba(4, 130, 214, 1);
            font-family: 'Open Sans';
            font-size: 0.9em;
            border-radius: 5px; 
            width: auto;
            -webkit-user-select: none;
            padding-left: 2em;
        }

        input[type=time]:focus {
            background: #fff;
            color: rgba(4, 130, 214, 1);;
        }

        input[type=time]::-webkit-datetime-edit-hour-field,
        input[type=time]::-webkit-datetime-edit-minute-field {
            -webkit-appearance: none;
        }

        input[type=time]::-webkit-datetime-edit-hour-field:focus,
        input[type=time]::-webkit-datetime-edit-minute-field:focus {
            background: #fff;
        }

        footer {
            text-align: center;
        }
    }

</style> 