import { MessageType } from '../types'

const generateMessage = <T>(type: MessageType, payload: T) => {
	return {
		type: type,
		data: JSON.stringify(payload),
		id: 0,
	}
}

export { generateMessage }
