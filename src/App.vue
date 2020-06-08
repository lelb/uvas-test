<template>
    <div id="app">
        <md-app md-mode="overlap">
            <md-app-toolbar class="md-primary">
                <div class="md-toolbar-row">
                    <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                        <md-icon>menu</md-icon>
                    </md-button>
                    <h1 class="md-title">{{$route.meta.title}} {{$route.params.id}}</h1>
                </div>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible" :md-swipeable="true">
                <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

                <md-list>
                    <md-list-item>
                        <router-link to="/dashboard"><span class="md-list-item-text">Dashboard</span></router-link>
                    </md-list-item>
                    <md-list-item>
                        <router-link to="/transactions"><span class="md-list-item-text">Transactions</span>
                        </router-link>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <router-view></router-view>
                <tiles-basket></tiles-basket>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
	import TilesBasket from './components/TilesBasket'

	export default {
		name: 'App',
		components: {TilesBasket},
		data() {
			return {
				menuVisible: false
			}
		}
	}
</script>

<style lang="scss">
    #app {
        height: 100vh;

        .md-app {
            height: 100%;
        }
    }

    .vdr {
        &:not(:hover) {
            .vdr-stick {
                opacity: .4;
            }
        }
    }

    .vdr-stick {
        z-index: 99;
        border-radius: 50%;
        transition: .3s all;
    }

    .t_center {
        text-align: center;
    }
</style>
