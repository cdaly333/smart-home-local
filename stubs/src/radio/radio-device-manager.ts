import {RadioController} from './radio-controller';
import {UdpResponseData} from './dataflow';

/**
 * The default port to listen on for radio responses.
 */
const DEFAULT_LISTEN_PORT = 3311;

/**
 * An implementation of `smarthome.DeviceManager` that implements radio functionality.
 */
export class RadioDeviceManager implements smarthome.DeviceManager {
  private radioController: RadioController;
  private listenPort: number;
  private deviceIdToAddress: Map<string, string> = new Map<string, string>();

  /**
   * @param  radioController  The radio controller used for radio communication.
   * @param  listenPort  The port to listen on for radio responses.
   */
  constructor(
    radioController: RadioController,
    listenPort: number = DEFAULT_LISTEN_PORT
  ) {
    this.radioController = radioController;
    this.listenPort = listenPort;
  }

  /**
   * Associates a deviceId with an IP address.
   * Required for routing Execute commands.
   * @param deviceId The deviceId of the device
   * @param address The address of the device
   */
  public addDeviceIdToAddress(deviceId: string, address: string): void {
    this.deviceIdToAddress.set(deviceId, address);
  }

  markPending(request: smarthome.IntentRequest): Promise<void> {
    //TODO(cjdaly) implementation
    return Promise.resolve();
  }

  getProxyInfo(id: string): smarthome.ProxyInfo {
    //TODO(cjdaly) implementation
    throw new Error('Method not implemented.');
  }

  /**
   * Fulfills a UdpRquestData.
   * @param udpRequestData  The UdpRequestData to source radio parameters from.
   * @returns  A promise that resolves to the determined UdpResponseData.
   */
  private async processUdpRequestData(
    udpRequestData: smarthome.DataFlow.UdpRequestData
  ): Promise<smarthome.DataFlow.UdpResponseData> {
    const payload = Buffer.from(udpRequestData.data, 'hex');
    const localAddress = this.deviceIdToAddress.get(udpRequestData.deviceId);
    const udpResponse = await this.radioController.sendUdpMessage(
      payload,
      localAddress!,
      udpRequestData.port,
      this.listenPort,
      udpRequestData.expectedResponsePackets
    );
    return new UdpResponseData(
      udpRequestData.requestId,
      udpRequestData.deviceId,
      udpResponse
    );
  }

  /**
   * Sends a true radio command based on the contents of a `CommandRequest`
   * @param command  The `CommandRequest` to process.
   * @returns  The determined `CommandBase` response.
   */
  public async send(
    command: smarthome.DataFlow.CommandRequest
  ): Promise<smarthome.DataFlow.CommandBase> {
    if (!this.deviceIdToAddress.has(command.deviceId)) {
      throw new smarthome.IntentFlow.HandlerError(command.requestId);
    }
    if (command.protocol === 'UDP') {
      return await this.processUdpRequestData(
        command as smarthome.DataFlow.UdpRequestData
      );
    }
    throw new Error('Radio protocol not recognized');
  }
}
