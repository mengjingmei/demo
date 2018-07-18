
window.onload = function () {

	left_scroll();
}

/**
 * 左边分类栏滑动处理
 */
function left_scroll() {
	// 获取移动的ul
	var moveUl = document.querySelector(".main_left ul");

	// ul父盒子的高度	
	var parentHeight = document.querySelector(".main_left").offsetHeight;
	// 获取 header的高度 将下部的偏移值 进行计算
	var headerHeight = document.querySelector('.header').offsetHeight;
	// ul的高度
	var ulHeight = moveUl.offsetHeight;

	// 计算移动的范围 能像上移动的最大距离
	var minDistance = parentHeight - ulHeight - headerHeight;
	var maxDistance = 0;

	// 定义变量 用来 标示 吸附的 距离
	var delayDistance = 150;

	// 2.通过touch事件 修改 ul的移动
	// 定义一些变量 记录 距离
	//  起始值
	var startY  = 0;
	// 移动值
	var moveY = 0;
	// 总的移动距离
	var distanceY = 0

	// 将 重复的代码 进行封装
	var startTransition = function () {
		moveUl.style.transition = 'all .5s';
	}
	var endTransition = function () {
		moveUl.style.transition = '';
	}
	var setTransform = function (distance) {
		moveUl.style.transform = 'translateY('+distance+'px)';
	}


	moveUl.addEventListener('touchstart',function(event){
		startY = event.touches[0].clientY;
	})
	moveUl.addEventListener('touchmove',function(event){
		moveY = event.touches[0].clientY - startY;

		// 判断 是否满足 移动的条件
		if ((moveY+distanceY)>(maxDistance+delayDistance)) {
			// 修正 moveY
			moveY = 0;
			distanceY = maxDistance+delayDistance;
			// 为什么是减法 因为 往上移动 是负值 要比最小值 还要更小
		}else if((moveY+distanceY)<(minDistance-delayDistance)){
			// 修改 moveY
			moveY = 0;
			distanceY = minDistance-delayDistance;
		}	

		// 关闭 过渡效果
		// moveUl.style.transition = '';
		endTransition();
		// 移动
		// moveUl.style.transform = 'translateY('+(moveY+distanceY)+'px)';
		setTransform(moveY+distanceY);
	})
	moveUl.addEventListener('touchend',function(event){
		// 修改移动的总距离
		distanceY+=moveY;

		// 吸附回去 判断 吸附的方位
		if (distanceY>maxDistance) {
			distanceY = maxDistance;
		}else if(distanceY<minDistance){
			distanceY = minDistance;
		}

		// 吸附回去
		// 移动
		// moveUl.style.transition  ='all .5s';
		startTransition();
		// moveUl.style.transform = 'translateY('+(distanceY)+'px)';
		setTransform(distanceY);
	})


	//  第二大部分逻辑  点击 跳转
	/*
		逻辑1
		绑定tap事件绑定给ul即可 
			事件参数中是能够拿到 触发该事件的 dom元素

		逻辑2
			获取 点击的li标签的 索引值
				让我们的ul 移动 索引值 * li的高度的 距离
					索引值获取
						可以再for循环中获取
					为每一个li 保存一个 索引属性
						<body  data-index='1'>
						点击li的时候 获取该属性的值即可
						dom.dataSet['index'];

	*/

	// 在使用之前 先获取
	// 获取 当前点击的 li标签的 索引值  每一个li标签的 高度
	var liHeight = document.querySelector('.main_left ul li').offsetHeight;

	// 用之前 为li标签 绑定一个 data-index 属性
	// 为所有的li 绑定data-index
	var liArr = document.querySelectorAll('.main_left ul li');

	// js绑定 自定义属性
	for (var i = 0; i < liArr.length; i++) {
		// dataset['index'] 如果 html标签中 已经有了 data-index属性 那么是 赋值操作
		// 如果 html标签中 没有 data-index属性 那么是 添加该属性的操作
		liArr[i].dataset['index'] = i;
	}
    //
	fox_tap(moveUl,function(e){

		for (var i = 0; i < liArr.length; i++) {
			liArr[i].className = '';
		}
		// 高亮当前的 
		e.target.parentNode.className = 'current';
		// 知道 当前 点击的li标签的 index
		var currentIndex = e.target.parentNode.dataset['index'];
		var moveDistance = currentIndex*liHeight*-1;
		// 对 moveDistance 进行修正
		if (moveDistance>maxDistance) {
			// 如果大于最大值,将他 改回来 
			moveDistance = maxDistance;
		}
		else if(moveDistance <minDistance) {
			// 如果 小于最小值 将他 改回 最小值
			moveDistance = minDistance;
		}
		startTransition();
		setTransform(moveDistance);

	});


}