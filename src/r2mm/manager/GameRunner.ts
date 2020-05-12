import ManagerSettings from './ManagerSettings';

import fs from 'fs-extra';
import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';
import Profile from '../../model/Profile';
import WebSlogIntegration from '../logging/WebSlogIntegration';
import Timeout = NodeJS.Timeout;
import protobuf from 'protobufjs';
import SlogMessage from '../../model/logging/SlogMessage';
var webSlogMessage = require("src/model/protobuf/WebSlog.json");

let webSocket: WebSocket | undefined;
let attemptInterval: Timeout | undefined;
let logDisplayInterval: Timeout | undefined;

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        
        if (attemptInterval !== undefined) {
            clearInterval(attemptInterval);
            attemptInterval = undefined;
        }
        
        Logger.Log(LogSeverity.INFO, 'Launching modded');
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable true --doorstop-target r2modman\\BepInEx\\core\\BepInEx.Preloader.dll`);
        
        // Ensure log is empty prior to start
        fs.ensureDirSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx'));
        fs.writeFileSync(path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'LogOutput.log'), '');
        
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'true', '--doorstop-target', 'r2modman\\BepInEx\\core\\BepInEx.Preloader.dll']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
    
        if (WebSlogIntegration.isEnabled()) {
            
            WebSlogIntegration.start();
            onComplete(null);
    
            let didUpdate = false;
            attemptInterval = setInterval(() => {
                try {
                    var socket = new WebSocket('ws://localhost:5892/Log');
                    socket.binaryType = 'arraybuffer';
                    socket.addEventListener('open', () => {
                        if (attemptInterval !== undefined) {
                            clearInterval(attemptInterval);
                            attemptInterval = undefined;
                        }
                    })
                    socket.addEventListener('message', message => {
                        const protoRoot = protobuf.Root.fromJSON(webSlogMessage);
                        const protoMessage = protoRoot.lookupType("WebSlogMessage");
                        const decoded = protoMessage.decode(new Uint8Array(message.data))
                        WebSlogIntegration.add(decoded as unknown as SlogMessage)
                        didUpdate = true;
                    })
                    if (logDisplayInterval !== undefined) {
                        clearInterval(logDisplayInterval);
                        logDisplayInterval = undefined;
                    }
                    logDisplayInterval = setInterval(() => {
                        if (didUpdate) {
                            onComplete(null);
                            didUpdate = false;
                        }
                    }, 100);
                } catch (e) {
                    // Do nothing. No websocket connection currently available.
                }
            }, 500);
        }
    }

    public static playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching vanilla');
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable false`);
        child.spawn(`${steamDir}/Steam.exe`, ['-applaunch', '632360', '--doorstop-enable', 'false']).on('error', err => {
            Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting vanilla');
            Logger.Log(LogSeverity.ERROR, err.message);
            onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
        });
    }


}