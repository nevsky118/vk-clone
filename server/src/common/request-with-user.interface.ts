import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    email: string;
    sub: string;
    iat: number;
    exp: number;
  };
}

export default RequestWithUser;
