const pool = require("../database/")

/* ***************************
 * Add a new review
 * ************************** */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `INSERT INTO reviews (inv_id, account_id, review_rating, review_text) 
                 VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(sql, [inv_id, account_id, review_rating, review_text])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    return null
  }
}

/* ***************************
 * Get all reviews for a vehicle
 * ************************** */
async function getReviewsByVehicle(inv_id) {
  try {
    const sql = `SELECT r.review_id, r.review_rating, r.review_text, r.review_date,
                 a.account_firstname, a.account_lastname
                 FROM reviews r
                 JOIN account a ON r.account_id = a.account_id
                 WHERE r.inv_id = $1
                 ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByVehicle error: " + error)
    return []
  }
}

/* ***************************
 * Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = `SELECT AVG(review_rating) as average, COUNT(*) as count
                 FROM reviews
                 WHERE inv_id = $1`
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
    return { average: 0, count: 0 }
  }
}

/* ***************************
 * Check if user already reviewed this vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = `SELECT * FROM reviews WHERE inv_id = $1 AND account_id = $2`
    const result = await pool.query(sql, [inv_id, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingReview error: " + error)
    return false
  }
}

module.exports = {
  addReview,
  getReviewsByVehicle,
  getAverageRating,
  checkExistingReview
}