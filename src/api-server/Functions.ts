import { Express } from "express";
import { DavinciBridge } from "../openai/DavinciBridge.js";
import { ApiResponse } from "./ApiResponse.js";
import dotenv from "dotenv";
import { ApiRequest } from "./ApiRequest.js";


const getBridge = (): DavinciBridge => {
    dotenv.config();
    const openApiKey = process.env["openai.apiKey"] ?? 
        "Define 'openai.apiKey' in .env file in project's root";
    const apiBridge = new DavinciBridge(openApiKey);
    return apiBridge;
}


export class Functions {

    private static _bridge: DavinciBridge = getBridge();

    static apply( app: Express ): void {

        const testPath = `/api/test`;
        console.log(`Path applied: ${testPath}`);
        app.get(testPath, ( req, resp ) => {
            // Test if API is available
            try {
                const simpleAnswer: ApiResponse = {answer: "YES"}
                console.log(`Path "${testPath}" called. Will responde with: "${JSON.stringify(simpleAnswer)}"`);
                resp.send( simpleAnswer );
            }
            catch (error) {
                console.error(error);
                console.trace();
                return resp.status(400).send({error: String(error)});
            }
        });

        const davinciPath = `/api/davinci`;
        console.log(`Path applied: ${davinciPath}`);
        app.post(davinciPath, async ( req, resp ) => {
            try {
                const now = Date.now();
                console.log("Request for Davinci API received.")
                const apiRequest = req.body as ApiRequest;
                const apiPrompt = apiRequest.question;
                const responseText = await Functions._bridge.request(apiPrompt);
                const simpleAnswer: ApiResponse = {answer: responseText}
                const timeInSeconds = (Date.now() - now) / 1000;
                console.log(`Time for Davinci request: ${timeInSeconds} seconds`);
                resp.send( simpleAnswer );
            }
            catch (error) {
                console.error(error);
                console.trace();
                return resp.status(400).send({error: String(error)});
            }
        });
    }

}