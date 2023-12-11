const AnswersModel = require("../models/answers");
const rateLimit = require("express-rate-limit");

class AnswersController {
  constructor(app) {
    this.app = app;

    this.getAnswers = this.getAnswers.bind(this);
    this.createAnswer = this.createAnswer.bind(this);

    this.rateLimitMiddleware();

    this.setupRoutes();
  }

  async getAnswers(req, res) {
    const answers = await AnswersModel.find();
    res.json(answers);
  }

  async createAnswer(req, res) {
    const newAnswer = await AnswersModel.create(req.body);
    res.json(newAnswer);
  }

  async updateComments(req, res) {
    const { cid } = req.body;

    const answer = await AnswersModel.updateOne(
      { aid: req.params.aid },
      { $push: { comments: cid } }
    );

    res.json(answer);
  }

  async updateText(req, res) {
    const {text} = req.body

    const answer = await AnswersModel.updateOne(
      {aid: req.params.aid},
      {$set: {text: text}}
    )

    res.json(answer);
  }

  async deleteAns(req, res) {
    const answer = await AnswersModel.deleteOne(
      {aid: req.params.aid},
    )

    res.json(answer);
  }

  async updateVotesOnServer(req, res) {
    const answer = await AnswersModel.updateOne(
      { aid: req.params.aid },
      { $set: { votes: req.body.votes } }
    );
    res.json(answer);
  }

  async upvotedBy(req, res) {
    const { upvoteBy } = req.body;
    const answer = await AnswersModel.updateOne(
      { aid: req.params.aid },
      {
        $addToSet: { upvoteBy: upvoteBy },
        $pull: { downvoteBy: upvoteBy },
      },
      { new: true }
    );
    res.json(answer);
  }

  async downvotedBy(req, res) {
    const { downvoteBy } = req.body;
    const answer = await AnswersModel.updateOne(
      { aid: req.params.aid },
      {
        $addToSet: { downvoteBy: downvoteBy },
        $pull: { upvoteBy: downvoteBy },
      },
      { new: true }
    );
    res.json(answer);
  }

  rateLimitMiddleware() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      message: "Too many requests from this IP, please try again later.",
    });
  }

  setupRoutes() {
    this.app.get("/api/answers", this.rateLimitMiddleware(), this.getAnswers);
    this.app.post("/api/answers", this.rateLimitMiddleware(), this.createAnswer);
    this.app.put("/api/answers/comments/:aid", this.rateLimitMiddleware(), this.updateComments);
    this.app.put("/api/answers/text/:aid", this.rateLimitMiddleware(), this.updateText);
    this.app.delete("/api/answers/:aid", this.rateLimitMiddleware(), this.deleteAns);
    this.app.put("/api/answers/votes/:aid", this.rateLimitMiddleware(), this.updateVotesOnServer);
    this.app.put("/api/answers/upvotedby/:aid", this.rateLimitMiddleware(), this.upvotedBy);
    this.app.put("/api/answers/downvotedby/:aid", this.rateLimitMiddleware(), this.downvotedBy);
  }
}

module.exports = AnswersController;
