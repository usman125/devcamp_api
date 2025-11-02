const express = require("express");
const { sendMailgunEmail, webhookMailgun } = require("../controllers/webhook");

const router = express.Router();

router.route("/sendemail").post(sendMailgunEmail);
router.route("/email").post(webhookMailgun);

module.exports = router;
