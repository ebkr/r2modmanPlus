export default class BepInExLog {
	
	private static lines: string[] = [];
	
	public static start() {
		this.lines = [];
	}
	
	public static async add(data: string) {
		data.split("\n").forEach(line => {
			this.lines.push(line);
		});
	}
	
	public static getLines() {
		return [...this.lines];
	}
	
}