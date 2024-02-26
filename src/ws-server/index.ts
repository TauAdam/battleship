import { WebSocketServer } from 'ws'
import { MessageType, RequestMessage, wsClient } from './types'
import { loginPlayer } from './handlers/auth'
import { handleAddUserToRoom, handleCreateRoom, refreshRoom } from './handlers/rooms'
import { removeConnection } from '../store'
import { handleAddShips, handleAttack, handleRandomAttack } from './handlers/ships'

export const BattleshipServer = () => {
	const port = 3000
	const wss = new WebSocketServer({ port }, () => console.log(`WS server is listening at ws://localhost:${port}`))

	wss.on('connection', (ws: wsClient) => {
		ws.on('message', message => {
			console.log('received: %s', message)
			const body: RequestMessage = JSON.parse(message.toString())
			if (body.type === MessageType.Reg) {
				loginPlayer(ws, body.data)
			}
			if (body.type === MessageType.CreateRoom) {
				handleCreateRoom(ws.id)
			}
			if (body.type === MessageType.AddUserToRoom) {
				handleAddUserToRoom(ws.id, body.data)
			}
			if (body.type === MessageType.AddShips) {
				handleAddShips(ws.id, body.data)
			}
			if (body.type === MessageType.Attack) {
				handleAttack(ws.id, body.data)
			}
			if (body.type === MessageType.RandomAttack) {
				handleRandomAttack(ws.id, body.data)
			}
		})
		ws.on('error', console.error)
		ws.on('close', () => {
			console.log('Client disconnected')
			removeConnection(ws.id)
			refreshRoom()
		})
	})
}
