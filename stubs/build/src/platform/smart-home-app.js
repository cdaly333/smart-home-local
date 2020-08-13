"use strict";
/*
 * An interactive stub of the smarthome.App class.
 */
/// <reference types="@google/local-home-sdk" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStub = exports.ERROR_HANDLERS_NOT_SET = exports.ERROR_LISTEN_WITHOUT_EXECUTE_HANDLER = exports.ERROR_LISTEN_WITHOUT_IDENTIFY_HANDLER = void 0;
const mock_local_home_platform_1 = require("./mock-local-home-platform");
exports.ERROR_LISTEN_WITHOUT_IDENTIFY_HANDLER = 'Identify handler must be set before listen() can be called';
exports.ERROR_LISTEN_WITHOUT_EXECUTE_HANDLER = 'Execute handler must be set before listen() can be called';
exports.ERROR_HANDLERS_NOT_SET = 'All handlers must be set and listen() must be called before ' +
    'accessing the Platform';
class AppStub {
    /**
     * Constructs a new AppStub, which implements the smarthome.App interface.
     * Creates a member instance of `MockLocalHomePlatform`.
     * @param version  The app version, in accordance with the smarthome.app type.
     */
    constructor(version) {
        this.allHandlersSet = false;
        this.version = version;
        this.mockLocalHomePlatform = new mock_local_home_platform_1.MockLocalHomePlatform(this);
    }
    /**
     * Returns the `MockLocalHomePlatform` member, if all handlers have been set
     * and `listen()` has been called.
     * Otherwise, throws an `Error`.
     * @returns  The MockLocalHomePlatform member.
     */
    getLocalHomePlatform() {
        if (this.allHandlersSet) {
            return this.mockLocalHomePlatform;
        }
        else {
            throw new Error(exports.ERROR_HANDLERS_NOT_SET);
        }
    }
    /**
     * @returns  The `DeviceManager` associated with the platform.
     */
    getDeviceManager() {
        return this.mockLocalHomePlatform.getDeviceManager();
    }
    /**
     * Indicates that all handlers have been set on the app.
     * Will throw an error if either `identifyHandler` or
     * `executeHandler` is missing.
     */
    listen() {
        if (this.identifyHandler === undefined) {
            throw new Error(exports.ERROR_LISTEN_WITHOUT_IDENTIFY_HANDLER);
        }
        if (this.executeHandler === undefined) {
            throw new Error(exports.ERROR_LISTEN_WITHOUT_EXECUTE_HANDLER);
        }
        this.allHandlersSet = true;
        return Promise.resolve();
    }
    /**
     * Sets the app `executeHandler`.
     * @param executeHandler The `executeHandler` for Execute fulfillment.
     */
    onExecute(executeHandler) {
        this.executeHandler = executeHandler;
        return this;
    }
    /**
     * Sets the app `identifyHandler`.
     * @param identifyHandler The `identifyHandler` for Identify fulfillment.
     */
    onIdentify(identifyHandler) {
        this.identifyHandler = identifyHandler;
        return this;
    }
    /**
     * Sets the app `reachableDevicesHandler`.
     * @param reachableDevicesHandler The `reachableDevicesHandler` for
     *     Reachable Devices fulfillment.
     */
    onReachableDevices(reachableDevicesHandler) {
        this.reachableDevicesHandler = reachableDevicesHandler;
        return this;
    }
}
exports.AppStub = AppStub;
//# sourceMappingURL=smart-home-app.js.map