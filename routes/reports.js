require("dotenv").config();
const express = require("express");
const reports = express.Router();
const {pool} = require("../utils/db");

reports.get("/revenue", (req, res) => {
	pool.query(
		"SELECT YEAR(Date) AS Year, MONTH(Date) AS Month, SUM(Amount) AS TotalRevenue FROM Payment WHERE Status = 'Completed' GROUP BY YEAR(Date), MONTH(Date) ORDER BY Year DESC, Month DESC",
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({message: "Records not found"});
			}
			res.status(200).json({message: results});
		},
	);
});

reports.get("/bookings", (req, res) => {
	pool.query(
		"SELECT YEAR(Date) AS Year, MONTH(Date) AS Month, COUNT(BookingID) AS TotalBookings FROM Booking GROUP BY YEAR(Date), MONTH(Date) ORDER BY Year DESC, Month DESC",
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({message: "Records not found"});
			}
			res.status(200).json({message: results});
		},
	);
});

reports.get("/bookings/popular", (req, res) => {
	pool.query(
		"SELECT Name AS PackageName, COUNT(BookingID) AS TotalBookings FROM Booking JOIN ServicePackage ON Booking.PackageID = ServicePackage.PackageID GROUP BY ServicePackage.Name ORDER BY TotalBookings DESC",
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({message: "Records not found"});
			}
			res.status(200).json({message: results});
		},
	);
});

reports.get("/feedback/average", (req, res) => {
	pool.query(
		"SELECT Name AS CleanerName, AVG(Feedback.Rating) AS AverageRating, COUNT(Feedback.FeedbackID) AS TotalFeedbacks FROM Feedback JOIN Cleaner ON Feedback.CleanerID = Cleaner.CleanerID GROUP BY Cleaner.Name ORDER BY AverageRating DESC",
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({messages: "Records not found"});
			}
		},
	);
});

reports.get("/feedback/distribution", (req, res) => {
	pool.query(
		"SELECT Rating, COUNT(FeedbackID) AS Count FROM Feedback GROUP BY Rating ORDER BY Rating DESC",
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({messages: "Records not found"});
			}
		},
	);
});

module.exports.reportsRouter = reports;
