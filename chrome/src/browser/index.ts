/**
 * The entry point for the Chrome app.
 */
import {smarthomeStub, AppStub} from 'local-home-testing';
import {PlatformController} from './platform-controller';
import {UDPScanConfig} from 'local-home-testing/build/src/radio/dataflow';

/**
 * Initialize the UI.
 * Redefine all `console.log` and `console.error` calls to log
 * to an element in the page.
 */
const logElement = document.getElementById('log');
if (logElement) {
  const modifiedConsole: any = console;
  modifiedConsole.defaultlog = console.log;
  modifiedConsole.log = (message: string) => {
    modifiedConsole.defaultlog(message);
    if (logElement) {
      logElement.innerHTML += `${getTimestamp()}<br/>${message}<br/>`;
      // Scrolls to the bottom of the element
      logElement.scrollTop = logElement.scrollHeight;
    }
  };
  modifiedConsole.error = modifiedConsole.log;
}

/**
 * A helper function to produce a readable timestamp prefix to differentiate calls.
 */
function getTimestamp() {
  return `[${new Date().toLocaleTimeString()}]: `;
}

/**
 * Callback to hook into app initialization.
 */
let onAppInitialized: (app: AppStub) => void | undefined;

/**
 * A promise to resolve when the app constructor gets called.
 */
const saveAppStub = new Promise<AppStub>(resolve => {
  onAppInitialized = (app: AppStub) => {
    resolve(app);
  };
});

/**
 * Override the constructor to access the stub on creation.
 */
class ChromeAppStub extends AppStub {
  constructor(version: string) {
    super(version);
    onAppInitialized(this);
  }
}

/**
 * Set the global dependencies.
 */
smarthomeStub.App = ChromeAppStub;
export const smarthome = smarthomeStub;

const filePicker = document.getElementById('file-picker');
if (filePicker) {
  filePicker.addEventListener('change', async event => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      eval(await files[0].text());
      filePicker.remove();
    }
  });
}

const platformController = new PlatformController(saveAppStub);

function getElementValue(id: string) {
  return (<HTMLInputElement>document.getElementById(id)).value;
}

export function onUdpScanButton() {
  const requestId = getElementValue('udp-request-id');
  const deviceId = getElementValue('udp-device-id');
  const broadcastAddress = getElementValue('udp-broadcast-address');
  const broadcastPort = getElementValue('udp-broadcast-port');
  const listenPort = getElementValue('udp-listen-port');
  const discoveryPacket = getElementValue('udp-discovery-packet');
  const scanConfig = new UDPScanConfig(
    broadcastAddress,
    parseInt(broadcastPort),
    parseInt(listenPort),
    discoveryPacket
  );
  platformController.udpScan(requestId, scanConfig, deviceId!);
}

export function onExecuteButton() {
  const requestId = getElementValue('execute-request-id');
  const deviceId = getElementValue('execute-device-id');
  const command = getElementValue('execute-command');
  const params = getElementValue('execute-params');
  const customData = getElementValue('execute-custom-data');
  platformController.execute(
    requestId,
    deviceId,
    command,
    JSON.parse(params),
    JSON.parse(customData)
  );
}
