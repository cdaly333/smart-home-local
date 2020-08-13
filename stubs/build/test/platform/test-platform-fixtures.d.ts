/// <reference types="@google/local-home-sdk" />
/**
 * Fixtures used across internal tests.
 */
/**
 * Creates a basic Identify handler that returns the specified
 * deviceId and verificationId.
 * @param deviceId  The `id` to include in the `IdentifyResponse`.
 * @param verificationId  The `verificationId` to return in the `IdentifyResponse`.
 */
export declare function createIdentifyHandler(deviceId: string, verificationId: string): smarthome.IntentFlow.IdentifyHandler;
