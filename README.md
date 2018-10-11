# Flexible JSON/MQTT messages generator/tester

## Usage:

```
npm install
npm start -- [options]
```

Where `Options`:
```
      -t <path>   Path to template file. Required.
      -s <URI>    MQTT server URI.
      -d          Subscribe to own messages.
```

## Template example

```
{
    "init": "timestamp=moment().format('X');filter=10;avg=0",
    "generators":[
        {
            "topic": "dev=Math.round(Math.random()*10);a='devices/dev'+dev+'/info'",
            "message": {
                "timestamp": "timestamp=+timestamp+Math.round(Math.random()*600)+1",
                "value":"val=Math.random()*100"
            },
            "interval":1000
        },
        {
            "topic": "'devices/dev'+dev+'/status'",
            "message": {
                "timestamp":"timestamp",
                "avg":"avg=(val+(avg*(filter-1)))/filter",
                "status":"0"
            },
            "interval":1000
        }
    ]
}
```

`topic` and all fields of `message` will be evaluated. `init` will be evaluated before message generation starts.

## Example output

```
$ npm start -- -t templates/template.json -d

> mqtt-tester@0.0.1 start /home/sl/git/mqtt-tester
> node index.js "-t" "templates/template.json" "-d"

Topic: devices/dev9/info, Message: {"timestamp":1539231662,"value":78.2868638291508}
Topic: devices/dev9/status, Message: {"timestamp":1539231662,"avg":7.82868638291508,"status":0}
Topic: devices/dev7/info, Message: {"timestamp":1539231676,"value":50.10248084393574}
Topic: devices/dev7/status, Message: {"timestamp":1539231676,"avg":12.056065829017147,"status":0}
Topic: devices/dev9/info, Message: {"timestamp":1539231884,"value":52.38434792534525}
Topic: devices/dev9/status, Message: {"timestamp":1539231884,"avg":16.088894038649958,"status":0}
```

`Faker.js` and `Moment.js` modules are included.
