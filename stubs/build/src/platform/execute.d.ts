/**
 * Stubs and helper functions for Execute functionality.
 */
/// <reference types="@google/local-home-sdk" />
export declare const ExecuteStub: typeof smarthome.Execute;
/**
 * A helper to build a simple `ExecuteRequestCommands` for sending a single
 * command to a single device.
 * @param deviceId  The id of the single device to send the command.
 * @param command  The single command to send to the device.
 * @param params  Parmeters for the command.
 * @returns  An `ExecuteRequestCommands` with the specified arguments.
 */
export declare function createSimpleExecuteCommands(deviceId: string, command: string, params: Record<string, unknown>, customData: Record<string, unknown>): smarthome.IntentFlow.ExecuteRequestCommands;
