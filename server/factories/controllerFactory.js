const AnswersController = require("../controllers/answersController");
const QuestionsController = require("../controllers/questionsController");
const TagsController = require("../controllers/tagsController");
const UsersController = require("../controllers/usersController");
const MainController = require("../controllers/mainController");
const CommentsController = require("../controllers/commentsController");

class ControllerFactory {
  static createController(app, type) {
    switch(type) {
      case 'Answers':
        return new AnswersController(app);
      case 'Main':
          return new MainController(app);
      case 'Questions':
        return new QuestionsController(app);
      case 'Tags':
        return new TagsController(app);
      case 'Users':
        return new UsersController(app);
      case 'Comments':
        return new CommentsController(app);
    }
  }
}

module.exports = ControllerFactory;
