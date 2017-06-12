var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看

  if(path === '/'){  // 如果用户请求的是 / 路径
    var string = fs.readFileSync('./index.html')  
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    response.end(string)
  }else if(path === '/signUp.html'){
    var string = fs.readFileSync('./signUp.html');
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    response.end(string)
  }else if(path === '/css/login.css'){
    var string = fs.readFileSync('./css/login.css');
    response.setHeader('Content-Type','text/css');
    response.end(string)
  }else if(path === '/css/signUp.css'){
    var string = fs.readFileSync('./css/signUp.css');
    response.setHeader('Content-Type','text/css');
    response.end(string)
  }else if(path === '//at.alicdn.com/t/font_rwabvyzr50nc23xr.css') {
    var string = fs.readFileSync('//at.alicdn.com/t/font_rwabvyzr50nc23xr.css');
    response.setHeader('Content-Type','text/css');
    response.end(string)
  }else if(path === '/css/reset.css') {
    var string = fs.readFileSync('./css/reset.css');
    response.setHeader('Content-Type', 'text/css');
    response.end(string)
  }else if(path === '/signUp' && method === 'POST'){
    request.addListener('data',function () {
      console.log(request.body);
    });
    request.on('end', function () {
      console.log('拿到数据');
      response.end('here')
    })
  }else if(path === '/login' && method === 'POST'){
    data = '';
    request.on('data', function(postData){
      data += postData.toString();
    })
    request.on('end', function () {
      console.log('拿到数据')
      console.log(data);
      response.end('here')
    })
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.end('找不到对应的路径，你需要自行修改 index.js')
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
