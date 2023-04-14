import { Router } from 'express';
import { getPayment, postPayment } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPayment).post('/process', postPayment);

export { paymentsRouter };
