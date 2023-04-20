import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(remote?: string, hotel?: string) {
  // const isRemote = Boolean(remote) || faker.datatype.boolean();
  const isRemote = remote === 'true' ? true : remote === 'false' ? false : faker.datatype.boolean();
  // const includesHotel = Boolean(hotel) || faker.datatype.boolean();
  const includesHotel = hotel === 'true' ? true : hotel === 'false' ? false : faker.datatype.boolean();

  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote,
      includesHotel: includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
