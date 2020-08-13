"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioDeviceManager = void 0;
const dataflow_1 = require("./dataflow");
/**
 * The default port to listen on for radio responses.
 */
const DEFAULT_LISTEN_PORT = 3311;
/**
 * An implementation of `smarthome.DeviceManager` that implements radio functionality.
 */
class RadioDeviceManager {
    /**
     * @param  radioController  The radio controller used for radio communication.
     * @param  listenPort  The port to listen on for radio responses.
     */
    constructor(radioController, listenPort = DEFAULT_LISTEN_PORT) {
        this.deviceIdToAddress = new Map();
        this.radioController = radioController;
        this.listenPort = listenPort;
    }
    /**
     * Associates a deviceId with an IP address.
     * Required for routing Execute commands.
     * @param deviceId The deviceId of the device
     * @param address The address of the device
     */
    addDeviceIdToAddress(deviceId, address) {
        this.deviceIdToAddress.set(deviceId, address);
    }
    markPending(request) {
        //TODO(cjdaly) implementation
        return Promise.resolve();
    }
    getProxyInfo(id) {
        //TODO(cjdaly) implementation
        throw new Error('Method not implemented.');
    }
    /**
     * Fulfills a UdpRquestData.
     * @param udpRequestData  The UdpRequestData to source radio parameters from.
     * @returns  A promise that resolves to the determined UdpResponseData.
     */
    async processUdpRequestData(udpRequestData) {
        const payload = Buffer.from(udpRequestData.data, 'hex');
        const localAddress = this.deviceIdToAddress.get(udpRequestData.deviceId);
        const udpResponse = await this.radioController.sendUdpMessage(payload, localAddress, udpRequestData.port, this.listenPort, udpRequestData.expectedResponsePackets);
        return new dataflow_1.UdpResponseData(udpRequestData.requestId, udpRequestData.deviceId, udpResponse);
    }
    /**
     * Sends a true radio command based on the contents of a `CommandRequest`
     * @param command  The `CommandRequest` to process.
     * @returns  The determined `CommandBase` response.
     */
    async send(command) {
        if (!this.deviceIdToAddress.has(command.deviceId)) {
            throw new smarthome.IntentFlow.HandlerError(command.requestId);
        }
        console.log(command);
        if (command.protocol === 'UDP') {
            return await this.processUdpRequestData(command);
        }
        throw new Error('Radio protocol not recognized');
    }
}
exports.RadioDeviceManager = RadioDeviceManager;
//# sourceMappingURL=radio-device-manager.js.map