let model = require('../model/model');
let express = require('express');
let router = express.Router();

router.get('/group/:template_id', allowCrossOrigin, function(req, res) {
    const template_id = req.params.template_id;
    const record_id = req.query.record_id;
    const labels = req.query.labels;
    const offset = req.query.offset;
    const keywords = req.query.keywords;

    model.operate({ 
        'template_id': template_id,
        'record_id'  : record_id,
        'offset'     : offset,
        'labels'     : labels,
        'keywords'   : keywords
    }, function(data) {
        res.json(data);
    })
});

router.get('/label/:record_id', allowCrossOrigin, function(req, res) {
    const record_id = req.params.record_id;
    model.labelInfos( {
        'record_id' : record_id,
    }, function(data) {
        res.json(data);
    })
});

router.get('/export/:record_id', allowCrossOrigin, function(req, res) {
    const record_id = req.params.record_id;
    
    model.exportLabels( {
        'record_id' : record_id,
    }, function(data) {
        res.json(data);
    });
});

function allowCrossOrigin(req, res, next) {
    const origin = ['*'];

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    return next();
}

module.exports = router
