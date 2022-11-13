import connection from "../database/database.js";
import {QueryResult} from 'pg';
import { Movie } from "../protocols/moviesProtocols.js";

async function addMovieRepository(name: string, genderId: number, platformId:number):Promise<void>{
    const query = `INSERT INTO movies(name,"genderId","platformId") VALUES($1,$2,$3);`;
    try {
        await connection.query(query, [name, genderId, platformId]);
        return;
    } catch (error) {
        console.log(error);
    };
};
async function addPlatform(name: string):Promise<void>{
    const query = `INSERT INTO platforms(name) VALUES($1);`;
    try {
        await connection.query(query, [name]);
        return;
    } catch (error) {
        console.log(error);
    };
};

async function addGender(name: string):Promise<void>{
    const query = `INSERT INTO genders(name) VALUES($1);`;
    try {
        await connection.query(query, [name]);
        return;
    } catch (error) {
        console.log(error);
    };
};


async function checkPlatform(platform: string):Promise<QueryResult>{
    const query = `SELECT id FROM platforms WHERE name=$1 LIMIT 1;`;
    console.log(platform)
    return connection.query(query, [platform]);
};
async function checkGender(gender: string):Promise<QueryResult>{
    const query = `SELECT id FROM genders WHERE name=$1 LIMIT 1;`;
    return connection.query(query, [gender]);
};
async function checkMovie(movie: string):Promise<QueryResult>{
    const query: string = `SELECT id FROM movies WHERE name=$1 LIMIT 1;`;
    return connection.query(query, [movie]);
};
async function checkMovieId(id: number):Promise<QueryResult>{
    const query: string = `SELECT id FROM movies WHERE id=$1 LIMIT 1;`;
    return connection.query(query, [id]);
};

async function getMoviesRepository(gender:string, status:boolean, platform:string):Promise<Movie[]>{
    let conditions: string[] =[];
    let items: (string | boolean)[] =[];
    let count: number =1;
    if (gender){
        conditions.push(`g.name = $${count}`)
        count ++
        items.push(gender);
    }
    if (platform){
        conditions.push(`p.name = $${count}`)
        count ++
        items.push(platform);
    }
    if (status){
        conditions.push(`m.status = $${count}`)
        count ++
        items.push(status);
    }

    let where:string;

    if (conditions.length>0){
        where = `WHERE ${conditions.join(' AND ')}`;
    }

    let query = `SELECT m.id, m.name AS "movie", p.name AS "platform", g.name AS "gender", m.status AS "status" FROM movies m JOIN platforms p ON p.id=m."platformId" JOIN genders g ON g.id=m."genderId"  ${where};`;

    console.log(query)

    const movieList:QueryResult = await (connection.query(query, items));
    return movieList.rows;

};

async function statusRepository(movieId: number, movie: string) {
    const query: string = `UPDATE movies SET status = true WHERE id = $1 AND name= $2;`
    return connection.query(query,[movieId,movie])
}

async function deleteRepository(movieId: number) {
    const query: string = `DELETE FROM movies WHERE id = $1;`
    return connection.query(query,[movieId])
}

export{
    addMovieRepository,
    checkPlatform,
    checkGender,
    checkMovie,
    addGender,
    addPlatform,
    getMoviesRepository,
    statusRepository,
    checkMovieId,
    deleteRepository
}