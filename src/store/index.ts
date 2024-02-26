import { Connections, Game, Player, RequestMessage, Room, wsClient } from '../ws-server/types'

const games: Game[] = []
const players: Player[] = []
const connections: Connections = {}
const rooms: Room[] = []
const selectPlayer = (name: string) => {
	return players.find(player => player.name === name)
}
const selectPlayerById = (id: number) => {
	return players.find(player => player.id === id)
}
const addNewPlayer = (player: Player) => {
	players.push(player)
	console.log(players)
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
const sendToAll = (message: RequestMessage) => {
	Object.values(connections).forEach(ws => ws.send(JSON.stringify(message)))
}
const sendToPlayer = (id: number, message: RequestMessage) => {
	connections[id].send(JSON.stringify(message))
}
export {
	addNewGame,
	sendToPlayer,
	selectPlayer,
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
