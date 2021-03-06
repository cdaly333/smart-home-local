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
  TcpRequestData: class {
    protocol: smarthome.Constants.Protocol = smarthome.Constants.Protocol.TCP;
    requestId = '';
    deviceId = '';
    data = '';
    bytesToRead?: number;
    hostname?: string;
    port = 0;
    operation: smarthome.Constants.TcpOperation =
      smarthome.Constants.TcpOperation.WRITE;
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
 * An implementation of `smarthome.DataFlow.TcpResponseData` for
 * responding to TCP requests.
 */
export class TcpResponseData implements smarthome.DataFlow.TcpResponseData {
  tcpResponse: smarthome.DataFlow.TcpResponse;
  requestId: string;
  deviceId: string;
  protocol: smarthome.Constants.Protocol = smarthome.Constants.Protocol.UDP;
  /**
   * @param requestId  The requestId of the corresponding `TcpRequestData`.
   * @param deviceId  The id of the device that the request was sent to.
   * @param tcpResponse  The contents of the response.
   * @returns  A new `TcpResponseData` instance
   */
  constructor(
    requestId: string,
    deviceId: string,
    tcpResponse: smarthome.DataFlow.TcpResponse
  ) {
    this.requestId = requestId;
    this.deviceId = deviceId;
    this.tcpResponse = tcpResponse;
  }
}

/**
 * An implementation of `smarthome.DataFlow.TcpResponse` for
 * responding to TCP requests.
 */
export class TcpResponse implements smarthome.DataFlow.TcpResponse {
  data: string;
  constructor(data = '') {
    this.data = data;
  }
}
