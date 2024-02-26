import { WebSocketServer } from 'ws'
import { RequestMessage, wsClient } from './types'
import { loginPlayer } from './handlers/auth'
import { handleAddUserToRoom, handleCreateRoom, refreshRoom } from './handlers/rooms'
import { removeConnection } from '../store'

export const BattleshipServer = () => {
	const port = 3000
	const wss = new WebSocketServer({ port }, () => console.log(`WS server is listening at ws://localhost:${port}`))

	wss.on('connection', (ws: wsClient) => {
		ws.on('message', message => {
			console.log('received: %s', message)
			const body: RequestMessage = JSON.parse(message.toString())
			if (body.type === 'reg') {
				loginPlayer(ws, body.data)
			}
			if (body.type === 'create_room') {
				handleCreateRoom(ws.id)
			}
			if (body.type === 'add_user_to_room') {
				handleAddUserToRoom(ws.id, body.data)
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
