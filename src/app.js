const express = require("express");

const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryExist(request, response, next){
    const id = request.params;
    const repositoryIndex = repositories.findIndex(r=>r.id === id);

    if(repositoryIndex < 0)
      return response.status(400).json({error: "Repository not found"});

    request.repositoryIndex = repositoryIndex;
    return next();
}

app.use("/repositories/:id",validateRepositoryExist);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, like: 0};
  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

    const repositoryIndex = request.repositoryIndex;
    const {title, url, techs} = request.body;
    repositories[repositoryIndex] = {title,url,techs};
    return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {

    const repositoryIndex = request.repositoryIndex;
    repositories.splice(repositoryIndex,1);
    return response.status(204).send();  

});

app.post("/repositories/:id/like", validateRepositoryExist, (request, response) => {

   const repository = repositories[request.repositoryIndex];
   repository.like += repository.like;
   repositories[request.repositoryIndex] = repository;
   return response.json(repository);

});

module.exports = app;
