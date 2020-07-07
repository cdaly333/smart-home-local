/*
 * Mock Local Home Platform class
 * - Interacts with bundled HomeApp
 * - Accepts scan config
 * - Interacts with virtual network
 */

/// <reference types="@google/local-home-sdk" />
import { MockNetwork, MockNetworkListener } from './mock-radio';
import { AppStub } from './smart-home-app';

// TODO(cjdaly): add other radio scan support
export class MockLocalHomePlatform implements MockNetworkListener {
  //  Singleton instance
  private static instance: MockLocalHomePlatform;

  private deviceManager: smarthome.DeviceManager;
  private app: AppStub;
  private localDeviceIds: Map<string, string> = new Map<string, string>();
  private newDeviceRegisteredActions: ((localDeviceId: string) => void)[] = [];
  private homeAppReady: boolean = false;

  private constructor() {}

  public setApp(app: AppStub) {
    this.app = app;
  }

  private onNewDeviceIdRegistered(localDeviceId: string) {
    this.newDeviceRegisteredActions.forEach((newDeviceRegisteredAction) => {
      newDeviceRegisteredAction(localDeviceId);
    });
  }

  public async getNextDeviceIdRegistered(): Promise<string> {
    return new Promise((resolve) => {
      this.newDeviceRegisteredActions.push((localDeviceId) => {
        resolve(localDeviceId);
      });
    });
  }

  public isHomeAppReady(): boolean {
    return this.homeAppReady;
  }

  public notifyHomeAppReady(): void {
    this.homeAppReady = true;
  }

  //  Singleton getter
  public static getInstance(): MockLocalHomePlatform {
    if (!MockLocalHomePlatform.instance) {
      MockLocalHomePlatform.instance = new MockLocalHomePlatform();
    }
    return MockLocalHomePlatform.instance;
  }

  public getDeviceManager(): smarthome.DeviceManager {
    return this.deviceManager;
  }

  public getLocalDeviceIdMap(): Map<string, string> {
    return this.localDeviceIds;
  }

  // Establish fulfillment path using app code
  async onNetworkMessage(msg: Buffer): Promise<void> {
    console.log('received discovery payload:', msg);

    const identifyRequest: smarthome.IntentFlow.IdentifyRequest = {
      requestId: 'request-id',
      inputs: [
        {
          intent: smarthome.Intents.IDENTIFY,
          payload: {
            device: {
              radioTypes: [],
              udpScanData: { data: msg.toString('hex') },
            },
            structureData: {},
            params: {},
          },
        },
      ],
      devices: [],
    };

    const identifyResponse: smarthome.IntentFlow.IdentifyResponse = await this.app.identifyHandler(
      identifyRequest
    );

    const device = identifyResponse.payload.device;
    console.log('Registering localDeviceId: ' + device.verificationId);
    this.localDeviceIds.set(device.id, device.verificationId);
    this.onNewDeviceIdRegistered(device.verificationId);
  }
}
