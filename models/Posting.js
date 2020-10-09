const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Image = require('../models/Image')

const PostingSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        location: {
            country: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            postalCode: {
                type: String
            }
        },
        askingPrice: {
            type: Number,
            required: true
        },
        deliveryTypes: {
            shipping: {
                type: Boolean,
                required: true
            },
            pickup: {
                type: Boolean,
                required: true
            }
        },
        seller: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        },
        images: [{
            type: Schema.ObjectId,
            ref: 'Image'
        }],
        slug: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

PostingSchema.pre('validate', function(next) {
    if (!this.deliveryTypes.shipping && !this.deliveryTypes.pickup) {
        this.invalidate('deliveryTypes', 'Must specify at least one valid delivery type', this.deliveryTypes.shipping);
    }
    next();
})

PostingSchema.pre('remove', async function(next) {
    for (image of this.images) {
        await Image.findOneAndDelete( {_id: image});
    }
})

const Posting = mongoose.model('Posting', PostingSchema);

module.exports = Posting;