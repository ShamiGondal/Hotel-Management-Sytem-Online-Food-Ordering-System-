CREATE DATABASE IF NOT EXISTS IndianHouseRestaurant;

USE IndianHouseRestaurant;

-- Create Customers Table
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    Credits INT,
    PhoneNumber VARCHAR(20) -- Added Phone Number to Customers Table
);

-- Create Admins Table
CREATE TABLE Admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(255) UNIQUE,
    Password VARCHAR(255)
);

-- Create Addresses Table
CREATE TABLE Addresses (
    AddressID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    StreetAddress VARCHAR(255), -- Added Street Address
    City VARCHAR(100), -- Added City
    State VARCHAR(100), -- Added State
    PostalCode VARCHAR(20), -- Added Postal Code
    Country VARCHAR(100), -- Added Country
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Reservations Table
CREATE TABLE Reservations (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    ReservationDate DATE,
    ReservationTime TIME, -- Added Time Attribute
    NoOfTables INT,
    Status VARCHAR(50) CHECK (Status IN ('Pending', 'Confirmed', 'Rejected')), 
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    OrderTime TIME, -- Added Time Attribute
    OrderNote VARCHAR(100) DEFAULT'No Instruction',
    PaymentStatus VARCHAR(50) CHECK (PaymentStatus IN ('Pending', 'Confirmed', 'Rejected')),
    TotalAmount DECIMAL(10, 2),
    DeliveryAddress VARCHAR(255),
    Status VARCHAR(50) CHECK (Status IN ('Pending', 'Confirmed', 'Rejected')),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create FoodItems Table
CREATE TABLE FoodItems (
    FoodItemID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255), -- Added Title
    Subtitle VARCHAR(255), -- Added Subtitle
    Description TEXT, -- Added Description
    Price DECIMAL(10, 2) NOT NULL,
    Sizes JSON, -- Added Sizes (stored as JSON, can vary in size)
    SpecialSelection JSON, -- Added Special Selection (stored as JSON, admin-defined options)
    IsAvailable BOOLEAN DEFAULT 1,
    FoodItemDiscount DECIMAL(5, 2) NOT NULL DEFAULT 0,
    Category VARCHAR(255),
    ImageURL JSON
);

CREATE TABLE Addons (
    AddonID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255),
    Subtitle VARCHAR(255),
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    ImageURL VARCHAR(255),
    Size JSON
);

-- FoodItemsReview Table
CREATE TABLE FoodItemsReview (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    FoodItemID INT,
    Rating INT NOT NULL, -- Rating out of 5
    Comment TEXT, -- Optional comment
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (FoodItemID) REFERENCES FoodItems(FoodItemID)
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    FoodItemID INT,
    AddonID INT DEFAULT NULL, -- Added AddonID column with default NULL
    Quantity INT,
    Subtotal DECIMAL(10, 2)
);

ALTER TABLE OrderItems
ADD CONSTRAINT fk_order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
ADD CONSTRAINT fk_fooditem FOREIGN KEY (FoodItemID) REFERENCES FoodItems(FoodItemID),
ADD CONSTRAINT fk_addon FOREIGN KEY (AddonID) REFERENCES Addons(AddonID);

-- Create Feedback Table
CREATE TABLE Feedback (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    ServiceRating INT NOT NULL,
    FoodRating INT NOT NULL,
    Comment TEXT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Payments Table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    CustomerID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create Complaints Table
CREATE TABLE Complaints (
    ComplaintID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    ComplaintType VARCHAR(50) CHECK (ComplaintType IN ('Food', 'Website', 'Hotel')),
    ComplaintText TEXT,
    ComplaintDate DATETIME,
    IsResolved BOOLEAN DEFAULT 0,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Table for notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('order', 'complaint', 'reservation','payment') NOT NULL,
    message TEXT NOT NULL,
    CustomerID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsCustomerRead TINYINT DEFAULT 0,
    IsAdminRead TINYINT DEFAULT 0,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);


-- Table for promotion notifications
CREATE TABLE promotion_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('generic', 'promotion') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsCustomerRead TINYINT DEFAULT 0,
    IsAdminRead TINYINT DEFAULT 0
);


CREATE TABLE coupons (
    couponID INT AUTO_INCREMENT PRIMARY KEY,
    couponCode VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL,
    CopounDiscountAmount DECIMAL(10, 2)
);


-- Create Report Table
CREATE TABLE Report (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    ConfirmedOrders INT,
    RejectedOrders INT,
    PlacedOrdersToday INT,
    RevenueToday DECIMAL(10, 2)
);

CREATE TABLE CustomerImages (
    ImageID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    ImageData LONGBLOB NOT NULL,
    UploadDate DATETIME NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);



-- Create Trigger for Payment Table
DELIMITER $$
CREATE TRIGGER InsertPaymentOnConfirmed
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Confirmed' AND NEW.PaymentStatus = 'Confirmed' THEN
        INSERT INTO Payments (OrderID, CustomerID, Amount, PaymentDate)
        VALUES (NEW.OrderID, NEW.CustomerID, NEW.TotalAmount, NOW());
    END IF;
END$$
DELIMITER ;

-- Procedures for insertions

-- Procedure for inserting data into Customers table
DELIMITER //

-- Procedure for updating reservation status
CREATE PROCEDURE UpdateReservationStatus (
    IN p_ReservationID INT,
    IN p_NewStatus VARCHAR(50)
)
BEGIN
    UPDATE Reservations
    SET Status = p_NewStatus
    WHERE ReservationID = p_ReservationID;
END //

-- Procedure for updating order status
CREATE PROCEDURE UpdateOrderStatus (
    IN p_OrderID INT,
    IN p_NewStatus VARCHAR(50)
)
BEGIN
    UPDATE Orders
    SET Status = p_NewStatus
    WHERE OrderID = p_OrderID;
END //

-- Procedure for updating complaint status
CREATE PROCEDURE UpdateComplaintStatus (
    IN p_ComplaintID INT,
    IN p_IsResolved BIT
)
BEGIN
    UPDATE Complaints
    SET IsResolved = p_IsResolved
    WHERE ComplaintID = p_ComplaintID;
END //

-- Procedure for updating payment status
CREATE PROCEDURE UpdatePaymentStatus (
    IN p_OrderID INT,
    IN p_NewPaymentStatus VARCHAR(50)
)
BEGIN
    UPDATE Orders
    SET PaymentStatus = p_NewPaymentStatus
    WHERE OrderID = p_OrderID;
END //

-- Procedure for inserting data into Customers table
CREATE PROCEDURE InsertCustomer (
    IN p_CustomerID INT,
    IN p_FirstName VARCHAR(255),
    IN p_LastName VARCHAR(255),
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255),
    IN p_Credits INT
)
BEGIN
    INSERT INTO Customers (CustomerID, FirstName, LastName, Email, Password, Credits)
    VALUES (p_CustomerID, p_FirstName, p_LastName, p_Email, p_Password, p_Credits);
END //

-- Procedure for inserting data into Admins table
CREATE PROCEDURE InsertAdmin (
    IN p_AdminID INT,
    IN p_UserName VARCHAR(255),
    IN p_Password VARCHAR(255)
)
BEGIN
    INSERT INTO Admins (AdminID, UserName, Password)
    VALUES (p_AdminID, p_UserName, p_Password);
END //

-- Procedure for inserting data into Addresses table
CREATE PROCEDURE InsertAddress (
    IN p_AddressID INT,
    IN p_CustomerID INT,
    IN p_Address VARCHAR(255),
    IN p_PhoneNumber VARCHAR(20)
)
BEGIN
    INSERT INTO Addresses (AddressID, CustomerID, Address, PhoneNumber)
    VALUES (p_AddressID, p_CustomerID, p_Address, p_PhoneNumber);
END //

-- Procedure for inserting data into Reservations table
CREATE PROCEDURE InsertReservation (
    IN p_ReservationID INT,
    IN p_CustomerID INT,
    IN p_ReservationDate DATE,
    IN p_NoOfTables INT,
    IN p_Status VARCHAR(50)
)
BEGIN
    INSERT INTO Reservations (ReservationID, CustomerID, ReservationDate, NoOfTables, Status)
    VALUES (p_ReservationID, p_CustomerID, p_ReservationDate, p_NoOfTables, p_Status);
END //

-- Procedure for inserting data into Orders table
CREATE PROCEDURE InsertOrder (
    IN p_OrderID INT,
    IN p_CustomerID INT,
    IN p_OrderDate DATE,
    IN p_PaymentStatus VARCHAR(50),
    IN p_TotalAmount DECIMAL(10, 2),
    IN p_Status VARCHAR(50)
)
BEGIN
    INSERT INTO Orders (OrderID, CustomerID, OrderDate, PaymentStatus, TotalAmount, Status)
    VALUES (p_OrderID, p_CustomerID, p_OrderDate, p_PaymentStatus, p_TotalAmount, p_Status);
END //

-- Procedure for inserting data into FoodItems table
CREATE PROCEDURE InsertFoodItem (
    IN p_Name NVARCHAR(100),
    IN p_Price DECIMAL(10, 2),
    IN p_Category NVARCHAR(50),
    IN p_AvailableQuantity INT,
    IN p_FoodItemDiscount DECIMAL(5, 2)
)
BEGIN
    INSERT INTO FoodItems (Name, Price, Category, AvailableQuantity, FoodItemDiscount)
    VALUES (p_Name, p_Price, p_Category, p_AvailableQuantity, p_FoodItemDiscount);
END //

-- Procedure for inserting data into OrderItems table
CREATE PROCEDURE InsertOrderItem (
    IN p_OrderItemID INT,
    IN p_OrderID INT,
    IN p_FoodItemID INT,
    IN p_Quantity INT,
    IN p_Subtotal DECIMAL(10, 2)
)
BEGIN
    INSERT INTO OrderItems (OrderItemID, OrderID, FoodItemID, Quantity, Subtotal)
    VALUES (p_OrderItemID, p_OrderID, p_FoodItemID, p_Quantity, p_Subtotal);
END //

-- Procedure for inserting data into Feedback table
CREATE PROCEDURE InsertFeedback (
    IN p_CustomerID INT,
    IN p_ServiceRating INT,
    IN p_FoodRating INT,
    IN p_Comment TEXT
)
BEGIN
    INSERT INTO Feedback (CustomerID, ServiceRating, FoodRating, Comment)
    VALUES (p_CustomerID, p_ServiceRating, p_FoodRating, p_Comment);
END //

-- Procedure for inserting data into Payments table
CREATE PROCEDURE InsertPayment (
    IN p_PaymentID INT,
    IN p_OrderID INT,
    IN p_CustomerID INT,
    IN p_Amount DECIMAL(10, 2),
    IN p_PaymentDate DATETIME
)
BEGIN
    INSERT INTO Payments (PaymentID, OrderID, CustomerID, Amount, PaymentDate)
    VALUES (p_PaymentID, p_OrderID, p_CustomerID, p_Amount, p_PaymentDate);
END //

-- Procedure for inserting data into Complaints table
CREATE PROCEDURE InsertComplaint (
    IN p_CustomerID INT,
    IN p_ComplaintType VARCHAR(50),
    IN p_ComplaintText TEXT
)
BEGIN
    INSERT INTO Complaints (CustomerID, ComplaintType, ComplaintText, ComplaintDate)
    VALUES (p_CustomerID, p_ComplaintType, p_ComplaintText, NOW());
END //

-- Procedure for updating the Report table
CREATE PROCEDURE UpdateReport ()
BEGIN
    INSERT INTO Report (Date, ConfirmedOrders, RejectedOrders, PlacedOrdersToday, RevenueToday)
    SELECT
        CURRENT_DATE() AS Date,
        (SELECT COUNT(*) FROM Orders WHERE Status = 'Confirmed' AND DATE(OrderDate) = CURRENT_DATE()) AS ConfirmedOrders,
        (SELECT COUNT(*) FROM Orders WHERE Status = 'Rejected' AND DATE(OrderDate) = CURRENT_DATE()) AS RejectedOrders,
        (SELECT COUNT(*) FROM Orders WHERE DATE(OrderDate) = CURRENT_DATE()) AS PlacedOrdersToday,
        COALESCE((SELECT SUM(IFNULL(TotalAmount, 0)) FROM Orders WHERE Status = 'Confirmed' AND DATE(OrderDate) = CURRENT_DATE()), 0) AS RevenueToday;
END //

DELIMITER ;
