//command line arguments
const argv = require('minimist')(process.argv.slice(2));
const templateFile = argv['t'];
const server = argv['s']?argv['s']:'http://localhost:1883';
const debug = argv['d'];
const help = argv['h'];

//modules
const fs = require('fs');
const mqtt = require('mqtt');
const moment = require('moment');
const faker = require('faker');

if (help) {
    showHelp();
    return;
}

if (!templateFile) {
    console.error('Template file option is required.')
    return;
}

var client  = mqtt.connect(server);

client.on('connect', ()=>{
    client.subscribe('#', (err)=>{
        if (err) return;

        template = JSON.parse(fs.readFileSync(templateFile, 'utf8'));

        if (template.hasOwnProperty('init'))
            eval(template.init);

        if (template.hasOwnProperty('generators')) {
            handlers = template.generators.map(mapWorker)
                .map(w=>setInterval(w.worker, w.interval));
        }
    })
})

client.on('message', (topic, message)=>{
    if(debug) console.debug("Topic: "+topic+", Message: "+message.toString());
})

function mapWorker (gen) {
    return {
        "worker": function() {
            sendMessage(eval(gen.topic),
                Object.assign({}, ...Object.keys(gen.message).map(k=>({[k]: eval(gen.message[k])}))));
        },
        "interval": gen.interval
    };
}

function sendMessage(topic,message) {
    client.publish(topic, JSON.stringify(message))
}

function showHelp() {
    console.info("MQTT tester/generator\n" +
        "Options:\n" +
        "-t <path>   Path to template file. Required.\n" +
        "-s <URI>    MQTT server URI.\n" +
        "-d          Subscribe to own messages.\n")
}