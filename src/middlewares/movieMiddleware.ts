import {Request,Response,NextFunction} from 'express';
import { Movie } from '../protocols/moviesProtocols.js';
import {QueryResult} from 'pg';
import {checkPlatform,checkGender,checkMovie, addGender, addPlatform, checkMovieId} from '../repositories/movieRepository.js';

async function hasPlatformGender(req:Request, res:Response, next:NextFunction){
    const {gender,platform,movie} : Movie = req.body;

    try {
        console.log(movie)
        const movieId :QueryResult = (await checkMovie(movie)).rows[0];
        if(movieId){
            console.log('entrei')
            return res.status(422).send({ message: "Filme já inserido" });
        }

        const platformQuery:QueryResult= (await checkPlatform(platform));
        let platformId: number;
        if(!platformQuery.rows[0]){
            console.log('aqui')
            addPlatform(platform);
            platformId= (await checkPlatform(platform)).rows[0].id;
        }else{
            platformId= platformQuery.rows[0].id;
        };

        let genderQuery:QueryResult= (await checkGender(gender));
        let genderId:number;
        if(!genderQuery.rows[0]){
            addGender(gender);
            genderId= (await checkGender(gender)).rows[0].id;
        }else{
            genderId= genderQuery.rows[0].id;
        };

        res.locals.genderId = genderId;
        res.locals.platformId = platformId;

        next();
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    };
};

async function verifyPlatformGender(req:Request, res:Response, next:NextFunction){
    const platform = req.query.platform as string;
    const gender= req.query.gender as string;

    console.log(platform, gender)

    try {
        if (platform){
            let platformId: number;

            const platformQuery:QueryResult= (await checkPlatform(platform));
            if(!platformQuery.rows[0]){
                return res.status(422).send({ message: "Não há nenhuma plataforma com esse nome" });
            }else{
                platformId= platformQuery.rows[0].id;
            };
            res.locals.platformId = platformId;
        }
        
        if (gender){
            let genderId:number;
            let genderQuery:QueryResult= (await checkGender(gender));
            if(!genderQuery.rows[0]){
                return res.status(422).send({ message: "Não há nenhum genero com esse nome" });
            }else{
                genderId= genderQuery.rows[0].id;
            };
    
            res.locals.genderId = genderId;

        }

        next();
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    };
}

async function hasMovie(req:Request, res:Response, next:NextFunction) {
    const movie:string = req.body.movie;

        console.log(movie)
        const movieId :QueryResult = (await checkMovie(movie));
        if(!movieId.rows[0]){
            console.log('entrei')
            return res.status(422).send({ message: "Filme não existe" });
        }
        res.locals.movieId= movieId.rows[0].id;
        next();

}
async function hasMovieId(req:Request, res:Response, next:NextFunction) {
    const id = req.params.id as unknown as number;

        const movieId :QueryResult = (await checkMovieId(id));
        if(!movieId.rows[0]){
            return res.status(422).send({ message: "Filme não existe" });
        }
        res.locals.movieId= movieId.rows[0].id;
        next();

}

export{
    hasPlatformGender,
    verifyPlatformGender,
    hasMovie,
    hasMovieId
}