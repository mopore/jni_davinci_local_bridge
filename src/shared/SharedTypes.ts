export type PresenceEvent = {
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
	extendable: boolean,
	description: string,
}