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


	private tick(): void{
		if (this._secCounter === PULLING_INTERVAL_IN_SECS){
			this.sendAliveMessage();
			this._secCounter = 0;
		}
		if (this._keepAlive){
			setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
		}
		else {
			this._mqttConnection.publish(this._topicName, "DEAD");
		}
		this._secCounter++;
	}


	exit(): void{
		this._keepAlive = false;
	}


	private sendAliveMessage(): void{
		this._mqttConnection.publish(this._topicName, "ALIVE");
	}
}