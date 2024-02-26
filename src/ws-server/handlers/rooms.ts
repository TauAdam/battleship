import { addNewGame, addNewRoom, arePlayerInRoom, getRooms, selectPlayerById, selectRoomByIndex, sendToAll, sendToPlayer } from '../../store'
import { Command, Game } from '../types'

const refreshRoom = () => {
	const message = {
		id: 0,
		type: Command.UpdateRoom,
		data: JSON.stringify(getRooms()),
	}
	sendToAll(message)
}

const handleCreateRoom = (id: number) => {
	const player = selectPlayerById(id)
	if (!player) return
	addNewRoom(player.name, player.id)
	refreshRoom()
}

const createGameInRoom = (index: number) => {
	const room = selectRoomByIndex(index)
	if (!room) return
	const idGame = room.roomId
	const game: Game = {
		idGame,
		playersIds: room.roomUsers.map(user => user.index),
		playersNames: room.roomUsers.map(user => user.name),
	}
	addNewGame(game)
	room.roomUsers.forEach(user => {
		const message = {
			data: JSON.stringify({ idGame, idPlayer: user.index }),
			id: 0,
			type: Command.CreateGame,
		}
		sendToPlayer(user.index, message)
	})
}

const handleAddUserToRoom = (index: number, data: string) => {
	const { indexRoom } = JSON.parse(data)
	const room = selectRoomByIndex(indexRoom)
	const player = selectPlayerById(index)
	if (!player || !room) return
	const isPlayerInRoom = arePlayerInRoom(player.name, indexRoom)
	if (isPlayerInRoom) return
	room.roomUsers.push({ name: player.name, index })
	refreshRoom()
	createGameInRoom(room.roomId)
}

export { handleCreateRoom, refreshRoom, handleAddUserToRoom }
