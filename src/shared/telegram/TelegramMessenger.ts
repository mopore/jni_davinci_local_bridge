import { ServiceFrame } from "../ServiceFrame.js";
import { sharedTopics } from "../SharedTopics.js";
import { log } from "../logger/log.js";



export class TelegramMessenger{

	constructor(
		private readonly _frame: ServiceFrame
	){
	}

	/**
	 * Sends a message to the JNI via the telegram bot.
	 * This uses MQTT and throws an error if the message could not be sent. 
	 * @param message The message to send to JNI via the telegram bot.
	 */
	async sendAsync(message: string): Promise<void>{
		// Replace new lines with spaces for logging.
		const logText = message.replace(/\n/g, " ");
		log.info(`Posting telegram message via MQTT: "${logText}"`);
		try {
			await this._frame.mqttConnection.publishAsync(sharedTopics.TELEGRAM_SEND, message);
		}
		catch(error){
			log.error(`Error sending telegram message via MQTT: ${error}`);
			console.trace();
			throw error;
		}
	}
}