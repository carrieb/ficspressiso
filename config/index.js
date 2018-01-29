const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/webapp.properties');

const dbUrl = properties.get('db.url');
const libraryDir = properties.get('library.dir');

module.exports = {
    dbUrl,
    libraryDir
};