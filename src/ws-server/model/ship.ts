import { Ship } from '../types'

export const enum STATUS {
	empty,
	notEmpty,
	shot = 'shot',
	missed = 'miss',
	killed = 'killed',
}
const BOARD_SIZE = 10
class Cell {
	public isChecked = false
	public status = STATUS.empty

	constructor(
		public x: number,
		public y: number,
	) {}
}
export class ShipEntry {
	private _ships: Ship[]
	public board: Cell[][] = []
	private shipPositions: number[][][] = []

	constructor(ships: Ship[]) {
		this._ships = ships
		this.calculateShipPositions()
		this.createBoard()
	}

	calculateShipPositions() {
		this.shipPositions = this._ships.map(({ position, length, direction }) =>
			Array.from({ length }, (_, i) => {
				const { x, y } = position
				return direction ? [x, y + i] : [x + i, y]
			}),
		)
	}

	createBoard() {
		this.board = Array(BOARD_SIZE)
			.fill(null)
			.map((_, y) =>
				Array(BOARD_SIZE)
					.fill(null)
					.map((_, x) => new Cell(x, y)),
			)

		this.shipPositions.forEach(position => {
			position.forEach(([x, y]) => {
				this.board[x][y].status = STATUS.notEmpty
			})
		})
	}

	attackCell(coordX: number, coordY: number) {
		const targetCell = this.board[coordX][coordY]
		targetCell.isChecked = true
		if (targetCell.status === STATUS.notEmpty) {
			targetCell.status = STATUS.shot
			const shipIdx = this.findShipIndex(coordX, coordY)
			const position = this.shipPositions[shipIdx]
			return this.isShipKilled(position)
				? { x: coordX, y: coordY, status: STATUS.killed, surroundingCells: this.getSurroundingCells(position, this._ships[shipIdx].direction) }
				: { x: coordX, y: coordY, status: STATUS.shot }
		} else {
			return { x: coordX, y: coordY, status: STATUS.missed }
		}
	}

	getSurroundingCells(shipPosition: number[][], shipDirection: boolean) {
		const [coordX, coordY] = shipPosition[0]
		const shipSize = shipPosition.length

		const surroundingCells = []

		const xStart = Math.max(coordX - 1, 0)
		const yStart = Math.max(coordY - 1, 0)
		const xEnd = Math.min(shipDirection ? coordX + 1 : coordX + shipSize, BOARD_SIZE - 1)
		const yEnd = Math.min(shipDirection ? coordY + shipSize : coordY + 1, BOARD_SIZE - 1)

		for (let i = xStart; i <= xEnd; i++) {
			for (let j = yStart; j <= yEnd; j++) {
				if (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && (i !== coordX || j !== coordY)) {
					const cell = this.board[i][j]
					cell.isChecked = true
					surroundingCells.push([i, j])
				}
			}
		}
		return surroundingCells
	}

	findShipIndex(x: number, y: number) {
		return this.shipPositions.findIndex(pos => pos.some(([cx, cy]) => cx === x && cy === y))
	}
	isShipKilled(positions: number[][]) {
		return positions.every(([x, y]) => this.board[x][y].status === STATUS.shot)
	}
	checkAllShipsSunk = () => {
		for (const row of this.board) {
			for (const cell of row) {
				if (cell.status === STATUS.notEmpty) {
					return false
				}
			}
		}
		return true
	}
}
