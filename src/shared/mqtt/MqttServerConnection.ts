import MQTT, { Client } from "mqtt";

const sleep = async (ms: number): Promise<void> =>{
	return new Promise( resolve => setTimeout(resolve, ms) );
}

const THREE_SECS = 3000;
export class MqttServerConnection {


	private _client: Client | undefined;
	private _connected = false;
	private _firstConnectionAttempt = true;
	private _reconnecting = false;
	private _connectionLosses = 0;
	private _connectionLostTimestamp = -1;


	constructor(mqttServerUrl: string){
		console.log(`Connecting to MQTT server via "${mqttServerUrl}"...`);
		try {
			this._client = MQTT.connect(mqttServerUrl, {
				connectTimeout: 10000,
				keepalive: 60,
			});
			
			// Will be called when the client has a connection (also after reconnection)
			this._client.on("connect", () => {
				this._connected = true;
				this._firstConnectionAttempt = false;
				if (this._reconnecting) {
					const timeDiff = Date.now() - this._connectionLostTimestamp;
					const timeDiffSeconds = timeDiff / 1000;
					console.log(`Reestablished connection to MQTT` +
						` server after ${timeDiffSeconds.toFixed(0)} second(s).`);
					this._reconnecting = false;
				}
				else {
					console.log("Connected to MQTT server!");
				}
			});

			// Will be called every second when the client is connected (default value)
			this._client.on("reconnect", () => {
				if (this._reconnecting === false) {
					this._connectionLosses++;
					console.error(`Connection loss No. ${this._connectionLosses}`);
					console.log("Reconnecting to MQTT server due to...");
					this._reconnecting = true;
					this._connectionLosses++;
					this._connectionLostTimestamp = Date.now();
				}
			});

			// Will be called each often (e.g. a reconnect attempt fails (every second))
			this._client.on("error", (error) => {
				if (this._firstConnectionAttempt) {
					this._connected = false;
					const errorMessage = 
						`Can not establish first connection to MQTT broker ${mqttServerUrl}`;
					console.error(errorMessage);
					console.trace();
					throw new Error(errorMessage);
				}
				if (this._connected){
					this._connected = false;
					console.error(error.message);
					console.trace();
				}
			});

			// Will be called when the client commands to disconnect
			this._client.on("end", () => {
				console.error("Actively closed connection to MQTT server!");
				this._connected = false;
			})

			this._client.setMaxListeners(15);
		}
		catch (error) {
			let message: string
			if (error instanceof Error){
				message = error.message
			}
			else {
				message = String(error)
			}
			console.error(`Error connecting to MQTT server: ${message}`);
			console.trace();
		}
	}


	// Getter for connected
	get connected(): boolean {
		return this._connected;
	}


	/**
	 * This method is used to publish a message to a topic.
	 * It will throw an error after 3 seconds if the client is not connected.
	 * @param topic The topic to publish to
	 * @param message 
	 */
	publish(topic: string, message: string): void{
		Promise.resolve().then(async () => {
			// Wait max 3 seconds before subscribing to the topic if not connected.
			const startTime = Date.now();
			while (!this._connected){
				await sleep(100);
				const timeDiff = Date.now() - startTime;
				if (timeDiff > THREE_SECS)
					break
			}
			this._publish(topic, message);
		}).catch(error => {
			const errorMessage = `Error publishing: ${error}`;
			console.error(errorMessage);
			console.trace();
			throw new Error(errorMessage);
		});
	}


	private _publish(topic: string, message: string): void{
		this.checkClientAndConnection();
		if (this._client)
			this._client.publish(topic, message);
	}


	/**
	 * This method is used to subscribe to a topic.
	 * It will throw an error after 3 seconds if the client is not connected.
	 * @param topic The topic to subscribe to
	 * @param handler 
	 */
	subscribe(topic: string, handler: (message: string, topic?: string) => void): void{
		Promise.resolve().then(async () => {
			// Wait max 3 seconds before subscribing to the topic if not connected.
			const startTime = Date.now();
			while (!this._connected){
				await sleep(100);
				const timeDiff = Date.now() - startTime;
				if (timeDiff > THREE_SECS)
					break
			}
			this._subscribe(topic, handler);
		}).catch(error => {
			const errorMessage = `Error subscribing: ${error}`;
			console.error(errorMessage);
			console.trace();
			throw new Error(errorMessage);
		});
	}


	private _subscribe(topic: string, handler: (message: string, topic?: string) => void): void{
		this.checkClientAndConnection();
		if (this._client){
			this._client.subscribe(topic, (error => {
				if (!error) {
					this.checkClientAndConnection();
					if (this._client){
						this._client.on("message", (recTopic, recMessage) => {
							if (recTopic === topic){
								handler(recMessage.toString(), topic);
							}
						});
					}
				}
				else {
					const errorMessage = `Error subscribing: ${error}`;
					console.error(errorMessage);
					console.trace();
					throw new Error(errorMessage);
				}
			}));
		}
	}


	/**
	 * The default number of listeners is 10. With this method the number of listeners can be 
	 * overwritten.
	 * @param limit The maximum number of connection losses to tolerate
	 */
	setMaxListeners(limit: number): void {
		if (this._client)
			this._client.setMaxListeners(limit)
	}


	/**
	 * This will close the connection to the MQTT server. The client will not be usable anymore.
	 */
	exit(): void {
		console.log("Shutdown for MQTT helper requested...");
		this.checkClientAndConnection();
		if (this._client){
			this._connected = false;
			this._client.end();
		}
	}


	private checkClientAndConnection(): void {
		if (! this._connected) {
			const errorMessage = `There is no active connection!`;
			console.error(errorMessage)
			console.trace();
			throw new Error(errorMessage);
		}
		if (! this._client) {
			const errorMessage = "Client was not yet initialized!";
			console.error(errorMessage);
			console.trace();
			throw new Error(errorMessage);
		}
	}
}
