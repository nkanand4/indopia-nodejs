var future = require("q");

var request = function(options) {
  var http = /https/i.test(options.protocol) ? require('https') : require('http');
  var dfd = future.defer();
  var data = options.data ? options.data : undefined;
  var isPost = /post/i.test(options.method);
  delete options.data;
  delete options.protocol;

  if(isPost && data) {
    data = data+'\n';
    if(!options.headers) {
      options.headers  = {};
    }

    options.headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = data.length;
  }

  if(!isPost && data) {
    options.path += '?' + data;
  }

  var responseBody = '';
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      responseBody += chunk;
    });
    
    res.on('end', function (chunk) {
      dfd.resolve({
        response: res,
        text: responseBody
      });
    });

    res.on('error', function (chunk) {
        dfd.reject({
        response: res,
        text: responseBody
      });
    });
    
  });

  req.on('error', function(e) {
    dfd.reject({
      request: req,
      text: 'Error making request!'
    });
  });
  
  //write data to request body
  if(isPost && data) {
    req.write(data);
  }
  req.end();
  //dfd.req = req;
  return dfd.promise;
};

module.exports = {
    request: request
};
