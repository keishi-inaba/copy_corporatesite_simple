/*
*画面遷移
*/
$(window).on('load', function() {
  $('#splash-logo').delay(1200).fadeOut('slow');
  $('#splash').delay(1500).fadeOut('slow', function() {
    $('body').addClass('appear');
  });
});



/*
*グローバルナビ
*/
$('.open_area').click(function() {
  $(this).toggleClass('active');
  $('#g-nav').toggleClass('panel');
});

$('#g-nav a').click(function() {
  $('.open_area').removeClass('active');
  $('#g-nav').removeClass('panel');
});


/*
*loading
*/
let bar = new ProgressBar.Line(splash_text, {
  easing: 'easeInOut',
  duration: 1000,
  strokeWidth: 0.2,
  color: '#333',
  trailWidth: 0.2,
  trailColor: '#333',
  text: {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: '0',
      margin: '-30px 0 0 0',
      transform: 'translate(-50%, -50%)',
      'font-size': '1rem',
      color: '#333',
    },
    autoStyleContainer: false
  },
  step: function(state, bar) {
    bar.setText(Math.round(bar.value() * 100) + '%');
  }
});

bar.animate(1.0, function() {
  $('#splash').delay(500).fadeOut(800);
});


/*
 *波線
*/
var unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */

function init() {
    info.seconds = 0;
    info.t = 0;
		canvasList = [];
    colorList = [];
    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#fff', '#fff', '#fff', '#fff', '#fff']);//重ねる波線の色設定
    
	
		// 各キャンバスの初期化
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 200;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    // 共通の更新処理呼び出し
		update();
}

function update() {
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        draw(canvas, colorList[canvasIndex]);
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 35);
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */

function draw(canvas, color) {
		// 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    //波線を描画 drawWave(canvas, color[数字], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 0.5, 3, 0);
	drawWave(canvas, color[1], 0.8, 4, 0);
	drawWave(canvas, color[2], 0.5, 1.6, 0);
	drawWave(canvas, color[3], 0.8, 3, 100);
	drawWave(canvas, color[4], 0.5, 1.6, 250);
}

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/

function drawWave(canvas, color, alpha, zoom, delay) {
	var context = canvas.contextCache;
    context.strokeStyle = color;//線の色
	context.lineWidth = 1;//線の幅
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.stroke(); //線
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */

function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();


/*
 *テキストがフワッと出現 
 */

 function delayScroll() {
   var time = 0.2;
   var value = time;

   $('.delayScroll').each(function() {
     var parent = this;
     var elemPos = $(this).offset().top;
     var scroll = $(window).scrollTop();
     var windowH = $(window).height();
     var childs = $(this).children();

     if(scroll >= elemPos - windowH && !$(parent).hasClass("play")) {
       $(childs).each(function() {
         if(!$(this).hasClass("fadeUp")) {
           $(parent).addClass("play");
           $(this).css("animation-delay", value + "s");
           $(this).addClass("fadeUp");
           value = value + time;

           var index = $(childs).index(this);
           if((childs.length - 1) == index) {
             $(parent).removeClass("play");
           }
         }
       })
     } else {
       $(childs).removeClass("fadeUp");
       value = time;
     }
   })
 }

 //画面をスクロール時に動作
 $(window).scroll(function() {
   delayScroll();
 });

//画面をリロード時に動作
$(window).on('load', function() {
  delayScroll();
})