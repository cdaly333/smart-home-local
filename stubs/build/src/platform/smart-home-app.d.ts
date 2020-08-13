/// <reference types="@google/local-home-sdk" />
import { MockLocalHomePlatform } from './mock-local-home-platform';
export declare const ERROR_LISTEN_WITHOUT_IDENTIFY_HANDLER = "Identify handler must be set before listen() can be called";
export declare const ERROR_LISTEN_WITHOUT_EXECUTE_HANDLER = "Execute handler must be set before listen() can be called";
export declare const ERROR_HANDLERS_NOT_SET: string;
export declare class AppStub implements smarthome.App {
    private version;
    identifyHandler: smarthome.IntentFlow.IdentifyHandler | undefined;
    executeHandler: smarthome.IntentFlow.ExecuteHandler | undefined;
    reachableDevicesHandler: smarthome.IntentFlow.ReachableDevicesHandler | undefined;
    private allHandlersSet;
    private mockLocalHomePlatform;
    /**
     * Constructs a new AppStub, which implements the smarthome.App interface.
     * Creates a member instance of `MockLocalHomePlatform`.
     * @param version  The app version, in accordance with the smarthome.app type.
     */
    constructor(version: string);
    /**
     * Returns the `MockLocalHomePlatform` member, if all handlers have been set
     * and `listen()` has been called.
     * Otherwise, throws an `Error`.
     * @returns  The MockLocalHomePlatform member.
     */
    getLocalHomePlatform(): MockLocalHomePlatform;
    /**
     * @returns  The `DeviceManager` associated with the platform.
     */
    getDeviceManager(): smarthome.DeviceManager;
    /**
     * Indicates that all handlers have been set on the app.
     * Will throw an error if either `identifyHandler` or
     * `executeHandler` is missing.
     */
    listen(): Promise<void>;
    /**
     * Sets the app `executeHandler`.
     * @param executeHandler The `executeHandler` for Execute fulfillment.
     */
    onExecute(executeHandler: smarthome.IntentFlow.ExecuteHandler): this;
    /**
     * Sets the app `identifyHandler`.
     * @param identifyHandler The `identifyHandler` for Identify fulfillment.
     */
    onIdentify(identifyHandler: smarthome.IntentFlow.IdentifyHandler): this;
    /**
     * Sets the app `reachableDevicesHandler`.
     * @param reachableDevicesHandler The `reachableDevicesHandler` for
     *     Reachable Devices fulfillment.
     */
    onReachableDevices(reachableDevicesHandler: smarthome.IntentFlow.ReachableDevicesHandler): this;
}
