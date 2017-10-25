const db = require('./db'); 
const Sequelize = require('sequelize');

module.exports.operate = function(payload, callback) {
    var filterStatment = {};
    var searchStatment = {};
    var getCount = false;
    var limit = null;
    var offset   = payload['offset'];
    var labels   = payload['labels'];
    var keywords = payload['keywords'];

    const t_id   = payload['template_id'];
    const r_id   = payload['record_id'];

    searchStatment.template_id = t_id;

    if (offset==-1) {
        getCount = true;
        offset = null;
    }

    if (offset != null) {
        limit = 25;
        offset = parseInt(offset);
    }
   
    if (r_id) {
        filterStatment.record_id = r_id;
    }

    if (labels) {
        filterStatment.label_id = { $in: labels };
    }
    if (keywords) {
        searchStatment.sentence = { $regexp: keywords.join('|')  };
    }

    db.Group.findAndCountAll({
        attributes: [
            'group_id',
            'sentence',
            'total',
        ],
        where: searchStatment,
        required: true,
        include: [{
            attributes: [
                'pid', 
                'process_id', 
                'record_id',
                'label_id',
            ],
            model: db.Process,
            where: filterStatment,
            required: true,
            include: [{
                attributes: [
                    'label_id',
                    'name',
                ],
                model: db.Label,
            }]
        }],
        offset: offset,
        limit: limit,
    }).then(data => {
        if (getCount) {
            callback({ total: data.count });
        } else {
            data.rows.map(function(item) { 
                item.sentence = item.sentence.split(',')[0].trim();
            });
            callback(data.rows);
        }
    });

}

module.exports.labelInfos = function(payload, callback) {
    const r_id   = payload['record_id'];

    db.Label.findAll({
        attributes: [
            'label_id',
            'name',
            [Sequelize.fn('COUNT', 'processes->process_id'), 'group_count'],
            [Sequelize.fn('SUM', Sequelize.col('total')), 'comment_count'],
        ],
        where: {
            'record_id': r_id
        },
        include: [{
            attributes: [],
            model: db.Process,
            include: [{
                attributes: [],
                model: db.Group,
                required: true,
            }]
        }],
        group: 'label_id',
    }).then(data => {
        console.log(data.length);
        data.map(function(element) {
            if (element.dataValues.comment_count == null) {
                element.dataValues.group_count = 0;
                element.dataValues.comment_count = 0;
            }
        });
        callback(data);
    });
}

module.exports.exportLabels = function(payload, callback) {
    const r_id = payload['record_id'];
    console.log(r_id);
    db.Label.findAll({
        attributes: [
            'label_id',
            'name',
        ],
        where: {'record_id': r_id},
        include: [{
            model: db.Process,
            include: [{
                attributes: [ 
                    'sentence',
                ],
                model: db.Group,
            }]
        }],
    }).then (data => {
        console.log(data.length)
        data.map(function(label) {
            label.processes.map(function(process) {
                sentences = process.group.sentence.split(','); 
                sentences.map(function(sentence, ix) {
                    sentences[ix] = sentence.trim()
                });
                process.group.sentence =  sentences;
            });
        });
        callback(data);
    });
}


module.exports.label = function(method, payload, callback) {
    const r_id = payload.record_id;
    const id = payload.id;
    const name = payload.name;

    if (method == 'Create') {
        db.Label.create({
            record_id: r_id, 
            name: name,
        }).then(data => {
            console.log('Create a new label \n ' + JSON.stringify(data));
            callback(data);
        });
    } else if (method == 'Update') {
        const values =  { name: name };
        const options = { where: { id: id } };

        db.Label.update( values, options).then(data => {
           console.log('Update a label \n' + JSON.stringify(data));
           callback(data);
        });
    }
}
