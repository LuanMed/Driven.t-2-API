import { notFoundError, requestError, unauthorizedError } from '@/errors';
import { Body } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw requestError(400, 'Bad request');
  console.log(ticketId);
  const payment = await paymentsRepository.getPayment(ticketId);
  console.log(payment);

  // const ownTicket = await paymentsRepository.validarTicketUsuario(ticketId, userId);

  // if (!ownTicket) throw unauthorizedError();

  if (!payment) throw notFoundError();

  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  const ticket = await paymentsRepository.getTicket(enrollments.id);

  if (ticket.id != ticketId) throw unauthorizedError();

  return payment;
}

async function postPayment(body: Body, userId: number) {
  if (!body.cardData || !body.ticketId) throw requestError(400, 'Bad request');

  const ticket = await paymentsRepository.getTicketById(body.ticketId);
  if (!ticket) throw notFoundError();

  const ticketType = await paymentsRepository.getTicketType(ticket.ticketTypeId);

  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  const userTicket = await paymentsRepository.getTicket(enrollments.id);
  console.log(enrollments.userId);
  console.log(userTicket.id);
  console.log(body.ticketId);
  if (userTicket.id != body.ticketId) throw unauthorizedError();
  // const ownTicket = await paymentsRepository.validarTicketUsuario(body.ticketId, userId);

  // if (!ownTicket) throw unauthorizedError();

  await paymentsRepository.postPayment(body, ticketType.price);

  await paymentsRepository.updateTicketStatus(body.ticketId);

  const response = await paymentsRepository.getPayment(body.ticketId);
  return response;
}

export const paymentsService = {
  getPayment,
  postPayment,
};
