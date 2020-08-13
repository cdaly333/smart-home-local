/// <reference types="@google/local-home-sdk" />
/**
 * Interactive stub for the smarthome.DeviceManager class.
 **/
export declare const ERROR_UNEXPECTED_COMMAND_REQUEST = "Unable to process unexpected CommandRequest";
export declare const ERROR_PENDING_REQUEST_MISMATCH = "The pending request did not match the expected value";
export declare class MockDeviceManager implements smarthome.DeviceManager {
    /** Action to call when an `IntentRequest` is marked with `markPending()`.*/
    private markPendingAction;
    /** Map of each expected `CommandRequest` to its associated response.*/
    private expectedCommandToResponse;
    private commandRequestsSent;
    getCommandsSent(): Set<smarthome.DataFlow.CommandRequest>;
    clearCommandsSent(): void;
    wasCommandSent(commandRequest: smarthome.DataFlow.CommandRequest): boolean;
    /**
     * Checks if the next request marked pending matches a given request.
     * @param requestToMatch  A request to compare with the next pending request.
     * @returns  Promise that resolves to true if the requests matched.
     *     If the next pending request doesn't match, the promise will reject.
     */
    doesNextPendingRequestMatch(requestToMatch: smarthome.IntentRequest): Promise<boolean>;
    /**
     * Registers both a command that will be checked against on `send()`, and
     * a corresponding response that will be returned from `send()` on a match.
     * @param expectedCommand  The command to check against incoming commands.
     * @param response  The response to send when an incoming command matches.
     */
    addExpectedCommand(expectedCommand: smarthome.DataFlow.CommandRequest, response: smarthome.DataFlow.CommandBase): void;
    /**
     * Marks a request as pending, conceptually indicating to the platform
     * that the actual operation is still not done.
     * Passes the request to `markPendingAction`
     * @param request  The request to pass into `markPendingAction`
     */
    markPending(request: smarthome.IntentRequest): Promise<void>;
    getProxyInfo(id: string): smarthome.ProxyInfo;
    /**
     * Checks if a given command is registered as an expected command.
     * If a match happens, the associated response is returned.
     * @param command  The command to send and check against expected commands.
     * @returns  Promise that resolves to the expected command's response,
     *     otherwise a `HandlerError`.
     */
    send(command: smarthome.DataFlow.CommandRequest): Promise<smarthome.DataFlow.CommandBase>;
}
