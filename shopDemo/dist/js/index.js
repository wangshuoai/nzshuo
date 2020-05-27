// 遵从AMD规范，编写首页模块
define(["parabola", "jquery", "jquery-cookie"], function(parabola, $){
    function download(){
        sc_msg();
        sc_num();
        //加载数据
        $.ajax({
            type: "get",
            url: "../data/data.json",
            success: function (arr) {
                //创建节点，添加到页面上
                var html = ``;
                for (var i = 0; i < arr.length; i++) {
                    html += `<li class="goods_item">
                        <div class="goods_pic">
                            <img src="${arr[i].img}" alt="">
                        </div>
                        <div class="goods_title">
                            <p>【京东超市】奥利奥软点小草莓${i}</p>
                        </div>
                        <div class="sc">
                            <div id="${arr[i].id}" class="sc_btn">加入购物车</div>
                        </div>
                    </li>`;
                }
                //将拼接成功的商品，设置在页面上
                $(".goods_box ul").html(html);
            },
            error: function (err) {
                console.log(err);
            }
        })
    }


    //计算购物车中商品的数量
    function sc_num(){
        var cookieStr = $.cookie("goods");
        if(cookieStr){
            var cookieArr = JSON.parse(cookieStr);
            console.log(cookieArr);
            
            var sum = 0;
            for(var i = 0; i < cookieArr.length; i++){
                sum += cookieArr[i].num;
            }
            $(".sc_right").find(".sc_num").html(sum);
        }else{
            $(".sc_right").find(".sc_num").html(0)
        }
    }


    // 加载右侧购物车的商品数据
    // 购物车的数据在cookie里，但是只存储了id 和 num。{id：id, num:1}
    // 需要商品的详细数据（详细数据在数据源里）
    // 通过加入购物车的商品id，把商品详细数据单独找出来
    function sc_msg() {
        $.ajax({
            type: "get",
            url: "../data/data.json",
            success: function (arr) {
                //arr 所有的数据
                var cookieStr = $.cookie("goods");
                if (cookieStr) {
                    var cookieArr = JSON.parse(cookieStr);
                    //加载所有数据：
                    var newArr = [];
                    for(var i = 0; i < arr.length; i++){
                        for(var j = 0; j < cookieArr.length; j++){
                            if(arr[i].id == cookieArr[j].id){
                                //将商品的数量赋值上去
                                arr[i].num = cookieArr[j].num;

                                //这个商品加入购物车过
                                newArr.push(arr[i]);
                            }
                        }
                    }
                    //newArr 就是加入购物车的商品详情数据
                    //想办法将数据添加到页面上
                    var html = ``;
                    for(var i = 0; i < newArr.length; i++){
                        html += `<li id="${newArr[i].id}">
                            <div class="sc_goodsPic">
                                <img src="${newArr[i].img}"
                                    alt="">
                            </div>
                            <div class="sc_goodsTitle">
                                <p>这是商品曲奇饼干</p>
                            </div>
                            <div class="sc_goodsBtn">购买</div>
                            <div class="delete_goodsBtn">删除</div>
                            <div class="sc_goodsNum">
                                <div>
                                    <button>+</button>
                                    <button>-</button>
                                    <span>商品数量：${newArr[i].num}</span>
                                </div>
                            </div>
                        </li>`;
                    }
                    $(".sc_right").find("ul").html(html);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    //右侧购物车数据加载
    //异步数据串行：promise写法：



    //抛物线运动
    function ballMove(oBtn){
        $("#ball").css({
            display:"block",
            left:$(oBtn).offset().left,
            top:$(oBtn).offset().top,
        })

        //计算偏移位置：
        var X = $(".sc_right .sc_pic").offset().left - $("#ball").offset().left;
        var Y = $(".sc_right .sc_pic").offset().top - $("#ball").offset().top;
        var bool = new Parabola({
            el:"#ball",
            offset:[X, Y], //运动的偏移位置
            duration:500,
            curvatrue:0.001,
            callback:function(){
                // 动画结束的回调函数
                $("#ball").hide();
            }
        })
        bool.start();
    }


    //点击加入购物车按钮
    function addShopCart(){
        //给所有的加入购物车的按钮添加点击
        //对于异步加载，后添加进来的节点，我们要通过事件委托来进行绑定事件
        $(".goods_box ul").on("click", ".sc_btn", function(){
            //购物车的商品本地缓存，cookie最大不能超过4kb
            //一般存id和数量就行了：[{id:id, num:1},{id:id, num:1}]
            // 将上面的数据结果转成对应json字符串进行存储

            // this.id 就是我们加入购物车所在的商品的id
            var id = this.id;
            console.log(this.id);
            //1、判断否是第一次添加
            var first = $.cookie("goods") == null ? true : false;
            if (first) {
                var arr = [{ id: id, num: 1 }];
                $.cookie("goods", JSON.stringify(arr), {
                    expires: 7
                })
            } else {
                //2、判断之前是否添加过
                var cookieArr = JSON.parse($.cookie("goods"));
                var same = false; //默认代表之前没添加过
                // var index = cookieArr.findIndex(item => item.id == id);
                // if(index != -1){
                //     //添加过数量加1
                //     cookieArr[index].num++;
                // }else{
                //     //没添加过，新增数据
                //     var obj = {id:id, num:1}
                //     cookieArr.push(obj);
                // }
                for (var i = 0; i < cookieArr.length; i++) {
                    if (cookieArr[i].id == id) {
                        same = true;
                        cookieArr[i].num++; //数量+1
                        break;
                    }
                }
                //3、该商品之前没有添加过
                if(!same){
                    var obj = {id:id, num:1};
                    cookieArr.push(obj);
                }
                //4、最后要将修改完毕的数据重新存储回去
                $.cookie("goods", JSON.stringify(cookieArr),{
                    expires:7
                })
                console.log(cookieArr);
            }
            //点击加入购物车以后重新计算商品数量
            sc_num();
            sc_msg();
            ballMove($(this));
        })
    }

    // 清空购物车
    function clearShopCart(){
        //点击清空购物车
        $("#clearBtn").click(function(){
            console.log("11111");
            // 1、删除cookie
            // $.cookie("goods", null);
            // $.removeCookie("goods");
            $.cookie("goods", null, {
                expires: -1
            })
            // 2、删除页面上的数据
            sc_num();
            // 相当于清空了该节点下的所有子节点
            $(".sc_right ul").html("");
            // $(".sc_right ul").empty();  // 清空子节点
        })
    }


    function delShop(){
        //右侧删除按钮
        $(".sc_right ul").on("click", ".delete_goodsBtn", function(){
            // 获取要删除商品的id
            //删除页面上的节点
            var id = $(this).closest("li").remove().attr("id");
            console.log(id);
            
            // 从cookie中删除数据
            var cookieArr = JSON.parse($.cookie("goods"));
            // coolieArr = cookieArr.filter(item => item.id != id);
            for(var i = 0; i < cookieArr.length; i++){
                if(cookieArr[i].id === id){
                    cookieArr.splice(i, 1);
                    break;
                }
            }
            //如果购物车里没有数据
            if(!cookieArr.length){
                // 删除cookie
                $.cookie("goods", null, {
                    expires: -1
                })
            }else{
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires:7
                });
            }
            // 重新计算购物车数量
            sc_num();
        })

        //给购物车添加加号减号事件
        $(".sc_right ul").on("click", ".sc_goodsNum button", function(){
            // 
            var id = $(this).closest("li").attr('id');
            // 取cookie
            var cookieArr = JSON.parse($.cookie("goods"));
            // 找到要改的数据
            // var item = cookieArr.find(item => item.id === id);
            for(var i =0; i < cookieArr.length; i++){
                if(cookieArr[i].id === id){
                    break;
                }
            }
            // 判断是加号还是减号
            if(this.innerHTML == "+"){
                cookieArr[i].num++;
            }else{
                cookieArr[i].num == 1 ? alert("数量为1，不能减了") : cookieArr[i].num--;
            }
            // 页面上也要修改
            $(this).siblings("span").html (`商品数量是：${cookieArr[i].num}`);

            // 将cookie存回去
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires:7
            });
            // 重新计算商品数量
            sc_num();
        })
    }

    // 右侧购物车移入移出事件
    function shopCartHover(){
        // 给右侧购物车添加移入移出事件
        $(".sc_right").mouseenter(function(){
            $(this).stop(true).animate({
                right:0
            },500)
        }).mouseleave(function(){
            $(this).stop(true).animate({
                right:-270
            },500)
        })
    }
    


    //对外暴露
    return{
        download:download,
        addShopCart:addShopCart,
        clearShopCart:clearShopCart,
        delShop:delShop,
        shopCartHover:shopCartHover
    }
})

