import { ServiceFrame } from "./ServiceFrame.js";

export interface IService {
	getServiceName(): string;
	initAsync(frame: ServiceFrame): Promise<void>;
	onExit(): void;
	onReset(): void;
}