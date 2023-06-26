const router = require("express").Router();

router.use("/todos", require('./todo.routes'));
router.use("/auth", require('./auth.routes'));

module.exports = router