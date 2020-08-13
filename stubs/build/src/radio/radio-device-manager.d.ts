/// <reference types="@google/local-home-sdk" />
import { RadioController } from './radio-controller';
/**
 * An implementation of `smarthome.DeviceManager` that implements radio functionality.
 */
export declare class RadioDeviceManager implements smarthome.DeviceManager {
    private radioController;
    private listenPort;
    private deviceIdToAddress;
    /**
     * @param  radioController  The radio controller used for radio communication.
     * @param  listenPort  The port to listen on for radio responses.
     */
    constructor(radioController: RadioController, listenPort?: number);
    /**
     * Associates a deviceId with an IP address.
     * Required for routing Execute commands.
     * @param deviceId The deviceId of the device
     * @param address The address of the device
     */
    addDeviceIdToAddress(deviceId: string, address: string): void;
    markPending(request: smarthome.IntentRequest): Promise<void>;
    getProxyInfo(id: string): smarthome.ProxyInfo;
    /**
     * Fulfills a UdpRquestData.
     * @param udpRequestData  The UdpRequestData to source radio parameters from.
     * @returns  A promise that resolves to the determined UdpResponseData.
     */
    private processUdpRequestData;
    /**
     * Sends a true radio command based on the contents of a `CommandRequest`
     * @param command  The `CommandRequest` to process.
     * @returns  The determined `CommandBase` response.
     */
    send(command: smarthome.DataFlow.CommandRequest): Promise<smarthome.DataFlow.CommandBase>;
}
