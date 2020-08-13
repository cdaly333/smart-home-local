/// <reference types="@types/node" />
/// <reference types="@google/local-home-sdk" />
import * as dgram from 'dgram';
/**
 * A class to contain all parameters required to perform
 * a UDP scan.
 */
export declare class UDPScanConfig {
    broadcastAddress: string;
    broadcastPort: number;
    listenPort: number;
    discoveryPacket: string;
    /**
     *
     * @param broadcastAddress  The destination UDP broadcast address.
     * @param broadcastPort  The destination UDP broadcast port.
     * @param listenPort  The listen port for the UDP response.
     * @param discoveryPacket  The payload to send in the UDP broadcast.
     * @returns  A new `UDPScanConfig` instance.
     */
    constructor(broadcastAddress: string, broadcastPort: number, listenPort: number, discoveryPacket: string);
}
/**
 * A class to contain the information from a UDP scan.
 */
export interface UDPScanResults {
    buffer: Buffer;
    rinfo: dgram.RemoteInfo;
}
/**
 * A class to contain all Node radio functionality.
 */
export declare class RadioController {
    /**
     * A helper function to create timeout promises.
     * @returns  A new Promise that resolves after RADIO_TIMEOUT milliseconds.
     */
    private createTimeoutPromise;
    /**
     * Performs a UDP scan according to a `UDPScanConfig`.
     * @param udpScanConfig  A scan configuration containing UDP parameters.
     * @param timeout  How long in ms to wait before timing out the request.
     * @return  A promise that resolves to the determined `UDPScanResults`
     */
    udpScan(udpScanConfig: UDPScanConfig, timeout?: number): Promise<UDPScanResults>;
    /**
     * Sends a UDP message using the given parameters
     * @param payload  The payload to send in the UDP message.
     * @param address  The destination address of the UDP message.
     * @param listenPort  The port to listen on for a response, if execting one.
     * @param expectedResponsePackets  The number of responses to save before resolving.
     * @param timeout  How long in ms to wait before timing out the request.
     * @returns  A promise that resolves to the determined `UDPResponse`.
     */
    sendUdpMessage(payload: Buffer, address: string, port: number, listenPort: number, expectedResponsePackets?: number, timeout?: number): Promise<smarthome.DataFlow.UdpResponse>;
}
