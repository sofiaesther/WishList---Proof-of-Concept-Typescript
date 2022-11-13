import express from 'express';

import { hasPlatformGender,verifyPlatformGender, hasMovie, hasMovieId } from '../middlewares/movieMiddleware.js';
import { addMovie, getMovie, changeStatus, deleteMovie } from '../controllers/moviesController.js';

const router = express.Router();

router.post('/movie',hasPlatformGender,addMovie);

router.get('/movie', verifyPlatformGender,getMovie);

router.put('/movie', hasMovie, changeStatus);

router.delete('/movie/:id', hasMovieId, deleteMovie)

export default router;