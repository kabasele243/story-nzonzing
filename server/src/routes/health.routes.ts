import { Router, Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { config } from '../config';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  return ResponseUtil.success(res, {
    status: 'ok',
    message: `${config.server.name} is running`,
  });
});

export default router;
