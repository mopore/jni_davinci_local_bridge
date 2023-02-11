import { MqttServerConnection } from "../mqtt/MqttServerConnection.js";
import { CommandRegistration } from "../SharedTypes.js";


const ONE_SECOND_IN_MILLIS = 1000;
const REGISTER_COMMANDS_EVERY_SECS = 60;
const REGISTER_COMMANDS_TOPIC_NAME = "jniHome/services/telegramBot/registerCommands";

export class CommandRegistrar {


	private _keepAlive = true;
	private _secondCounter = 0;
	

	constructor( 
		private _commandRegistrations: CommandRegistration[], 
		private _mqttConnection: MqttServerConnection){
		setTimeout(this.tick.bind(this), ONE_SECOND_IN_MILLIS);
	}


	private registerCommands(): void {
		const commandsMessage = JSON.stringify(this._commandRegistrations);
		this._mqttConnection.publish(REGISTER_COMMANDS_TOPIC_NAME, commandsMessage);
	}


	private tick(): void {
		if (this._secondCounter > REGISTER_COMMANDS_EVERY_SECS){
			this._secondCounter = 0;
		}
		if (this._secondCounter === 0){
			this.registerCommands();
		}
		if (this._keepAlive){
			this._secondCounter ++;
			setTimeout(this.tick.bind(this), ONE_SECOND_IN_MILLIS);
		}
	}


	exit(): void {
		this._keepAlive = false;
	}


	updateCommands(commandRegistrations: CommandRegistration[]): void {
		this._commandRegistrations = commandRegistrations;
	}
}