import Joi from "joi";
import ReviewsDAO from "../dao/reviewsDAO.js";
import Schemas from "../schemas/joi.schemas.js";

export default class ReviewsController {
    
    // * CRUD methods
    //Gets all non deleted reviews with optional filters from query parameters
    static async apiGetReviews (req,res,next) {
        try {
            const reviewsPerPage = req.query.reviewsPerPage ? parseInt(req.query.reviewsPerPage, 10) : 20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    
            let filters = {};
            if (req.query.city) {
                filters.city = req.query.city;
            } else if (req.query.state) {
                filters.state = req.query.state;
            } else if (req.query.country){
                filters.country = req.query.country;
            } else if (req.query.username){
                filters.username = req.query.username;
            }
    
            const {reviewsList, totalNumReviews} = await ReviewsDAO.getAllReviews( {
                filters,
                page,
                reviewsPerPage
            });
    
            let response = {
                reviews: reviewsList,
                page: page,
                filters: filters,
                entries_per_page: reviewsPerPage,
                total_results: totalNumReviews,
            }
            res.json(response)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    
    //Registers a new review to the database
    static async apiPostReview (req,res,next) {
        try {
            const body = req.body;
            const reviewInfo = {
                username: body.username,
                location: {
                    city: body.location.city,
                    state: body.location.state,
                    country: body.location.country
                },
                review_values: {
                    treatment_quality: body.review_values.treatment_quality,
                    communication: body.review_values.communication,
                    price: body.review_values.price,
                    facilities: body.review_values.facilities,
                    satisfaction: body.review_values.satisfaction,
                    personnel_treatment: body.review_values.personnel_treatment,
                    waiting_time: body.review_values.waiting_time,
                    explanation: body.review_values.explanation,
                    appointment: body.review_values.appointment,
                },
                review_comment: body.review_comment,
                review_recommendation: body.review_recommendation,
                deleted: false,
            }
            
            Joi.assert(reviewInfo,Schemas.reviewSchema);
            const ReviewID = await ReviewsDAO.getReviewID();

            reviewInfo.review_id = ReviewID.value.count;
            reviewInfo.creation_date = new Date();
            reviewInfo.updatedAt = new Date();

            const ReviewResponse = await ReviewsDAO.addReview(
                reviewInfo
            )

            res.json({ status:"success"})

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Soft deletes a review found by username and location
    static async apiDeleteReviews (req,res,next) {
        try {
            const reviewInfo = {
                username: req.body.username,
            }

            Joi.assert(reviewInfo,Schemas.deleteReviewSchema);

            const ReviewResponse = await ReviewsDAO.deleteReview(
                reviewInfo
            )
            if (ReviewResponse.matchedCount == 0) {
                res.status(400).json({ error: "Review not found with username and location provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateReviews (req,res,next) {
        try {
            const body = req.body;
            const reviewInfo = {
                username: body.username,
                location: {
                    city: body.location.city,
                    state: body.location.state,
                    country: body.location.country
                },
                review_values: {
                    treatment_quality: body.review_values.treatment_quality,
                    communication: body.review_values.communication,
                    price: body.review_values.price,
                    facilities: body.review_values.facilities,
                    satisfaction: body.review_values.satisfaction,
                    personnel_treatment: body.review_values.personnel_treatment,
                    waiting_time: body.review_values.waiting_time,
                    explanation: body.review_values.explanation,
                    appointment: body.review_values.appointment,
                },
                review_comment: body.review_comment,
                review_recommendation: body.review_recommendation,
                deleted: false,
            }

            Joi.assert(reviewInfo,Schemas.reviewSchema);

            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewInfo
            )
            if (ReviewResponse.matchedCount == 0) {
                res.status(400).json({ error: "Review not found with username provided" });
            } else {
                res.json({ status:"success"})
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //* Specific methods
    //Gets a review by its username
    static async apiGetReviewByUsername(req,res,next) {
        try {
            let username = req.body.username;
            let review = await ReviewsDAO.getReviewByUsername(username);
            if(!review) {
                res.status(404).json({ error: "Review not found"})
                return
            }
            res.json(review)
        } catch (e) {
            console.log(`api ${e}`);
            res.status(500).json({ error: e });
        }

    }
}