"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Example tests against a fulfillment's executeHandler.
 */
/// <reference types="@google/local-home-sdk" />
/// <reference types="@types/node" />
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const fixtures_1 = require("./fixtures");
const DEVICE_ID = 'device-id-123';
const DEVICE_PORT = 12345;
const LOCAL_DEVICE_ID = 'local-device-id-123';
const EXECUTE_REQUEST_ID = 'request-id-123';
// Create a valid request for the Execute call.
const expectedCommand = fixtures_1.createUdpDeviceCommand(Buffer.from('test-execute-buffer'), EXECUTE_REQUEST_ID, DEVICE_ID, DEVICE_PORT);
/**
 * Tests that valid Execute request resolves with a 'SUCCESS'.
 */
ava_1.default('test-valid-execute-request', async (t) => {
    const app = new smarthome.App('0.0.1');
    const executeHandler = fixtures_1.createExecuteHandler(expectedCommand, app.getDeviceManager());
    // Registers DEVICE_ID and LOCAL_DEVICE_ID to the Local Home Platform with Identify.
    await app.onIdentify(fixtures_1.identifyHandler).onExecute(executeHandler).listen();
    const discoveryBuffer = Buffer.from(JSON.stringify({
        localDeviceId: LOCAL_DEVICE_ID,
    }));
    await src_1.extractStubs(app).mockLocalHomePlatform.triggerIdentify('identify-request-id', discoveryBuffer, DEVICE_ID),
        LOCAL_DEVICE_ID;
    // Source interactive stubs from the App instance.
    const stubs = src_1.extractStubs(app);
    // Create a valid `ExecuteRequestCommands`
    const executeCommands = src_1.createSimpleExecuteCommands(DEVICE_ID, 'actions.devices.commands.OnOff', { on: true }, { fooValue: 74, barvalue: true, bazValue: 'sheepdip' });
    // Prepare the `DeviceManagerStub` to expect the command to be sent in `executeHandler`.
    stubs.deviceManagerStub.addExpectedCommand(expectedCommand, new src_1.UdpResponseData(EXECUTE_REQUEST_ID, DEVICE_ID, new src_1.UdpResponse()));
    // Trigger an Execute intent and confirm a CommandSuccess.
    await t.notThrowsAsync(async () => {
        const executeResponseCommands = await stubs.mockLocalHomePlatform.triggerExecute(EXECUTE_REQUEST_ID, [executeCommands]);
        t.is(executeResponseCommands[0].status, 'SUCCESS');
    });
    // Confirm the expected command was sent.
    t.is(stubs.deviceManagerStub.wasCommandSent(expectedCommand), true);
});
//# sourceMappingURL=execute-test.js.map