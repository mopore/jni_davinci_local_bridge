const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const jsonReviver = (_: string, value: unknown): unknown => {
	if (typeof value === "string" && dateFormat.test(value)) {
		return new Date(value);
	}
	return value;
}

export default jsonReviver;
