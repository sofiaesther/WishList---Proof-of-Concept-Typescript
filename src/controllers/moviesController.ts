import {Request, Response} from 'express';
import {addMovieRepository, getMoviesRepository,statusRepository, deleteRepository} from '../repositories/movieRepository.js'
import {Movie} from '../protocols/moviesProtocols.js'
import { QueryResult } from 'pg';

async function addMovie(req:Request, res:Response):Promise<void> {
    const movie:string = req.body.movie;
    const genderId = res.locals.genderId;
    const platformId = res.locals.platformId;
    try {
       await addMovieRepository(movie,genderId,platformId);
       res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
};

async function getMovie(req:Request, res:Response):Promise<Movie[]> {
    const status = req.query.status as unknown as boolean;
    const platform = req.query.platform as string;
    const gender= req.query.gender as string;
    const genderId:number=res.locals.genderId;
    const platformId:number=res.locals.platformId;

    console.log(status)

    try {
        const query:Movie[]= await getMoviesRepository(gender,status,platform);
        res.status(200).send(query);
        return query;
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

async function changeStatus(req:Request, res:Response):Promise<void> {
    const movie: string = req.body.movie;
    const movieId: number = res.locals.movieId;

    try {
        await statusRepository(movieId,movie);
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

async function deleteMovie(req:Request, res:Response):Promise<void> {
    const id = req.params.id as unknown as number;

    try {
        await deleteRepository(id);
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

export{
    addMovie,
    getMovie,
    changeStatus,
    deleteMovie
}