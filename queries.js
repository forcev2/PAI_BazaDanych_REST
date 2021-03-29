const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Wypo',
  password: 'TajneHaslo123',
  port: 5432,
})

const getUserById = (request, result) => {
    const id = parseInt(request.params.user_id);
    pool.query('SELECT * FROM public.user WHERE user_id = $1', [id], (error, results) => {
        if(error){
            throw error;
        }

        //response.status(200).json(results.rows);
        return result(results.rows);
    })
}

const createUser = (request, results) => {
    console.log(request.body);
    const { name, surname, username, email, company, password } = request.body
    const resultBody = {usernameTaken:false, emailTaken:false, finalized:false};
  
    checkIfUsernameExist(username, (result) =>{
        resultBody.usernameTaken = result;
        checkIfEmailExist(email, (result) =>{
            resultBody.emailTaken = result;
            if(!resultBody.emailTaken && !resultBody.usernameTaken){
                pool.query(
                    'INSERT INTO public.user (name, surname, username, email, company, password) VALUES ($1, $2, $3, $4, $5, $6)',
                     [name, surname, username, email, company, password], (error, results) => {
                    if (error) {
                        throw error
                    }
                    //response.status(201).send(`User added with ID: ${result.insertId}`)
                    console.log(results);
                    return results(resultBody);
                })
            }
            else{
                return results(resultBody);
            }
        })
    })
  }

const checkIfUsernameExist = (request, result) => {
    const username = request;
    pool.query('SELECT * FROM public.user WHERE username=$1', [username], (error, results) => {
        if(error){
            throw error;
        }

        if(results == null){
            return result(false);
        }
        else{
            return result(true);
        }
    })
}

const checkIfEmailExist = (request, result) => {
    const email = request;
    pool.query('SELECT * FROM public.user WHERE email=$1', [email], (error, results) => {
        if(error){
            throw error;
        }
        if(results == null){
            return result(false);
        }
        else{
            return result(true);
        }
    })
}

const getCarsBySearch = (request, response) => {
    const {place, type, dateStart, dateEnd } = request.body;

    console.log(request.body);

    pool.query("SELECT car_id FROM public.car WHERE type_id=$2 AND place_id IN (SELECT place_id FROM public.place WHERE address LIKE LOWER('%$1%'))",
        [place, type], 
        (error, results) => {
            if(error){
                throw error;
            }


            pool.query("SELECT * FROM public.car WHERE"+
                " NOT EXISTS (SELECT * FROM public.rental as r WHERE (r.start, r.end) OVERLAPS ($1::DATE, $2::DATE) AND car_id IN ($3))",
                [dateStart, dateEnd, results.rows],
                (error, resultsFinal) => {
                    if(error){
                        throw error;
                    }
    
                    response.status(200).json(resultsFinal.rows);
            })

        }
        )
}

const getUserRental = (request, result) => {
    const user_id = request.body.user_id

    pool.query("SELECT c.nazwa, c.marka, c.model, r.price, s.status, r.start, r.end, r.rental_date  FROM public.rental as r JOIN public.car as c ON r.car_id=c.car_id NATURAL JOIN public.status as s WHERE user_id=$1",
        [user_id],
        (error, results) => {
            if(error){
                throw error;
            }

            console.log(results.rows);
            return result(results.rows);
        }
    )
}

const addRental = (request, result) => {
    const {user_id, car_id, start_date, end_date, rental_date, price} = request.body;
    
    pool.query("INSERT INTO public.rental(user_id, car_id, status_id, start, end, rental_date, price) VALUES ( $1, $2, $3, $4, $5, $6, $7)",
        [user_id, car_id, 1, start_date, end_date, rental_date, price],
        (error, results) => {
            if(error){
                throw error;
            }

            console.log(results.rows);
            return result(results.rows);
        }
    );
}

const getAllRental = (request, response) => {
    pool.query("SELECT c.nazwa, c.marka, c.model, r.price, s.status, r.start, r.end, r.rental_date, u  FROM public.rental as r JOIN public.car as c ON r.car_id=c.car_id NATURAL JOIN public.status as s NATURAL JOIN public.user as u",
        (error, results) => {
            if(error){
                throw error;
            }

            console.log(results.rows);
            response.status(200).json(results.rows);
        }
    );
}

const changeRentalStatus = (request, result) => {
    const {rental_id, status_id} = request;
    const changed = {correct:true};

    pool.query("UPDATE public.rental SET status_id=$2 WHERE rental_id=$1", [rental_id, status_id],
        (error, results) => {
            if(error){
                throw error;
            }

            return result(changed);
        }
     );
}

const changeRentalDates = (request, result) => {
    const {rental_id, start_date, end_date} = request.body

    pool.query("UPDATE public.rental SET start=$2 , end=$3 WHERE rental_id=$1", [rental_id, start_date, end_date],
        (error, results) => {
            if(error){
                throw error;
            }

            console.log(results.rows);
            return result(results.rows);
        }
     );
}


module.exports = {
    getUserById,
    createUser,
    getCarsBySearch,
    getUserRental,
    addRental,
    getAllRental,
    changeRentalStatus,
    changeRentalDates
  }