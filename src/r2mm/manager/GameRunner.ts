import ManagerSettings from './ManagerSettings';

import fs from 'fs-extra';
import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';
import Profile from '../../model/Profile';
import WebSlogIntegration from '../logging/WebSlogIntegration';
import protobuf from 'protobufjs';
import SlogMessage from '../../model/logging/SlogMessage';
var webSlogMessage = require("src/model/protobuf/WebSlog.json");

let webSocket: WebSocket | undefined;
let pulseInterval: NodeJS.Timeout | undefined;
let didUpdate: boolean = false;

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        
        if (pulseInterval !== undefined) {
            clearInterval(pulseInterval);
            pulseInterval = undefined;
        }
        
        if (webSocket !== undefined) {
            webSocket.close();
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
            
            pulseInterval = setInterval(() => {
                if (didUpdate) {
                    onComplete(null);
                    didUpdate = false;
                }
            }, 400);
            
            WebSlogIntegration.start();
            onComplete(null);
            
            this.openSocket(message => {
                const protoRoot = protobuf.Root.fromJSON(webSlogMessage);
                const protoMessage = protoRoot.lookupType("WebSlogMessage");
                const decoded = protoMessage.decode(new Uint8Array(message.data));
                WebSlogIntegration.add(decoded as unknown as SlogMessage);
                didUpdate = true;
            });
        }
    }
    
    private static openSocket(action: (x: MessageEvent) => void) {
        webSocket = new WebSocket('ws://localhost:5892/Log');
        webSocket.addEventListener("error", err => {
            // @ts-ignore
            // Must be defined if received an "error" event.
            webSocket.close();
            this.openSocket(action);
        })
        webSocket.binaryType = 'arraybuffer';
        webSocket.addEventListener('message', action);
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