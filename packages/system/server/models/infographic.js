'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InfographicSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Infographic'
    },
    description: {
        type: String,
        required: true,
        trim: true,
        default: 'Description'
    },
    tags: [],
    team: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Team'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    poster: {
        type: String,
        trim: true,
        default: ''
    },
    ready: {
        type: Boolean,
        required: true,
        default: false
    },
    template: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Template'
    },
    content: [{
        id: {
            type: String,
            required: false,
            default: ''
        },
        content: {
            type: String,
            required: false,
            default: ''
        },
        background: { 
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Background'
        }
    }]
});

/**
 * Statics
 */
InfographicSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
InfographicSchema.plugin(deepPopulate);

mongoose.model('Infographic', InfographicSchema);
