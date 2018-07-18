window.onload = function () {
    /**
     * 需求：
     * 1、顶部通栏:随着鼠标下滑，通栏的颜色透明度1-0
     * 2、倒计时
     * 3、轮播图
     */

        //获取相关标签元素
    var headerDom = document.querySelector(".jd_header");
    var timeDom = document.querySelector(".countdown");

    var bannerDom = document.querySelector(".jd_banner");
    var bannerUlImage = document.querySelector(".banner_images");
    var bannerLiArr = document.querySelectorAll(".banner_images li");
    var bannerIndexArr = document.querySelectorAll(".banner_index li");

    var navDom = document.querySelector(".jd_nav");

    //1、顶部通栏
    headerScroll();
    //2、倒计时
    cutdownTime();
    //3、轮播图
    banner();

    function headerScroll() {
        /*顶部通栏:
        * 鼠标下滑到导航栏之间，通栏的不透明度0-1变化
        * 下滑到导航栏一下，不透明度为0
        *
        */
        //分类导航以下的距离
        var scorllHeight = navDom.offsetTop + navDom.offsetHeight;
        window.onscroll = function () {
            //获取鼠标滚动距离
            var scrollDistance = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            //根据距离百分比，计算opacity
            var opacityValue = 1 - scrollDistance / scorllHeight;
            if (opacityValue < 0) {
                opacityValue = 0;
            }
            //设置opacity
            // console.log(opacityValue);
            headerDom.style.opacity = opacityValue;
        }

    }

    function cutdownTime() {
        /*
         * 倒计时：
         * 1、确定目标时间
         * 2、根据当前时间与目标时间差，计算倒计时，返回的是总秒数
         * 3、格式化总秒数xx:xx:xx
         * 4、给倒计时元素赋值
         */
        //初始化目标时间
        var targetTime = new Date("2018/5/2 17:00:00");
        //当前时间
        var currtentTime = new Date();

        var targetTimeSenconds = targetTime.getHours()*3600+targetTime.getMinutes()*60+targetTime.getSeconds();
        var currtentTimeSenconds = currtentTime.getHours()*3600+currtentTime.getMinutes()*60+currtentTime.getSeconds();
        var timeSeconds = targetTimeSenconds-currtentTimeSenconds;
        if(timeSeconds>0) {
            var timer = setInterval(function () {
                //根据时差总秒数获取时分秒
                var hours = Math.floor(timeSeconds/3600);
                var minutes =  Math.floor(timeSeconds/60)%60;
                var senconds = timeSeconds%60;
                //格式化时分秒
                hours = (hours>=10) ? hours : ("0"+hours);
                minutes = (minutes>=10) ? minutes : ("0"+minutes);
                senconds = (senconds>=10) ? senconds : ("0"+senconds);
                //组合成字符串，赋值给相应标签
                var str = hours+":"+minutes+":"+senconds;
                console.log(str);
                timeDom.innerHTML = str;
                //倒计时
                timeSeconds--;
                //倒计时结束，清除定时器
                if(timeSeconds<0){
                    clearInterval(timer);
                    timeDom.innerHTML = "正在秒杀";
                }
            },1000);
        }
        else {
            timeDom.innerHTML = "正在秒杀";
        }


    }

    function banner() {
        //ul中的li的图片序号为8, 1,2,3,4,5,6,7,8 ,1,首尾各添加一张图片，滑动时衔接
        // 屏幕的宽度
        var width = document.body.offsetWidth;
        //初始化显示第几张图片
        var index = 1;
        //过渡开始
        var startTransition = function () {
            bannerUlImage.style.transition = 'all .3s';
        };
        //结束过渡
        var endTransition = function () {
            bannerUlImage.style.transition = '';
        };
        //设置移动
        var setTransform = function (distance) {
            bannerUlImage.style.transform = 'translateX('+distance+'px)';
        };

        // 开启定时器
        var timeId = setInterval(function () {
            index++;
            startTransition();
            setTransform(index*width*-1);
        },1000);

        // 过渡 结束事件 用来 修正 index的值 并修改索引  重点！！！（修正index的时间点很关键）
        bannerUlImage.addEventListener('webkitTransitionEnd',function () {
            console.log('过渡结束');
            //移动到替补的最后一张了，修改index，并瞬间切换到第二张
            if (index>(bannerLiArr.length-2)) {
                index = 1;
                endTransition();
                setTransform(index*width*-1);
            }
            //移动到替补第一张，修改index，并瞬间切换到最后一张
            else if(index<1) {
                index= bannerLiArr.length-2;
                endTransition();
                setTransform(index*width*-1);
            }
            // 修改 索引li标签的 class，排他思想
            for (var i=0; i<(bannerLiArr.length-2); i++) {
                bannerIndexArr[i].classList.remove("current");
            }
            console.log(index);
            bannerIndexArr[index-1].classList.add("current");

        })


        // 注册 三个 touch事件

        // 定义变量 记录 开始的X
        var startX = 0;

        // 记录移动的值
        var moveX = 0;

        // 触摸开始
        bannerUlImage.addEventListener('touchstart',function (event) {
            // 关闭定时器
            clearInterval(timeId);
            // 关闭过渡效果
            endTransition();
            // 记录开始值
            startX = event.touches[0].clientX;

        })

        // 触摸中
        bannerUlImage.addEventListener('touchmove',function (event) {
            // 计算移动的值
            moveX = event.touches[0].clientX - startX;
            // 移动ul
            // 默认的移动值是 index*-1*width
            setTransform(moveX+index*-1*width);
        })

        // 触摸结束
        /*
            手指松开的时候 判断 移动的距离 进行 是否吸附
                由于 不需要考虑 正负 只需要考虑 距离 Math.abs()
                    吸附回的值是 index*-1*width
                如果移动的距离较大
                    需要判断正负
                        index++;
                        index--;
                         index*-1*width
        */
        bannerUlImage.addEventListener('touchend',function (event) {

            // 定义 最大的 偏移值
            var maxDistance = width/3;
            // 判断 是否超过
            if (Math.abs(moveX)>maxDistance) {
                // 判断 到底是 往左 还是往右移动
                if (moveX>0) {
                    index--;
                }
                else{
                    index++;
                }

                startTransition();
                // 吸附 一整页
                // moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';
                setTransform(index*-1*width);
            }
            else{
                // 如果 进到这里了 说明 没有超过 我们定义的 最大偏移值 吸附回去即可

                // 为了好看 将 过渡效果开启
                // moveUl.style.transition = 'all .3s';
                startTransition();
                // 吸附回去
                // moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';
                setTransform(index*-1*width);
            }
            // 拖动结束再次开启定时器，自动轮播
            timeId = setInterval(function () {
                index++;
                startTransition();
                setTransform(index*width*-1);
            },1000)
        })

    }
}





