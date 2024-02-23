import { httpServer } from './src/http_server/index.js'

const HTTP_PORT = 8181

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

import { WebSocketServer } from 'ws'
const wss = new WebSocketServer({ port: 8080 }, () => console.log('WS server is listening at ws://localhost:8080'))

wss.on('connection', ws => {
	ws.on('message', message => {
		console.log('received: %s', message)

		ws.send('something')
	})
	ws.on('error', console.error)
})
