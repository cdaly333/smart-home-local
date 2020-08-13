/// <reference types="@types/node" />
/// <reference types="@google/local-home-sdk" />
import { RadioController, UDPScanConfig, UDPScanResults } from 'local-home-testing/build/src/radio';
export declare class ProxyRadioClient implements RadioController {
    private webSocket;
    private onUdpScanResponse;
    private onUdpSendResponse;
    constructor(port?: number);
    private handleMessageEvent;
    udpScan(udpScanConfig: UDPScanConfig, timeout?: number | undefined): Promise<UDPScanResults>;
    sendUdpMessage(payload: Buffer, address: string, port: number, listenPort: number, expectedResponsePackets?: number | undefined, timeout?: number | undefined): Promise<smarthome.DataFlow.UdpResponse>;
}
