const CommentsModel = require("../models/comments");
const rateLimit = require("express-rate-limit");

class CommentsController {
    constructor(app) {
        this.app = app;

        this.rateLimitMiddleware();

        this.setupRoutes();
    }

    async findComments(req, res) {
        const comments = await CommentsModel.find();
        res.json(comments);
    }
    
    async createComment(req, res) {
        const newComment = await CommentsModel.create(req.body);
        res.json(newComment);
    }

    rateLimitMiddleware() {
        return rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 1000,
          message: "Too many requests from this IP, please try again later.",
        });
      }

    setupRoutes() {
        this.app.get("/api/comments", this.rateLimitMiddleware(), this.findComments);
        this.app.post("/api/comments", this.rateLimitMiddleware(), this.createComment);
      }
}

module.exports = CommentsController;