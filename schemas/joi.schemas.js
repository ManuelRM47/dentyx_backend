import Joi from "joi";

export default class Schemas {
    
    static reviewSchema = Joi.object({
        username: Joi.string().required(),
        location: Joi.object({
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
        }
        ).required(),
        creation_date: Joi.date().timestamp(),
        review_values: Joi.object({
            treatment_quality: Joi.number().min(1).max(5).required(),
            communication: Joi.number().min(1).max(5).required(),
            price: Joi.number().min(1).max(5).required(),
            facilities: Joi.number().min(1).max(5).required(),
            satisfaction: Joi.number().min(1).max(5).required(),
            personnel_treatment: Joi.number().min(1).max(5).required(),
            waiting_time: Joi.number().min(1).max(3).required(),
            explanation: Joi.number().min(1).max(5).required(),
            appointment: Joi.number().min(1).max(5).required(),
        }).required(),
        review_comment: Joi.string().required(),
        review_recommendation: Joi.string().required(),
        updateAt: Joi.date().timestamp(),
        deleted: Joi.boolean(),
    })

    static deleteReviewSchema = Joi.object({
        username: Joi.string().required(),
    })

}