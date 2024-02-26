import { addNewWinner, getSecondPlayerId, getWinnersTable, selectGame, selectPlayerById, selectWinner, sendToAll, sendToPlayer } from '../../store'
import { STATUS, ShipEntry } from '../model/ship'
import { Game, MessageType } from '../types'
import { generateMessage } from '../utils'

const handleAddShips = (clientId: number, body: string) => {
	const { ships, gameId, indexPlayer } = JSON.parse(body)
	const game = selectGame(gameId)
	if (!game) return
	game.ships[clientId] = new ShipEntry(ships)
	const message = generateMessage(MessageType.StartGame, { ships, currentPlayerIndex: clientId })
	sendToPlayer(clientId, message)
	changeTurn(game, indexPlayer)
}

const changeTurn = (game: Game, status?: STATUS) => {
	if (status === STATUS.missed) {
		game.active = game.active === 0 ? 1 : 0
	}
	const message = generateMessage(MessageType.Turn, { currentPlayer: game.playersIds[game.active] })
	game.playersIds.forEach(id => sendToPlayer(id, message))
}
const sendAttackFeedback = (x: number, y: number, playerId: number, secondPlayerId: number, status: STATUS) => {
	const message = generateMessage(MessageType.Attack, { position: { x, y }, currentPlayer: playerId, status })
	sendToPlayer(playerId, message)
	sendToPlayer(secondPlayerId, message)
}
const handleAttack = (playerId: number, body: string) => {
	const { x, y, gameId, indexPlayer } = JSON.parse(body)
	const game = selectGame(gameId)
	if (!game || game.playersIds[game.active] !== indexPlayer) return
	const secondPlayerId = getSecondPlayerId(playerId, game)
	if (secondPlayerId === undefined) return
	const secondShip = game.ships[secondPlayerId]
	if (secondShip.board[x][y].isChecked) return

	const { status, surroundingCells } = secondShip.attackCell(x, y)
	sendAttackFeedback(x, y, playerId, secondPlayerId, status)

	if (status === STATUS.killed) {
		surroundingCells?.forEach(([x, y]) => sendAttackFeedback(x, y, playerId, secondPlayerId, STATUS.missed))
		if (secondShip.checkAllShipsSunk()) {
			game.playersIds.forEach(id => {
				sendToPlayer(id, generateMessage(MessageType.Finish, { winPlayer: playerId }))
			})
			rewardPlayer(playerId)
			return
		}
	}
	changeTurn(game, status)
}
const handleRandomAttack = (playerId: number, body: string) => {
	const { indexPlayer, gameId } = JSON.parse(body)
	const game = selectGame(gameId)
	if (!game || game.playersIds[game.active] !== indexPlayer) return

	const secondPlayerId = getSecondPlayerId(playerId, game)
	if (secondPlayerId === undefined) return

	const secondShip = game.ships[secondPlayerId]
	const uncheckedCells = secondShip.board.flatMap((row, i) => row.map((cell, j) => (!cell.isChecked ? [i, j] : null))).filter(Boolean)

	if (uncheckedCells.length === 0) return

	const randomIndex = Math.floor(Math.random() * uncheckedCells.length)
	const [x, y] = uncheckedCells[randomIndex]!

	handleAttack(playerId, JSON.stringify({ gameId, x, y, indexPlayer: playerId }))
}
const rewardPlayer = (playerId: number) => {
	const player = selectPlayerById(playerId)
	if (!player) return
	const { name } = player
	const winner = selectWinner(name)
	if (!winner) {
		addNewWinner(name)
		refreshWinnersTable()
		return
	}
	winner.wins++
	refreshWinnersTable()
}
const refreshWinnersTable = () => {
	sendToAll(generateMessage(MessageType.UpdateWinners, getWinnersTable()))
}
export { handleRandomAttack, handleAddShips, handleAttack, refreshWinnersTable }
