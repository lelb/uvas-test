<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <h1>This is home page of application</h1>
        <p>Please open the menu for navigate onwards</p>
        <div class="md-layout md-alignment-center md-gutter">
            <md-button to="/dashboard" class="md-raised md-primary">Dashboard</md-button>
            <md-button to="/transactions" class="md-raised md-primary">Transactions</md-button>
        </div>
    </div>
</template>

<script>

	export default {
		name: 'home'
	}
</script>

<style scoped lang="scss">
    .home {
        text-align: center;
    }
</style>
