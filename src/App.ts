import dotenv from "dotenv";
import { DavinciBridge } from "./openai/DavinciBridge.js";
import { log } from "./shared/logger/log.js";

dotenv.config();
const openApiKey = process.env["openai.apiKey"] ?? 
	"Define 'openai.apiKey' in .env file in project's root";

const apiBridge = new DavinciBridge(openApiKey);
const prompt = "Tell a story about a blue cat in three sentences.";
const responseText = await apiBridge.request(prompt);
log.info(responseText);
