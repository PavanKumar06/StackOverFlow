const UsersModel = require("../models/users")
const rateLimit = require("express-rate-limit");

class UsersController {
    constructor(app) {
        this.app = app;

        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);

        this.rateLimitMiddleware();

        this.setupRoutes();
    }

    async signup(req, res) {
        const {username, password, email} = req.body;
        try {
            const user = await UsersModel.signup(username, password, email)
            res.status(200).json(user);
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    }

    async login(req, res) {
        const {username, password} = req.body;
        try {
            const user = await UsersModel.login(username, password)
            res.status(200).json(user);
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    }

    async reputation(req, res) {
        const {reputation} = req.body;

        try {
            const user = UsersModel.updateOne(
                { username: req.params.username },
                { $set: {reputation: reputation} }
            );
            res.json(user);
        } catch(error) {
            console.error("Could not update reputation " +error.message);
        }
    }

    rateLimitMiddleware() {
        return rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 1000,
          message: "Too many requests from this IP, please try again later.",
        });
      }

    setupRoutes() {
        this.app.post("/api/signup", this.rateLimitMiddleware(), this.signup);
        this.app.post("/api/login", this.rateLimitMiddleware(), this.login);
        this.app.put("/api/users/reputation/:username", this.rateLimitMiddleware(), this.reputation);
    }
}

module.exports = UsersController;
