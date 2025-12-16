const cfonts = require('cfonts');
const config = require('../../Settings/Config.json');

module.exports.run = async (manager) => {
    try {
        const banner = cfonts.render(config.bot.name, {
            font: 'chrome',
            color: 'candy',
            align: 'center',
            gradient: ["red", "magenta"],
            lineHeight: 1
        });
        console.log(banner.string);
    } catch (error) {
        return client.errors(manager, error.stack, null,'Event');
    }
};