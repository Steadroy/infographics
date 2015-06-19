'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Setting Schema
 */
var SettingSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    colours: {
        backgrounds: [{
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Colour'
        }],
        fonts: [{
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Colour'
        }],
        borders: [{
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Colour'
        }],
        overlays: [{
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Colour'
        }]
    },
    fonts: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            style: {
                'font-weight': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['normal', 'bold'],
                    default: 'normal'
                },
                'font-style': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['normal', 'italic'],
                    default: 'normal'
                },
                'text-decoration': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['none', 'underline'],
                    default: 'none'
                },
                'text-transform': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['none', 'uppercase'],
                    default: 'none'
                },
                'font-family': {
                    type: String,
                    required: true,
                    trim: true,
                    default: 'Arial, Helvetica, sans-serif'
                },
                'font-size': {
                    type: String,
                    required: true,
                    trim: true,
                    default: '14px'
                },
                color: {
                    type: Schema.Types.ObjectId,
                    require: true,
                    ref: 'Colour'
                },
                'text-align': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['left', 'right', 'center', 'justify'],
                    default: 'left'
                }
            }    
        }]
    },
    borders: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            style: {
                'border-style': {
                    type: String,
                    required: true,
                    trim: true,
                    enum: ['dashed', 'dotted', 'solid', 'none'],
                    default: 'solid'
                },
                'border-width': {
                    type: String,
                    required: true,
                    trim: true,
                    default: '1px'
                },
                'border-color': {
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
                },
                'border-radius': {
                    type: String,
                    required: true,
                    trim: true,
                    default: '0%'
                }
            }    
        }]
    },
    overlays: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            style: {
                type: {
                    type: Number,
                    required: true,
                    default: 0
                },
                color0: {
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
                },
                color1: {
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
                }
            }
        }]
    }
});

/**
 * Statics
 */
SettingSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Setting', SettingSchema);
