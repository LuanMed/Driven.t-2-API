import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const tickets = await ticketsService.getTickets(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postCreateOrUpdateTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketTypeId: number = req.body.ticketTypeId;
  try {
    const response = await ticketsService.createOrUpdateTickets(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    if (error.name === 'RequestError') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
