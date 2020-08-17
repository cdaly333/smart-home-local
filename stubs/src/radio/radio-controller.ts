import * as dgram from 'dgram';
import {UdpResponse, UDPScanConfig, UDPScanResults} from './dataflow';

/**
 * A default radio timeout, in milliseconds.
 */
const RADIO_TIMEOUT = 2500;
/**
 * A helper function to create timeout promises.
 * @returns  A new Promise that resolves after RADIO_TIMEOUT milliseconds.
 */
export function createTimeoutPromise(timeout: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

/**
 * A class to contain all Node radio functionality.
 */
export interface RadioController {
  /**
   * Performs a UDP scan according to a `UDPScanConfig`.
   * @param udpScanConfig  A scan configuration containing UDP parameters.
   * @param timeout  How long in ms to wait before timing out the request.
   * @return  A promise that resolves to the determined `UDPScanResults`
   */
  udpScan(
    udpScanConfig: UDPScanConfig,
    timeout?: number
  ): Promise<UDPScanResults>;

  /**
   * Sends a UDP message using the given parameters
   * @param payload  The payload to send in the UDP message.
   * @param address  The destination address of the UDP message.
   * @param listenPort  The port to listen on for a response, if execting one.
   * @param expectedResponsePackets  The number of responses to save before resolving.
   * @param timeout  How long in ms to wait before timing out the request.
   * @returns  A promise that resolves to the determined `UDPResponse`.
   */
  sendUdpMessage(
    payload: Buffer,
    address: string,
    port: number,
    listenPort: number,
    expectedResponsePackets?: number,
    timeout?: number
  ): Promise<smarthome.DataFlow.UdpResponse>;
}

/**
 * A class to contain all Node radio functionality.
 */
export class NodeRadioController implements RadioController {
  /**
   * Performs a UDP scan according to a `UDPScanConfig`.
   * @param udpScanConfig  A scan configuration containing UDP parameters.
   * @param timeout  How long in ms to wait before timing out the request.
   * @return  A promise that resolves to the determined `UDPScanResults`
   */
  public async udpScan(
    udpScanConfig: UDPScanConfig,
    timeout = RADIO_TIMEOUT
  ): Promise<UDPScanResults> {
    // Open a UDP socket.
    const socket = dgram.createSocket('udp4');
    const discoveryBuffer = new Promise<UDPScanResults>(resolve => {
      // Resolve promise when a broadcast buffer is recieved.
      socket.on('message', (buffer, rinfo) => {
        // Close the socket.
        socket.close();
        resolve({scanData: buffer.toString('hex'), rinfo});
      });

      // Enable UDP broadcast.
      socket.on('listening', () => {
        socket.setBroadcast(true);
      });
      socket.bind(udpScanConfig.listenPort);

      // Decode the discovery packet and send it.
      const payload = Buffer.from(udpScanConfig.discoveryPacket, 'hex');
      socket.send(
        payload,
        udpScanConfig.broadcastPort,
        udpScanConfig.broadcastAddress,
        error => {
          if (error) {
            throw new Error(
              `Failed to send UDP discovery packet:\n${error.message}`
            );
          }
          console.log('Sent UDP discovery packet: ', payload);
        }
      );
    });
    // Timeout if there hasn't been a response.
    return Promise.race([
      discoveryBuffer,
      createTimeoutPromise(timeout).then(() => {
        // Close the socket if timed out
        socket.close();
        throw new Error(`UDP scan timed out after ${timeout}ms.`);
      }),
    ]);
  }

  /**
   * Sends a UDP message using the given parameters
   * @param payload  The payload to send in the UDP message.
   * @param address  The destination address of the UDP message.
   * @param listenPort  The port to listen on for a response, if execting one.
   * @param expectedResponsePackets  The number of responses to save before resolving.
   * @param timeout  How long in ms to wait before timing out the request.
   * @returns  A promise that resolves to the determined `UDPResponse`.
   */
  public async sendUdpMessage(
    payload: Buffer,
    address: string,
    port: number,
    listenPort: number,
    expectedResponsePackets = 0,
    timeout = RADIO_TIMEOUT
  ): Promise<smarthome.DataFlow.UdpResponse> {
    const responsePackets: string[] = [];
    // Open a UDP socket
    const socket = dgram.createSocket('udp4');
    const discoveryBuffer = new Promise<smarthome.DataFlow.UdpResponse>(
      resolve => {
        // Record any UDP messages as responses.
        socket.on('message', msg => {
          responsePackets.push(msg.toString('hex'));
          if (responsePackets.length >= expectedResponsePackets) {
            socket.close();
            resolve(new UdpResponse(responsePackets));
          }
        });
        // Start listening for responses.
        socket.bind(listenPort, () => {
          // Send the UDP message, forwarding the given parameters.
          socket.send(payload, port, address, error => {
            if (error) {
              throw new Error(`Failed to send UDP message: ${error.message}`);
            }
            console.log('Sent UDP message: ', payload);
            if (expectedResponsePackets === 0) {
              // Resolve early if we aren't expecting any response.
              socket.close();
              resolve(new UdpResponse());
            }
          });
        });
      }
    );
    // Timeout if still waiting for a response.
    return Promise.race([
      discoveryBuffer,
      createTimeoutPromise(timeout).then(() => {
        socket.close();
        throw new Error(`UDP send timed out after ${timeout} ms.`);
      }),
    ]);
  }
}
