import { AliveTicker } from "./AliveTicker.js";
import { ExitResetListener } from "./mqtt/ExitResetListener.js";
import { IService } from "./IService.js";
import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const FIVE_SEC = 5000;
export class ServiceFrame {

	private _mqttConnection: MqttServerConnection;
	private _ticker: AliveTicker | undefined;
	private _service: IService | undefined;

	constructor(
		private readonly _mqttServerUrl: string,
	){
		this._mqttConnection = new MqttServerConnection(_mqttServerUrl);
	}

	attachService(service: IService): void{
		this._service = service;
		this._ticker = new AliveTicker(this._mqttConnection,service.getServiceName());
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
		setTimeout( this.endWorldInFiveSeconds.bind(this), FIVE_SEC);
	}

	private endWorldInFiveSeconds(): void {
		this._mqttConnection.exit();
		if (this._service){
			console.error(`Will exit the process for serivce ${this._service.getServiceName()}`);	
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
		setTimeout( this.ressurectWorldInFiveSeconds.bind(this), FIVE_SEC);
	}


	private ressurectWorldInFiveSeconds(): void {
		console.log("Ressurecting world...")
		try{
			this._mqttConnection = new MqttServerConnection(this._mqttServerUrl);
			if (this._service){
				this.attachService(this._service);
				this._service.init(this);
			}
		}
		catch(error){
			console.error(`Error while ressurecting world:`);
			console.error(error);
			console.trace();
			this.exit();
		}
	}
}