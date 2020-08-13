"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Internal integration tests for the MockLocalHomePlatform's
 * Execute functionality.
 */
/// <reference types="@google/local-home-sdk" />
/// <reference types="@types/node" />
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const test_platform_fixtures_1 = require("./test-platform-fixtures");
const fixtures_1 = require("../example/fixtures");
const DEVICE_ID = 'device-id-123';
const DEVICE_PORT = 12345;
const LOCAL_DEVICE_ID = 'local-device-id-123';
const EXECUTE_REQUEST_ID = 'request-id-123';
/**
 * A helper to prepare the platform and register a device ID.
 * @param app  The app instance to ready.
 * @param executeHandler  The executeHandler to assign to the `App`.
 * @param deviceId  The deviceId to register to the platform.
 * @param localDeviceId  The localDeviceId to register to the platform.
 */
async function registerDevice(app, executeHandler, deviceId, localDeviceId) {
    const identifyHandler = test_platform_fixtures_1.createIdentifyHandler(deviceId, localDeviceId);
    await app.onIdentify(identifyHandler).onExecute(executeHandler).listen();
    await src_1.extractStubs(app).mockLocalHomePlatform.triggerIdentify('identify-request-id', Buffer.from('test-buffer'), deviceId);
    Promise.resolve();
}
/**
 * Tests that a valid Execute request and handler pair
 * will result in a `SUCCESS`.
 */
ava_1.default('execute-handler-command-success', async (t) => {
    // Create the App to test against.
    const app = new smarthome.App('0.0.1');
    // Create a valid request for the Execute call.
    const validCommand = fixtures_1.createUdpDeviceCommand(Buffer.from('test-execute-buffer'), EXECUTE_REQUEST_ID, DEVICE_ID, DEVICE_PORT);
    // Create an Execute handler that sends a valid command.
    const executeHandler = fixtures_1.createExecuteHandler(validCommand, app.getDeviceManager());
    await registerDevice(app, executeHandler, DEVICE_ID, LOCAL_DEVICE_ID);
    const stubs = src_1.extractStubs(app);
    // Prepare the stub to expect the command.
    stubs.deviceManagerStub.addExpectedCommand(validCommand, new src_1.UdpResponseData(EXECUTE_REQUEST_ID, DEVICE_ID, new src_1.UdpResponse()));
    const executeCommands = src_1.createSimpleExecuteCommands(DEVICE_ID, 'actions.devices.commands.OnOff', { on: true }, { fooValue: 74, barvalue: true, bazValue: 'sheepdip' });
    // Trigger an Execute intent and confirm a `CommandSuccess`.
    await t.notThrowsAsync(async () => {
        const executeResponseCommands = await stubs.mockLocalHomePlatform.triggerExecute(EXECUTE_REQUEST_ID, [executeCommands]);
        t.is(executeResponseCommands[0].status, 'SUCCESS');
    });
});
/**
 * Tests that sending a non-matching command will result in an `ERROR`.
 */
ava_1.default('execute-handler-sends-wrong-buffer', async (t) => {
    // Create the App to test against.
    const app = new smarthome.App('0.0.1');
    const expectedCommand = fixtures_1.createUdpDeviceCommand(Buffer.from('test-execute-buffer'), EXECUTE_REQUEST_ID, DEVICE_ID, DEVICE_PORT);
    const unexpectedCommand = fixtures_1.createUdpDeviceCommand(Buffer.from('incorrect-buffer'), EXECUTE_REQUEST_ID, DEVICE_ID, DEVICE_PORT);
    // Create an Execute handler that passes in an unexpected command.
    const executeHandler = fixtures_1.createExecuteHandler(unexpectedCommand, app.getDeviceManager());
    // Register the device with Identify.
    await registerDevice(app, executeHandler, DEVICE_ID, LOCAL_DEVICE_ID);
    const stubs = src_1.extractStubs(app);
    // Prepare the stub to expect a command.
    stubs.deviceManagerStub.addExpectedCommand(expectedCommand, new src_1.UdpResponseData(EXECUTE_REQUEST_ID, DEVICE_ID, new src_1.UdpResponse()));
    // Create a valid Execute command to trigger `executeHandler`.
    const executeCommands = src_1.createSimpleExecuteCommands(DEVICE_ID, 'actions.devices.commands.OnOff', { on: true }, { fooValue: 74, barvalue: true, bazValue: 'sheepdip' });
    // Trigger the Execute handler and confirm a `CommandFailure`
    await t.throwsAsync(async () => {
        await stubs.mockLocalHomePlatform.triggerExecute(EXECUTE_REQUEST_ID, [
            executeCommands,
        ]);
    }, {
        instanceOf: Error,
        message: src_1.ERROR_EXECUTE_RESPONSE_ERROR_STATUS,
    });
    // Confirm that the unexpected command was sent.
    t.is(stubs.deviceManagerStub.wasCommandSent(unexpectedCommand), true);
});
//# sourceMappingURL=test-platform-execute.js.map