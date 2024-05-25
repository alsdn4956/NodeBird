const Sequelize = require('sequelize');

const fs = require('fs');
const path = require('path');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'; // .js로 끝나는 파일들만 필터링 indexof'.'은 .파일 숨긴다는 의미
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));console.log(file, model.name);
    db[model.name] = model;
    model.iniiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
  });

module.exports = db;
