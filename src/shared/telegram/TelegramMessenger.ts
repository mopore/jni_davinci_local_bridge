import { ServiceFrame } from "../ServiceFrame.js";
import { sharedTopics } from "../SharedTopics.js";



export class TelegramMessenger{

	constructor(
		private _frame: ServiceFrame
	){
	}

	async sendAsync(message: string): Promise<void>{
		console.log(`Posting telegram message via MQTT: ${message}`);
		try {
			await this._frame.mqttConnection.publishAsync(sharedTopics.TELEGRAM_SEND, message);
		}
		catch (error){
			console.error(`Requesting reset after error sending telegram message via MQTT: ${error}`);
			console.trace();
			this._frame.reset("MQTT error when sending telegram message.");
		}
	}
}