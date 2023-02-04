import { Configuration, OpenAIApi } from "openai";


export class DavinciBridge {

	private _openAiApi: OpenAIApi;

	constructor(
		apiKey: string
	){
		const config = new Configuration({
			apiKey: apiKey
		});
		this._openAiApi = new OpenAIApi(config);
	}

	async request(prompt: string): Promise<string> {
		let responseText: string | undefined;
		try{
			const response = await this._openAiApi.createCompletion({
				model: "text-davinci-003",
				prompt: prompt,
				max_tokens: 300,
				temperature: .8,
			});
			responseText = response.data.choices[0].text;
		}
		catch (error) {
			console.error(`Error requesting response from Open AI: ${error}`);
			console.trace();
		}
		if (!responseText) {
			throw new Error("No response text");
		}
		return responseText;
	}

}