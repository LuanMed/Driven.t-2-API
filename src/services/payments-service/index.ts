import { notFoundError, requestError, unauthorizedError } from '@/errors';
import { Body } from '@/protocols';
import paymentsRepository from '@/repositories/payments-repository';

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw requestError(400, 'Bad request');

  const payment = await paymentsRepository.getPayment(ticketId);

  const ticket = await paymentsRepository.getTicketById(ticketId);

  if (!ticket) throw notFoundError();

  const ticketOwnerId = ticket.Enrollment.userId;

  if (ticketOwnerId != userId) throw unauthorizedError();

  return payment;
}

async function postPayment(body: Body, userId: number) {
  if (!body.cardData || !body.ticketId) throw requestError(400, 'Bad request');

  const ticket = await paymentsRepository.getTicketById(body.ticketId);
  if (!ticket) throw notFoundError();

  const ticketOwnerId = ticket.Enrollment.userId;

  if (ticketOwnerId != userId) throw unauthorizedError();

  await paymentsRepository.postPayment(body, ticket.TicketType.price);

  await paymentsRepository.updateTicketStatus(body.ticketId);

  const response = await paymentsRepository.getPayment(body.ticketId);
  return response;
}

export const paymentsService = {
  getPayment,
  postPayment,
};
