/**
 * Stubs to allow handlers to access smarthome.DataFlow
 */
export const DataFlowStub = {
  UdpRequestData: class {
    protocol: smarthome.Constants.Protocol = smarthome.Constants.Protocol.UDP;
    requestId = '';
    deviceId = '';
    data = '';
    port = 0;
  },
};

/**
 * An implementation of `smarthome.DataFlow.UdpResponseData` for
 * responding to UDP requests.
 */
export class UdpResponseData implements smarthome.DataFlow.UdpResponseData {
  udpResponse: smarthome.DataFlow.UdpResponse;
  requestId: string;
  deviceId: string;
  protocol: smarthome.Constants.Protocol = smarthome.Constants.Protocol.UDP;
  /**
   * @param requestId  The requestId of associated `UdpRequestData`.
   * @param deviceId  The id of the device that the request was sent to.
   * @param udpResponse  The contents of the response.
   * @returns  A new UdpResponseData instance
   */
  constructor(
    requestId: string,
    deviceId: string,
    udpResponse: smarthome.DataFlow.UdpResponse
  ) {
    this.requestId = requestId;
    this.deviceId = deviceId;
    this.udpResponse = udpResponse;
  }
}

/**
 * An implementation of `smarthome.DataFlow.UdpResponse` for
 * responding to UDP requests.
 */
export class UdpResponse implements smarthome.DataFlow.UdpResponse {
  responsePackets?: string[];
  /**
   * @param responsePackets  The response packets to include in the UdpResponse, if any
   * @returns  A new `UdpResponse` instance.
   */
  constructor(responsePackets?: string[]) {
    this.responsePackets = responsePackets;
  }
}

/**
 * A class to contain all parameters required to perform
 * a UDP scan.
 */
export class UDPScanConfig {
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
  constructor(
    broadcastAddress: string,
    broadcastPort: number,
    listenPort: number,
    discoveryPacket: string
  ) {
    this.broadcastAddress = broadcastAddress;
    this.broadcastPort = broadcastPort;
    this.listenPort = listenPort;
    this.discoveryPacket = discoveryPacket;
  }
}

export interface RemoteInfo {
  port: number;
  address: string;
}

/**
 * A class to contain the information from a UDP scan.
 */
export interface UDPScanResults {
  scanData: string;
  rinfo: RemoteInfo;
}
