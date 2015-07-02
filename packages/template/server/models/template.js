'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Template'
    },
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
    doms: [{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Dom'
    }]
});

/**
 * Statics
 */
TemplateSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

var deepPopulate = require('mongoose-deep-populate');
TemplateSchema.plugin(deepPopulate);

mongoose.model('Template', TemplateSchema);
