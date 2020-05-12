import SlogMessage from '../../model/logging/SlogMessage';

export default class WebSlogIntegration {
	
	private static lines: SlogMessage[] = [];
	private static enabled: boolean = false;
	
	public static enable() {
		this.enabled = true;
	}
	
	public static disable() {
		this.enabled = false;
	}
	
	public static isEnabled(): boolean {
		return this.enabled;
	}
	
	public static start() {
		this.lines = [];
	}
	
	public static async add(data: SlogMessage) {
		if (this.enabled) {
			this.lines.push(data)
		}
	}
	
	public static getLines() {
		return [...this.lines];
	}
	
}