const express = require("express");
const app = express();
const postBank = require("./postBank");
const morgan = require("morgan");

app.use(morgan('dev'));
app.use(express.static('public'))

app.get("/", (req, res) => {
  const posts = postBank.list();
  const html = `<!DOCTYPE html>
    <html> 
      <head> 
        <title> Wizard News </title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body> 
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>

          ${posts.map(post =>
              `
            <div class='news-item'>
              <p>
                <span class="news-position">${post.id}. ▲</span>
                <a href="/posts/${post.id}">${post.title}</a>
                <small>(by ${post.name})</small>
              </p>
              <small class="news-info">
                ${post.upvotes} upvotes | ${post.date}
              </small>
            </div>`
            ).join('')}

        </div>
      </body>
    </html>
`;
  res.send(html);

});

app.get('/posts/:id', (req, res,next) => {
  const id = req.params.id;
  
  const post = postBank.find(id);
  if (!post.id) {
    next({
      "name": "PostNotFound",
      "message": "Post ID does not exist."
    })
  }
  else{
    const html =
   `<!DOCTYPE html>
    <html> 
      <head> 
        <title> Wizard News </title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body> 
        <div class="news-list">
            <header><img src="/logo.png"/>Wizard News</header>
            <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>
              ${post.title}
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${post.date}
            </small>
            <p>  ${post.content}</p>
          </div>
        </div>
      </body>
    </html>`
  res.send(html); 
  }
 
});

const { PORT = 1337 } = process.env;

app.use((err, req, res, next) => {
  console.log(err);
  const html = `
  <!DOCTYPE html>
    <html> 
      <head> 
        <title> ${err.name} </title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body> 
        <h1> ${err.message}</h1>
      </body>
    </html>  
  `
 res.status(404).send(html)
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
