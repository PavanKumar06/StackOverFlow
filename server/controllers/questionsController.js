const QuestionsModel = require("../models/questions");

class QuestionsController {
  constructor(app) {
    this.app = app;

    this.findQuestions = this.findQuestions.bind(this);
    this.createQuestion = this.createQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.updateQuestionAnswer = this.updateQuestionAnswer.bind(this);

    this.setupRoutes();
  }

  async findQuestions(req, res) {
    const questions = await QuestionsModel.find();
    res.json(questions);
  }

  async createQuestion(req, res) {
    const newQuestion = await QuestionsModel.create(req.body);
    res.json(newQuestion);
  }

  async updateQuestion(req, res) {
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { $set: { views: req.body.views } }
    );
    res.json(question);
  }

  async updateQuestionAnswer(req, res) {
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { $set: { answers: req.body.answers } }
    );
    res.json(question);
  }

  async updateVotesOnServer(req, res) {
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { $set: { votes: req.body.votes } }
    );
    res.json(question);
  }

  async upvotedBy(req, res) {
    const { upvotedBy } = req.body;
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { 
        $addToSet: { upvoteBy: upvotedBy },
        $pull: { downvoteBy: upvotedBy }
      },
      { new: true }
    );
    res.json(question);
  }

  async downvotedBy(req, res) {
    const { downvotedBy } = req.body;
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { 
        $addToSet: { downvoteBy: downvotedBy },
        $pull: { upvoteBy: downvotedBy }
      },
      { new: true }
    );
    res.json(question);
  }

  async pinnedAnswer(req, res) {
    const { aId } = req.body;
    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { $set: { pinnedAnswer: aId } }
    );
    res.json(question);
  }

  async updateComments(req, res) {
    const { cid } = req.body;

    const question = await QuestionsModel.updateOne(
      { qid: req.params.qid },
      { $push: { comments: cid } }
    );

    res.json(question);
  }

  async updateQuestionTitleText(req, res) {
    const {title, text} = req.body;

    try {
      const question = await QuestionsModel.updateOne(
        {qid: req.params.qid},
        {$set: { title: title, text: text }}
      )
      res.json(question);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteQues(req, res) {
    const question = await QuestionsModel.deleteOne(
      {qid: req.params.qid},
    )

    res.json(question);
  }

  async updateLastAskDate(req, res) {
    try {
      const question = await QuestionsModel.updateOne(
        {qid: req.params.qid},
        {$set: { last_ask_date_time: new Date() }}
      )
      res.json(question);
    } catch(error) {
      console.error(error);
    }
  }

  async updateAnswers(req, res) {
    const {aid} = req.body;
    try {
      const question = await QuestionsModel.updateOne(
        {qid: req.params.qid},
        {$pull: { answers: aid }}
      )
      res.json(question);
    } catch (error) {
      console.error(error);
    }
  }



  setupRoutes() {
    this.app.get("/api/questions", this.findQuestions);
    this.app.post("/api/askQuestion", this.createQuestion);
    this.app.put("/api/questions/:qid", this.updateQuestion);
    this.app.put("/api/questions/answer/:qid", this.updateQuestionAnswer);
    this.app.put("/api/questions/votes/:qid", this.updateVotesOnServer);
    this.app.put("/api/questions/upvotedby/:qid", this.upvotedBy);
    this.app.put("/api/questions/downvotedby/:qid", this.downvotedBy);
    this.app.put("/api/questions/pinnedanswer/:qid", this.pinnedAnswer);
    this.app.put("/api/questions/comments/:qid", this.updateComments);
    this.app.put("/api/questions/titletext/:qid", this.updateQuestionTitleText);
    this.app.delete("/api/questions/:qid", this.deleteQues);
    this.app.put("/api/questions/lastAskDate", this.updateLastAskDate);
    this.app.put("/api/questions/answers/:qid", this.updateAnswers);
  }
}

module.exports = QuestionsController;
