const joi=require("joi");
module.exports.listingschema = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    location:joi.string().required(),
    country:joi.string().required(),
    price:joi.number().required().min(0),
    guests:joi.number().required().min(1),
    bedrooms:joi.number().required().min(1),
    beds:joi.number().required().min(1),
    bathrooms:joi.number().required().min(1),
    amenities:joi.alternatives().try(
        joi.array().items(joi.string()),
        joi.string()
    ).default([]),
    image:joi.string().allow(" ",null),
    images:joi.any(),
    deleteImages:joi.alternatives().try(
        joi.array().items(joi.string()),
        joi.string()
    ).optional(),
}).unknown(true);
module.exports.reviewschema=joi.object({
        review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required(),
})