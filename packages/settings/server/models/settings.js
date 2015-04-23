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
        type: {
            backgrounds: [{
                    type: String,
                    required: true,
                    trim: true
                }],
            texts: [{
                    type: String,
                    required: true,
                    trim: true
                }],
            borders_frames: [{
                    type: String,
                    required: true,
                    trim: true
                }]
        },
        default: {
            backgrounds: [],
            texts: [],
            borders_frames: []
        }
    },
    texts: {
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
                    type: String,
                    required: true,
                    trim: true,
                    default: 'inherit'
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
