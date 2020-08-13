"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioController = exports.UDPScanConfig = void 0;
const dgram = __importStar(require("dgram"));
const dataflow_1 = require("./dataflow");
/**
 * A default radio timeout, in milliseconds.
 */
const RADIO_TIMEOUT = 2500;
/**
 * A class to contain all parameters required to perform
 * a UDP scan.
 */
class UDPScanConfig {
    /**
     *
     * @param broadcastAddress  The destination UDP broadcast address.
     * @param broadcastPort  The destination UDP broadcast port.
     * @param listenPort  The listen port for the UDP response.
     * @param discoveryPacket  The payload to send in the UDP broadcast.
     * @returns  A new `UDPScanConfig` instance.
     */
    constructor(broadcastAddress, broadcastPort, listenPort, discoveryPacket) {
        this.broadcastAddress = broadcastAddress;
        this.broadcastPort = broadcastPort;
        this.listenPort = listenPort;
        this.discoveryPacket = discoveryPacket;
    }
}
exports.UDPScanConfig = UDPScanConfig;
/**
 * A class to contain all Node radio functionality.
 */
class RadioController {
    /**
     * A helper function to create timeout promises.
     * @returns  A new Promise that resolves after RADIO_TIMEOUT milliseconds.
     */
    createTimeoutPromise(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    /**
     * Performs a UDP scan according to a `UDPScanConfig`.
     * @param udpScanConfig  A scan configuration containing UDP parameters.
     * @param timeout  How long in ms to wait before timing out the request.
     * @return  A promise that resolves to the determined `UDPScanResults`
     */
    async udpScan(udpScanConfig, timeout = RADIO_TIMEOUT) {
        // Open a UDP socket.
        const socket = dgram.createSocket('udp4');
        const discoveryBuffer = new Promise(resolve => {
            // Resolve promise when a broadcast buffer is recieved.
            socket.on('message', (buffer, rinfo) => {
                // Close the socket.
                socket.close();
                resolve({ buffer, rinfo });
            });
            // Enable UDP broadcast.
            socket.on('listening', () => {
                socket.setBroadcast(true);
            });
            socket.bind(udpScanConfig.listenPort);
            // Decode the discovery packet and send it.
            const payload = Buffer.from(udpScanConfig.discoveryPacket, 'hex');
            socket.send(payload, udpScanConfig.broadcastPort, udpScanConfig.broadcastAddress, error => {
                if (error) {
                    throw new Error(`Failed to send UDP discovery packet:\n${error.message}`);
                }
                console.log('Sent UDP discovery packet: ', payload);
            });
        });
        // Timeout if there hasn't been a response.
        return Promise.race([
            discoveryBuffer,
            this.createTimeoutPromise(timeout).then(() => {
                // Close the socket if timed out
                socket.close();
                throw new Error(`UDP scan timed out after ${timeout}ms.`);
            }),
        ]);
    }
    /**
     * Sends a UDP message using the given parameters
     * @param payload  The payload to send in the UDP message.
     * @param address  The destination address of the UDP message.
     * @param listenPort  The port to listen on for a response, if execting one.
     * @param expectedResponsePackets  The number of responses to save before resolving.
     * @param timeout  How long in ms to wait before timing out the request.
     * @returns  A promise that resolves to the determined `UDPResponse`.
     */
    async sendUdpMessage(payload, address, port, listenPort, expectedResponsePackets = 0, timeout = RADIO_TIMEOUT) {
        const responsePackets = [];
        // Open a UDP socket
        const socket = dgram.createSocket('udp4');
        const discoveryBuffer = new Promise(resolve => {
            // Record any UDP messages as responses.
            socket.on('message', msg => {
                responsePackets.push(msg.toString('hex'));
                if (responsePackets.length >= expectedResponsePackets) {
                    socket.close();
                    resolve(new dataflow_1.UdpResponse(responsePackets));
                }
            });
            // Start listening for responses.
            socket.bind(listenPort);
            // Send the UDP message, forwarding the given parameters.
            socket.send(payload, port, address, error => {
                if (error) {
                    throw new Error(`Failed to send UDP message: ${error.message}`);
                }
                console.log('Sent UDP message: ', payload);
                if (expectedResponsePackets === 0) {
                    // Resolve early if we aren't expecting any response.
                    resolve(new dataflow_1.UdpResponse());
                }
            });
        });
        // Timeout if still waiting for a response.
        return Promise.race([
            discoveryBuffer,
            this.createTimeoutPromise(timeout).then(() => {
                socket.close();
                throw new Error(`UDP send timed out after ${timeout} ms.`);
            }),
        ]);
    }
}
exports.RadioController = RadioController;
//# sourceMappingURL=radio-controller.js.map