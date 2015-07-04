'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    top: {
        type: Number,
        required: true,
        default: 0
    },
    left: {
        type: Number,
        required: true,
        default: 0
    },
    width: {
        type: Number,
        required: true,
        default: 585
    },
    height: {
        type: Number,
        required: true,
        default: 360
    },
    logo_position: {
        type: String,
        required: true,
        trim: true,
        enum: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
        default: 'bottom-right'
    },
    background: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Background'
    },
    border: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Border'
    },
    font: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Font'
    },
    overlay: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Overlay'
    },
    overwrite: {
        padding_top: {
            type: Number,
            required: true,
            default: 0 
        },
        padding_right: {
            type: Number,
            required: true,
            default: 0
        },
        padding_bottom: {
            type: Number,
            required: true,
            default: 0
        },
        padding_left: {
            type: Number,
            required: true,
            default: 0
        }
    }
});

/**
 * Statics
 */
ConfigurationSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
ConfigurationSchema.plugin(deepPopulate);

mongoose.model('Configuration', ConfigurationSchema);
