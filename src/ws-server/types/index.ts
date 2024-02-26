import { WebSocket } from 'ws'

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
const enum Command {
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
	type: Command
	data: string
	id: number
}
type Room = {
	roomId: number
	roomUsers: { name: string; index: number }[]
}
type Game = {
	idGame: number
	playersIds: number[]
	playersNames: string[]
}
export { Command }
export type { RequestMessage, Player, Connections, wsClient, RequestHandler, Room, Game }
