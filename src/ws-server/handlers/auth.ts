import { addNewPlayer, checkConnection, generateNewId, selectPlayer, setConnection } from '../../store'
import { Player, wsClient } from '../types'
import { refreshRoom } from './rooms'

const sendMessage = (ws: wsClient, name: string, id: number, error: boolean, errorText: string) => {
	const message = {
		id: 0,
		type: 'reg',
		data: JSON.stringify({
			name,
			id,
			error,
			errorText,
		}),
	}
	ws.send(JSON.stringify(message))
}

const loginPlayer = (ws: wsClient, data: string) => {
	const { name, password } = JSON.parse(data)
	const oldPlayer = selectPlayer(name)
	if (!oldPlayer) {
		const newPlayer = new ActivePlayer(name, password)
		addNewPlayer(newPlayer)
		ws.name = name
		ws.id = newPlayer.id
		setConnection(newPlayer.id, ws)
		sendMessage(ws, name, newPlayer.id, false, '')
		refreshRoom()
		return
	}
	if (oldPlayer.password !== password) {
		sendMessage(ws, name, oldPlayer.id, true, 'Wrong password')
		return
	}
	const isConnectionOpen = checkConnection(name)
	if (!isConnectionOpen) {
		const id = generateNewId()
		ActivePlayer.id += 1
		oldPlayer.id = id
		ws.id = id
		setConnection(id, ws)
		sendMessage(ws, name, id, false, '')
		refreshRoom()
		return
	}
	sendMessage(ws, name, oldPlayer.id, true, 'User is already connected')
}

class ActivePlayer implements Player {
	static id = 0
	id: number
	wins = 0
	name: string
	password: string

	constructor(name: string, password: string) {
		this.name = name
		this.password = password
		this.id = ActivePlayer.id
		ActivePlayer.id++
	}
}

export { loginPlayer }
