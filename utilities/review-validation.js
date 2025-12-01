const utilities = require(".")
const { body, validationResult } = require("express-validator")
const reviewModel = require("../models/review-model")
const validate = {}

/*  **********************************
 *  Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // Rating is required and must be 1-5
    body("review_rating")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please select a rating from 1 to 5 stars."),

    // Review text is required
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10, max: 500 })
      .withMessage("Review must be between 10 and 500 characters."),

    // Check if user already reviewed this vehicle
    body("inv_id")
      .custom(async (inv_id, { req }) => {
        if (req.body.account_id) {
          const alreadyReviewed = await reviewModel.checkExistingReview(inv_id, req.body.account_id)
          if (alreadyReviewed) {
            throw new Error("You have already reviewed this vehicle.")
          }
        }
      }),
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Redirect back to vehicle detail page with errors
    req.flash("notice", "Please correct the errors in your review.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

module.exports = validate