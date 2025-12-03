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
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  
  // Check for duplicate review
  const alreadyReviewed = await reviewModel.checkExistingReview(inv_id, account_id)
  if (alreadyReviewed) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors in your review.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  
  next()
}

module.exports = validate