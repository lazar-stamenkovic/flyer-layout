const postMessage = (message, targetOrigin = '*', stringyfy = true) => {
	window.parent.postMessage( stringyfy? JSON.stringify(message):message, targetOrigin );
	console.log('postMessage:', message);
}

/**
 * Controls to communicate with Super-C parent window.
 */
export default class ParentComms {

	static SendData( data ) {
		postMessage( data )
	}

	static SendEvent(event, data) {
		this.SendData({
			direction: 'from-iframe',
			event,
			data
		})
	}


}
