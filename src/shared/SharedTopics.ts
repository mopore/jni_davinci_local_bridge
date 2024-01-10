export const sharedTopics = {
	TELEGRAM_SEND : "jniHome/services/telegramBot/send" as const,
	BRIEFING_ALERT: "jniHome/services/briefing/alert" as const,
	HUE_BRIDGE_SYSTEM_COMMAND: "jniHome/services/hueBridge/command" as const,
	HUE_BRIDGE_USER_COMMAND: "jniHome/services/hueBridge/commandUser" as const,
}