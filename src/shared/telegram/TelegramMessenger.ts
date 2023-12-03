import { MqttServerConnection } from "../mqtt/MqttServerConnection.js";


const TOPIC_TELEGRAM_SEND_MESSAGE = "jniHome/services/telegramBot/send";

export class TelegramMessenger{

	constructor(
		private _mqttConnection: MqttServerConnection
	){
	}

	async sendAsync(message: string): Promise<void>{
		console.log(`Posting telegram message: ${message}`);
		await this._mqttConnection.publishAsync(TOPIC_TELEGRAM_SEND_MESSAGE, message);
	}
}