const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/errorresponse");
const path = require("path");
const MailtrapClient = require("mailtrap");

// @desc create bootcamp
// @route POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to body
  req.body.user = req.user.id;

  // check for published bootcamps
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // if the user is not an admin, can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with the id ${req.user.id} has already published a bootcamp`,
        401
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc get bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById({ _id: req.params.id });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.udpateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to update this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`please upload a file`, 404));
  }

  const file = req.files.file;

  // make sure it is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `please upload an image less than ${process.env.MAX_FILE_UPLOAD}!`,
        400
      )
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`problem wih file upload!`, 500));
    }
  });

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc create bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is the owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorised to update this bootcamp`,
        401
      )
    );
  }

  await bootcamp.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc get bootcamp within a radius
// @route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc raius
  // Divide distance by radius of earth
  // radius of earth is 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Test Mailtrap by creating a new inbox (alias email)
// @route POST /api/v1/bootcamps/testmailtrap
// @access Private
exports.testMailTrap = asyncHandler(async (req, res, next) => {
  const TOKEN = "fa3e12b536e5461dc800bab1efd2e271";

  try {
    // 2522645 : projectID
    // 2467743 : accountID
    // Create a new inbox in Mailtrap
    const response = await fetch(
      "https://mailtrap.io/api/accounts/2467743/projects/2522645/inboxes",
      {
        method: "POST",
        headers: {
          "Api-Token": TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          inbox: {
            name: "My new inbox",
          },
        }),
      }
    );
    // const response = await fetch(
    //   "https://mailtrap.io/api/accounts/2467743/projects",
    //   {
    //     headers: {
    //       "Api-Token": TOKEN,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //   }
    // );

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return next(
        new ErrorResponse(
          `Mailtrap API error: ${response.status} ${
            response.statusText
          } - ${JSON.stringify(errorData)}`,
          401
        )
      );
    }

    const data = await response.json();

    // console.log(data);
    // Construct the full email address
    // const aliasEmail = `${data.email}@${data.domain}`;

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error creating Mailtrap inbox:", error);

    // Handle specific error cases
    if (error.message.includes("401")) {
      return next(
        new ErrorResponse("Invalid or missing Mailtrap API token", 401)
      );
    }

    if (error.message.includes("422")) {
      return next(
        new ErrorResponse("Validation error when creating inbox", 422)
      );
    }

    return next(
      new ErrorResponse(
        "Failed to create Mailtrap inbox: " + error.message,
        500
      )
    );
  }
});
