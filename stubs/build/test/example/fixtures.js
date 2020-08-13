"use strict";
/// <reference types="@google/local-home-sdk" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUdpDeviceCommand = exports.createExecuteHandler = exports.identifyHandler = void 0;
/**
 * Sample Identify handler that is tested against in example tests.
 * @param identifyRequest  The `IdentifyRequest` to send to `identifyHandler`
 */
function identifyHandler(identifyRequest) {
    const device = identifyRequest.inputs[0].payload.device;
    if (device.udpScanData === undefined) {
        throw Error('Missing discovery response');
    }
    const scanData = JSON.parse(Buffer.from(device.udpScanData.data, 'hex').toString());
    console.log(scanData);
    if (scanData.localDeviceId === undefined) {
        throw Error('Missing localDeviceId in discovery response');
    }
    return {
        requestId: identifyRequest.requestId,
        intent: smarthome.Intents.IDENTIFY,
        payload: {
            device: {
                id: device.id || '',
                verificationId: scanData.localDeviceId,
            },
        },
    };
}
exports.identifyHandler = identifyHandler;
/**
 * Creates a basic Execute handler that forwards a specified `CommandRequest`
 * to a referenced `DeviceManager.
 * @param deviceCommand  The command to send to the given `DeviceManager`.
 * @param deviceManager  The `DeviceManager` to forward the `CommandRequest` to.
 * @returns  An Execute handler that sends the given command to the
 *     given `DeviceManager`.
 */
function createExecuteHandler(deviceCommand, deviceManager) {
    return async (executeRequest) => {
        const command = executeRequest.inputs[0].payload.commands[0];
        const device = command.devices[0];
        // Create the Execute response to send back to platform.
        const executeResponse = new smarthome.Execute.Response.Builder().setRequestId(executeRequest.requestId);
        // Perform required DeviceManager actions and update response.
        try {
            const result = await deviceManager.send(deviceCommand);
            executeResponse.setSuccessState(result.deviceId, {});
        }
        catch (e) {
            executeResponse.setErrorState(device.id, e.errorCode);
        }
        return executeResponse.build();
    };
}
exports.createExecuteHandler = createExecuteHandler;
/**
 * Creates a 'UdpRequestData' to use for testing `DeviceManager` functionality.
 * @param buffer  The `Buffer` to include in the returned request data.
 * @param requestId  The request id to set in the request data.
 * @param deviceId  The device id to set in the request data.
 * @param port  The port to set in the request data.
 */
function createUdpDeviceCommand(buffer, requestId, deviceId, port) {
    const deviceCommand = new smarthome.DataFlow.UdpRequestData();
    deviceCommand.data = buffer.toString('hex');
    deviceCommand.requestId = requestId;
    deviceCommand.deviceId = deviceId;
    deviceCommand.port = port;
    return deviceCommand;
}
exports.createUdpDeviceCommand = createUdpDeviceCommand;
//# sourceMappingURL=fixtures.js.map