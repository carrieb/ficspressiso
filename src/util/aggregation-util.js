const AggregationUtil = {
    FANDOM_PIPELINE: [
        {
            '$project': {
                'fandoms': {
                    '$ifNull': ['$fandoms', ['Harry Potter']]
                }
            }
        },
        {
            '$unwind': '$fandoms'
        },
        {
            '$group': {
                '_id': {
                    fandom: '$fandoms'
                },
                count: { '$sum': 1 }
            }
        },
        {
            '$match': {
                count: {'$gt' : 1}
            }
        },
        {
            '$sort': { count: -1 }
        }
    ],

    CHARACTER_PIPELINE: [
        {
            '$project': {
                'characters': '$characters'
            }
        },
        {
            '$unwind': '$characters'
        },
        {
            '$group': {
                '_id': {
                    character: '$characters'
                },
                count: { '$sum': 1 }
            }
        },
        {
            '$sort': { count: -1 }
        }
    ]
};

module.exports = AggregationUtil;
