var config = {}

console.log(process.env)

config.fanfiction_dir = process.env.HOME + '/Desktop/fanfiction/';

config.compiled_json = process.env.HOME + '/Desktop/compiled_fanfic.json';

module.exports = config;
