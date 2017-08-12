#!/usr/bin/env node

var ok = require('log-ok');
var path = require('path');
var hekyll = require('hekyll');
var clone = require('gh-clone');
var opts = {src: 's', dest: 'd'};
var argv = require('minimist')(process.argv.slice(2), opts);

argv.src = argv.src || argv._[0];
argv.dest = argv.dest || argv._[1] || 'src';

if (argv.r) {
  if (!argv.src && typeof argv.r === 'string') {
    argv.src = argv.r;
  }

  var dir = path.join('vendor', argv.src);
  clone(Object.assign({}, argv, {dest: dir, repo: argv.src}), function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      convert(Object.assign({}, argv, {src: dir}));
    }
  });
} else {
  convert(argv);
}

function convert(options) {
  return hekyll(options)
    .then(function() {
      ok('finished');
      process.exit();
    })
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
}
