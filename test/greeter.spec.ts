import { assert } from "chai";
import { greet } from "../src/greeter/greeter.js";

describe("greeter test", () => {
	it("greets the caller", () => {
		const result = greet("Tester");
		assert.equal(result, "Hello from Tester");
	})
});