# A basic nodejs coding exercise:


```
Write a module that exports a function shiftedBody(url, shiftNum) in Nodejs.

shiftedBody(url, shiftNum) will print the response body of a website but with every character shifted by shiftNum.

For example shiftedBody("http://google.com/", 3);

Every a is now d, g is now j, "<" is now "?", ... etc

This should be a non blocking function that will allow my server to continue accepting requests or to allow a healthcheck setup using setInterval to continuously run in the background.
```

## Solution

I used the request module as it seems the simpliest library to use for managing asyncronous http requests, plus it convieniently follows redirects by default.

## Testing

You can test this out by running the following commands (Don't forget to first run 'npm install' to download dependencies)

```
npm test <URL> <shiftNum>
```
## Enhancements

With some additional time, I would go back and add the following:

* Unit tests -- perhaps even standing up a server to serve known test content
* Better error handling 
