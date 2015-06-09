'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Media Schema
 */
var MediaSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    poster: {
        type: String,
        required: false,
        trim: true
    },
    alt: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    filetype: {
        type: String,
        required: true,
        trim: true,
        enum: ['image', 'video'],
        default: 'image'
    },
    tags: []
});

/**
 * Statics
 */
MediaSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Media', MediaSchema);
