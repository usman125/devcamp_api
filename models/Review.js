const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a title for the review"],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, "Please add some text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please add a rating between 1 and 10"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get avg of course tuitions
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating,
      });
    } else {
      // No courses left → reset averageRating
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: 0, // or 0, depending on your needs
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating after remove
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    try {
      await this.model("Review").getAverageRating(this.bootcamp);
    } catch (err) {
      console.error("Failed to update average cost after deletion:", err);
    }
  }
);

// CourseSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     console.log("doc in after delet:''", doc);
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

module.exports = mongoose.model("Review", ReviewSchema);
