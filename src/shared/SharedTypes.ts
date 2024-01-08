export type PresenceEvent = {
	name: string,
	start: boolean,
	end: boolean,
	utcTime: Date
}

export type AlertEvent = {
	subject: string,
	message: string,
	urgent: boolean,
	utcTime: Date
}

export type CommandRegistration = {
	service: string,
	command: string,
	commandAlternatives: string[] | undefined,
	extendable: boolean,
	description: string,
}