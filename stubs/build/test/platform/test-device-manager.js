"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal test for the `DeviceManagerStub` class.
 */
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../../src");
const fixtures_1 = require("../example/fixtures");
const EXECUTE_REQUEST_ID = 'execute-request-id';
const DEVICE_ID = 'test-device-id';
const COMMAND_REQUEST = fixtures_1.createUdpDeviceCommand(Buffer.from('test-execute-buffer'), EXECUTE_REQUEST_ID, DEVICE_ID, 12345);
/**
 * Creates a simple execute request used for testing.
 * @param command  A command to set in the sample request.
 * @param params  The `params` field for the command.
 * @returns a simple execute request with the supplied parameters.
 */
function createExecuteRequest(command, params) {
    return {
        requestId: EXECUTE_REQUEST_ID,
        inputs: [
            {
                intent: smarthome.Intents.EXECUTE,
                payload: {
                    commands: [
                        {
                            execution: [
                                {
                                    command,
                                    params,
                                },
                            ],
                            devices: [
                                {
                                    id: DEVICE_ID,
                                },
                            ],
                        },
                    ],
                    structureData: {},
                },
            },
        ],
    };
}
/**
 * Tests that `markPending()` matches two identical requests.
 */
ava_1.default('device-manager-expected-mark-pending', async (t) => {
    const deviceManager = new src_1.MockDeviceManager();
    const executeRequest = createExecuteRequest('action.devices.commands.OnOff', {
        on: true,
    });
    const doesNextPendingRequestMatch = deviceManager.doesNextPendingRequestMatch(executeRequest);
    deviceManager.markPending(executeRequest);
    t.is(await doesNextPendingRequestMatch, true);
});
/**
 * Tests that `markPending()` differentiates two different requests.
 */
ava_1.default('device-manager-unexpected-mark-pending', async (t) => {
    const deviceManager = new src_1.MockDeviceManager();
    const executeRequest = createExecuteRequest('action.devices.commands.OnOff', {
        on: true,
    });
    const differentExecuteRequest = createExecuteRequest('action.devices.commands.OnOff', { on: true });
    const doesNextPendingRequestMatch = deviceManager.doesNextPendingRequestMatch(executeRequest);
    deviceManager.markPending(differentExecuteRequest);
    await t.throwsAsync(async () => {
        t.is(await doesNextPendingRequestMatch, false);
    }, {
        instanceOf: Error,
        message: src_1.ERROR_PENDING_REQUEST_MISMATCH,
    });
});
/**
 * Tests that an unexpected Execute request throws a `HandlerError`.
 */
ava_1.default('test-unexpected-command-request', async (t) => {
    const deviceManager = new src_1.MockDeviceManager();
    await t.throwsAsync(async () => {
        await deviceManager.send(COMMAND_REQUEST);
    }, {
        instanceOf: smarthome.IntentFlow.HandlerError,
        message: src_1.ERROR_UNEXPECTED_COMMAND_REQUEST,
    });
});
/**
 * Tests that `DeviceManagerStub` keeps track of sent requests
 * and resets them properly.
 */
ava_1.default('test-sent-requests', async (t) => {
    const deviceManager = new src_1.MockDeviceManager();
    const commandResponse = new src_1.UdpResponseData(EXECUTE_REQUEST_ID, DEVICE_ID, new src_1.UdpResponse());
    deviceManager.addExpectedCommand(COMMAND_REQUEST, commandResponse);
    // Send an expected command.
    await t.notThrowsAsync(async () => {
        await deviceManager.send(COMMAND_REQUEST);
    });
    // Confirm command was saved.
    t.is(deviceManager.wasCommandSent(COMMAND_REQUEST), true);
    // Confirm command was cleared.
    deviceManager.clearCommandsSent();
    t.is(deviceManager.wasCommandSent(COMMAND_REQUEST), false);
});
//# sourceMappingURL=test-device-manager.js.map