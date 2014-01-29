
/*
 * GET home page.
 */

exports.index = function(req, res){
  /*if(!req.session.un) {
    console.log("Logging in...");
    req.session.un = req.connection.getPeerCertificate().subject.CN;
  };
  console.log(req.session.un);*/
  res.render('index');
};

exports.partial = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};