/// <reference types="@google/local-home-sdk" />
/// <reference types="@types/node" />
/**
 * Sample Identify handler that is tested against in example tests.
 * @param identifyRequest  The `IdentifyRequest` to send to `identifyHandler`
 */
export declare function identifyHandler(identifyRequest: smarthome.IntentFlow.IdentifyRequest): smarthome.IntentFlow.IdentifyResponse;
/**
 * Creates a basic Execute handler that forwards a specified `CommandRequest`
 * to a referenced `DeviceManager.
 * @param deviceCommand  The command to send to the given `DeviceManager`.
 * @param deviceManager  The `DeviceManager` to forward the `CommandRequest` to.
 * @returns  An Execute handler that sends the given command to the
 *     given `DeviceManager`.
 */
export declare function createExecuteHandler(deviceCommand: smarthome.DataFlow.CommandRequest, deviceManager: smarthome.DeviceManager): (executeRequest: smarthome.IntentFlow.ExecuteRequest) => Promise<smarthome.IntentFlow.ExecuteResponse>;
/**
 * Creates a 'UdpRequestData' to use for testing `DeviceManager` functionality.
 * @param buffer  The `Buffer` to include in the returned request data.
 * @param requestId  The request id to set in the request data.
 * @param deviceId  The device id to set in the request data.
 * @param port  The port to set in the request data.
 */
export declare function createUdpDeviceCommand(buffer: Buffer, requestId: string, deviceId: string, port: number): smarthome.DataFlow.UdpRequestData;
