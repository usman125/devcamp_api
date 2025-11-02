const asyncHandler = require("../middleware/async");

const FormData = require("form-data"); // form-data v4.0.1
const Mailgun = require("mailgun"); // mailgun.js v11.1.0

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
  const emailStore = {};
  // Parse raw body as URL-encoded (Mailgun sends form data)
  console.log(req.body);
  // const body = new URLSearchParams(req.body);
  // const to = body.get("recipient");
  // const from = body.get("sender");
  // const subject = body.get("subject");
  // const bodyPlain = body.get("body-plain");
  // const bodyHtml = body.get("body-html");

  const {
    recipient,
    sender,
    subject,
    "body-plain": bodyPlain,
    "body-html": bodyHtml,
  } = req.body;

  // Save email
  if (!emailStore[recipient]) emailStore[to] = [];
  emailStore[to].push({
    id: crypto.randomUUID(),
    sender,
    subject,
    bodyPlain,
    bodyHtml,
    receivedAt: new Date().toISOString(),
  });

  console.log(`📧 Received email for ${recipient} from ${sender} ${bodyPlain}`);
  res.status(200).json({ success: true, data: emailStore });
});
