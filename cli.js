#!/usr/bin/env node

var ok = require('log-ok');
var path = require('path');
var hekyll = require('hekyll');
var clone = require('gh-clone');
var themes = require('./themes');
var opts = {src: 's', dest: 'd', remote: 'r'};
var argv = require('minimist')(process.argv.slice(2), opts);

if (argv.h) {
  console.log(themes);
  process.exit();
}

argv.src = argv.src || argv._[0];
argv.destBase = argv.dest || argv._[1] || 'src';
delete argv.dest;

if (argv.r) {
  if (!argv.src && typeof argv.r === 'string') {
    argv.src = argv.r;
  }

  var repo = themes[argv.r] || argv.r;
  var dir = path.join('vendor', argv.src);
  clone(Object.assign({}, argv, {dest: dir, repo: repo}), function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      console.log('converting...');
      convert(Object.assign({}, argv, {cwd: dir, destBase: argv.destBase}));
    }
  });
} else {
  convert(argv);
}

function convert(options) {
  return hekyll.build(options)
    .then(function() {
      ok('finished');
      process.exit();
    })
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
}
