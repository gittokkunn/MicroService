var posts = [
  {title: '記事０', body: '本文０'},
  {title: '記事１', body: '本文１'},
  {title: '記事２', body: '本文２'}
];

exports.index = function(req, res) {
  res.render('posts/index.ejs', {posts: posts});
};
exports.show = function(req, res) {
  res.render('posts/show.ejs', {post: posts[req.params.id]});
};
exports.new = function(req, res) {
  res.render('posts/new.ejs');
};
exports.edit = function(req, res) {
  res.render('posts/edit.ejs', {post: posts[req.params.id], id: req.params.id});
};
exports.update = function(req, res, next) {
  if (req.body.id != req.params.id) {
    next(new Error('ID not valid'));
  }else {
    posts[req.body.id] = {
      title: req.body.title,
      body: req.body.body
    };
    res.redirect('/posts');
  }
};
exports.destroy = function(req, res, next) {
  if (req.body.id != req.params.id) {
    next(new Error('ID not valid'));
  }else {
    posts.splice(req.body.id, 1);
    res.redirect('/posts');
  }
};
exports.create = function(req, res) {
  var post = {
    title: req.body.title,
    body: req.body.body
  };
  posts.push(post);
  res.redirect('/posts/');
};
