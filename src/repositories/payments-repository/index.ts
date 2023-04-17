import { prisma } from '@/config';
import { Body } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
    },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
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
  getTicketById,
  postPayment,
  updateTicketStatus,
};

export default paymentsRepository;
