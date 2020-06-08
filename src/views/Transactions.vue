<template>
    <div class="transactions">
        <a href="javascript:history.go(-1)">Go Back</a>
        <h1>Transactions page</h1>
        <div class="md-layout md-gutter">
            <div class="md-layout-item t_center">
                <md-button class="md-raised md-primary" @click="startListing">Start</md-button>
            </div>
            <div class="md-layout-item t_center">
                <md-button class="md-raised md-accent" @click="stopListing">Stop</md-button>
            </div>
            <div class="md-layout-item t_center">
                <md-button class="md-dense md-primary" @click="resetListing">Reset</md-button>
            </div>
        </div>
        <div class="md-gutter md-layout t_center">
            <div class="md-layout-item md-gutter">
                <span class="md-headline">Sum: {{transactionsSum}} BTC</span>
            </div>
        </div>
        <div class="md-gutter md-layout t_center">
            <div class="md-layout-item md-gutter">
                <md-table>
                    <md-table-row>
                        <md-table-head>From</md-table-head>
                        <md-table-head>To</md-table-head>
                        <md-table-head>Sum</md-table-head>
                    </md-table-row>

                    <md-table-row v-for="(transaction, index) in transactionsList" :key="index">
                        <md-table-cell md-numeric>{{transaction.from}}</md-table-cell>
                        <md-table-cell>{{transaction.to}}</md-table-cell>
                        <md-table-cell>{{transaction.sum}} BTC</md-table-cell>
                    </md-table-row>
                </md-table>
            </div>
        </div>

    </div>
</template>
<script>
	export default {
		name: 'transactions',
		data() {
			return {}
		},
		mounted() {
			this.$store.dispatch('transactionsConnect')
		},
		computed: {
			transactionsSum() {
				return this.$store.state.transactionsSum.toFixed(8)
			},
			transactionsList() {
				return this.$store.state.transactionsList
			}
		},
		methods: {
			startListing() {
				this.$store.dispatch('startListing')
			},
			stopListing() {
				this.$store.dispatch('stopListing')
			},
			resetListing() {
				this.$store.commit('resetListing')
			}
		}
	}
</script>