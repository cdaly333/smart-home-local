import {
  UDPScanConfig,
  UDPScanResults,
} from 'local-home-testing/build/src/radio';

/**
 * Defines all supported message types.
 */
export type RadioMessageType = 'UDPSCAN' | 'UDPSEND';

/**
 * A message request interface which demands a supported message type.
 */
export interface ProxyRequest {
  proxyMessageType: RadioMessageType;
}

/**
 * A message response interface which demands a supported message type.
 * Optionally holds an error message.
 */
export interface ProxyResponse {
  proxyMessageType: RadioMessageType | undefined;
  error: undefined | string;
}

/**
 * A class which contains all parameters required
 * to fulfill a UDP scan.
 */
export class UdpScanRequest implements ProxyRequest {
  proxyMessageType: RadioMessageType = 'UDPSCAN';
  udpScanConfig: UDPScanConfig;
  /**
   * @param udpScanConfig  The UDP Scan config to scan with.
   * @returns  A new `UdpScanRequest` instance.
   */
  constructor(udpScanConfig: UDPScanConfig) {
    this.udpScanConfig = udpScanConfig;
  }
}

/**
 * A class which contains all parameters required
 * to fulfill a UDP send command.
 */
export class UdpSendRequest implements ProxyRequest {
  proxyMessageType: RadioMessageType = 'UDPSEND';
  address: string;
  listenPort: number;
  payload: string;
  port: number;
  expectedResponsePackets: number;
  /**
   * @param address  The destination UDP address.
   * @param listenPort  The UDP port to listen on for packets.
   * @param payload  The UDP message payload.
   * @param port  The destintion UDP port.
   * @param expectedResponsePackets  The amount of packets to listen for.
   * @returns  A new `UdpSendRequest` instance.
   */
  constructor(
    address: string,
    listenPort: number,
    payload: string,
    port: number,
    expectedResponsePackets = 0
  ) {
    this.address = address;
    this.listenPort = listenPort;
    this.payload = payload;
    this.port = port;
    this.expectedResponsePackets = expectedResponsePackets;
  }
}

/**
 * A class that contains all information for a fulfilled `UdpScanRequest`.
 */
export class UdpScanResponse implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'UDPSCAN';
  error: undefined | string;
  udpScanResults: UDPScanResults | undefined;
  /**
   * @param udpScanResults  The UDP scan results.
   * @param error  An error message, if any.
   * @returns  A new `UdpScanResponse` instance.
   */
  constructor(udpScanResults?: UDPScanResults, error = '') {
    this.udpScanResults = udpScanResults;
    this.error = error;
  }
}

/**
 * A class that contains all information for a fulfilled `UdpSendRequest`.
 */
export class UdpSendResponse implements ProxyResponse {
  proxyMessageType: RadioMessageType = 'UDPSEND';
  error: string | undefined;
  udpResponse: smarthome.DataFlow.UdpResponse | undefined;
  /**
   * @param udpResponse  The `UDPResponse` obtained from the UDP command.
   * @param error  An error message, if any.
   * @returns  A new `UdpSendResponse` instance.
   */
  constructor(udpResponse?: smarthome.DataFlow.UdpResponse, error?: string) {
    this.udpResponse = udpResponse;
    this.error = error;
  }
}
