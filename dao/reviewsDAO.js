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

    //soft deletion
    static async deleteReview(reviewDoc)
        {
        try {
            const deleteResponse = await reviews.updateOne(
                {location:reviewDoc.location, username: reviewDoc.username, deleted: false},
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

    //* miscellaneous
}


