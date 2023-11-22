const mongoose = require('mongoose')
const Review = require('./review')

const imageSchema = new mongoose.Schema({
    url: String,
    name: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});

const campgroundSchema = new mongoose.Schema({
    title: String,
    image:[imageSchema],
    price: Number,
    description:String,
    location: String,
    author : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
    }
    ]
})

campgroundSchema.post('findOneAndDelete', async function (data) {
    if(data){
        for(let reviewId of data.reviews){
            const review = await Review.findByIdAndDelete(reviewId)
        } 
    }
})
const Campground = mongoose.model('CampGround', campgroundSchema)

module.exports = Campground;