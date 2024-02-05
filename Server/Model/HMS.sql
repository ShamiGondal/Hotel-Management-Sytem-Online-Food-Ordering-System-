create  database IndianResturant 


use IndianResturant
-- Create Users Table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY, -- We will generate this ID form some our backend ,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    Credits INT
);

-- Create Admins Table
CREATE TABLE Admins (
    AdminID INT PRIMARY KEY, --this will be particularly assigned by us because there will not be more admins,
    UserName VARCHAR(255),
    Password VARCHAR(255)
);

-- Create Addresses Table
CREATE TABLE Addresses (
    AddressID INT PRIMARY KEY ,
    CustomerID INT,
    Address VARCHAR(255),
    PhoneNumber VARCHAR(20),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Reservations Table
CREATE TABLE Reservations (
    ReservationID INT PRIMARY KEY,
    CustomerID INT,
    ReservationDate DATE,
    NoOfTables INT,
    Status VARCHAR(50) CHECK (Status IN ('Pending', 'Confirmed', 'Rejected')), -- nothing will be deleted we will have the record for each thing 
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    PaymentStatus VARCHAR(50) CHECK (PaymentStatus IN ('Pending', 'Confirmed', 'Rejected')), -- this payment will be confirmed form stripe method 
    TotalAmount DECIMAL(10, 2),
    Status VARCHAR(50) CHECK (Status IN ('Pending', 'Confirmed', 'Rejected')), --
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create FoodItems Table
CREATE TABLE FoodItems (
    FoodItemID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    AvailableQuantity INT NOT NULL,
    FoodItemDiscount DECIMAL(5, 2) NOT NULL DEFAULT 0 -- this will be calculated on the spot for the fooditem
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY,
    OrderID INT,
    FoodItemID INT,
    Quantity INT,
    Subtotal DECIMAL(10, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (FoodItemID) REFERENCES FoodItems(FoodItemID)
);



-- Create Feedback Table
CREATE TABLE Feedback (
    FeedbackID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT,
    ServiceRating INT NOT NULL,
    FoodRating INT NOT NULL,
    Comment NVARCHAR(MAX),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Payments Table
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY,
    OrderID INT,
    CustomerID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Report Table with Auto-increment ID
CREATE TABLE Report (
    ReportID INT IDENTITY(1,1) PRIMARY KEY,
    Date DATE,
    ConfirmedOrders INT,
    RejectedOrders INT,
    PlacedOrdersToday INT,
    RevenueToday DECIMAL(10, 2)
);

--Porcedures for insertions

-- Procedure for updating reservation status
CREATE PROCEDURE UpdateReservationStatus
    @ReservationID INT,
    @NewStatus VARCHAR(50)
AS
BEGIN
    UPDATE Reservations
    SET Status = @NewStatus
    WHERE ReservationID = @ReservationID;
END;


-- Procedure for updating order status
CREATE PROCEDURE UpdateOrderStatus
    @OrderID INT,
    @NewStatus VARCHAR(50)
AS
BEGIN
    UPDATE Orders
    SET Status = @NewStatus
    WHERE OrderID = @OrderID;
END;


-- Procedure for inserting data into Customers table
CREATE PROCEDURE InsertCustomer
	@CustomerID INT,
    @FirstName VARCHAR(255),
    @LastName VARCHAR(255),
    @Email VARCHAR(255),
    @Password VARCHAR(255),
    @Credits INT
AS
BEGIN
    INSERT INTO Customers (CustomerID,FirstName, LastName, Email, Password, Credits)
    VALUES (@CustomerID,@FirstName, @LastName, @Email, @Password, @Credits);
END;

-- Procedure for inserting data into Admins table
CREATE PROCEDURE InsertAdmin
	@AdminID INT,
    @UserName VARCHAR(255),
    @Password VARCHAR(255)
AS
BEGIN
    INSERT INTO Admins (AdminID, UserName, Password)
    VALUES (@AdminID ,@UserName, @Password);
END;

-- Procedure for inserting data into Addresses table
CREATE PROCEDURE InsertAddress
	@AddressID INT,
    @CustomerID INT,
    @Address VARCHAR(255),
    @PhoneNumber VARCHAR(20)
AS
BEGIN
    INSERT INTO Addresses (AddressID,CustomerID, Address, PhoneNumber)
    VALUES (@AddressID,@CustomerID, @Address, @PhoneNumber);
END;
-- Procedure for inserting data into Reservations table
CREATE PROCEDURE InsertReservation
    @ReservationID INT,
    @CustomerID INT,
    @ReservationDate DATE,
    @NoOfTables INT,
    @Status VARCHAR(50)
AS
BEGIN
    INSERT INTO Reservations (ReservationID, CustomerID, ReservationDate, NoOfTables, Status)
    VALUES (@ReservationID, @CustomerID, @ReservationDate, @NoOfTables, @Status);
END;

-- Procedure for inserting data into Orders table
CREATE PROCEDURE InsertOrder
    @OrderID INT,
    @CustomerID INT,
    @OrderDate DATE,
    @PaymentStatus VARCHAR(50),
    @TotalAmount DECIMAL(10, 2),
    @Status VARCHAR(50)
AS
BEGIN
    INSERT INTO Orders (OrderID, CustomerID, OrderDate, PaymentStatus, TotalAmount, Status)
    VALUES (@OrderID, @CustomerID, @OrderDate, @PaymentStatus, @TotalAmount, @Status);
END;

-- Procedure for inserting data into FoodItems table
CREATE PROCEDURE InsertFoodItem
    @Name NVARCHAR(100),
    @Price DECIMAL(10, 2),
    @Category NVARCHAR(50),
    @AvailableQuantity INT,
    @FoodItemDiscount DECIMAL(5, 2)
AS
BEGIN
    INSERT INTO FoodItems ( Name, Price, Category, AvailableQuantity, FoodItemDiscount)
    VALUES ( @Name, @Price, @Category, @AvailableQuantity, @FoodItemDiscount);
END;

-- Procedure for inserting data into OrderItems table
CREATE PROCEDURE InsertOrderItem
    @OrderItemID INT,
    @OrderID INT,
    @FoodItemID INT,
    @Quantity INT,
    @Subtotal DECIMAL(10, 2)
AS
BEGIN
    INSERT INTO OrderItems (OrderItemID, OrderID, FoodItemID, Quantity, Subtotal)
    VALUES (@OrderItemID, @OrderID, @FoodItemID, @Quantity, @Subtotal);
END;

-- Procedure for inserting data into Feedback table
CREATE PROCEDURE InsertFeedback
    @CustomerID INT,
    @ServiceRating INT,
    @FoodRating INT,
    @Comment NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Feedback ( CustomerID, ServiceRating, FoodRating, Comment)
    VALUES ( @CustomerID, @ServiceRating, @FoodRating, @Comment);
END;

-- Procedure for inserting data into Payments table
CREATE PROCEDURE InsertPayment
    @PaymentID INT,
    @OrderID INT,
    @CustomerID INT,
    @Amount DECIMAL(10, 2),
    @PaymentDate DATETIME
AS
BEGIN
    INSERT INTO Payments (PaymentID, OrderID, CustomerID, Amount, PaymentDate)
    VALUES (@PaymentID, @OrderID, @CustomerID, @Amount, @PaymentDate);
END;


-- Insert data into Customers table using the procedure
EXEC InsertCustomer
	@CustomerID =2,
    @FirstName = 'John',
    @LastName = 'Doe',
    @Email = 'john.doe@example.com',
    @Password = 'password123',
    @Credits = 100;

-- Insert data into Admins table using the procedure
EXEC InsertAdmin
	@AdminID = 2,
    @UserName = 'admin1',
    @Password = 'adminpassword';

-- Insert data into Addresses table using the procedure
EXEC InsertAddress
	@AddressID = 2,
    @CustomerID = 2,
    @Address = '123 Main Street',
    @PhoneNumber = '123-456-7890';

-- Insert data into Reservations table using the procedure
EXEC InsertReservation
    @ReservationID = 4,
    @CustomerID = 2,
    @ReservationDate = '2024-02-10',
    @NoOfTables = 3,
    @Status = 'Pending';

-- Insert data into Orders table using the procedure
EXEC InsertOrder
    @OrderID = 1,
    @CustomerID = 2,
    @OrderDate = '2024-02-10',
    @PaymentStatus = 'Pending',
    @TotalAmount = 50.00,
    @Status = 'Pending';

-- Insert data into FoodItems table using the procedure
EXEC InsertFoodItem
    @Name = 'Pizza',
    @Price = 12.99,
    @Category = 'Main Dish',
    @AvailableQuantity = 20,
    @FoodItemDiscount = 0.1;

-- Insert data into OrderItems table using the procedure
EXEC InsertOrderItem
    @OrderItemID = 1,
    @OrderID = 1,
    @FoodItemID = 1,
    @Quantity = 2,
    @Subtotal = 25.98;

-- Insert data into Feedback table using the procedure
EXEC InsertFeedback
    @CustomerID = 2,
    @ServiceRating = 4,
    @FoodRating = 5,
    @Comment = 'Great service and delicious food!';

-- Insert data into Payments table using the procedure
EXEC InsertPayment
    @PaymentID = 1,
    @OrderID = 1,
    @CustomerID = 2,
    @Amount = 50.00,
    @PaymentDate = '2024-02-10 12:30:00';

-- Procedure for updating the Report table
CREATE PROCEDURE UpdateReport
AS
BEGIN
    INSERT INTO Report (Date, ConfirmedOrders, RejectedOrders, PlacedOrdersToday, RevenueToday)
    SELECT
        GETDATE() AS Date,
        (SELECT COUNT(*) FROM Orders WHERE Status = 'Confirmed' AND CONVERT(DATE, OrderDate) = CONVERT(DATE, GETDATE())) AS ConfirmedOrders,
        (SELECT COUNT(*) FROM Orders WHERE Status = 'Rejected' AND CONVERT(DATE, OrderDate) = CONVERT(DATE, GETDATE())) AS RejectedOrders,
        (SELECT COUNT(*) FROM Orders WHERE CONVERT(DATE, OrderDate) = CONVERT(DATE, GETDATE())) AS PlacedOrdersToday,
        COALESCE((SELECT SUM(ISNULL(TotalAmount, 0)) FROM Orders WHERE Status = 'Confirmed' AND CONVERT(DATE, OrderDate) = CONVERT(DATE, GETDATE())), 0) AS RevenueToday;
END;


EXEC UpdateReport;



