import { Ticket, TicketType } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes: TicketType[] = await ticketsRepository.getTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getTickets(userId: number): Promise<Ticket & { TicketType: TicketType }> {
  const enrollments = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollments) throw notFoundError();

  const tickets = await ticketsRepository.getTickets(enrollments.id);
  if (!tickets) throw notFoundError();

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

  const response = await ticketsRepository.getTickets(enrollments.id);
  return response;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
  createOrUpdateTickets,
};
