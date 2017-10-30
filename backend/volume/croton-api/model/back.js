var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host           : '192.168.10.116',
    user           : 'lingtelli',
    password       : 'lingtelli',
    database       : 'croton'
});


module.exports.getGroup = function(payload, callback) {
    var query = "";
    var template_id = payload['template_id'];
    var offset      = payload['offset'];

    if(!offset) offset = 0;

    if (offset==-1) {
        query = "SELECT COUNT(*) as total "+
                "FROM CrotonGroup "+
                "WHERE template_id=?";
    }
    else {
        query = "SELECT id as group_id, sentence, total "+ 
                "FROM CrotonGroup "+
                "WHERE template_id=? "+
                "LIMIT 100 "+ 
                "OFFSET "+parseInt(offset);
    }

    console.log(query);

    perform(query, [template_id], function(results) {
        callback(results);
    })
}

module.exports.filterGroup = function(payload, callback) {
    var query = "";
    var record_id   = payload['record_id'];
    var labels      = payload['labels'];
    var offset      = payload['offset'];

    if (!offset) offset = 0;

    if (offset==-1) {
        query  = "SELECT COUNT(w.group_id) as total "+
                 "FROM CrotonWorkingGroup as w "+
                 "JOIN CrotonRecord as r "+
                 "ON (r.id=w.record_id) "+
                 "WHERE r.id=? ";
    }
    else {
        query  = "SELECT g.id as group_id, g.sentence, total "+
                 "FROM CrotonGroup as g "+
                 "JOIN (CrotonWorkingGroup as w, CrotonRecord as r) "+
                 "ON (g.template_id=r.template_id AND r.id=w.record_id AND g.id=w.group_id) "+
                 "WHERE r.id=? ";
    }

    if (labels || labels == "") {
        query+="AND w.class_id in ("+labels+") "
    }

    query += "LIMIT 100 "+
             "OFFSET "+parseInt(offset);

    console.log(query);

    perform(query, [record_id], function(results) {
        callback(results);
    })

}

module.exports.searchGroup = function(payload, callback) {
    var query = "";
    var keywords = payload['keywords'];
    var template_id = payload['template_id'];
    var offset      = parseInt(payload['offset']);

    var like_statement = "AND ";

    query  = "SELECT g.id as group_id, g.sentence, total "+
             "FROM CrotonGroup as g "+
             "JOIN (CrotonWorkingGroup as w, CrotonRecord as r) "+
             "ON (g.template_id=r.template_id AND r.id=w.record_id AND g.id=w.group_id) "+
             "WHERE r.id=? AND w.class_id in ("+labels+")";

    keywords = keywords.split(',')
    keywords.forEach(function(ele, ix) {
        if (ix == 0)
            like_statement += "sentence LIKE %"+ele+"%";
        else
            like_statement += " AND sentence LIKE %"+ele+"%";
    })

    console.log(like_statement);
    return;
}

function perform(query, vals, callback) {
    pool.query({
        sql: query,
        values: vals,
        timeout: 40000
    }, function(err, results, fields) {
        if (err) throw results=[];
        callback(results);
    });
}



