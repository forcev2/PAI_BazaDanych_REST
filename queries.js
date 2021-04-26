const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Wypo',
    password: 'TajneHaslo123',
    port: 5432,
})

const getUserById = (user_id) => {
    return new Promise((resolve, reject) => {
        const id = parseInt(user_id);
        pool.query('SELECT * FROM public.user WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                throw error;
            }
            //response.status(200).json(results.rows);
            return resolve(results.rows);
        })
    })
}

const getUserByUsername = (usernamePassed) => {
    return new Promise((resolve, reject) => {
        const username = usernamePassed;
        pool.query('SELECT * FROM public.user WHERE username = $1', [username], (error, results) => {
            if (error) {
                throw error;
            }

            //response.status(200).json(results.rows);
            return resolve(results.rows);
        })
    })
}

const createUser = (user, result) => {
    return new Promise((resolve, reject) => {
        console.log(user);
        const { name, surname, username, email, company, password } = user
        const finalized = false;

        pool.query(
            'INSERT INTO public.user (name, surname, username, email, company, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6, false)',
            [name, surname, username, email, company, password], (error, results) => {
                if (error) {
                    throw error
                }

                console.log(results.rows);
                return resolve(finalized);
            })
    })
}

const checkIfUsernameExist = (request, result) => {
    return new Promise((resolve, reject) => {
        const username = request;
        //console.log("Checking if usernameExist");
        pool.query('SELECT * FROM public.user WHERE username=$1', [username], (error, results) => {
            if (error) {
                throw error;
            }
            console.log("Checking if usernameExist", results.rows);
            if (results.rows.length == 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
    })
}

const checkIfEmailExist = (request, result) => {
    return new Promise((resolve, reject) => {
        const email = request;
        //console.log("Checking if emailExit");
        pool.query('SELECT * FROM public.user WHERE email=$1', [email], (error, results) => {
            if (error) {
                throw error;
            }
            console.log("Checking if emailExit", results.rows);
            if (results.rows.length == 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
    })
}

const getCarsBySearch = (request, result) => {
    const { place, type, dateStart, dateEnd } = request;

    console.log(dateStart, dateEnd);

    console.log(request);


    pool.query("SELECT car_id FROM public.car WHERE type_id=$2 AND place_id IN (SELECT place_id FROM public.place WHERE address LIKE $1)",
        [place.toLowerCase(), type],
        async (error, results) => {
            if (error) {
                throw error;
            }
            console.log("Car ", results.rows);
            var carIds = results.rows.map((item) => {
                return parseInt(item['car_id']);
            })

            var type_name = await getTypeFromId(type);

            console.log(carIds);

            var resultArray = [];
            var index = 0;

            var getAll = new Promise((resolve, reject) => {
                for (let id of carIds) {
                    pool.query("SELECT type_id, car_id, nazwa, marka, model, opis, place_id, price, regexp_replace(encode(photo, 'base64'), '\r|\n', '', 'g') as image, type" +
                        "  FROM public.car NATURAL JOIN public.type WHERE" +
                        " NOT EXISTS (SELECT * FROM public.rental as r WHERE (r.start, r.end) OVERLAPS ($1::DATE, $2::DATE) AND car_id = $3) AND type_id = $4 AND car_id = $3",
                        [dateStart, dateEnd, id, type],
                        (error, resultsFinal) => {
                            if (error) {
                                throw error;
                            }
                            console.log("index: ", index, id)
                            if (resultsFinal.rows.length > 0) {
                                console.log("GOOD CAR PUSH TO ARRAY ", resultsFinal.rows[0].car_id)

                                resultArray.push(resultsFinal.rows[0])
                            }
                            //response.status(200).json(resultsFinal.rows);
                            if (index === carIds.length - 1) resolve();

                            index++;
                        })   
                }
            });

            /*
            var getAll = new Promise((resolve, reject) => {
                carIds.forEach((id, index, array ) => {
                    pool.query("SELECT type_id, car_id, nazwa, marka, model, opis, place_id, price, regexp_replace(encode(photo, 'base64'), '\r|\n', '', 'g') as image, type" +
                        "  FROM public.car NATURAL JOIN public.type WHERE" +
                        " NOT EXISTS (SELECT * FROM public.rental as r WHERE (r.start, r.end) OVERLAPS ($1::DATE, $2::DATE) AND car_id = $3) AND type_id = $4 AND car_id = $3",
                        [dateStart, dateEnd, id, type],
                        (error, resultsFinal) => {
                            if (error) {
                                throw error;
                            }
                            console.log("index: ", index)
                            if (resultsFinal.rows.length > 0) {
                                console.log("GOOD CAR PUSH TO ARRAY ", resultsFinal.rows[0].car_id)

                                resultArray.push(resultsFinal.rows[0])
                            }
                            //response.status(200).json(resultsFinal.rows);
                            if (index === array.length -1) resolve();
                        })
                });
                //resolve();
            });
            */
            getAll.then(() => {
                console.log("WAIKTED FOR FOREACH ", resultArray.length);
                return result({ result: resultArray, type: type_name });
            })



            //console.log(resultArray)
            //return result({ result: resultArray, type: type_name });

        }
    )
}

const getUserRental = (request, result) => {
    const user_id = request.user.user_id;

    console.log(user_id);

    pool.query("SELECT r.rental_id, c.nazwa, c.marka, c.model, r.price, s.status, r.start, r.end, r.rental_date  FROM public.rental as r JOIN public.car as c ON r.car_id=c.car_id NATURAL JOIN public.status as s WHERE user_id=$1",
        [user_id],
        (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows);
            return result(results.rows);
        }
    )
}

const getTypeFromId = (type_id, result) => {
    console.log(type_id)
    return new Promise((resolve, reject) => {
        pool.query("SELECT t.type FROM public.type as t WHERE t.type_id = $1",
            [type_id],
            (error, results) => {
                if (error) {
                    throw error;
                }
                console.log(results.rows[0])
                resolve(results.rows[0]);
            }
        )
    })
}

const addRental = (user_id, car_id, start_date, end_date, rental_date, price, result) => {

    pool.query("INSERT INTO public.rental(user_id, car_id, status_id, start, \"end\", rental_date, price) VALUES ( $1, $2, $3, $4, $5, $6, $7)",
        [user_id, car_id, 1, start_date, end_date, rental_date, price],
        (error, results) => {
            if (error) {
                throw error;
            }

            console.log(results.rows);
            return result(results.rows);
        }
    );
}

const getAllRental = (request, result) => {
    pool.query("SELECT r.rental_id, c.nazwa, c.marka, c.model, r.price, s.status, r.start, r.end, r.rental_date, " +
        "u.user_id, u.name, u.surname, u.username, u.email, u.company " +
        " FROM public.rental as r JOIN public.car as c ON r.car_id=c.car_id NATURAL JOIN public.status as s NATURAL JOIN public.user as u",
        (error, results) => {
            if (error) {
                throw error;
            }

            console.log(results.rows);
            return result(results.rows);
        }
    );
}

const changeRentalStatus = (request, result) => {
    const { rental_id, status_id } = request;
    const changed = { correct: true };

    pool.query("UPDATE public.rental SET status_id=$2 WHERE rental_id=$1", [rental_id, status_id],
        (error, results) => {
            if (error) {
                throw error;
            }

            return result(changed);
        }
    );
}

const changeRentalDates = async (request, result) => {
    const { rental_id, start, end } = request.body

    console.log(rental_id, start, end);

    const car_id = await getCarIdFromRentId(rental_id, result);
    const isAvaible = await checkIfRentalDatesAreAvaible(car_id, start, end, rental_id, result);
    if (!isAvaible) {
        return result(false);
    }
    else {
        pool.query("UPDATE public.rental SET start=$2::DATE, \"end\"=$3::DATE WHERE rental_id=$1", [rental_id, start, end],
            (error, results) => {
                if (error) {
                    throw error;
                }

                return result(true);
            }
        );
    }

}

const getCarPrice = (car_id) => {

    console.log("Inside car id : ", car_id)
    return new Promise((resolve, reject) => {
        pool.query("SELECT price FROM public.car as c WHERE c.car_id = $1",
            [car_id],
            (error, results) => {
                if (error) {
                    throw error;
                }

                console.log("car price = ", results.rows[0].price);

                return resolve(results.rows[0].price);
            }
        );
    })
}


const getCarIdFromRentId = (rental_id, result) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT car_id FROM public.rental as r WHERE rental_id = $1",
            [rental_id],
            (error, results) => {
                if (error) {
                    throw error;
                }

                console.log("car id = ", results.rows[0].car_id);

                return resolve(results.rows[0].car_id);
            }
        );
    })
}


const rentalBelongsToUser = (user_id, rental_id, result) => {
    return new Promise((resolve, reject) => {
        console.log(user_id, rental_id)
        pool.query("SELECT * FROM public.rental as r WHERE r.user_id = $1 AND r.rental_id = $2",
            [user_id, rental_id],
            (error, results) => {
                if (error) {
                    throw error;
                }

                if (results.rows.length > 0)
                    resolve(true)
                else
                    resolve(false)
            })
    })
}


const checkIfRentalDatesAreAvaible = (car_id, start, end, rental_id, result) => {
    return new Promise((resolve, reject) => {
        console.log(car_id, start, end);
        //SELECT * FROM public.rental as r WHERE (r.start, r.end) OVERLAPS ('2020-09-08'::DATE, '2021-03-29'::DATE) AND car_id = 1;
        pool.query("SELECT * FROM public.rental as r WHERE (r.start, r.end) " +
            "OVERLAPS ($2::DATE, $3::DATE) AND car_id = $1 AND rental_id != $4",
            [car_id, start, end, rental_id],
            (error, results) => {
                if (error) {
                    throw error;
                }

                console.log("Overlapping ", results.rows.length == 0);

                return resolve(results.rows.length == 0);
            }
        );
    })
}


module.exports = {
    getUserById,
    getUserByUsername,
    createUser,
    getCarsBySearch,
    getUserRental,
    addRental,
    getAllRental,
    changeRentalStatus,
    changeRentalDates,
    checkIfEmailExist,
    checkIfUsernameExist,
    rentalBelongsToUser,
    getTypeFromId,
    getCarPrice,
}