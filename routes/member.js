var members = [
  {name: '小澤愛実', team: 'シューロケ', comment: '笑顔が武器です'},
  {name: '松本ももな', team: 'シューロケ', comment: 'センターです'},
  {name: '長月翠', team: 'シューロケ', comment: '兼任です'},
  {name: '猪子れいあ', team: 'サムサム', comment: 'おでこ'},
  {name: '古賀哉子', team: 'ラルーチェ', comment: '女優です'}
];

exports.index = function(req, res) {
  res.render('members/index.ejs', {members: members});
};
exports.show = function(req, res) {
  res.render('members/show.ejs', {member: members[req.params.id]});
};
