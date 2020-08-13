"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.identify = exports.udpScan = exports.smarthome = void 0;
const local_home_testing_1 = require("local-home-testing");
const proxy_client_1 = require("./proxy-client");
const radio_device_manager_1 = require("local-home-testing/build/src/radio/radio-device-manager");
// inject stubsmarthomeStubs
let appStubInstance = undefined;
let onAppInitialized;
const saveAppStub = new Promise(resolve => {
    onAppInitialized = (app) => {
        appStubInstance = app;
        resolve();
    };
});
class ChromeAppStub extends local_home_testing_1.AppStub {
    constructor(version) {
        super(version);
        onAppInitialized(this);
    }
}
local_home_testing_1.smarthomeStub.App = ChromeAppStub;
globalThis.smarthome = local_home_testing_1.smarthomeStub;
exports.smarthome = local_home_testing_1.smarthomeStub;
console.log('Stubs injected.');
let mockLocalHomePlatform;
const proxyRadioClient = new proxy_client_1.ProxyRadioClient();
let radioDeviceManager;
async function udpScan(requestId, scanConfig, deviceId) {
    if (mockLocalHomePlatform === null) {
        return;
    }
    try {
        const scanRemoteInfo = await proxyRadioClient.udpScan(scanConfig);
        // Trigger the identifyHandler with scan results.
        await mockLocalHomePlatform.triggerIdentify(requestId, scanRemoteInfo.buffer, deviceId);
        // Save association between deviceId and local IP address.
        radioDeviceManager.addDeviceIdToAddress(deviceId, scanRemoteInfo.rinfo.address);
    }
    catch (error) {
        console.error('UDP scan failed:\n' + error);
    }
}
exports.udpScan = udpScan;
async function identify(requestId, discoveryBuffer, deviceId) {
    if (mockLocalHomePlatform === null) {
        return;
    }
    try {
        await mockLocalHomePlatform.triggerIdentify(requestId, Buffer.from(discoveryBuffer, 'hex'), deviceId);
    }
    catch (error) {
        console.error('An Error occured while triggering the identifyHandler: ' + error);
    }
}
exports.identify = identify;
async function execute(requestId, localDeviceId, executeCommand, params, customData) {
    if (mockLocalHomePlatform === null) {
        return;
    }
    try {
        const executeCommands = local_home_testing_1.createSimpleExecuteCommands(localDeviceId, executeCommand, params, customData);
        // Trigger an Execute intent.
        const executeResponse = await mockLocalHomePlatform.triggerExecute(requestId, [executeCommands]);
        // Report the ExecuteResponse if succesful.
        console.log('Execute handler triggered. ExecuteResponse was:\n' +
            JSON.stringify(executeResponse));
    }
    catch (error) {
        console.error('An error occured when triggering the Execute handler:\n' +
            error.toString());
    }
}
exports.execute = execute;
async function listenForCommands() {
    await saveAppStub;
    mockLocalHomePlatform = local_home_testing_1.extractStubs(appStubInstance).mockLocalHomePlatform;
    radioDeviceManager = new radio_device_manager_1.RadioDeviceManager(proxyRadioClient);
    mockLocalHomePlatform.setDeviceManager(radioDeviceManager);
    console.log('smarthome.App constructor loaded.  Ready for intents.');
}
listenForCommands();
//# sourceMappingURL=index.js.map