/// <reference types="@google/local-home-sdk" />
/// <reference types="@types/node" />
import { AppStub } from './smart-home-app';
export declare const ERROR_UNDEFINED_VERIFICATIONID = "The handler returned an IdentifyResponse with an undefined verificationId";
export declare const ERROR_UNDEFINED_IDENTIFY_HANDLER = "Couldn't trigger an IdentifyRequest: The App identifyHandler was undefined.";
export declare const ERROR_UNDEFINED_EXECUTE_HANDLER = "Couldn't trigger an ExecuteRequest: The App executeHandler was undefined.";
export declare const ERROR_NO_LOCAL_DEVICE_ID_FOUND = "Cannot get localDeviceId of unregistered deviceId";
export declare const ERROR_DEVICE_ID_NOT_REGISTERED: string;
export declare const ERROR_EXECUTE_RESPONSE_ERROR_STATUS = "One or more ExecuteResponseCommands returned with an 'ERROR' status";
export declare class MockLocalHomePlatform {
    private app;
    private deviceManager;
    private localDeviceIds;
    /**
     * Constructs a new MockLocalHomePlatform instance using an App instance.
     * @param app  The AppStub that acts as an interface for intent handlers.
     */
    constructor(app: AppStub);
    setDeviceManager(deviceManager: smarthome.DeviceManager): void;
    getDeviceManager(): smarthome.DeviceManager;
    /**
     * Returns true if the provided deviceId was registered to the platform.
     * Otherwise, returns false.
     * @param deviceId  The deviceId to check.
     * @returns  A boolean indicating whether or not the deviceId is registered.
     */
    isDeviceIdRegistered(deviceId: string): boolean;
    getLocalDeviceId(deviceId: string): string;
    /**
     * Takes a `discoveryBuffer` and passes it to the fulfillment app
     * in an `IdentifyRequest`.
     * @param requestId  The requestId to set on the `IdentifyRequest`.
     * @param discoveryBuffer  The buffer in the `IdentifyRequest` scan data.
     * @param deviceId  The deviceId to register with the recieved localDeviceId.
     * @returns  The next localDeviceId registered to the Local Home Platform.
     */
    triggerIdentify(requestId: string, discoveryBuffer: Buffer, deviceId?: string): Promise<string>;
    /**
     * Forms an `ExecuteRequest` with the given commands.
     * Passes it to the fulfillment app.
     * @param requestId  The request id to set in the `ExecuteRequest`
     * @param commands  The `ExecuteRequestCommands` to pass to executeHandler.
     * @returns The list of `ExecuteResponseCommands` the fulfillment returned.
     */
    triggerExecute(requestId: string, commands: smarthome.IntentFlow.ExecuteRequestCommands[]): Promise<smarthome.IntentFlow.ExecuteResponseCommands[]>;
}
