const AnswersModel = require("../models/answers");
const QuestionsModel = require("../models/questions");
const TagsModel = require("../models/tags");
const CommentsModel = require("../models/comments");

class MainController {
  constructor(app) {
    this.app = app;

    this.getAllData = this.getAllData.bind(this);

    this.setupRoutes();
  }

  async getAllData(req, res) {
    try {
      const questions = await QuestionsModel.find();
      const answers = await AnswersModel.find();
      const tags = await TagsModel.find();
      const comments = await CommentsModel.find();

      const formattedData = {
        questions: questions.map((question) => ({
          qid: question.qid,
          title: question.title,
          text: question.text,
          tagIds: question.tags,
          askedBy: question.asked_by,
          askDate: question.ask_date_time,
          ansIds: question.answers,
          views: question.views,
          votes: question.votes,
          upvoteBy: question.upvoteBy,
          downvoteBy: question.downvoteBy,
          pinnedAnswer: question.pinnedAnswer,
          comIds: question.comments,
          lastAskDate: question.last_ask_date_time
        })),
        tags: tags.map((tag) => ({
          tid: tag.tid,
          name: tag.name,
          tagBy: tag.tag_by
        })),
        answers: answers.map((answer) => ({
          aid: answer.aid,
          text: answer.text,
          ansBy: answer.ans_by,
          ansDate: answer.ans_date_time,
          votes: answer.votes,
          upvoteBy: answer.upvoteBy,
          downvoteBy: answer.downvoteBy,
          comments: answer.comments
        })),
        comments: comments.map((comment) => ({
          cid: comment.cid,
          name: comment.name,
          comBy: comment.comment_by,
          comDate: comment.com_date_time
        }))
      };

      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  setupRoutes() {
    this.app.get("/api/getAllData", this.getAllData);
  }
}

module.exports = MainController;
