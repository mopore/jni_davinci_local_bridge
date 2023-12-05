import { ServiceFrame } from "../ServiceFrame.js";
import { MqttServerConnection } from "../mqtt/MqttServerConnection.js";


const TOPIC_TELEGRAM_SEND_MESSAGE = "jniHome/services/telegramBot/send";

export class TelegramMessenger{

	constructor(
		private _frame: ServiceFrame
	){
	}

	async sendAsync(message: string): Promise<void>{
		console.log(`Posting telegram message via MQTT: ${message}`);
		try {
			await this._frame.mqttConnection.publishAsync(TOPIC_TELEGRAM_SEND_MESSAGE, message);
		}
		catch (error){
			console.error(`Requesting reset after error sending telegram message via MQTT: ${error}`);
			console.trace();
			this._frame.reset();
		}
	}
}