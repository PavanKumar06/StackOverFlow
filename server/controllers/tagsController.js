const TagsModel = require("../models/tags");
const rateLimit = require("express-rate-limit");

class TagsController {
  constructor(app) {
    this.app = app;

    this.findTags = this.findTags.bind(this);
    this.createTag = this.createTag.bind(this);

    this.rateLimitMiddleware();

    this.setupRoutes();
  }

  async findTags(req, res) {
    const tags = await TagsModel.find();
    res.json(tags);
  }

  async createTag(req, res) {
    const newTag = await TagsModel.create(req.body);
    res.json(newTag);
  }

  async updateName(req, res) {
    const {name} = req.body

    console.log(name);
    console.log(req.params.tid)

    const tag = await TagsModel.updateOne(
      {tid: req.params.tid},
      {$set: {name: name}}
    )

    res.json(tag);
  }

  async deleteTag(req, res) {
    const tag = await TagsModel.deleteOne(
      {tid: req.params.tid},
    )

    res.json(tag);
  }

  rateLimitMiddleware() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      message: "Too many requests from this IP, please try again later.",
    });
  }

  setupRoutes() {
    this.app.get("/api/tags", this.rateLimitMiddleware(), this.findTags);
    this.app.post("/api/tags", this.rateLimitMiddleware(), this.createTag);
    this.app.put("/api/tags/name/:tid", this.rateLimitMiddleware(), this.updateName);
    this.app.delete("/api/tags/:tid", this.rateLimitMiddleware(), this.deleteTag);
  }
}

module.exports = TagsController;