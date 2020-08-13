/// <reference types="@google/local-home-sdk" />
/**
 * Stubs to allow handlers to access smarthome.DataFlow
 */
export declare const DataFlowStub: {
    UdpRequestData: {
        new (): {
            protocol: smarthome.Constants.Protocol;
            requestId: string;
            deviceId: string;
            data: string;
            port: number;
        };
    };
};
/**
 * An implementation of `smarthome.DataFlow.UdpResponseData` for
 * responding to UDP requests.
 */
export declare class UdpResponseData implements smarthome.DataFlow.UdpResponseData {
    udpResponse: smarthome.DataFlow.UdpResponse;
    requestId: string;
    deviceId: string;
    protocol: smarthome.Constants.Protocol;
    /**
     * @param requestId  The requestId of associated `UdpRequestData`.
     * @param deviceId  The id of the device that the request was sent to.
     * @param udpResponse  The contents of the response.
     * @returns  A new UdpResponseData instance
     */
    constructor(requestId: string, deviceId: string, udpResponse: smarthome.DataFlow.UdpResponse);
}
/**
 * An implementation of `smarthome.DataFlow.UdpResponse` for
 * responding to UDP requests.
 */
export declare class UdpResponse implements smarthome.DataFlow.UdpResponse {
    responsePackets?: string[];
    /**
     * @param responsePackets  The response packets to include in the UdpResponse, if any
     * @returns  A new `UdpResponse` instance.
     */
    constructor(responsePackets?: string[]);
}
