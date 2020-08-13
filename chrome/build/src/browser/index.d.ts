/// <reference types="@google/local-home-sdk" />
import { UDPScanConfig } from 'local-home-testing/build/src/radio/dataflow';
export declare const smarthome: {
    App: typeof globalThis.smarthome.App;
    Execute: typeof globalThis.smarthome.Execute;
    Intents: {
        readonly EXECUTE: string;
        readonly IDENTIFY: string;
        readonly REACHABLE_DEVICES: string;
    };
    DataFlow: {
        UdpRequestData: typeof globalThis.smarthome.DataFlow.UdpRequestData;
    };
    IntentFlow: {
        HandlerError: typeof globalThis.smarthome.IntentFlow.HandlerError;
    };
    Constants: {
        Protocol: {
            readonly BLE: string;
            readonly HTTP: string;
            readonly TCP: string;
            readonly UDP: string;
            readonly BLE_MESH: string;
        };
    };
};
export declare function udpScan(requestId: string, scanConfig: UDPScanConfig, deviceId: string): Promise<void>;
export declare function identify(requestId: string, discoveryBuffer: string, deviceId: string): Promise<void>;
export declare function execute(requestId: string, localDeviceId: string, executeCommand: string, params: Record<string, unknown>, customData: Record<string, unknown>): Promise<void>;
