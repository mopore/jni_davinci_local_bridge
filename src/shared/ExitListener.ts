import { MqttServerConnection } from "./mqtt/MqttServerConnection.js";
import { ServiceFrame } from "./ServiceFrame.js";

const EXIT_COMMAND = "exit";
export class ExitListener {

	constructor(
		mqttConnection: MqttServerConnection, 
		serviceName: string, 
		frame: ServiceFrame
	){
		const topicName = `jniHome/services/${serviceName}/command`;
		mqttConnection.subscribe(topicName, message => {
			const cleanedMessage = message.trim().toLowerCase();
			if (EXIT_COMMAND === cleanedMessage){
				console.info("Exit Listener received 'exit' command.");
				frame.exit();
			}
		});
	}
}