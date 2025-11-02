const asyncHandler = require("../middleware/async");

const FormData = require("form-data"); // form-data v4.0.1
const Mailgun = require("mailgun"); // mailgun.js v11.1.0

const crypto = require("crypto");
const emailStore = {};

// @desc update a user
// @route PUT /api/v1/webhook/sendemail
// @access Public
exports.sendMailgunEmail = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
});

// @desc update a user
// @route PUT /api/v1/webhook/email
// @access Public
exports.webhookMailgun = asyncHandler(async (req, res, next) => {
  const {
    recipient,
    sender,
    subject,
    "body-plain": bodyPlain,
    "body-html": bodyHtml,
  } = req.body;

  if (!recipient) {
    console.warn("Mailgun webhook: no recipient");
    return res.status(200).send("OK");
  }

  if (!emailStore[recipient]) emailStore[recipient] = [];
  emailStore[recipient].push({
    id: crypto.randomUUID(),
    from: sender,
    subject,
    bodyPlain,
    bodyHtml,
    receivedAt: new Date().toISOString(),
  });

  console.log(
    `📧 Received email for ${recipient} from ${sender}: ${bodyPlain}`
  );

  // Mailgun expects plain text response
  res.status(200).json({ status: "OK", data: emailStore });
});
