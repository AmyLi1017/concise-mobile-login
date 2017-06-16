var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true);
  var path = temp.pathname;
  var query = temp.query;
  var method = request.method;

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
    getPostData(request, function (postData) {
      var errors = checkPostData(postData);
      if (Object.keys(errors).length === 0){
        //写数据库
        var tel = postData.tel;
        var message = postData.message;
        var userName = postData.userName;
        var password = postData.password;
        var user = {
          tel: tel,
          message: message,
          userName: userName,
          passwordHash: passwordHas(password)//不要使用 MDN5(黑客已破解)，不要自己使用自己的加密算法。
        };
        var dataString = fs.readFileSync('./data.json', 'utf-8');
        var dataObject = JSON.parse(dataString);
        dataObject.users.push(user);
        var dataString2 = JSON.stringify(dataObject);
        fs.writeFileSync('./data.json', dataString2);
      }else {
        response.statusCode = 400
      }

      response.setHeader('content-Type', 'text/html;charset=utf-8')
      response.end(JSON.stringify(postData))
    })
  }else if(path === '/jquery-3.1.0.min.js') {
    var string = fs.readFileSync('./jquery-3.1.0.min.js');
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8');
    response.end(string)
  }else if(path === '/main.js') {
    var string = fs.readFileSync('./main.js');
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8');
    response.end(string)
  }else if(path === '/home.html') {
    var cookies = parseCookies(request.headers.cookie);
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    if (cookies.logged === 'true'){
      response.end("用户" + cookies.userId + "已登录")
    }else {
      var string = fs.readFileSync('./home.html');
      response.end(string)
    }
    response.end(string)
  }else if(path === '/login' && method === 'POST'){
    getPostData(request, function (postData) {
      var tel = postData.tel;
      var password = postData.password;
      //读数据
      var dataString = fs.readFileSync('./data.json', 'utf-8');
      var dataObject = JSON.parse(dataString);
      var users = dataObject.users;
      var found;
      for (var i=0; i<users.length; i++){
        if (users[i].tel === tel && users[i].passwordHash === passwordHas(password)){
          found = users[i]
        }
      }
      if (found){
        //标记该用户登录了
        response.setHeader('Set-Cookie', ['logged=true;expires=1000;path=/;','userId='+ tel +';expires=12345678;path=/;'])
        response.end('')
      }else {
        response.statusCode = 400;
        var error = {password:'没有注册或密码错误'}
        response.end(JSON.stringify(error))
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
      }

      response.end(JSON.stringify(postData))
    })
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.end('找不到对应的路径，你需要自行修改 index.js')
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
});

function checkPostData(postData) {
  var errors = {};
  var tel = postData.tel;
  var message = postData.message;
  var userName = postData.userName;
  var password = postData.password;
  var confirmPassword = postData.confirmPassword;

  //check
  if (tel.lenght < 8){
    errors.tel = '号码格式错误'
  }
  if(message.length !== 6){
    errors.message = '短信验证码错误'
  }
  if (!isNaN(userName[0])){
    errors.userName = '用户名开头不能为数字'
  }
  if (password.lenght < 6){
    errors.password = '密码太短'
  }
  if (confirmPassword !== password){
    errors.confirmPassword = '两次输入密码不匹配'
  }
  return errors;
}

function getPostData(request, callback) {
  data = '';
  request.on('data', function (postData) {
    data += postData.toString();
  });
  request.on('end', function () {
    var array = data.split("&");
    var postData = {};
    for (var i=0; i<array.length; i++){
      var parts = array[i].split("=");
      var key = decodeURIComponent(parts[0]);
      var value = decodeURIComponent(parts[1]);
      postData[key] = value;
    }
    callback.call(null, postData);
  })
}

function passwordHas(password) {
  return passwordHash = 'amyli' + password + 'amyli';

}

function parseCookies(cookie) {  //类似JSON.parse
  try{
    return cookie.split(';').reduce(
        function(prev, curr) {
          var m = / *([^=]+)=(.*)/.exec(curr);
          var key = m[1];
          var value = decodeURIComponent(m[2]);
          prev[key] = value;
          return prev;
        },
        { }
    );
  }catch (error){
    return {}
  }
}

function stringifyCookies(cookies) {  //类似JSON.stringify
  var list = [ ];
  for (var key in cookies) {
    list.push(key + '=' + encodeURIComponent(cookies[key]));
  }
  return list.join('; ');
}

server.listen(port);
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);
