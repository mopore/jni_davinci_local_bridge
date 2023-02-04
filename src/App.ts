import dotenv from "dotenv";

dotenv.config();
const testEnvValue = process.env["TEST_VAR"] ?? "Define 'TEST_VAR' in .env file in project's root";

console.log(`Hello from the Template. Test value: ${testEnvValue}`);