'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Template Schema
 */
var TemplateSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
TemplateSchema.path('title').validate(function (title) {
    return !!title;
}, 'Title cannot be blank');

TemplateSchema.path('content').validate(function (content) {
    return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
TemplateSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Template', TemplateSchema);
