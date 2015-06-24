'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        required: false,
        trim: true
    },
    settings: {
        type: Schema.Types.ObjectId,
        ref: 'Setting'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    designers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    journalists: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

/**
 * Validations
 */
TeamSchema.path('name').validate(function (name) {
    return !!name;
}, 'Name cannot be blank');

/**
 * Statics
 */
TeamSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};
mongoose.model('Team', TeamSchema);
