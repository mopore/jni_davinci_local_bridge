import { ServiceFrame } from "./ServiceFrame.js";
import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const PULLING_INTERVAL_IN_SECS = 10;
const ONE_SEC_IN_MS = 1000;

export class AliveTicker {

	private _keepAlive = true;
	private _secCounter = 10;
	private _topicName: string;
	private _failedAliveTicks = 0;

	constructor(
		private _frame: ServiceFrame,
		serviceName: string,
	){
		console.info(`Setting up Aliveticker for ${serviceName}`);
		this._topicName = `jniHome/services/${serviceName}/aliveTick`;
		const greeting = `Alive Ticker for "${serviceName}" will publish an alive tick every ` +
			`${PULLING_INTERVAL_IN_SECS} seconds. It will reset the service after 3 failed ticks.`;
		console.log(greeting);
		setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
	}


	private async tick(): Promise<void>{
		if (this._keepAlive && this._secCounter === PULLING_INTERVAL_IN_SECS){
			try {
				this._secCounter = 0;
				await this._frame.mqttConnection.publishAsync(this._topicName, "ALIVE");
				this._failedAliveTicks = 0;
			}
			catch (error){
				this._failedAliveTicks++;
				const msg = `Error sending alive tick (${this,this._failedAliveTicks} times): ${error}`;
				console.error(msg);
				if (this._failedAliveTicks > 2){
					const errMessage = "Requesting reset after alive tick failed 3 times.";
					console.error(errMessage);
					console.trace();
					this._frame.reset("Alive tick could not be send.");
				}
			}
		}
		if (this._keepAlive){
			setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
		}
		this._secCounter++;
	}


	exit(): void{
		this._keepAlive = false;
		this._frame.mqttConnection.publishAsync(this._topicName, "DEAD").catch(error => {
			console.error(`Error sending dead tick: ${error}`);
		});
	}
}