/*
 * Mock radio for interfacing with mock devices
 */

export interface MockNetworkListener {
  onNetworkMessage(msg: Buffer): void;
}

// Simulates a network with simple UDP messaging functionality
export class MockNetwork {
  networkListeners: MockNetworkListener[] = [];

  public registerNetworkListener(listener: MockNetworkListener) {
    this.networkListeners.push(listener);
  }

  public sendNetworkMessage(msg: Buffer) {
    for (const listener of this.networkListeners) {
      listener.onNetworkMessage(msg);
    }
  }
}

export class MockDevice {
  private deviceId: string;
  private network: MockNetwork;

  public constructor(deviceId: string, network: MockNetwork) {
    this.deviceId = deviceId;
    this.network = network;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public triggerIdentify(discoveryBuffer: Buffer): void {
    this.network.sendNetworkMessage(discoveryBuffer);
  }
}
