import { Router } from 'express';
import { getTickets, getTicketTypes, postCreateOrUpdateTickets } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTickets)
  .post('/', postCreateOrUpdateTickets);

export { ticketsRouter };
