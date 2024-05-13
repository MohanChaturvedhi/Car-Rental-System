const pg = require("pg");
const path = require("path");
const bcrypt = require("bcryptjs");
const mailer = require("../utilities/mailer.js");
require('dotenv').config({ path: path.join(__dirname, "..", ".env") });
const client = new pg.Client(process.env.CONNECTION_STRING);
const randomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);

module.exports = {
    client: client,
    connect: async () => {
        try {
            await client.connect();
        } catch(err) {
            console.log(err);
        }
    },
    query: async () => {
        const query = "SELECT * FROM USERS";
        const result = await client.query(query);
        console.log(result.rows);
    },
    createUserTable: async () => {
        try {
            const query = `
                CREATE TABLE users (
                    userid bigserial primary key,
                    email varchar(64) not null unique,
                    name varchar(64) not null,
                    password varchar(64) not null,
                    isverified boolean not null,
                    dateJoined varchar(64) not null,
                    balance bigserial not null
                );`;
            await client.query(query);
                
        } catch(err) {
            throw err;
        }
    },
    createCarTable: async () => {
        try {
            const query = `
                CREATE TABLE cars (
                    carId bigserial primary key,
                    carName varchar(64) not null unique,
                    baseAmount integer not null,
                    rupeePerKm integer not null,
                    rupeePerHour integer not null,
                    imageLink text not null,
                    price integer not null
                );`;
                await client.query(query);
                
        } catch(err) {
            throw err;
        }
    },
    createInventoryTable: async () => {
        try {
            const query = `
                CREATE TABLE inventory (
                    carId bigserial not null,
                    numberPlate varchar(12) primary key,
                    carType carTypeEnum,
                    carStatus carStatusEnum,
                    mileMeterReading integer not null,
                    maintainenceExpense integer not null,
                    constraint fk_car_id FOREIGN KEY(carId) REFERENCES cars(carId)
                );`;
            await client.query(query);
                
        } catch(err) {
            throw err;
        }
    },
    createRentTable: async () => {
        try {
            const query = `
                CREATE TABLE rents (
                    rentId bigserial primary key,
                    userId bigserial not null,
                    numberPlate varchar(12) not null,
                    expectedReturn varchar(64) not null,
                    mileMeterStart integer not null,
                    rentedOn varchar(32) not null,
                    rentStatus rentStatusEnum,
                    constraint fk_user_id_rent FOREIGN KEY(userId) REFERENCES users(userId),
                    constraint fk_numberPlate_id_rent FOREIGN KEY(numberPlate) REFERENCES inventory(numberPlate)
                );`;
            await client.query(query);
                
        } catch(err) {
            throw err;
        }
    },
    createReturnTable: async () => {
        try {
            const query = `
                CREATE TABLE return (
                    rentId bigserial primary key,
                    numberPlate varchar(12) not null,
                    mileMeterEnd integer not null,
                    returnedOn varchar(32) not null,
                    gasConsumed integer not null,
                    amountPaid integer not null,
                    amountRefunded integer not null,
                    constraint fk_rentId_return FOREIGN KEY(rentId) REFERENCES rents(rentId),
                    constraint fk_numberPlate_return FOREIGN KEY(numberPlate) REFERENCES inventory(numberPlate)
                );`;
            await client.query(query);
                
        } catch(err) {
            throw err;
        }
    },
    createEnums: async () => {
        try {
            const query1 = `CREATE TYPE carStatusEnum AS ENUM('available', 'rented', 'repaired');`;
            const query2 = `CREATE TYPE carTypeEnum AS ENUM('AC', 'NONAC');`;
            const query3 = `CREATE TYPE rentStatusEnum AS ENUM('active', 'requestedToReturn', 'returned');`;
            await client.query(query1);
            await client.query(query2);
            await client.query(query3);
        
        } catch(err) {
            throw err;
        }
    },
    dropUserTable: async () => {
        const query = `DROP table users;`;
        await client.query(query);
    
    },
    dropCarTable: async () => {
        const query = `DROP table cars`;
        await client.query(query);
    
    },
    dropInventoryTable: async () => {
        const query = `DROP table inventory`;
        await client.query(query);
    
    },
    dropRentTable: async () => {
        const query = `DROP table rents;`;
        await client.query(query);
    
    },
    dropReturnTable: async () => {
        const query = `DROP table return;`;
        await client.query(query);
    
    },
    dropEnums: async () => {
        const query1 = `DROP TYPE carStatusEnum;`;
        const query2 = `DROP TYPE carTypeEnum;`;
        const query3 = `DROP TYPE rentStatusEnum;`;
        // await client.query(query1);
        // await client.query(query2);
        await client.query(query3);
    
    },
    deleteAllTables: async () => {
        const query = `
            DELETE FROM users;
            DELETE FROM cars;
            DELETE FROM inventory;
            DELETE FROM rents;
            DELETE FROM return;
        `;
        await client.query(query);
    
    },
    createUser: async (email, hashedPassword, name) => {
        try {
            const query1 = `SELECT * FROM users WHERE email = '${email}'`;
            const result1 = await client.query(query1);
            if(result1.rows.length === 1) {
                if(result1.rows[0].isverified === true) {
                    return { 
                        info: "Account with this email already exists, please try with another email", 
                        status: "info", 
                        title: "Account already exists" 
                    };
                } else {
                    await mailer.sendVerificationLink(result1.rows[0].id, result1.rows[0].email, result1.rows[0].name);
                    return { 
                        info: "Account with this email already exists, please click on the verification link sent to your email to continue login", 
                        status: "info", 
                        title: "Account already exists" 
                    };
                }
            }
            const query2 = `INSERT INTO users(name, email, password, isverified, dateJoined, balance) VALUES('${name}', '${email}', '${hashedPassword}', false,'${Date.now()}', 0)`;
            await client.query(query2);
            const query3 = `SELECT userid FROM users WHERE email = '${email}'`;
            const result3 = await client.query(query3);
            const userid = parseInt(result3.rows[0].userid);
            await mailer.sendVerificationLink(userid, email, name);
            return { 
                info: "Account successfully created, please click on the verification link sent to your email to continue login", 
                status: "success", 
                title: "Account successfully created" 
            };
        } catch(err) {
            throw err;
        }
    },
    updateUserVerificationStatus: async email => {
        try {
            const query1 = `SELECT * FROM users WHERE email = '${email}'`;
            const result1 = await client.query(query1);
            if(result1.rows[0].isverified === true) {
            
                return { 
                    info: `Hi ${result1.rows[0].name}, you can now use your credentials to login`, 
                    status: "info", 
                    title: "Account already verified" 
                };
            }
            const query2 = `UPDATE users SET isverified = true WHERE email = '${email}'`;
            await client.query(query2);
        
            return { 
                info: `Hi ${result1.rows[0].name}, you can now use your credentials to login`, 
                status: "info", 
                title: "Account verification successful" 
            };
        } catch(err) {
            throw err;
        } 
    },
    checkUser: async (email, password) => {
        try {
            const query = `SELECT * FROM users WHERE email = '${email}'`;
            const result = await client.query(query);
            if(result.rows.length === 0 || !await bcrypt.compare(password, result.rows[0].password)) {
                return { 
                    info: "Invalid credentials", 
                    status: "error", 
                    title: "Error" 
                };
            } else if(result.rows[0].isverified === false) {
                await mailer.sendVerificationLink(result.rows[0].id, result.rows[0].email, result.rows[0].name);
                return { 
                    info: "User is not verified, but dont worry we have sent you a verification mail to your email", 
                    status: "warning", 
                    title: "Not verified" 
                };
            }
            result.rows[0].datejoined = new Date(parseInt(result.rows[0].datejoined));
            result.rows[0].datejoined = result.rows[0].datejoined.toLocaleDateString("en-AU");
            return { 
                info: "Login Successful", 
                status: "success", 
                title: "Login Successful", 
                data: {
                    userid:  result.rows[0].userid,
                    email: result.rows[0].email,
                    name: result.rows[0].name,
                    isverified: result.rows[0].isverified,
                    datejoined: result.rows[0].datejoined,
                    balance: result.rows[0].balance
                }
            };
        } catch(err) {
            throw err;
        }
    },
    getUserDetailsFromEmail: async email => {
        try {
            const query = `SELECT * FROM users WHERE email = '${email}'`;
            const result = await client.query(query);
            if(result.rows[0] == undefined) {
            
                return { 
                    userid: null, 
                    email: null
                };
            }
        
            return result.rows[0];
        } catch(err) {
            throw err;
        }
    },
    changeUserPassword: async (userid, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const query = `UPDATE users SET password = '${hashedPassword}' WHERE userid = ${userid}`;
            await client.query(query);
        
            return { 
                info: "Password reset successful", 
                status: "success", 
                title: "Success"
            };
        } catch(err) {
            throw err;
        }
    },
    getCars: async (carName, type, lowerBound, upperBound) => {
        try {
            const query1 = `
                SELECT 
                    cars.carId carId,
                    cars.carName carName,
                    cars.baseAmount baseAmount,
                    cars.rupeePerKm rupeePerKm,
                    cars.rupeePerHour rupeePerHour,
                    cars.imageLink imageLink,
                    COUNT(*) availablity,
                    inventory.carType carType
                FROM 
                    cars INNER JOIN inventory
                ON 
                    cars.carId = inventory.carId
                WHERE
                    inventory.carStatus = 'available' AND 
                    carType = 'AC' AND
                    ${lowerBound + ` <= baseAmount * 1.5 AND 1.5 * baseAmount <= ` + upperBound} AND 
                    UPPER(carName) LIKE UPPER('%${carName}%')
                GROUP BY
                    cars.carId, inventory.carType;`;
            const result1 = await client.query(query1);
            const query2 = `
                SELECT 
                    cars.carId carId,
                    cars.carName carName,
                    cars.baseAmount baseAmount,
                    cars.rupeePerKm rupeePerKm,
                    cars.rupeePerHour rupeePerHour,
                    cars.imageLink imageLink,
                    COUNT(*) availablity,
                    inventory.carType carType
                FROM 
                    cars INNER JOIN inventory
                ON 
                    cars.carId = inventory.carId
                WHERE
                    inventory.carStatus = 'available' AND 
                    carType = 'NONAC' AND
                    ${lowerBound + ` <= baseAmount AND baseAmount <= ` + upperBound} AND 
                    UPPER(carName) LIKE UPPER('%${carName}%')
                GROUP BY
                    cars.carId, inventory.carType;`;
            const result2 = await client.query(query2);
            let result;
            if(type === "AC") {
                result = result1.rows;
            } else if(type === "NONAC") {
                result = result2.rows;
            } else {
                result = [...result1.rows, ...result2.rows];
            }
            return {
                status: "success",
                title: "Success",
                info: "Inventory fetched successfully",
                data: result
            };
        } catch(err) {
            throw err;
        }
    },
    rentCar: async (carId, expectedReturn, userid, carType) => {
        try {
            const query1 = `
                SELECT
                    cars.carId carId,
                    cars.baseAmount baseAmount,
                    inventory.numberPlate numberPlate,
                    inventory.mileMeterReading milemeterStart
                FROM
                    cars INNER JOIN inventory
                ON
                    cars.carId = inventory.carId
                WHERE
                    inventory.carStatus = 'available' AND
                    cars.carId = ${carId}
                LIMIT
                    1
            ;`;
            const result1 = await client.query(query1);
            if(result1.rows.length === 0) {
                return {
                    status: "info",
                    title: "Info",
                    info: "Car is not available"
                }
            }
            const query2 = `SELECT balance FROM users WHERE userId = ${userid};`;
            const result2 = await client.query(query2);
            if(parseInt(result2.rows[0].balance) < Math.floor(carType === "AC" ? parseInt(result1.rows[0].baseamount) * 1.5 : parseInt(result1.rows[0].baseamount))) {
                return {
                    status: "warning",
                    title: "warning",
                    info: "Out of money, recharge your money in profile page"
                }
            }
            const query3 = `UPDATE users SET balance = ${parseInt(result2.rows[0].balance) - Math.floor(carType === "AC" ? parseInt(result1.rows[0].baseamount) * 1.5 : parseInt(result1.rows[0].baseamount))} WHERE userid = ${userid};`;
            await client.query(query3);
            const query4 = `UPDATE inventory SET carStatus = 'rented' WHERE numberPlate = '${result1.rows[0].numberplate}';`;
            await client.query(query4);
            const query5 = `INSERT INTO RENTS(userid, numberPlate, expectedReturn, mileMeterStart, rentedOn, rentStatus) VALUES (${userid}, '${result1.rows[0].numberplate}', '${expectedReturn}', ${result1.rows[0].milemeterstart}, '${Date.now()}', 'active');`;
            await client.query(query5);
            return {
                status: "success",
                info: "Car Successfully rented",
                title: "Success"
            }
        } catch(err) {
            throw err;
        }
    },
    getUserRentedCars: async userid => {
        try {
            const query = `
                SELECT 
                    * 
                FROM 
                    cars 
                INNER JOIN 
                    inventory ON cars.carId = inventory.carId 
                INNER JOIN 
                    rents ON inventory.numberPlate = rents.numberPlate
                WHERE 
                rents.userid = ${userid} AND
                rents.rentStatus != 'returned'
            ;`;
                const result = await client.query(query);
                for(let row of result.rows) {
                    const tempDate = new Date(parseInt(row.rentedon));
                    row.rentedon = tempDate.toLocaleDateString("en-AU");
                    if(row.cartype === "AC") {
                        row.baseamount = 1.5 * parseInt(row.baseamount);
                        row.rupeeperkm = 1.5 * parseInt(row.rupeeperkm);
                        row.rupeeperhour = 1.5 * parseInt(row.rupeeperhour);
                    }
                }
            
                return {
                    status: "success",
                    title: "Success",
                    info: "Rented cars fetched successfully",
                    data: result.rows
                };
        } catch(err) {
            throw err;
        }
    },
    getUserReturnedCars: async userid => {
        try {
            const query = `
                SELECT 
                    *
                FROM cars
                    INNER JOIN inventory ON
                    cars.carId = inventory.carId
                    INNER JOIN rents ON
                    inventory.numberPlate = rents.numberPlate
                    INNER JOIN return ON
                    rents.rentId = return.rentId
                WHERE
                    rents.userId = ${userid}
            ;`;
            const result = await client.query(query);
            for(let row of result.rows) {
                const tempDate1 = new Date(parseInt(row.rentedon));
                row.rentedon = tempDate1.toLocaleDateString("en-AU");
                const tempDate2 = new Date(parseInt(row.returnedon));
                row.returnedon = tempDate2.toLocaleDateString("en-AU");
                if(row.cartype === "AC") {
                    row.baseamount = 1.5 * parseInt(row.baseamount);
                    row.rupeeperkm = 1.5 * parseInt(row.rupeeperkm);
                    row.rupeeperhour = 1.5 * parseInt(row.rupeeperhour);
                }
            }
        
            return {
                status: "success",
                title: "Success",
                info: "Returned cars fetched successfully",
                data: result.rows
            };
        } catch(err) {
            throw err;
        }
    },
    getCarData: async availablity => {
        try {
            const query1 = `
                SELECT
                    *
                FROM 
                    (SELECT 
                        SUM(return.gasConsumed) totalGasConsumed,
                        SUM(return.amountPaid) revenueEarned,
                        rents.numberPlate numberPlate
                    FROM
                        rents INNER JOIN return ON
                        rents.rentId = return.rentId
                    GROUP BY
                        rents.numberPlate) a
                RIGHT JOIN
                    (SELECT
                        *
                    FROM
                        cars INNER JOIN inventory ON
                        cars.carId = inventory.carId
                    WHERE
                        ${availablity ? "availablity = " + availablity : "true"}) b
                ON a.numberPlate = b.numberPlate
            ;`;
            const query2 = `
                SELECT 
                    COUNT(*) numberofrents,
                    inventory.numberplate numberplate
                FROM
                    rents INNER JOIN inventory ON
                    rents.numberplate = inventory.numberplate
                GROUP BY
                    inventory.numberplate
            ;`;
            const result1 = await client.query(query1);
            const result2 = await client.query(query2);
            let totalRents = 0;
            for(let item of result2.rows) {
                totalRents += parseInt(item.numberofrents);
            }
            for(let item1 of result1.rows) {
                for(let item2 of result2.rows) {
                    if(item1.numberplate === item2.numberplate) {
                        item1.demand = (totalRents === 0 ? 0 : (parseInt(item2.numberofrents) * 100 / totalRents).toFixed(2));
                    }
                }
                item1.demand |= 0;
            }
        
            return {
                status: "success",
                info: "Inventory successfully fetched",
                title: "Success",
                data: result1.rows
            }
        } catch(err) {
            throw err;
        }
    },
    deleteInventoryItem: async numberPlate => {
        try {
            const query1 = `SELECT carId FROM inventory WHERE numberPlate = '${numberPlate}';`;
            const result1 = await client.query(query1);
            const carId = result1.rows[0].carid;
            const query2 = `DELETE FROM return WHERE numberPlate = '${numberPlate}';`;
            await client.query(query2);
            const query3 = `DELETE FROM rents WHERE numberPlate = '${numberPlate}'`;
            await client.query(query3);
            const query4 = `DELETE FROM inventory WHERE numberPlate = '${numberPlate}';`;
            await client.query(query4);
            const query5 = `SELECT price FROM cars WHERE carId = ${carId};`;
            const result5 = await client.query(query5);
            const price = parseInt(result5.rows[0].price);
            const returnMoney = randomInRange(Math.floor(price / 2), price);
        
            return {
                status: "success",
                info: `Car condemned and sold off successfully and got ${returnMoney} in return`,
                title: "Success",
            }
        } catch(err) {
            throw err;
        }
    },
    repairCar: async numberPlate => {
        try {
            const query = `UPDATE inventory SET carStatus = 'repaired' WHERE numberPlate = '${numberPlate}';`;
            await client.query(query);
        
            return {
                status: "success",
                info: "Car Successfully sent to repair",
                title: "Success"
            }
        } catch(err) {
            throw err;
        }
    },
    retrieveCar: async numberPlate => {
        try {
            const query1 = `
                SELECT 
                    cars.baseAmount 
                FROM 
                    cars INNER JOIN inventory ON
                    cars.carId = inventory.carId
                WHERE 
                    inventory.numberPlate = '${numberPlate}'
                ;`;
            const result1 = await client.query(query1);
            const baseAmount = parseInt(result1.rows[0].baseamount);
            const cost = randomInRange(baseAmount / 2, baseAmount);
            const query2 = `
                UPDATE
                    inventory
                SET
                    maintainenceExpense = maintainenceExpense + ${cost},
                    carStatus = 'available'
                WHERE
                    numberPlate = '${numberPlate}'
                ;`;
            const result2 = await client.query(query2);
        
            return {
                status: "success",
                info: `Car successfully repaired, cost occured: ${cost}`,
                title: "Success",
                data: cost
            }
        } catch(err) {
            throw err;
        }
    },
    getCarModels: async () => {
        try {
            const query = `SELECT carId, carname FROM cars;`;
            const result = await client.query(query);
        
            return {
                status: "success",
                title: "Success",
                info: "Car Models fetched successfully",
                data: result.rows
            }
        } catch(err) {
            throw err;
        }
    },
    insertInventory: async (carId, carType, numberPlate, mileMeterReading) => {
        try {
            const query = `INSERT INTO 
                                inventory(carId, numberPlate, carType, carStatus, mileMeterReading, maintainenceExpense) 
                            VALUES (${carId}, '${numberPlate}', '${carType}', 'available', ${mileMeterReading}, 0)
                        ;`;
            await client.query(query);
        
            return {
                status: "success",
                title: "Success",
                info: "Car added to inventory successfully"
            }
        } catch(err) {
            throw err;
        }
    },
    requestedToReturn: async rentId => {
        try {
            const query = `UPDATE rents SET rentStatus = 'requestedToReturn' WHERE rentId = ${rentId};`;
            await client.query(query);
        
            return {
                status: "info",
                title: "Info",
                info: "Return request recieved, visit your nearest CRS to return the car"
            }
        } catch(err) {
            throw err;
        }
    },
    getUserProfile: async userid => {
        try {
            const query = `SELECT * FROM users WHERE userid = ${userid};`;
            const result = await client.query(query);
            result.rows[0].datejoined = new Date(parseInt(result.rows[0].datejoined));
            result.rows[0].datejoined = result.rows[0].datejoined.toLocaleDateString("en-AU");
        
            return {
                status: "success",
                title: "Success",
                info: "User data fetched successfully",
                data: result.rows[0]
            }
        } catch(err) {
            throw err;
        }
    },
    updateUserDetails: async (userid, name, password) => {
        let query, hashedPassword;
        if(password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }
        if(name && password) {
            query = `UPDATE users SET name = '${name}', password = '${hashedPassword}' WHERE userid = ${userid}`;
        } else if(name && !password) {
            query = `UPDATE users SET name = '${name}' WHERE userid = ${userid}`;
        } else if(!name && password) {
            query = `UPDATE users SET password = '${hashedPassword}' WHERE userid = ${userid}`;
        }
        client.query(query);
    
        return { 
            info: "User details successfully updated", 
            status: "success", 
            title: "Success" 
        };
    },
    getRentData: async () => {
        try {
            const query = `
                SELECT 
                    users.userId userid,
                    users.name username,
                    users.email email,
                    cars.carname carname,
                    cars.carId carid,
                    cars.imageLink imagelink,
                    cars.rupeePerKm rupeeperkm,
                    cars.rupeePerHour rupeePerHour,
                    cars.BaseAmount baseamount,
                    inventory.numberPlate numberplate,
                    inventory.carType cartype,
                    rents.rentId rentid,
                    rents.rentedOn rentedon,
                    rents.rentStatus rentstatus,
                    rents.expectedReturn expectedreturn,
                    rents.mileMeterStart milemeterstart,
                    return.mileMeterEnd mileMeterEnd,
                    return.returnedon returnedon,
                    return.amountPaid amountpaid,
                    return.gasConsumed gasconsumed,
                    return.amountRefunded amountrefunded
                FROM users 
                    INNER JOIN rents ON
                    users.userid = rents.userid
                    INNER JOIN inventory ON
                    rents.numberPlate = inventory.numberPlate
                    INNER JOIN cars ON
                    inventory.carId = cars.carId
                    LEFT JOIN return ON
                    rents.rentId = return.rentId
                ;`;
            const result = await client.query(query);
            for(let item of result.rows) {
                item.rentedon = new Date(parseInt(item.rentedon));
                item.rentedon = item.rentedon.toLocaleDateString("en-AU");
                item.returnedon = new Date(parseInt(item.returnedon));
                item.returnedon = item.returnedon.toLocaleDateString("en-AU");
            }
        
            return {
                status: "success",
                title: "Success",
                info: "Rents fetched successfully",
                data: result.rows
            }
        } catch(err) {
            throw err;
        }
    },
    returnCar: async (rentId, mileMeterEnd, gasConsumed, refundAmount) => {
        try {
            const query1 = `SELECT * FROM rents WHERE rentId = ${rentId};`;
            const result1 = await client.query(query1);
            const numberPlate = result1.rows[0].numberplate;
            const userid = result1.rows[0].userid;
            const mileMeterStart = parseInt(result1.rows[0].milemeterstart);
            const rentedOn = parseInt(result1.rows[0].rentedon);
            const returnedOn = parseInt(Date.now());
            const query2 = `UPDATE inventory SET carStatus = 'available', mileMeterReading = mileMeterReading + ${mileMeterEnd - mileMeterStart} WHERE numberPlate = '${numberPlate}';`;
            await client.query(query2);
            const query3 = `
                SELECT 
                    * 
                FROM inventory 
                    INNER JOIN cars ON 
                    inventory.carId = cars.carId 
                WHERE 
                    numberPlate = '${numberPlate}'
            ;`;
            const result3 = await client.query(query3);
            const baseAmount = parseInt(result3.rows[0].baseamount);
            const rupeePerHour = parseInt(result3.rows[0].rupeeperhour);
            const rupeePerKm = parseInt(result3.rows[0].rupeeperkm);
            const roamingCost = Math.floor((result3.rows[0].cartype === "AC" ? 1.5 : 1) * (Math.max(rupeePerKm * (mileMeterEnd - mileMeterStart), rupeePerHour * Math.max(4, (returnedOn - rentedOn) / (1000 * 60 * 60)))) + (150 * (returnedOn - rentedOn) / (1000 * 60 * 60 * 24)));
            const baseAmountPaid = Math.floor((result3.rows[0].cartype === "AC" ? 1.5 : 1) * baseAmount);
            const query4 = `UPDATE rents SET rentStatus = 'returned' WHERE rentId = ${rentId};`;
            await client.query(query4);
            const query5 = `SELECT * FROM users WHERE userid = ${userid};`;
            const result5 = await client.query(query5);
            if(parseInt(result5.rows[0].balance) < roamingCost - refundAmount) {
                return {
                    status: "warning",
                    title: "warning",
                    info: "Out of money, recharge your money in profile page"
                }
            }
            const query6 = `INSERT INTO 
                                return(rentId, returnedOn, amountPaid, mileMeterEnd, gasConsumed, numberPlate, amountRefunded)
                            VALUES (${rentId}, ${returnedOn}, ${baseAmountPaid + roamingCost - refundAmount}, ${mileMeterEnd}, ${gasConsumed}, '${numberPlate}', ${refundAmount});`;
            await client.query(query6);
            const query7 = `UPDATE users SET balance = balance + ${refundAmount} - ${roamingCost} WHERE userid = ${userid};`;
            await client.query(query7);
        
            return {
                status: "success",
                title: "Success",
                info: `Car returned successfully, Total Cost: ${baseAmount + roamingCost - refundAmount}, Roaming Cost: ${roamingCost}, Amount Refunded: ${refundAmount}`,
            }
        } catch(err) {
            throw err;
        }
    },
    getCarModels: async () => {
        try {
            const query1 = `
                SELECT 
                    *
                FROM 
                    (SELECT 
                        cars.carId carid,
                        SUM(return.amountPaid) revenueearned,
                        COUNT(*) numberofrents
                    FROM cars
                        INNER JOIN inventory ON
                        cars.carId = inventory.carId
                        INNER JOIN rents ON
                        inventory.numberPlate = rents.numberPlate
                        INNER JOIN return ON
                        rents.rentId = return.rentId
                    GROUP BY
                        cars.carId) a
                RIGHT JOIN cars b ON
                    a.carId = b.carId;
                ;`;
            const result1 = await client.query(query1);
            const query2 = `SELECT COUNT(*) AS numberofrents FROM rents;`;
            const result2 = await client.query(query2);
            const totalNumberOfRents = parseInt(result2.rows[0].numberofrents);
            for(let car of result1.rows) {
                car.revenueearned |= 0;
                car.numberofrents |= 0;
                car.demand = (totalNumberOfRents === 0 ? 0 : (parseInt(car.numberofrents) * 100 / totalNumberOfRents).toFixed(2));
            }
        
            return {
                status: "success",
                title: "Success",
                info: "Car models fetched successfully",
                data: result1.rows
            }
        } catch(err) {
            throw err;
        }
    },
    insertCarModel: async (carName, price, baseAmount, rupeePerKm, rupeePerHour, imageLink) => {
        try {
            const query = `INSERT INTO 
                                cars(carName, rupeePerKm, rupeePerHour, baseAmount, price, imageLink)
                            VALUES ('${carName}', ${rupeePerKm}, ${rupeePerHour}, ${baseAmount}, ${price}, '${imageLink}');`;
            await client.query(query);
        
            return {
                status: "success",
                title: "Success",
                info: "Car model added successfully"
            }
        } catch(err) {
            throw err;
        }
    },
    deleteCarItem: async carId => {
        try {
            const query1 = `
                SELECT 
                    COUNT(*) numberOfActiveRents
                FROM cars
                    INNER JOIN inventory ON
                    cars.carId = inventory.carId
                    INNER JOIN rents ON
                    inventory.numberPlate = rents.numberPlate
                WHERE
                    cars.carId = ${carId} AND
                    rents.rentStatus != 'returned'
                ;`;
            const result1 = await client.query(query1);
            const numberOfActiveRents = parseInt(result1.rows[0].numberofactiverents);
            if(numberOfActiveRents > 0) {
            
                return {
                    status: "warning",
                    title: "Warning",
                    info: "There are some cars which are rented out currently, return them to delete this car model"
                }
            }
            const query2 = `SELECT COUNT(*) numberOfInventory FROM inventory WHERE carId = ${carId};`;
            const result2 = await client.query(query2);
            const numberOfInventory = parseInt(result2.rows[0].numberofinventory);
            if(numberOfInventory > 0) {
            
                return {
                    status: "warning",
                    title: "Warning",
                    info: "There are some cars in inventory with this car model, cannot delete this car model"
                }
            }
            const query3 = `
                DELETE
                    FROM return
                WHERE
                    numberPlate IN 
                        (SELECT 
                            numberPlate 
                        FROM cars 
                            INNER JOIN inventory ON 
                            cars.carId = inventory.carId
                        WHERE
                            cars.carId = ${carId}
                        )
                ;`
            await client.query(query3);
            const query4 = `
                DELETE
                    FROM rents
                WHERE
                    numberPlate IN 
                        (SELECT 
                            numberPlate 
                        FROM cars 
                            INNER JOIN inventory ON 
                            cars.carId = inventory.carId
                        WHERE
                            cars.carId = ${carId}
                        )
                ;`
            await client.query(query4);
            const query5 = `DELETE FROM inventory WHERE carId = ${carId};`;
            await client.query(query5);
            const query6 = `DELETE FROM cars WHERE carId = ${carId};`;
            await client.query(query6);
        
            return {
                status: "success",
                title: "Success",
                info: "Car model successfully deleted"
            };
        } catch(err) {
            throw err;
        }
    },
    updateBalance: async (userid, balance) => {
        try {
            const query = `UPDATE users SET balance = balance + ${balance} WHERE userId = ${userid};`;
            await client.query(query);
        
            return {
                title: "Success",
                status: "success",
                info: `User balance is increased by ${balance}`
            }
        } catch(err) {
            throw err;
        }
    }
}