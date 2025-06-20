import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs-extra';

let resizeTimeout = undefined;

export default class Persist {

    static getSize(app, { defaultWidth, defaultHeight }) {
        const configFilePath = path.join(app.getPath('appData'), 'r2modmanPlus-local', 'config', 'window-state.yml');
        if (fs.existsSync(configFilePath)) {
            try {
                const result = yaml.parse(fs.readFileSync(configFilePath).toString());
                return {
                    width: result.windowWidth,
                    height: result.windowHeight,
                    maximized: result.maximized || false
                };
            } catch (e) {
                return {
                    width: defaultWidth,
                    height: defaultHeight,
                    maximized: false
                };
            }
        }
        return {
            width: defaultWidth,
            height: defaultHeight,
            maximized: false
        };
    }

    static handle(window, app) {
        window.on('resize', () => {
            if (resizeTimeout !== undefined) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                const winSize = window.getSize();
                const yamlString = yaml.stringify({
                    'windowWidth': winSize[0],
                    'windowHeight': winSize[1],
                    'maximized': false
                });
                this.saveState(app, yamlString);
            }, 100);
        });
        window.on('maximize', () => {
            if (resizeTimeout !== undefined) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                const winSize = window.getSize();
                const previousSize = this.getSize(app, {defaultWidth: winSize[0], defaultHeight: winSize[1]});
                const yamlString = yaml.stringify({
                    'windowWidth': previousSize.width,
                    'windowHeight': previousSize.height,
                    'maximized': true
                });
                this.saveState(app, yamlString);
            }, 100);
        });
        window.on('unmaximize', () => {
            if (resizeTimeout !== undefined) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                const winSize = window.getSize();
                const yamlString = yaml.stringify({
                    'windowWidth': winSize[0],
                    'windowHeight': winSize[1],
                    'maximized': false
                });
                this.saveState(app, yamlString);
            }, 100);
        });
    }

    static saveState(app, state) {
        const configPath = path.join(app.getPath('appData'), 'r2modmanPlus-local', 'config');
        const configFilePath = path.join(configPath, 'window-state.yml');
        try {
            fs.ensureDirSync(configPath);
            fs.writeFileSync(configFilePath, state);
        } catch (e) {
            // Do nothing
        }
    }

}
