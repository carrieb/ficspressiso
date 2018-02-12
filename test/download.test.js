const PythonShell = require('python-shell');

const pyshell = new PythonShell('../tools/downloadff.py', {
  args: ['--ao3', '13060209']
});

pyshell.on('message', (message) => {
  console.log(message);
});

pyshell.end((err) => {
  if (err) throw err;
  console.log('finished');
});