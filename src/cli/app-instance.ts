import {parentPort, workerData, MessageChannel} from 'worker_threads';
import {smarthomeStub, extractStubs} from '../platform/stub-setup';
import {AppStub} from '../platform/smart-home-app';
import {createSimpleExecuteCommands} from '../platform/execute';
import {IdentifyMessage, ExecuteMessage} from './command-processor';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Override the constructor to capture the AppStub instance.
 */
let appStubInstance: AppStub | undefined = undefined;
class CliAppStub extends AppStub {
  constructor(version: string) {
    super(version);
    appStubInstance = this;
  }
}

/**
 * Inject the stubs into the worker thread context
 */
smarthomeStub.App = CliAppStub;
(global as any).smarthome = smarthomeStub;

/**
 * Initialize the app
 */
const appPath = path.relative('./', workerData);
try {
  fs.existsSync(appPath);
} catch (error) {
  throw new Error('File at path ' + workerData + ' not found.');
}

/**
 * Runs the javascript specified in the app_path command line argument
 */
require(workerData);

/**
 * Checks that smarthome.App constructor was called
 */
if (appStubInstance === undefined) {
  throw new Error(
    'There was no smarthome.App creation detected in the specified module.'
  );
}

const {mockLocalHomePlatform} = extractStubs(appStubInstance!);

parentPort?.postMessage('ready');

if (parentPort !== null) {
  parentPort.on('message', async intentMessage => {
    if (intentMessage instanceof IdentifyMessage) {
      console.log('IDENTIFYMESSAGE');
    }
    if (intentMessage.intentType === 'IDENTIFY') {
      console.log('got message: ' + intentMessage);
      try {
        const localDeviceId = await mockLocalHomePlatform.triggerIdentify(
          intentMessage.requestId,
          Buffer.from(intentMessage.discoveryBuffer, 'hex'),
          intentMessage.deviceId
        );
        console.log(
          'IDENTIFY handler triggered. localDeviceId: ' +
            localDeviceId +
            ' was registered to the platform '
        );
      } catch (error) {
        console.log('Could not register a device due to an error:\n' + error);
      }
    } else if (intentMessage.intentType === 'EXECUTE') {
      try {
        const executeCommands = createSimpleExecuteCommands(
          intentMessage.localDeviceId,
          intentMessage.executeCommand!,
          intentMessage.params,
          intentMessage.customData
        );
        const executeResponse = await mockLocalHomePlatform.triggerExecute(
          intentMessage.requestId,
          [executeCommands]
        );
        console.log(
          'Execute handler triggered. ExecuteResponse was:\n' +
            executeResponse.toString()
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  });
}
