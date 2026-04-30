class SocketManager {
  private static instance: SocketManager;
  private socket: any; // Using any for abstraction, in real app would be SocketIOClient.Socket

  private constructor() {
    this.socket = null; // Initialize connection logic here
    console.log('SocketManager instance created');
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public emitToRide(rideId: string, event: string, data: any): void {
    console.log(`Emitting to ride ${rideId}:`, event, data);
    if (this.socket) {
      this.socket.emit(event, { rideId, ...data });
    }
  }

  public joinRoom(socket: any, rideId: string): void {
    console.log(`Joining room for ride ${rideId}`);
    if (socket) {
      socket.emit('join', rideId);
    }
  }

  // Helper for actual socket access
  public setSocket(socket: any): void {
    this.socket = socket;
  }

  public getSocket(): any {
    return this.socket;
  }
}

export default SocketManager;
