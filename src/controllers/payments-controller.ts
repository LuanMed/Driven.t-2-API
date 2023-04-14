import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticket = req.query.ticketId as Record<string, string>;
  const ticketId = Number(ticket);
  const { userId } = req;

  try {
    const payment = await paymentsService.getPayment(ticketId, userId);
    res.send(payment);
  } catch (error) {
    if (error.name === 'RequestError') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { body, userId } = req;
  console.log(userId);

  try {
    const response = await paymentsService.postPayment(body, userId);
    res.send(response);
  } catch (error) {
    console.log(error);
    if (error.name === 'RequestError') {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
