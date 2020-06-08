<template>
    <div class="dashboard">
        <div id="output"></div>
        <a href="javascript:history.go(-1)"> Go Back</a>
        <h1>Dashboard page</h1>
        <div class="tiles_wrapper">
            <VueDragResize
                    v-for="(tile, index) in tiles"
                    :key="index"
                    :parentLimitation="true"
                    :isActive="tile.isActive"
                    :x="tile.rect.left"
                    :y="tile.rect.top"
                    :w="tile.rect.width"
                    :h="tile.rect.height"
                    :z="tile.zIndex"
                    v-on:activated="onActivated(index)"
                    v-on:resizing="(args) => resize(args, index)"
                    v-on:dragging="(args) => resize(args, index)">
                <md-card class="md-primary">
                    <md-card-header>
                        <md-card-header-text>
                            <span class="md-body-2">Tile {{tile.id}}</span>
                        </md-card-header-text>

                        <md-card-media>
                            <div class="md-subhead">{{ tile.rect.top }} х {{ tile.rect.left }}</div>
                            <div class="md-subhead">{{ tile.rect.width }} х {{ tile.rect.height }}</div>
                        </md-card-media>
                    </md-card-header>
                    <md-card-actions>
                        <md-button @click="tileDelete(index)">Delete</md-button>
                    </md-card-actions>
                </md-card>
            </VueDragResize>
        </div>
    </div>
</template>

<script>
	import VueDragResize from 'vue-drag-resize';

	export default {
		name: 'dashboard',
		components: {
			VueDragResize
		},
		data() {
			return {}
		},
		mounted() {
			this.$store.commit('tilesCreate')
		},
		computed: {
			tiles() {
				return this.$store.state.persistedState.tiles
			},
		},
		methods: {
			resize(rect, index) {
				this.$store.commit('updateRect', {rect, index})
			},
			onActivated(index) {
				this.$store.commit('deactivate', index)
				this.$store.commit('updateZIndex', index)
			},
			tileDelete(index) {
				this.$store.commit('tileDelete', index)
			}

		}
	}
</script>

<style lang="scss" scoped>
    .tiles_wrapper {
        position: relative;
        height: 1000px;
    }
    /*.md-content {
        max-width: 100%;
        height: 100%;
        display: block;
        vertical-align: top;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    }*/
    .md-card {
        margin: 0;
        overflow: hidden;
        height: 100%;
    }

    .md-toolbar {
        min-height: auto;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .vdr.active:before {
        outline: 1px solid #000;
    }

    .md-card-header .md-card-media {
        height: auto;
        width: auto;
        flex-shrink: 0;
    }
</style>
