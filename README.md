# Introduction

This is our basic express server

It integrate prisma, basic error handler, response helper and separate the development / production environment.



# Configuration:

Based on the `.env.example`, create your own `.env.development` with correct database information.

Change `.env.development` content:

- DATABASE_URL

  - the format will be

    > postgresql://${bd_user}:${db_password}@${db_host}:${db_port}/${db_database}?schema=${db_schema}

- HTTP_PORT to the port of project announcement announced
- Make sure change the `NODE_ENV` to `development`

In the future, we will create `.env.production` for production mode



# Run Server

Database: PostgreSQL



### 1 - For Development

1. Download PostgreSQL and run it locally

   ~~~bash
   # check db server
   $pg_ctl status
   
   # login db
   $ psql -U postgress
   ~~~

   

2. Set a password for database

   ~~~postgresql
   ALTER USER postgres PASSWORD 'your_password';
   ~~~

   

3. Create a database and schema consistent with the environment variables

   ~~~postgresql
   # create database
   CREATE DATABASE auth;
   
   # switch database
   \c database_name;
   
   # create schema
   CREATE SCHEMA testschema1;
   ~~~

4. Execute the following command in the project's root directory in the command prompt

   ~~~bash
   # async the entities into your database
   $ npm run sync:dev
   
   # add the seed data into your tables
   $ npm run seed:dev
   
   # run server in development mode
   $ npm run dev
   ~~~
   
   

### 2 - For Production

~~~bash
$ npm run pro
~~~

before run it, you need to setup the `.env.production` for the PRODUCTION DATABASE. Please ask Jurong for details.



# Response

Structure:

~~~json
{
    "status": true,
    "statusCode": 200,
    "message": "Success",
    "resData": [
        {
            "id": 1,
            "firstName": "Timber",
            "lastName": "Saw",
            "age": 27
        },
]}
~~~



all the response should use the `/src/helper/ResponseHelper.ts`

if there is no data need to send back:

- HttpSuccessStatus: Choose one of the success, you can add more
- response: imported from express
- message: optional, you send your own string message

~~~typescript
const res = new ResHelper()

res.sendSuccessRes(response, HttpSuccessStatus.succes, message)
~~~

if there is data need to send back:

just transfer the data to ResHelper()

~~~typescript
const res = new ResHelper()

const data = {a: "111", b:"222"}
res.setData(data)
res.sendSuccessRes(response, HttpSuccessStatus.succes, message)
~~~



# Error Handler

Structure: 

~~~json
{
    "status": false,
    "statusCode": 400,
    "message": "Bad request: wrong format",
    "error": "Bad Request",
    // resData only disappear in development mode
    "resData": {
        "query": "INSERT INTO \"testschema1\".\"user\"(\"firstName\", \"lastName\", \"age\") VALUES ($1, $2, DEFAULT) RETURNING \"id\"",
        "parameters": [
            "Frank2",
            "Jia2"
        ],
        "driverError": {
            "length": 209,
            "name": "error",
            "severity": "ERROR",
            "code": "23502",
            "detail": "Failing row contains (18, Frank2, Jia2, null).",
            "schema": "testschema1",
            "table": "user",
            "column": "age",
            "file": "execMain.c",
            "line": "2009",
            "routine": "ExecConstraints"
        },
        "length": 209,
        "severity": "ERROR",
        "code": "23502",
        "detail": "Failing row contains (18, Frank2, Jia2, null).",
        "schema": "testschema1",
        "table": "user",
        "column": "age",
        "file": "execMain.c",
        "line": "2009",
        "routine": "ExecConstraints"
    }
}
~~~



when there is an error has been cached

use following way to send error:

~~~typescript
const res = new ResHelper()
try {
    ...
} catch (err) {
    res.sendErrorRes(response, err, HttpErrorStatus.BadRequest, message)
}
~~~

- response:
  - required parameter
  - imported from express
- err:
  - required parameter，can be undefined type
  - passing from the parameter from catch
  - it **only show in developing mode**, hide in production mode
  - use the err information, to decide which **statusCode** to use!
- statusCode:
  - Already defined in **HttpErrorStatus**，choose proper property in HttpErrorStatus based on the err passed by the catch
  - If you don't pass this parameter, the error will show server inner error only.
- message:
  - For each error, you can customize the message send to client



# Other

You can add any library , add any technology in your service, make proper documentation that others can understand easily. 









