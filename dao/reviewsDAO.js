import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    //* DB connection
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.ATLAS_NS).collection("reviews");
        } catch (e) {
            console.error(
                `Unable to establish a collection hande in reviewsDAO: ${e}`,
            );
        }
    }

    //* Specific search methods
    static async getReviewByUsername(username) {
        try {
            const pipeline = [
                {
                    $match: {
                        username: username,
                        deleted: false
                    }
                },
            ];
            return await reviews.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getReviewByUsername: ${e}`);
            throw e;
        }
    }

    //* CRUD METHODS
    static async getAllReviews ({
        filters = null,
        page = 0,
        reviewsPerPage = 20,
    } = {}) {

        //Customize DB searches
        let query = {deleted: {$eq: false}};
        if (filters) {
            if ("username" in filters) {
                query = {$text: { $search: filters["username"]}, deleted: {$eq: false}};
            } else if ("city" in filters) {
                query = {"location.city": { $eq: filters["city"]}, deleted: {$eq: false}};
            } else if ("state" in filters){
                query = {"location.state": { $eq: filters["state"]}, deleted: {$eq: false}};
            } else if ("country" in filters){
                query = {"location.country": { $eq: filters["country"]}, deleted: {$eq: false}};
            } 
        }

        let cursor

        try {
            cursor = await reviews
                .find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {reviewList: [], totalNumReviews: 0};
        }

        const displayCursor = cursor.limit(reviewsPerPage).skip(reviewsPerPage * page);

        try {
            const reviewsList = await displayCursor.toArray();
            const totalNumReviews = page === 0 ? await reviews.countDocuments(query) : 0;
            return {reviewsList, totalNumReviews}
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return {reviewList: [], totalNumReviews: 0};
        }
    }
    
    static async addReview(reviewDoc)
    {    
        try {
            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewDoc)
        {
        try {                
            const updateResponse = await reviews.updateOne(
                {username: reviewDoc.username, deleted: false},
                {$set:{
                    username: reviewDoc.username,
                    location: {
                        city: reviewDoc.location.city,
                        state: reviewDoc.location.state,
                        country: reviewDoc.location.country
                    },
                    review_values: {
                        treatment_quality: reviewDoc.review_values.treatment_quality,
                        communication: reviewDoc.review_values.communication,
                        price: reviewDoc.review_values.price,
                        facilities: reviewDoc.review_values.facilities,
                        satisfaction: reviewDoc.review_values.satisfaction,
                        personnel_treatment: reviewDoc.review_values.personnel_treatment,
                        waiting_time: reviewDoc.review_values.waiting_time,
                        explanation: reviewDoc.review_values.explanation,
                        appointment: reviewDoc.review_values.appointment,
                    },
                    review_comment: reviewDoc.review_comment,
                    review_recommendation: reviewDoc.review_recommendation,
                }}
            )
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update company: ${e}`);
            return { error: e };
        }
    }

    //soft deletion
    static async deleteReview(reviewDoc)
        {
        try {
            const deleteResponse = await reviews.updateOne(
                {username: reviewDoc.username, deleted: false},
                {$set:{
                    deleted: true
                }}
            )

            return deleteResponse
        } catch (error) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }

    static async getReviewID() {
        try {
            const testResponse = await reviews.findOneAndUpdate(
                { "_id": "UNIQUE COUNT DOCUMENT IDENTIFIER" },
                { $inc: { "count": 1 }}
            )
            return testResponse
        } catch (e) {
            console.error(`Unable to get ID: ${e}`);
            return { error: e };
        }
    }

    //* miscellaneous
}


