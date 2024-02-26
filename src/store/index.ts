import { Connections, Game, Player, RequestMessage, Room, WinnerEntry, wsClient } from '../ws-server/types'

const games: Game[] = []
const winners: WinnerEntry[] = []
const players: Player[] = []
const connections: Connections = {}
const rooms: Room[] = []

const selectPlayerByName = (name: string) => {
	return players.find(player => player.name === name)
}
const selectPlayerById = (id: number) => {
	return players.find(player => player.id === id)
}
const addNewPlayer = (player: Player) => {
	players.push(player)
	return player
}

const setConnection = (id: number, ws: wsClient) => {
	connections[id] = ws
}
const checkConnection = (name: string) => {
	return Object.values(connections).some(ws => ws.name === name)
}
const removeConnection = (id: number) => {
	delete connections[id]
}
const sendToAll = (message: RequestMessage) => {
	Object.values(connections).forEach(ws => ws.send(JSON.stringify(message)))
}
const sendToPlayer = (id: number, message: RequestMessage) => {
	connections[id].send(JSON.stringify(message))
}

const generateNewId = () => {
	return players.length + 1
}

const getRooms = () => {
	return rooms
}
const addNewRoom = (name: string, index: number) => {
	rooms.push({ roomId: rooms.length, roomUsers: [{ name, index }] })
}
const selectRoomByIndex = (indexRoom: number) => {
	return rooms.find(room => room.roomId === indexRoom)
}
const arePlayerInRoom = (name: string, roomId: number) => {
	return rooms.some(room => room.roomId === roomId && room.roomUsers.some(user => user.name === name))
}

const addNewGame = (game: Game) => {
	games.push(game)
}
const selectGame = (id: number) => {
	return games.find(game => game.idGame === id)
}

const getSecondPlayerId = (id: number, game: Game) => {
	return game.playersIds.find(playerId => playerId !== id)
}

const selectWinner = (name: string) => {
	return winners.find(winner => winner.name === name)
}
const getWinnersTable = () => {
	return winners
}
const addNewWinner = (name: string) => {
	winners.push({ name, wins: 1 })
}

export {
	getWinnersTable,
	addNewWinner,
	selectWinner,
	getSecondPlayerId,
	selectGame,
	addNewGame,
	sendToPlayer,
	selectPlayerByName,
	addNewPlayer,
	setConnection,
	checkConnection,
	generateNewId,
	selectPlayerById,
	addNewRoom,
	sendToAll,
	getRooms,
	removeConnection,
	selectRoomByIndex,
	arePlayerInRoom,
}
