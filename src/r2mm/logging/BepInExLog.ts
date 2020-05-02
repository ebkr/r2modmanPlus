export default class BepInExLog {
	
	private static lines: string[] = [];
	
	public static start() {
		this.lines = [];
	}
	
	public static add(data: string) {
		data.split("\n").forEach(line => {
			this.lines.push(line);
			console.log('Adding line:', line);
		});
	}
	
	public static getLines() {
		return this.lines;
	}
	
}