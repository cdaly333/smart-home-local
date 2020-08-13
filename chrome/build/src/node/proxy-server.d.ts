/**
 * A WebSocket server that runs on node to provide radio fulfillment.
 */
export declare class ProxyRadioServer {
    private webSocketServer;
    private nodeRadioController;
    constructor(port?: number);
}
