/// <reference types="@google/local-home-sdk" />
import { MockLocalHomePlatform } from './mock-local-home-platform';
import { MockDeviceManager } from './mock-device-manager';
export declare const smarthomeStub: {
    App: typeof smarthome.App;
    Execute: typeof smarthome.Execute;
    Intents: {
        [key in keyof typeof smarthome.Intents]: string;
    };
    DataFlow: {
        UdpRequestData: typeof smarthome.DataFlow.UdpRequestData;
    };
    IntentFlow: {
        HandlerError: typeof smarthome.IntentFlow.HandlerError;
    };
    Constants: {
        Protocol: {
            [key in keyof typeof smarthome.Constants.Protocol]: string;
        };
    };
};
export interface ExtractedStubs {
    mockLocalHomePlatform: MockLocalHomePlatform;
    deviceManagerStub: MockDeviceManager;
}
/**
 * Module-level function to source `MockLocalHomePlatform`
 * and `DeviceManagerStub` from an `App`.
 * @param app  The app to promote and extract the stubs from.
 * @returns  The extracted stubs.
 */
export declare function extractStubs(app: smarthome.App): ExtractedStubs;
