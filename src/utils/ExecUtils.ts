import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export default class ExecUtils {

	public static openURI(uri: string){
		let args: Array<string>;
		switch (process.platform) {
			case 'win32':
				args = ['start', uri];
				break;
			case 'linux':
				args = [uri];
			default:
				args = [];
				break;
		}

		return spawn(this.getExecuter(), args);
	}

	public static openPathInFileManager(path: string): ChildProcessWithoutNullStreams{
		let args: Array<string>;
		switch (process.platform) {
			case 'win32':
				args = ['explorer', path];
				break;
			case 'linux':
				args = [path];
				break;
			default:
				args = [];
				break;
		}

		return spawn(this.getExecuter(), args);
	}

	public static openFileManagerToFile(file: string): ChildProcessWithoutNullStreams | undefined {
		switch(process.platform){
			case 'win32':
				return spawn(this.getExecuter(), ['explorer', `/select,${file}`]);
			case 'linux':
				console.log(file,`array:string:"${file}"`);
				return spawn('dbus-send', [
					'--session',
					'--dest=org.freedesktop.FileManager1',
					'--type=method_call',
					'/org/freedesktop/FileManager1',
					'org.freedesktop.FileManager1.ShowItems',
					`array:string:${file}`,
					'string:""'
				]);
			default:
				return undefined;
		}
	}

	private static getExecuter(): string{
		switch(process.platform){
			case 'win32':
				return 'powershell.exe';
			case 'linux':
				return 'xdg-open'; // The most common one, but Linux is hell anyway
			default:
				return '';
		}
	}

}