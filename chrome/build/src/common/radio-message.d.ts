/// <reference types="@google/local-home-sdk" />
import { UDPScanConfig, UDPScanResults } from 'local-home-testing/build/src/radio';
export declare type RadioMessageType = 'UDPSCAN' | 'UDPSEND' | 'ERROR';
export interface ProxyRequest {
    proxyMessageType: RadioMessageType;
}
export interface ProxyResponse {
    proxyMessageType: RadioMessageType;
}
export declare class UdpScanRequest implements ProxyRequest {
    proxyMessageType: RadioMessageType;
    udpScanConfig: UDPScanConfig;
    constructor(udpScanConfig: UDPScanConfig);
}
export declare class UdpSendRequest implements ProxyRequest {
    proxyMessageType: RadioMessageType;
    address: string;
    listenPort: number;
    payload: string;
    port: number;
    constructor(address: string, listenPort: number, payload: string, port: number);
}
export declare class UdpScanResponse implements ProxyResponse {
    proxyMessageType: RadioMessageType;
    udpScanResults: UDPScanResults;
    constructor(udpScanResults: UDPScanResults, errorString?: string);
}
export declare class UdpSendResponse implements ProxyResponse {
    proxyMessageType: RadioMessageType;
    udpResponse: smarthome.DataFlow.UdpResponse;
    constructor(udpResponse: smarthome.DataFlow.UdpResponse, errorString?: string);
}
export declare class ProxyError implements ProxyResponse {
    proxyMessageType: RadioMessageType;
    errorMessage: string;
    constructor(errorMessage: string);
}
