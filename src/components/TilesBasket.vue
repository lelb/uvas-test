<template>
    <div class="tiles-basket" v-if="tilesBasket.length !== 0">
        <div class="deletedTile" v-for="(tile, index) in tilesBasket" :key="index"
             :style="`background-size: ${tile.timeLeft / 5 * 100}% 100%` ">

            <span class="md-body-2">Tile {{tile.id}} <span class="md-caption">Will be deleted in {{tile.timeLeft}}</span></span>
            <md-button class="md-ripple" @click="tileReturn(index)">Return tile</md-button>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'tiles-basket',
		data() {
			return {}
		},
		mounted() {
			this.$store.state.persistedState.tilesBasket = []
		},
		computed: {
			tilesBasket() {
				return this.$store.state.persistedState.tilesBasket
			},
		},
		methods: {
			tileReturn(index) {
				this.$store.commit('tileReturn', index)
			},

		}
	}
</script>

<style lang="scss" scoped>

    .tiles-basket {
        position: sticky;
        right: 20px;
        left: 100%;
        bottom: 20px;
        z-index: 100;
        width: auto;
        color: #fff;
        display: inline-block;
        margin-left: auto;

        .md-button {
            color: #ffffff;
            margin-left: 5px;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .deletedTile {
        margin-top: 10px;
        /*padding: 15px 15px 0;*/
        padding: 0 15px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, .7);
        background-image: linear-gradient(to right, #000 0, #000 100%);
        background-repeat: no-repeat;
        transition: 1s linear;
        position: relative;

        .md-caption {
            color: #fff;
            display: block;
            /*position: absolute;*/
            /*left: 0;*/
            /*right: 0;*/
            /*top: 5px;*/
            /*padding-left: inherit;*/
        }

        svg {
            margin-left: 7px;
        }
    }

    .base-timer {
        /* Removes SVG styling that would hide the time label */
        &__circle {
            fill: none;
            stroke: none;
        }

        /* The SVG path that displays the timer's progress */
        &__path-elapsed {
            stroke-width: 4px;
            stroke: grey;
        }

        &__path-remaining {
            stroke-width: 4px;
            stroke-linecap: round;
            transform: rotate(90deg);
            transform-origin: center;
            transition: 1s linear all;
            stroke: rgb(65, 184, 131); // green
        }
    }
</style>
