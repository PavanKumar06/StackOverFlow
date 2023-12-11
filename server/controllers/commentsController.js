const CommentsModel = require("../models/comments");

class CommentsController {
    constructor(app) {
        this.app = app;

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

    setupRoutes() {
        this.app.get("/api/comments", this.findComments);
        this.app.post("/api/comments", this.createComment);
      }
}

module.exports = CommentsController;