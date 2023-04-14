import { Ticket, TicketType } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.getTicketTypes();
  return ticketTypes;
}

async function getTickets(userId: number): Promise<Ticket & { TicketType: TicketType }> {
  const tickets = await ticketsRepository.getTickets();

  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!tickets || !enrollments) throw notFoundError();
  return tickets;
}

async function createOrUpdateTickets(
  ticketTypeId: number,
  userId: number,
): Promise<Ticket & { TicketType: TicketType }> {
  if (!ticketTypeId) throw requestError(400, 'Bad request');

  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollments) throw notFoundError();

  await ticketsRepository.createOrUpdateTickets(ticketTypeId, userId, enrollments.id);

  const response = await ticketsRepository.getTickets();
  return response;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
  createOrUpdateTickets,
};
