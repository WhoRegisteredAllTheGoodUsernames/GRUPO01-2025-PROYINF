// src/controllers/sessionController.js
function sessionInfo(req, res) {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
}

module.exports = sessionInfo;
