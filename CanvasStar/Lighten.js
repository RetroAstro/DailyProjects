var Dots = function(speed, alpha){
	//绘制画布
	this.canvas;
	this.ctx;
	//绘制点
	this.x;
	this.y;
    this.r;
    this.a = alpha && alpha > 0 && alpha <= 1 ? alpha : .8;
    //移动相关
    this.speed = speed && speed > 0 ? speed : 2;
    this.sx;
    this.sy;
    this.isMouseDot = 0;
}

Dots.prototype = {
	//初始化
	init: function (canvas, x, y, isMouseDot){
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.x = x * 2 || Math.random() * this.canvas.width;
		this.y = y * 2 || Math.random() * this.canvas.height;
		this.r = Math.random() * 10;
		if (isMouseDot) {
			this.isMouseDot = 1;
		} 
		this.sx = isMouseDot ? 0 : Math.random() * this.speed * 2 - this.speed;
		this.sy = isMouseDot ? 0 : Math.random() * this.speed * 2 - this.speed;

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		this.ctx.fillStyle = 'rgba(255,255,255,'+this.a+')';
		this.ctx.fill();
		this.ctx.closePath();
	},
    //更新点的位置
  update: function(){
    if (this.isMouseDot) {
    		return;
    	}

    	this.x = this.x + this.sx;
    	this.y = this.y + this.sy;

    	if (this.x < 0 || this.x > this.canvas.width) {
    		this.init(this.canvas);
    	}
		if (this.y < 0 || this.y > this.canvas.height) {
			this.init(this.canvas);
		}

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r + 0.5, 0, 2*Math.PI);
		this.ctx.fillStyle = 'rgba(255,255,255,'+this.a+')';
		this.ctx.fill();
		this.ctx.closePath();

    }
}

function Super (opts) {
  var coco  = document.querySelector(opts.el),
	  canvas = document.createElement('canvas'),
	  ctx = canvas.getContext('2d'),
	  cocoStyle = window.getComputedStyle(coco,null),
	  width = parseInt(cocoStyle.width),
	  height = parseInt(cocoStyle.height),
	  area = width * height,
	  cssText = 'width: '+width+'px; height: '+height+'px;';

	  canvas.setAttribute('style',cssText);
	  canvas.width = (width * 2).toString();
	  canvas.height = (height * 2).toString();
	  coco.appendChild(canvas);
  var dotsArr = [],
      dotsNum = opts.dotsNumber || parseInt(area / 5000),
      maxDotsNum = dotsNum * 2,
      overNum = 0,
      dotsDistance = opts.lineMaxLength || 250;
      
  for(var i = 0; i < dotsNum; i++) {
  var dot = new Dots(opts.speed,opts.dotsAlpha);
      if (i < dotsNum - 1) {
      		dot.init(canvas);
      	}else{
      		dot.init(canvas, 0, 0, 1);
      	}
      	dotsArr.push(dot);
      }
  
  //鼠标点击触发Lighten效果
  document.addEventListener('click', createDot);
  function createDot(e) {
      var tx = e.pageX,
          ty = e.pageY;
      if ((tx > 0 && tx < width) && (ty > 0 && ty < height)) {

          for (var i = 0; i < 5; i ++) {
              var dot = new Dots(opts.speed, opts.dotsAlpha);
              dotsArr.push(dot);
              dotsNum += 1;
              dot.init(canvas, tx, ty);
          }
      }
  };

  //动画与连线
  var Animation = requestAnimationFrame;
  Animation(animateUpdate);

  function animateUpdate(){
  	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	//更新点的位置
  	if (dotsNum > maxDotsNum) {
  		overNum = dotsNum - maxDotsNum;
  	}

  	for(var i = overNum; i < dotsNum; i++) {
  		if (dotsArr[i]) {
  			dotsArr[i].update();
  		}
  	}

  	//绘制连线
  	for(var i = overNum; i < dotsNum; i++) {
  		for(var j = i + 1; j < dotsNum; j++) {
		var tx = dotsArr[i].x - dotsArr[j].x,
            ty = dotsArr[i].y - dotsArr[j].y,
            s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        if (s < dotsDistance) {
  			ctx.beginPath();
  			ctx.moveTo(dotsArr[i].x, dotsArr[i].y);
  			ctx.lineTo(dotsArr[j].x, dotsArr[j].y);
  			ctx.strokeStyle = 'rgba(255,255,255,'+(dotsDistance-s)/dotsDistance+')';
        ctx.lineWidth = 2;
  			ctx.stroke();
  			ctx.closePath();
  		   }
  		}
  	}
    Animation(animateUpdate);
  }
}

new Super({
    el: '.container',
    speed: 1.5,
    dotsAlpha: 0.5,
    dotsNumber: 150,
    lineMaxlength: 300
});