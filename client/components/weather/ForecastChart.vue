<script>
    import VueCharts from 'vue-chartjs';
    import { Line } from 'vue-chartjs';

    export default {
        extends: Line,
        props: ['data', 'options'],
        mounted() {
            this.renderChart(this.data, this.options)
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