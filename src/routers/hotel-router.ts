import { Router } from 'express';
import { getAllHotels, getHotel } from '@/controllers/hotel-controllet';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getAllHotels).get('/:hotelId', getHotel);

export { hotelRouter };
