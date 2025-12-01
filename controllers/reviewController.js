const reviewModel = require("../models/review-model")

const reviewCont = {}

/* ***************************
 * Process review submission
 * ************************** */
reviewCont.addReview = async function (req, res) {
  const { inv_id, review_rating, review_text } = req.body
  const account_id = res.locals.accountData.account_id

  const result = await reviewModel.addReview(inv_id, account_id, review_rating, review_text)

  if (result) {
    req.flash("notice", "Thank you for your review!")
  } else {
    req.flash("notice", "Sorry, there was an error submitting your review.")
  }
  
  res.redirect(`/inv/detail/${inv_id}`)
}

module.exports = reviewCont