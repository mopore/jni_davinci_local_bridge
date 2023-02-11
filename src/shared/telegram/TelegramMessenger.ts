import { MqttServerConnection } from "../mqtt/MqttServerConnection.js";


const TOPIC_TELEGRAM_SEND_MESSAGE = "jniHome/services/telegramBot/send";

export class TelegramMessenger{

	constructor(
		private _mqttConnection: MqttServerConnection
	){
	}

	message(message: string): void{
		console.log(`Posting telegram message: ${message}`);
		this._mqttConnection.publish(TOPIC_TELEGRAM_SEND_MESSAGE, message);
	}


}