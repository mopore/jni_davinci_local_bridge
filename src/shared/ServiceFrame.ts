import { AliveTicker } from "./AliveTicker.js";
import { ExitResetListener } from "./mqtt/ExitResetListener.js";
import { IService } from "./IService.js";
import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const FIVE_SEC = 5000;
const TWENTY_MIN_IN_MILLIES = 20 * 60 * 1000;

export class ServiceFrame {

	private _mqttConnection: MqttServerConnection;
	private _ticker: AliveTicker | undefined;
	private _service: IService | undefined;

	constructor(
		private readonly _mqttServerUrl: string,
	){
		this._mqttConnection = new MqttServerConnection(_mqttServerUrl);
	}

	
	/**
	 * Initializes the service frame with the given service.
	 * The init method of the service will be called with this service frame as parameter. 
	 * This method will also start an AliveTicker and a listener for exit and reset commands.
	 * The method should be called for initial setup and will be called by the frame for a potential reset.
	 * @param service 
	 */
	async initFrame(service: IService): Promise<void>{
		try {
			await this._mqttConnection.connectAndWaitAsync(TWENTY_MIN_IN_MILLIES);
		}
		catch (error) {
			const errMessage = `Could not establish essential connection to MQTT server: ${error}`;
			console.error(errMessage);
			throw new Error(errMessage);
		}
		this._service = service;
		this._ticker = new AliveTicker(this._mqttConnection, service.getServiceName());
		new ExitResetListener(this._mqttConnection, service.getServiceName(), this);
		this._service.init(this);
	}


	get mqttConnection(): MqttServerConnection{
		return this._mqttConnection;
	}


	exit(): void {
		if (this._service) {
			console.error(`Initiating exit for service "${this._service.getServiceName()}"`);
			try {
				this._service.onExit();
			}
			catch(error){
				console.error(`Error while exiting service "${this._service.getServiceName()}":`);
				console.error(error);
				console.trace();
			}
		}
		if (this._ticker){
			this._ticker.exit();
		}
		setTimeout( this.endServiceInFiveSeconds.bind(this), FIVE_SEC);
	}

	private endServiceInFiveSeconds(): void {
		this._mqttConnection.exit();
		if (this._service){
			console.error(`Will exit the process for service "${this._service.getServiceName()}"`);	
		}
        process.exit();
    }

	reset(): void {
		if (this._service) {
			console.error(`Initiating reset for service "${this._service.getServiceName()}"`);
			try {
				this._service.onReset();
			}
			catch(error){
				console.error(`Error while resetting service "${this._service.getServiceName()}":`);
				console.error(error);
				console.trace();
			}
		}
		if (this._ticker){
			this._ticker.exit();
			this._ticker = undefined;
		}
		this.mqttConnection.exit();
		setTimeout( this.resettingInFiveSeconds.bind(this), FIVE_SEC);
	}


	private async resettingInFiveSeconds(): Promise<void> {
		console.log("Resetting service...")
		try{
			this._mqttConnection = new MqttServerConnection(this._mqttServerUrl);
			if (!this._service){
				throw new Error("No service available for reset.");
			}
			await this.initFrame(this._service);
		}
		catch(error){
			console.error(`Error while resetting service:`);
			console.error(error);
			console.trace();
			this.exit();
		}
	}
}