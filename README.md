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


#