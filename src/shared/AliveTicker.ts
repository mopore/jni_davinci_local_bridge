import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const PULLING_INTERVAL_IN_SECS = 10;
const ONE_SEC_IN_MS = 1000;

export class AliveTicker {

	private _keepAlive = true;
	private _secCounter = 10;
	private _topicName: string;

	constructor(
		private _mqttConnection: MqttServerConnection,
		serviceName: string,
	){
		console.info(`Setting up Aliveticker for ${serviceName}`);
		this._topicName = `jniHome/services/${serviceName}/aliveTick`;
		setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
	}


	private async tick(): Promise<void>{
		if (this._keepAlive && this._secCounter === PULLING_INTERVAL_IN_SECS){
			this.sendAliveMessage();
			this._secCounter = 0;
		}
		if (this._keepAlive){
			setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
		}
		this._secCounter++;
	}


	exit(): void{
		this._keepAlive = false;
		this._mqttConnection.publishAsync(this._topicName, "DEAD").catch(error => {
			console.error(`Error sending dead tick: ${error}`);
		});
	}


	private sendAliveMessage(): void{
		try{
			if (this._keepAlive) {
				this._mqttConnection.publishAsync(this._topicName, "ALIVE");
			}
		}
		catch(error){
			console.error(`Error sending alive tick: ${error}`);
		}
	}
}