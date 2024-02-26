import { WebSocket } from 'ws'
import { ShipEntry } from '../model/ship'

type RequestHandler = (client: wsClient, data: string) => void
type wsClient = WebSocket & {
	id: number
	name: string
}
type Connections = {
	[key: string]: wsClient
}
type Player = {
	id: number
	name: string
	password: string
}
const enum MessageType {
	Reg = 'reg',
	UpdateWinners = 'update_winners',
	CreateRoom = 'create_room',
	AddUserToRoom = 'add_user_to_room',
	CreateGame = 'create_game',
	UpdateRoom = 'update_room',
	AddShips = 'add_ships',
	StartGame = 'start_game',
	Attack = 'attack',
	RandomAttack = 'randomAttack',
	Turn = 'turn',
	Finish = 'finish',
}

type RequestMessage = {
	type: MessageType
	data: string
	id: number
}
type Room = {
	roomId: number
	roomUsers: { name: string; index: number }[]
}
type Game = {
	active: 1 | 0
	idGame: number
	playersIds: number[]
	playersNames: string[]
	ships: { [key: string]: ShipEntry }
}
type WinnerEntry = {
	name: string
	wins: number
}
type Ship = {
	direction: boolean
	type: 'small' | 'medium' | 'large' | 'huge'
	position: {
		x: number
		y: number
	}
	length: number
}
export { MessageType }
export type { WinnerEntry, Ship, RequestMessage, Player, Connections, wsClient, RequestHandler, Room, Game }
