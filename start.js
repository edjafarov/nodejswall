var twitter = require('ntwitter');
var emitter = require('events').EventEmitter;
var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: './config.json' });


var PORT = nconf.get('port');

var HOST = nconf.get('host') + (PORT?(":"+PORT):"");
console.log(HOST);

var twit = new twitter({
    consumer_key: nconf.get('consumer_key'),
    consumer_secret: nconf.get('consumer_secret'),
    access_token_key: nconf.get('access_token_key'),
    access_token_secret: nconf.get('access_token_secret')
});

var observer = new emitter();
var latestTwitsHash = {};
var listWordsToObserve = [];
var twitterStream = null;
var regExpFilter = null;
var wordFollowers = {};

function startTwitObserving(word) {
    if (!word || listWordsToObserve.indexOf(word) == -1) {
        if(word) {
            
            if(listWordsToObserve.length > 498){
                listWordsToObserve.shift();
            }
            listWordsToObserve[listWordsToObserve.length] = word;
        }
        if(twitterStream){
            twitterStream.destroy();
        }
        if(listWordsToObserve.length > 0){
        regExpFilter = new RegExp("(" + listWordsToObserve.join("|") + ")","i");
        observer.emit("wordsChange");
        twit.stream('statuses/filter', {
            track: listWordsToObserve.join(",")
        }, function(stream) {
            twitterStream = stream;
            
            stream.on('data', function(data) {
                var regRes = regExpFilter.exec(data.text);
                if(regRes){
                    var filteredWord = regRes[1];
                    if(!latestTwitsHash[filteredWord]) latestTwitsHash[filteredWord] = [];
                    if (latestTwitsHash[filteredWord].length > 100) {
                        latestTwitsHash[filteredWord].pop();
                    }
                    latestTwitsHash[filteredWord].unshift(data);
                
                    observer.emit("newTwit" + filteredWord, data);
                }
            });
            stream.on('end', function(response) {nconf.get('access_token_key'),
                console.log("stream ended");
                //startTwitObserving(word);
    
            });
            stream.on('destroy', function(response) {
                // Handle a 'silent' disconnection from Twitter, no end/error event fired
                console.log("stream destroyed");
            });

        });
    }
    }
};



var io = require('socket.io');
var express = require("express");
var app = express.createServer(),
    io = io.listen(app);

if(nconf.get('pooling_enabled')){
    io.configure(function() {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
}

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + "/");
    app.set('view engine', 'ejs');
});

app.get('/', function(req, res) {
    res.render('public/ejs/homeLayout.ejs', {
        host: HOST,
        words: wordFollowers
    });
});


app.get('/:word', function(req, res) {
    var followWord = req.params.word;
    if(listWordsToObserve.indexOf(followWord) == -1){
        twit.search(followWord, {rpp: 100}, function(err, data) {
            latestTwitsHash[followWord] = data.results;
            show();
        });
    }else{
        show();
    }
    function show(){
        res.render('public/ejs/wallLayout.ejs', {
            latest: latestTwitsHash[followWord],
            wordToObserve:followWord,
            host: HOST,
            wordFollowers:wordFollowers[followWord]
        });
    }
}
)


io.sockets.on('connection', function(socket) {
    var subscribedWord = null;
    socket.on('subscribe', function(word) {

        subscribedWord = word;
        observer.on("newTwit" + word, function(data) {
            socket.emit('newTwit', data);
        })

        observer.on( word + "_follow", function() {
            socket.emit('followersChange', wordFollowers[word]);
            observer.emit("wordsChange");
        })
                
        startTwitObserving(word);
        if(!wordFollowers[word]) {
            wordFollowers[word] = 1;
        }else{
            wordFollowers[word]++;
        }
        observer.emit( word + "_follow");
        observer.emit("wordsChange");
    })

    socket.on('watchAll', function() {
        observer.on( "wordsChange", function() {
            socket.emit("wordsChange",{
                words : wordFollowers
            });
        });
    });

    socket.on('disconnect', function(){
        wordFollowers[subscribedWord]--;
        observer.emit( subscribedWord + "_follow");
        if(wordFollowers[subscribedWord] == 0){
            listWordsToObserve.splice(listWordsToObserve.indexOf(subscribedWord), 1);
        }

    });
});

app.listen(PORT);
