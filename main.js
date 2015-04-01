/**
 * Created by nitesh on 3/31/15.
 */
var indopia = require('./promised-http');
var jsdom = require('jsdom');
var future = require("q");

var language = ["Hindi", "Punjabi", "Telugu", "Tamil", "Bengali", "Bhojpuri", "Malayalam", "Kannada", "Marathi", "Others"];
var yearSelect = 2015;
var lanSelect = 'Hindi';
var data = 'ysel='+yearSelect+'&ygen=0&ylan='+(language.indexOf(lanSelect)+1);

var fetch = function() {
    var options = {
        hostname: 'www.indopia.com',
        path: '/movies/index/years/',
        data: data,
        method: 'POST',
        protocol: 'http'
    };

    indopia.request(options).then(function(resp) {
        var list = [];
        jsdom.env(resp.text, ["http://code.jquery.com/jquery.js"], function (errors, window) {
            var $ = window.$;
            var links = $(".haha a[href*='showtime']");
            $(links).each(function() {
                var text = $(this).text();
                if(/Play/.test(text) === false) {
                    list.push({
                        name: text,
                        url: 'http://www.indopia.com/'+$(this).attr('href').replace(/.\//, ''),
                        poster: ''
                    });
                }
            });
            console.log('-->',list);
        });
    }, function(data) {
        console.log('Fetch error', JSON.stringify(options));
    });
};
fetch();