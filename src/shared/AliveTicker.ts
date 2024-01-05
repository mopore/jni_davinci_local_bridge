import { ServiceFrame } from "./ServiceFrame.js";
import { log } from "./logger/log.js";

const PULLING_INTERVAL_IN_SECS = 10;
const ONE_SEC_IN_MS = 1000;

export class AliveTicker {

	private _keepAlive = true;
	private _secCounter = 10;
	private readonly _topicName: string;
	private _failedAliveTicks = 0;

	constructor(
		private readonly _frame: ServiceFrame,
		serviceName: string,
	){
		log.info(`Setting up Aliveticker for ${serviceName}`);
		this._topicName = `jniHome/services/${serviceName}/aliveTick`;
		const greeting = `Alive Ticker for "${serviceName}" will publish an alive tick every ` +
			`${PULLING_INTERVAL_IN_SECS} seconds. Using 3-fail-policy.`;
		log.info(greeting);
		setTimeout(this.tick.bind(this), ONE_SEC_IN_MS);
	}


	private tick(): void{
		const asyncFunc = async (): Promise<void> => {
			if (this._keepAlive && this._secCounter === PULLING_INTERVAL_IN_SECS){
				try {
					this._secCounter = 0;
					await this._frame.mqttConnection.publishAsync(this._topicName, "ALIVE");
					this._failedAliveTicks = 0;
				}
				catch (error){
					this._failedAliveTicks++;
					const msg = `Error sending alive tick (${this,this._failedAliveTicks} times): ${error}`;
					log.error(msg);
					if (this._failedAliveTicks > 2){
						const errMessage = "Requesting reset after alive tick failed 3 times.";
						log.error(errMessage);
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
		asyncFunc().catch(error => {
			const errMsg = `Panincing due to unexpected error in AliveTicker: ${error}`;
			log.error(errMsg);
			console.trace();
			throw new Error(errMsg);
		});
	}


	exit(): void{
		this._keepAlive = false;
		this._frame.mqttConnection.publishAsync(this._topicName, "DEAD").catch(error => {
			log.error(`Error sending dead tick: ${error}`);
		});
	}
}