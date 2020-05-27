// 编写gulp要做的任务

/*
    gulp.task() 创建任务的
    gulp.src()  找文件源路径
    pipe() 管道
    gulp.dest() 目的路径
*/

// 将这些静态文件进行整理

const gulp = require("gulp");

//整理html
// gulp-htmlmin压缩html代码
const htmlmin = require("gulp-htmlmin");
gulp.task("copy-html", ()=>{
    return gulp.src("*.html")
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest("dist/"))
    .pipe(connect.reload());
})

//图片
gulp.task("images", ()=>{
    return gulp.src("*.{jpg,png}")
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());
})

//数据
gulp.task("data", ()=>{
    //有多个源路径，只能写数组
    return gulp.src(["*.json", "!package.json"])
    .pipe(gulp.dest("dist/data"))
    .pipe(connect.reload());
})

//js代码
gulp.task("scripts", ()=>{
    return gulp.src(["*.js", "!gulpfile.js"])
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
})


//处理sass：使用gulp插件gulp-sass gulp-rename gulp-minify-css
//如果我们要对我们生成css代码进行重命名，一个文件一个任务
const scss = require("gulp-sass");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");

gulp.task("scss1", ()=>{
    return gulp.src("stylesheet/index.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())
    .pipe(rename("index.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})
gulp.task("scss2", ()=>{
    return gulp.src("stylesheet/css.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(minifyCSS())
    .pipe(rename("css.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

// 在监听之前，将所有的任务，先去执行一遍
gulp.task("build", ["copy-html", 'images', "scripts", "data", "scss1", "scss2"], function(){
    console.log("项目建立成功");
})

//设置监听，设置服务，同时启动监听和服务
gulp.task("watch", function(){
    gulp.watch("*.html", ["copy-html"]);
    gulp.watch("*.{jpg,png}", ['images']);
    gulp.watch(["*.json", "!package.json"], ["data"]);
    gulp.watch(["*.js", "!gulpfile.json"], ["scripts"]);
    gulp.watch("stylesheet/index.scss", ["scss1"]);
    gulp.watch("stylesheet/css.scss", ["scss2"]);
})


// 启动一个临时服务器，不支持运行php
const connect = require("gulp-connect");
gulp.task("server", function(){
    connect.server({
        root:"dist", //根目录
        port:8888,  // 端口号
        livereload:true  // 实时刷新
    })
})

//设置默认任务，同时启动服务和监听
gulp.task("default", ["watch", "server"]);