
export function parseEnvVariable(envName: string): string{
	const envRawValue = process.env[envName];
	let envValue: string;
	try {
		envValue = String(envRawValue);
		if (envValue.trim().length === 0 ){
			throw new Error( `Value for environment variable "${envName} is not set.`);
		}
		return envValue;
	}
	catch (error){
		const errorMessage = `Could not parse environment variable for '${envName}'. Please check.`;
		console.error(errorMessage);
		console.trace();
		throw new Error(errorMessage);
	}
}