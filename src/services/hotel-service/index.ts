import { notFoundError, paymentRequiredError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getAllHotels(userId: number) {
  const user = await hotelRepository.getEnrollmentUserTicket(userId);
  const hotels = await hotelRepository.getAllHotels();

  const ticket = user?.Ticket[0];

  if (!user || !ticket || !hotels) throw notFoundError();

  if (ticket.status == 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw paymentRequiredError();

  return hotels;
}

async function getHotel(userId: number, hotelId: number) {
  const user = await hotelRepository.getEnrollmentUserTicket(userId);
  const rooms = await hotelRepository.getRooms(hotelId);

  const ticket = user?.Ticket[0];

  if (!user || !ticket || !rooms) throw notFoundError();

  if (ticket.status == 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw paymentRequiredError();

  return rooms;
}

export const hotelService = {
  getAllHotels,
  getHotel,
};
