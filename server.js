require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const bodyParser = require("body-parser");
const {authRouter} = require("./routes/auth");
const {userRouter} = require("./routes/user");
const {servicesRouter} = require("./routes/services");
const {adminRouter} = require("./routes/admin");

const PORT = process.env.SERVER_PORT || 4000;

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
		},
	}),
);

app.use("/auth", authRouter);

app.use(
	"/user",
	(req, res, next) => {
		if (req.session.authorization) {
			let token = req.session.authorization["accessToken"];
			jwt.verify(token, process.env.SESSION_PRIVATE_KEY, (err, user) => {
				if (!err) {
					req.user = user;
					next();
				} else {
					return res
						.status(403)
						.json({message: "User not authenticated"});
				}
			});
		} else {
			return res.status(403).json({message: "User not logged in"});
		}
	},
	userRouter,
);

app.use(
	"/admin",
	(req, res, next) => {
		if (req.session.authorization) {
			let token = req.session.authorization["accessToken"];
			jwt.verify(token, process.env.SESSION_PRIVATE_KEY, (err, user) => {
				if (!err && user.Role === "Admin") {
					req.user = user;
					next();
				} else {
					return res
						.status(403)
						.json({message: "User not authenticated/authorized"});
				}
			});
		} else {
			return res.status(403).json({message: "User not logged in"});
		}
	},
	adminRouter,
);

app.get("/", (req, res) => {
	res.status(200).json({message: "Test route"});
});

app.use("/services", servicesRouter);

app.listen(PORT, () => {
	console.log(`Server connected on port: ${PORT}`);
});
