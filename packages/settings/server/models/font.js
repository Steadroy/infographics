'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FontSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    font_weight: {
        type: String,
        required: true,
        trim: true,
        enum: ['normal', 'bold'],
        default: 'normal'
    },
    font_style: {
        type: String,
        required: true,
        trim: true,
        enum: ['normal', 'italic'],
        default: 'normal'
    },
    text_decoration: {
        type: String,
        required: true,
        trim: true,
        enum: ['none', 'underline'],
        default: 'none'
    },
    text_transform: {
        type: String,
        required: true,
        trim: true,
        enum: ['none', 'uppercase'],
        default: 'none'
    },
    font_family: {
        type: String,
        required: true,
        trim: true,
        default: 'Arial, Helvetica, sans-serif'
    },
    font_size: {
        type: String,
        required: true,
        trim: true,
        default: '14px'
    },
    text_align: {
        type: String,
        required: true,
        trim: true,
        enum: ['left', 'right', 'center', 'justify'],
        default: 'left'
    },
    color: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Colour'
    }
});

/**
 * Statics
 */
FontSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
FontSchema.plugin(deepPopulate);

mongoose.model('Font', FontSchema);
