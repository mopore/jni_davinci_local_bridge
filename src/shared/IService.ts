import { ServiceFrame } from "./ServiceFrame.js";

export interface IService {
	getServiceName(): string;
	init(frame: ServiceFrame): void;
	onExit(): void;
	onReset(): void;
}