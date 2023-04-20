import { prisma } from '@/config';

async function getEnrollmentUserTicket(userId: number) {
  return await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    include: {
      User: {
        select: {
          id: true,
          email: false,
          password: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      Ticket: {
        include: {
          TicketType: true,
        },
      },
    },
  });
}

async function getAllHotels() {
  return await prisma.hotel.findMany();
}

async function getRooms(id: number) {
  return await prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  getEnrollmentUserTicket,
  getAllHotels,
  getRooms,
};

export default hotelRepository;
