'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var BorderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    border_style: {
        type: String,
        required: true,
        trim: true,
        enum: ['dashed', 'dotted', 'solid', 'none'],
        default: 'solid'
    },
    border_top_width: {
        type: String,
        required: true,
        trim: true,
        default: '1px'
    },
    border_right_width: {
        type: String,
        required: true,
        trim: true,
        default: '1px'
    },
    border_bottom_width: {
        type: String,
        required: true,
        trim: true,
        default: '1px'
    },
    border_left_width: {
        type: String,
        required: true,
        trim: true,
        default: '1px'
    },
    border_radius: {
        type: String,
        required: true,
        trim: true,
        default: '0px'
    },
    border_color: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Colour'
    }
});

/**
 * Statics
 */
BorderSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
BorderSchema.plugin(deepPopulate);

mongoose.model('Border', BorderSchema);
