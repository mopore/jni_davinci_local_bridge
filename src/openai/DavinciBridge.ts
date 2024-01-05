import OpenAI from "openai";
import { log } from "../shared/logger/log.js";


export class DavinciBridge {

	private readonly _openAIApi: OpenAI;

	constructor(
		apiKey: string
	){
		this._openAIApi = new OpenAI({
			apiKey: apiKey,
		});
	}

	async request(prompt: string): Promise<string> {
		let responseText: string | undefined;
		try{
			const completion = await this._openAIApi.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{
						"role": "user",
						"content": prompt
					}
				]
			});
			const rawInput = completion.choices[0].message.content;
			if (!rawInput) {
				throw new Error("Response from OpenAI API was empty");
			}
			responseText = String(rawInput);
		}
		catch (error) {
			log.error(`Error requesting response from Open AI: ${error}`);
			console.trace();
		}
		if (!responseText) {
			throw new Error("No response text");
		}
		return responseText;
	}

}