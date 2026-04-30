import { useSocketContext } from '../context/SocketContext';


export const useSocket = () => {
  const { socket } = useSocketContext();

  const emit = (event: string, data: any) => {
    if (socket) socket.emit(event, data);
  };

  const subscribe = (event: string, callback: (...args: any[]) => void) => {
    if (!socket) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  return { socket, emit, subscribe };
};
