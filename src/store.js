import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import createMutationsSharer from "vuex-shared-mutations";
import VueNativeSock from 'vue-native-websocket'

Vue.use(Vuex)


// const url = 'wss://echo.websocket.org/'
const transactionsUrl = 'wss://ws.blockchain.info/inv'

export default new Vuex.Store({
	plugins: [
		createPersistedState({
			paths: ["persistedState"]
		}),
		createMutationsSharer(
			{
				predicate: [
					"updateRect",
					"updateZIndex",
					"deactivate",
					"tileDelete",
					"tileReturn"
				]
			}
		)
	],
	state: {
		persistedState: {
			message: 'default',
			defaultPositions: true,
			tileDefaultWidth: 300,
			tileDefaultHeight: 150,
			defaultTilesNumber: 15,
			tiles: [],
			tilesBasket: []
		},
		transactionsConnection: false,
		transactionsList: [],
		transactionsSum: 0
	},
	getters: {},
	mutations: {
		updateMessage(state, message) {
			state.persistedState.message = message
		},
		updateRect(state, tile) {

			// state.persistedState.tiles.splice(tile.index, 1, {'rect': tile.rect})
			state.persistedState.tiles[tile.index].rect = tile.rect
		},
		updateZIndex(state, index) {
			state.persistedState.tiles.forEach(item => {
				if (item.zIndex !== 'auto' && (state.persistedState.tiles[index].zIndex === 'auto' || item.zIndex > state.persistedState.tiles[index].zIndex)) {
					item.zIndex--
				}
			})
			state.persistedState.tiles[index].zIndex = state.persistedState.tiles.length
		},
		deactivate(state, index) {
			state.persistedState.tiles.forEach(item => item.isActive = false)
			state.persistedState.tiles[index].isActive = true
		},
		setDefaultPositions(state) {
			if (state.persistedState.defaultPositions === false) return false
			let summWidth = 0,
				summHeight = 0,
				box = document.querySelector('.tiles_wrapper'),
				containerWidth = box.clientWidth,
				tilesOffset = (containerWidth % state.persistedState.tileDefaultWidth) / (Math.floor(containerWidth / state.persistedState.tileDefaultWidth) - 1)
			// box.style.width = '1100px'
			state.persistedState.tiles.forEach(item => {
				if (summWidth + item.rect.width > containerWidth) {
					summWidth = 0
					summHeight += item.rect.height + 20
					item.rect.left = summWidth
					item.rect.top = summHeight
					summWidth += (item.rect.width + tilesOffset)
				} else {
					item.rect.left = summWidth
					item.rect.top = summHeight
					summWidth += (item.rect.width + tilesOffset)
				}
			})

			summHeight += 500
			box.style.height = summHeight + 'px'
		},
		tilesCreate(state) {
			if (state.persistedState.tiles.length !== 0) return false
			for (var i = 1; i <= state.persistedState.defaultTilesNumber; i++) {
				state.persistedState.tiles.push({
					id: i,
					isActive: false,
					zIndex: 'auto',
					// visible: true,
					timeLeft: 0,
					rect: {
						width: state.persistedState.tileDefaultWidth,
						height: state.persistedState.tileDefaultHeight,
						top: 0,
						left: 0
					}
				})
			}
			this.commit('setDefaultPositions');
		},
		tileDelete(state, index) {
			const el = state.persistedState.tiles.splice(index, 1)
			el[0].timeOut = setTimeout(function () {
				clearInterval(state.persistedState.tilesBasket[state.persistedState.tilesBasket.indexOf(el[0])].countDown)
				state.persistedState.tilesBasket = state.persistedState.tilesBasket.filter(item => item !== el[0])
			}, 6000)

			el[0].timeLeft = 5
			state.persistedState.tilesBasket = state.persistedState.tilesBasket.concat(el)
			el[0].countDown = setInterval(function () {
				state.persistedState.tilesBasket[state.persistedState.tilesBasket.indexOf(el[0])].timeLeft--
			}, 1000)
		},
		tileReturn(state, index) {
			const el = state.persistedState.tilesBasket.splice(index, 1)
			clearTimeout(el[0].timeOut)
			clearInterval(el[0].countDown)
			el[0].rect = {
				width: state.persistedState.tileDefaultWidth,
				height: state.persistedState.tileDefaultHeight,
				top: state.persistedState.tileDefaultHeight / 2,
				left: document.querySelector('.tiles_wrapper').clientWidth / 2 - state.persistedState.tileDefaultWidth / 2
			}
			delete el[0].timeOut
			delete el[0].countDown
			state.persistedState.tiles = state.persistedState.tiles.concat(el)
		},
		transactionsConnect(state, connection) {
			state.transactionsConnection = connection
		},
		startListing(state, response) {
			// let inputs = 0;
			let outputs = 0;
			// response.x.inputs.forEach(e => {
			// 	inputs += e.prev_out.value
			// })

			// response.x.out.forEach(e => {
			// 	// outputs += e.value
			// 	console.log('e.addr: '+e.addr)
			// })
			state.transactionsSum += response.x.out[0].value / 100000000
			state.transactionsList.push({
				'from': response.x.inputs[0].addr,
				'to': response.x.out[0].addr,
				'sum': response.x.out[0].value / 100000000
			})
		},
		// stopListing(state) {
		//
		// },
		resetListing(state) {
			state.transactionsSum = 0
			state.transactionsList = []
		}

	},
	actions: {
		transactionsConnect(context) {
			const connection = new WebSocket(transactionsUrl)
			connection.onopen = e => {
				context.commit('transactionsConnect', connection)
			}
		},
		startListing(context) {
			if (context.state.transactionsConnection) {
				context.state.transactionsConnection.send('{"op":"unconfirmed_sub"}')
				context.state.transactionsConnection.onmessage = response => {
					context.commit('startListing', JSON.parse(response.data))
				}
			}
		},
		stopListing(context) {
			context.state.transactionsConnection.send('{"op":"unconfirmed_unsub"}')
		},
// 		connection.onopen = function (evt) {
// 			connection.send('{"op":"unconfirmed_sub"}');
// 			console.log('Open')
// 		};
// connection.onclose = function (evt) {
// 	console.log(evt)
// };
// connection.onmessage = function (evt) {
// 	console.log(JSON.parse(evt.data))
// 	connection.send('{"op":"unconfirmed_unsub"}');
// };
// connection.onerror = function (evt) {
// 	console.log(evt)
// };
	}
})

