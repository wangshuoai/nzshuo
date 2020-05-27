// 遵从AMD规范，编写banner模块
define(["jquery"], function($){
    function banner(){
        var aBtns = $("#play").find("ol li");
        var oUl = $("#play").find("ul");
        var timer = null;
        var index = 0; // 代表当前图片显示的下标

        aBtns.click(function(){
            index = $(this).index();
            tab();
        })

        // 自动循环轮播
        timer = setInterval(function(){
            index++;
            tab();
        },1000)

        //添加鼠标移入移出事件
        $("#play").mouseenter(function(){
            clearInterval(timer);
        }).mouseleave(function(){
            timer = setInterval(function(){
                index++;
                tab();
            },1000)
        })

        //切换
        function tab(){
            aBtns.removeClass("active").eq(index).addClass("active");
            //如果最后一张显示，则让按钮变成对应下标为0
            if(index === aBtns.size()){
                aBtns.eq(0).addClass("active");
            }
            oUl.animate({
                top: -260 * index
            }, 500, function(){
                // 当最后一张图片动画结束，直接切回下标为0的图片,也就是第一张图片
                if(index === aBtns.size()){
                    index = 0;
                    oUl.css("top", 0);
                }
            })
        }
    }
    
    return {
        banner:banner
    }
})