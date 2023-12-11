const UsersModel = require("../models/users")

class UsersController {
    constructor(app) {
        this.app = app;

        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);

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
        const {reputation, username} = req.body;

        try {
            const user = UsersModel.updateOne(
                { username: username },
                { $set: {reputation: reputation} }
            );
            res.json(user);
        } catch(error) {
            console.error("Could not update reputation " +error.message);
        }
    }

    setupRoutes() {
        this.app.post("/api/signup", this.signup);
        this.app.post("/api/login", this.login);
        this.app.put("/api/users/reputation", this.reputation);
    }
}

module.exports = UsersController;
