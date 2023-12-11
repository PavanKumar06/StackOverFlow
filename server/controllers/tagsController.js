const TagsModel = require("../models/tags");

class TagsController {
  constructor(app) {
    this.app = app;

    this.findTags = this.findTags.bind(this);
    this.createTag = this.createTag.bind(this);

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

  setupRoutes() {
    this.app.get("/api/tags", this.findTags);
    this.app.post("/api/tags", this.createTag);
    this.app.put("/api/tags/name/:tid", this.updateName);
    this.app.delete("/api/tags/:tid", this.deleteTag);
  }
}

module.exports = TagsController;