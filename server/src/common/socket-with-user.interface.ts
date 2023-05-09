import { Socket } from 'socket.io';

interface SocketWithUser extends Socket {
  user: {
    email: string;
    sub: string;
    iat: number;
    exp: number;
  };
}

export default SocketWithUser;
