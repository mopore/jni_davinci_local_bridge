import { Express } from "express";
import { ApiResponse } from "./ApiResponse.js";
export class Functions {

    static apply( app: Express ): void {

        // Test if API is available
        const testPath = `/api/test`;
        console.log(`Path applied: ${testPath}`);
        app.get(testPath, ( req, resp ) => {
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
    }

}