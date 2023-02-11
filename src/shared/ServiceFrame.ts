import { AliveTicker } from "./AliveTicker.js";
import { ExitListener } from "./ExitListener.js";
import { IService } from "./IService.js";
import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";

const FIVE_SEC = 5000;
export class ServiceFrame {

	private _mqttConnection: MqttServerConnection;
	private _ticker: AliveTicker | undefined;
	private _service: IService | undefined;

	constructor(
		mqttServerUrl: string,
	){
		this._mqttConnection = new MqttServerConnection(mqttServerUrl);
	}

	attachService(service: IService): void{
		this._service = service;
		this._ticker = new AliveTicker(this._mqttConnection,service.getServiceName());
		new ExitListener(this._mqttConnection, service.getServiceName(), this);
	}


	get mqttConnection(): MqttServerConnection{
		return this._mqttConnection;
	}


	exit(): void {
		if (this._service) {
			console.error(`Initiating exit for serivce "${this._service.getServiceName()}"`);
			this._service.onExit();
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
	

}