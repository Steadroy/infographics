'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DomSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    dom_id: {
        type: String,
        required: true,
        trim: true,
        default: '#infographic-container'
    },
    parent_dom_id: {
        type: String,
        trim: true,
        default: ''
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['container', 'text', 'media', 'chart'],
        default: 'container'
    },
    configuration: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Configuration'
    }
});

/**
 * Statics
 */
DomSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
DomSchema.plugin(deepPopulate);

mongoose.model('Dom', DomSchema);
