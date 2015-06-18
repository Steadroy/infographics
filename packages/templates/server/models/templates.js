'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Templates Schema
 */
var TemplatesSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    poster: {
        type: String,
        required: false,
        trim: true
    },
    config: {
        type: {
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            },
            background: {
                type:{
                    'background_color':{
                        hex: {
                            type: String,
                            required: true,
                            trim: true
                            
                        }, alpha: {
                            type: Number,
                            required: true
                        }
                    },
                    'background_image': {
                        type: String,
                        required: true,
                        trim: true
                    },
                    'background_repeat': {
                        type: String,
                        required: true,
                        trim: true,
                        enum: ['no-repeat', 'repeat-x', 'repeat-y', 'repeat']
                    },
                    'background_size': {
                        type: String,
                        required: true,
                        trim: true,
                        enum: ['contain', 'cover', 'inherit', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']
                    },
                    'background_position': {
                        type: String,
                        required: true,
                        trim: true,
                        enum: [
                            'left top',
                            'left center',
                            'left bottom',
                            'right top',
                            'right center',
                            'right bottom',
                            'center top',
                            'center center',
                            'center bottom'
                        ]
                    } 
                }
            },
            border: {
                type:{
                    'name': { 
                        type: String,
                        required: true,
                        trim: true
                    },
                    'border-style': {
                        type: String,
                        required: true,
                        trim: true
                    },
                    'border-width': {
                        type: String,
                        required: true,
                        trim: true
                    },
                    'border-color': {
                        hex: {
                            type: String,
                            required: true,
                            trim: true
                        }, alpha: {
                            type: Number,
                            required: true
                        }
                    },
                    'border-radius': {
                        type: String,
                        required: true,
                        trim: true
                    }
                }
            },
            overlay: {
                type:{
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
                }
            },
            grid_vertical: {
                type: Array,
                required: true
            },
            grid_horizontal: {
                type: Array,
                required: true
            },
            elements: [{ }]
        }, 
        default: {
            width: 600,
            height: 300,
            background: {
                'background_color': {
                    hex: 'inherit',
                    alpha: 1
                },
                'background_image': 'none',
                'background_repeat': 'none',
                'background_size': 'none',
                'background_position': 'center center'
            },
            border: {
                'name': 'none',
                'border-style': 'solid',
                'border-width': '1px',
                'border-color': 'inherit',
                'border-radius': '0%'
            },
            overlay: {
                'name': 'none'
            },
            grid_horizontal: [100/3, 100/3, 100/3],
            grid_vertical: [100/3, 100/3, 100/3],
            elements: [{ }]
        }
    },
    tags: []
});

/**
 * Statics
 */
TemplatesSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Templates', TemplatesSchema);
