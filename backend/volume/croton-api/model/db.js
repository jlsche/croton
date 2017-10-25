const Sequelize = require('sequelize');

const database = require('../config/database');

const sequelize = new Sequelize(database.name, database.username, database.password, {
    host: database.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports.Group = sequelize.define('group', {
    group_id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    }, 
    template_id: {
        type: Sequelize.INTEGER,
        field: 'template_id',
    },
    sentence: {
        type: Sequelize.TEXT,
        field: 'sentence'
    },
    total: {
        type: Sequelize.INTEGER,
        field: 'total'
    }
}, {
    tableName: 'CrotonGroup',
    createdAt: false,
    updatedAt: false
});

module.exports.Record = sequelize.define('record', {
    record_id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    template_id: {
        type: Sequelize.INTEGER,
        field: 'template_id'
    },
    name: {
        type: Sequelize.CHAR,
        field: 'name'
    }
}, {
    tableName: 'CrotonRecord',
    createdAt: false,
    updatedAt: false
});

module.exports.Label = sequelize.define('label', {
    name: {
        type: Sequelize.CHAR,
        field: 'name'
    },
    label_id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
    },
    record_id: {
        type: Sequelize.INTEGER,
        field: 'record_id',
    },
}, {
    tableName: 'CrotonClass',
    createdAt: false,
    updatedAt: false
});

module.exports.Template = sequelize.define('template', {
    t_id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
}, {
    tableName: 'CrotonTemplate',
    createdAt: false,
    updatedAt: false
});

module.exports.Process = sequelize.define('process', {
    process_id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true
    },
    group_id: {
        type: Sequelize.INTEGER,
        field: 'group_id',
    },
    label_id: {
        type: Sequelize.INTEGER,
        field: 'class_id'
    },
    record_id: {
        type: Sequelize.INTEGER,
        field: 'record_id'
    },
    pid: {
        type: Sequelize.INTEGER,
        field: 'pid'
    }
}, {
    tableName: 'CrotonWorkingGroup',
    createdAt: false,
    updatedAt: false
});

this.Group.hasOne(this.Process, { foreignKey: 'group_id' });


// Create a relations 
this.Process.hasOne(this.Label, { foreignKey: 'record_id' });
// Bind record_id and label_id key bewteen Process and Label
this.Process.belongsTo(this.Label, { foreignKey: 'record_id', targetKey: 'record_id' });
this.Process.belongsTo(this.Label, { foreignKey: 'label_id', targetKey: 'label_id' });

//this.Label.hasOne(this.Process, { foreignKey: 'label_id' });

this.Label.belongsTo(this.Record, { foreignKey: 'record_id' });
//this.Record.hasMany(this.Group, { foreignKey: 'template_id', sourceKey: 'template_id' });
//this.Record.belongsTo(this.Group, { foreignKey: 'template_id', targetKey: 'template_id' });

this.Label.hasMany(this.Process, { foreignKey: 'label_id' });

this.Process.hasOne(this.Group, { foreignKey: 'group_id' });
this.Process.belongsTo(this.Group, { foreignKey: 'group_id' });
