import { ServiceFrame } from "../ServiceFrame.js";
import { log } from "../logger/log.js";
import { MqttServerConnection } from "./MqttServerConnection.js";

const EXIT_COMMAND = "exit";
const RESET_COMMAND = "reset";


export class ExitResetListener {

	constructor(
		mqttConnection: MqttServerConnection, 
		serviceName: string, 
		frame: ServiceFrame
	){
		const topicName = `jniHome/services/${serviceName}/command`;
		mqttConnection.subscribeAsync(topicName, message => {
			const cleanedMessage = message.trim().toLowerCase();
			if (EXIT_COMMAND === cleanedMessage){
				log.info("Exit/Reset Listener received 'exit' command.");
				frame.exit();
			}
			else if(RESET_COMMAND === cleanedMessage){
				log.info("Exit/Reset Listener received 'reset' command.");
				frame.reset("Request by command over MQTT.");
			}
		}).catch(error => {
			log.error(`Error subscribing to topic "${topicName}": ${error}`);
			console.trace();
			// At this point the seems to a fundamental problem with the MQTT connection.
			throw new Error(`Error subscribing to topic "${topicName}": ${error}`);
		});
	}
}