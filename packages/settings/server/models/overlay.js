'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OverlaySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true,
        default: 0
    },
    color_0: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Colour'
    },
    color_1: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Colour'
    }
});

/**
 * Statics
 */
OverlaySchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
OverlaySchema.plugin(deepPopulate);

mongoose.model('Overlay', OverlaySchema);
