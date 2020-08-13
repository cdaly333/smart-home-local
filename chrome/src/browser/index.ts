import {
  smarthomeStub,
  AppStub,
  extractStubs,
  MockLocalHomePlatform,
  createSimpleExecuteCommands,
} from 'local-home-testing';
import {ProxyRadioClient} from './proxy-client';
import {RadioDeviceManager} from 'local-home-testing/build/src/radio/radio-device-manager';
import {UDPScanConfig} from 'local-home-testing/build/src/radio/dataflow';
// inject stubsmarthomeStubs

let appStubInstance: AppStub | undefined = undefined;

let onAppInitialized: (app: AppStub) => void | undefined;

const saveAppStub = new Promise(resolve => {
  onAppInitialized = (app: AppStub) => {
    appStubInstance = app;
    resolve();
  };
});

class ChromeAppStub extends AppStub {
  constructor(version: string) {
    super(version);
    onAppInitialized(this);
  }
}

smarthomeStub.App = ChromeAppStub;
(globalThis as any).smarthome = smarthomeStub;
export const smarthome = smarthomeStub;
console.log('Stubs injected.');

let mockLocalHomePlatform: MockLocalHomePlatform | undefined;
const proxyRadioClient = new ProxyRadioClient();
let radioDeviceManager: RadioDeviceManager | undefined;

export async function udpScan(
  requestId: string,
  scanConfig: UDPScanConfig,
  deviceId: string
): Promise<void> {
  if (mockLocalHomePlatform === null) {
    return;
  }
  try {
    const scanRemoteInfo = await proxyRadioClient.udpScan(scanConfig);
    // Trigger the identifyHandler with scan results.
    await mockLocalHomePlatform!.triggerIdentify(
      requestId,
      scanRemoteInfo.buffer,
      deviceId
    );
    // Save association between deviceId and local IP address.
    radioDeviceManager!.addDeviceIdToAddress(
      deviceId,
      scanRemoteInfo.rinfo.address
    );
  } catch (error) {
    console.error('UDP scan failed:\n' + error);
  }
}

export async function identify(
  requestId: string,
  discoveryBuffer: string,
  deviceId: string
): Promise<void> {
  if (mockLocalHomePlatform === null) {
    return;
  }
  try {
    await mockLocalHomePlatform!.triggerIdentify(
      requestId,
      Buffer.from(discoveryBuffer, 'hex'),
      deviceId
    );
  } catch (error) {
    console.error(
      'An Error occured while triggering the identifyHandler: ' + error
    );
  }
}

export async function execute(
  requestId: string,
  localDeviceId: string,
  executeCommand: string,
  params: Record<string, unknown>,
  customData: Record<string, unknown>
): Promise<void> {
  if (mockLocalHomePlatform === null) {
    return;
  }
  try {
    const executeCommands = createSimpleExecuteCommands(
      localDeviceId,
      executeCommand!,
      params,
      customData
    );
    // Trigger an Execute intent.
    const executeResponse = await mockLocalHomePlatform!.triggerExecute(
      requestId,
      [executeCommands]
    );
    // Report the ExecuteResponse if succesful.
    console.log(
      'Execute handler triggered. ExecuteResponse was:\n' +
        JSON.stringify(executeResponse)
    );
  } catch (error) {
    console.error(
      'An error occured when triggering the Execute handler:\n' +
        error.toString()
    );
  }
}

async function listenForCommands() {
  await saveAppStub;
  mockLocalHomePlatform = extractStubs(appStubInstance!).mockLocalHomePlatform;
  radioDeviceManager = new RadioDeviceManager(proxyRadioClient);
  mockLocalHomePlatform.setDeviceManager(radioDeviceManager);
  console.log('smarthome.App constructor loaded.  Ready for intents.');
}

listenForCommands();
