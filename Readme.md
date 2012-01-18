# nodejswall
Twitter wall written totally in Node.js
Can watch up to 500 words simultaneously. 

## install

	$ npm install nodejswall

## configure
### env

	$ export host="http://loalhost"
	$ export port=3000
	$ export consumer_key="[CONSUMER KEY]"
	$ export consumer_secret="[CONSUMER SECRET]"
	$ export access_token_key="[ACCESS TOKEN KEY]"
	$ export access_token_secret="[ACCESS TOKEN SECRET]"

consumer key/secret and access key/secret you are getting from twitter

### or config.json

	{
		"host":"http://localhost",
		"port": 3000,
		"consumer_key":"[CONSUMER KEY]",
		"consumer_secret":"[CONSUMER SECRET]",
		"access_token_key":"[ACCESS TOKEN KEY]",
		"access_token_secret":"[ACCESS TOKEN SECRET]",
		"pooling_enabled": false
	}

## upcoming features
* easy to change themes
* watch multiple words at a time
* default words
* distributed nodejs wall (to share api limits)

## License 

(The MIT License)

Copyright (c) 2011 Eldar Djafarov &lt;djkojb@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.