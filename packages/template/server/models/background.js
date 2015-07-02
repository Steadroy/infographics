'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BackgroundSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    background_color: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Colour'
    },
    background_image: {
        type: String,
        required: true,
        trim: true,
        default: 'none'
    },
    background_repeat: {
        type: String,
        required: true,
        trim: true,
        enum: ['no-repeat', 'repeat-x', 'repeat-y', 'repeat'],
        default: 'no-repeat'
    },
    background_size: {
        type: String,
        required: true,
        trim: true,
        enum: ['contain', 'cover', 'inherit', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
        default: 'inherit'
    },
    background_position: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'left top',
            'left center',
            'left bottom',
            'right top',
            'right center',
            'right bottom',
            'center top',
            'center center',
            'center bottom'
        ],
        default: 'center center'
    }
});

/**
 * Statics
 */
BackgroundSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
BackgroundSchema.plugin(deepPopulate);

mongoose.model('Background', BackgroundSchema);
