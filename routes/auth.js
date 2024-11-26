require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const auth = express.Router();
const mysql = require("mysql2");
const {hashPassword, comparePasswordWithHash} = require("../utils/password");
const {pool} = require("../utils/db");

auth.post("/register", async (req, res) => {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let phone = req.body.phone;
	let email = req.body.email;
	let address = req.body.address;
	let role = req.body.role;
	let password = await hashPassword(req.body.password);

	pool.query(
		"INSERT INTO Customer (name, phone, email, address, role, password) VALUES (?, ?, ?, ?, ?, ?)",
		[`${firstName} ${lastName}`, phone, email, address, role, password],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			let userId = results.insertId;
			let accessToken = jwt.sign(
				{
					id: userId,
					role: role,
				},
				process.env.SESSION_PRIVATE_KEY,
				{
					expiresIn: 3600,
				},
			);
			req.session.authorization = {accessToken};
			res.status(200).json({
				message: "User registered successfully!",
			});
		},
	);
});

auth.post("/login", (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let role = req.body.role;

	if (!email || !password) {
		return res.status(404).json({message: "Error logging in!"});
	}

	pool.query(
		"SELECT * FROM Customer WHERE email = ? AND role = ?",
		[email, role],
		async (e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.length <= 0) {
				res.status(404).json({
					message: "User not found!",
				});
			}
			let user = results[0];
			if (await comparePasswordWithHash(password, user.Password)) {
				let accessToken = jwt.sign(
					{
						id: user.CustomerID,
						role: user.Role,
					},
					process.env.SESSION_PRIVATE_KEY,
					{
						expiresIn: 3600,
					},
				);
				req.session.authorization = {accessToken};
				res.status(200).json({
					message: "User logged in!",
					accessToken,
				});
			} else {
				res.status(208).json({
					message: "Invalid Login. Check username and password",
				});
			}
		},
	);
});

module.exports.authRouter = auth;
