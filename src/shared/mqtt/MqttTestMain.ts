import { MqttServerConnection } from "./MqttServerConnection.js";

type TestType = {
	name: string;
	value: string;
}

const MQTT_TEST_TOPIC = "mqtt_test"

const sleep = async (ms: number): Promise<void> =>{
	return new Promise( resolve => setTimeout(resolve, ms) );
}

const handler = (message: string, topic?: string) : void => {
	if (MQTT_TEST_TOPIC === topic) {
		const testType: TestType = JSON.parse(message) as TestType;
		console.log(`New TestType received: "${JSON.stringify(testType)}".`);
	}
}

console.log("Starting...");

(async (): Promise<void> => {
	const mqttServerUrl = "mqtt://localhost:1883";
	const client = new MqttServerConnection(mqttServerUrl)

	console.log("Waiting for connection...");
	while(! client.connected) {
		await sleep(100);
	}

	client.subscribeAsync(MQTT_TEST_TOPIC, handler);
	const testType: TestType = {
		name: "MqttTestMain",
		value: "Initial value"
	}
	const testMessage = JSON.stringify(testType);
	client.publishAsync(MQTT_TEST_TOPIC, testMessage);

	// Simulate a clean exit after a minute
	console.log("Will shutdown after one minute...");
	await sleep(60000);
	console.log("Simulating clean exit...");
	client.exit();

})().catch(error => {
	console.error(error);
	console.trace();
});

console.log("Ending main...");