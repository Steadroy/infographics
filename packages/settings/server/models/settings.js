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
    fonts: [{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Font'
    }],
    borders: [{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Border'
    }],
    overlays: [{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Overlay'
    }]
});

/**
 * Statics
 */
SettingSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
SettingSchema.plugin(deepPopulate);

mongoose.model('Setting', SettingSchema);
