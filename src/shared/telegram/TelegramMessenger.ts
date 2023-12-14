import { ServiceFrame } from "../ServiceFrame.js";
import { sharedTopics } from "../SharedTopics.js";



export class TelegramMessenger{

	constructor(
		private _frame: ServiceFrame
	){
	}

	/**
	 * Sends a message to the JNI via the telegram bot.
	 * This uses MQTT and throws an error if the message could not be sent. 
	 * @param message The message to send to JNI via the telegram bot.
	 */
	async sendAsync(message: string): Promise<void>{
		console.log(`Posting telegram message via MQTT: ${message}`);
		try {
			await this._frame.mqttConnection.publishAsync(sharedTopics.TELEGRAM_SEND, message);
		}
		catch(error){
			console.error(`Error sending telegram message via MQTT: ${error}`);
			console.trace();
			throw error;
		}
	}
}