import express from "express";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

router.route("/").get(ReviewsCtrl.apiGetReviews);
router.route("/username").get(ReviewsCtrl.apiGetReviewByUsername);

router
    .route("/CRUD")
    .put(ReviewsCtrl.apiUpdateReviews)
    .post(ReviewsCtrl.apiPostReview)
    .delete(ReviewsCtrl.apiDeleteReviews)

export default router;