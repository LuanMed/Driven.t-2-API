import { prisma } from '@/config';
import { Body } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function getTicket(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
    },
  });
}

async function getTicketType(id: number) {
  return prisma.ticketType.findFirst({
    where: {
      id,
    },
  });
}

async function validarTicketUsuario(ticketId: number, userId: number) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    select: {
      enrollment: {
        select: {
          user: {
            where: {
              id: userId,
            },
          },
        },
      },
    },
  });

  return !!ticket?.enrollment?.user;
}

async function postPayment(body: Body, value: number) {
  return prisma.payment.create({
    data: {
      ticketId: body.ticketId,
      value,
      cardIssuer: body.cardData.issuer,
      cardLastDigits: body.cardData.number.toString().slice(11),
    },
  });
}

async function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const paymentsRepository = {
  getPayment,
  getTicket,
  getTicketById,
  getTicketType,
  postPayment,
  updateTicketStatus,
  validarTicketUsuario,
};

export default paymentsRepository;
