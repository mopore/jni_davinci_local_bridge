export interface IService {
	getServiceName(): string;
	onExit(): void;
}