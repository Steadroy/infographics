'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ColourSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    hex: {
        type: String,
        required: true,
        trim: true,
        default: 'inherit'
    }, alpha: {
        type: Number,
        required: true,
        default: 1
    }
});

/**
 * Statics
 */
ColourSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Colour', ColourSchema);
