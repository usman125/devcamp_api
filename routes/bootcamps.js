const express = require("express");
const {
  createBootcamp,
  getBootcamps,
  getBootcamp,
  udpateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
  testMailTrap,
} = require("../controllers/bootcamps");

const advancedResults = require("../middleware/advancedResults");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Include other resource routers
const courseRouter = require("./courses");
const Bootcamp = require("../models/Bootcamp");
const reviewRouter = require("./reviews");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/testmailtrap").get(testMailTrap);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), udpateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
