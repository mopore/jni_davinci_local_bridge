export type PresenceEvent = {
	name: string,
	start: boolean,
	end: boolean,
	utcTime: Date,
	proof?: string,
}

export type AlertEvent = {
	subject: string,
	message: string,
	urgent: boolean,
	utcTime: Date,
}

export type CommandRegistration = {
	service: string,
	command: string,
	commandAlternatives: string[] | undefined,
	extendable: boolean,
	description: string,
}

export enum ActionSource {
	USER = "USER",
	SYSTEM = "SYSTEM",
	UNKNOWN = "UNKNOWN",
}