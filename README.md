## DataBase setup

## Important Note:

Do Consider this that , the model inside the Server folder is just for the showing it to you guys but actually the datbase is hosted on AWS and designed in MS SQL server that has the connection with the AWS Directly, Therefore any change made here will not directly reflect until unless I don't change it in my database ms sql server 


# Description

There is customer how can order the food from our website the customer will have signup and login processes so you will have to store these details , customer can make the reservations like these are the Tables reservation before coming to our hotel , they can reserver their tables , order will definetly have the orderitems that will contains the fooditems , and the order will have the payment process , and more over the customer can have the multiple adderess and phone number , there will be discounts on the foodItems and there will be discounts for particular customer depending upon the credits that he gained form his no of orders, now there come the admin part, he can reject cutomer order plus reservation if he wants , he can generate the anlytic repot , there will be a table for the slip that when customer order the food the slip can be generated so that we can print the details of order like in  hotel we do have 


## Schema

Schema is avaliable at this path

    \IndainHouse\Server\Model

## Diagram 

![alt text](image.png)

## How to its working

1. I just created the datbase design in the ms sql server.
2. Then hosted it on the AWS (I will make video over it if you want)
3. Then just made the connection with the credentials.
4. Then there is also agent working for report after 24 hours
4. Thats all  folks!


## How to make the Database connection to the MERN APP

Its supper easy just like the mongodb, I have already hosted the database over the AWS. 

Simply we have the endpoint and  using that endpoint plus the username and password we can make the connection easily, Hope so you won't have any issue, if you still have just let me know.


## Successfull Creation of User

![alt text](image-1.png)

## Agent Setup in MS SQL

Set up a SQL Server Job to execute the stored procedure:

Open SQL Server Management Studio (SSMS).

In the Object Explorer, navigate to SQL Server Agent -> Jobs.

Right-click on Jobs and select "New Job..."

Provide a name for the job.

Go to the "Steps" page, click "New," and add a new step.

Set the "Type" to "Transact-SQL Script (T-SQL)."

In the "Command" box, enter the following T-SQL script:


## Backend Development 

#   Phase 1 (Authentication)

Completed login and Signup phase with jwt sign and bcrypt methods

## Signup

![alt text](image-3.png)

## Login

![alt text](image-2.png)


## getCustomer 

why this endpoint ?

"This helps to fetch the record and data that is related to only particular user who is logged in his own account, not seeing others data , plus it helps us to get user deatils based on his id".

1. This uses the middleware fetchCustomer , you can get this code at Server\middlewares
2. Middleware verify token that is coming in the header and then pass it to next endpoint that is getCustomer
3. Then getCustomer gets the uesr Record.

## How to set the value in header feild while sending ID of user 

Here is raw data just copy it and paste it in ThunderClient 

1. Go to thunderClient 
2. Make request to  url 
    http://localhost:4000/api/getCustomer.
3. open header option in thunder Client
4. Click on raw and paste this code.

    Accept: */*
    User-Agent: Thunder Client (https://www.thunderclient.com)
    Content-Type: application/json
    authToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEwLCJpYXQiOjE3MDcxNTY4NzMsImV4cCI6MTcwNzE2MDQ3M30.9SzoyVLuXVbO6H8AnsmnjMYv-fL6kzxhnDZBHb5oxF4
    ~Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEwLCJpYXQiOjE3MDcxNTY4NzMsImV4cCI6MTcwNzE2MDQ3M30.9SzoyVLuXVbO6H8AnsmnjMYv-fL6kzxhnDZBHb5oxF4

5. Add this body by clicking on body option
    {
  "UserID": 10
    }
6. Then you will get this resutl if your connection will be working fine.    


![alt text](image-4.png)


## Missing part/Functionalities Coming along with Project


Missing part mean that these are the anomalies, Problem that could not be solved till now.

# Database Part

1. There will be discounts for particular customer depending upon the credits that he gained form his no of orders, 
2. I have set token in the cookies but in thunderClient I am sending in header therefore I am using req.header in       middleware but later on will update when will work on frontend code , because it will automatically fetch the cookies value as we are setting at the time of login.

