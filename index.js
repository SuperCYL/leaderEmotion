var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
require('./bubble.css');
require('./bubble');



/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    let that = this;
    var html = `
          <div id="leaderEmotionCloud" class="wrapper" style="height:100%;overflow:hidden;">
          <div class="tagcloud" style="width:100%;height:100%;">`
            for(var i=0;i<data.length;i++){
              if(data[i]["rankId"] == 1){
                html+=`<a class="tagcloudItem b01" eventId="${data[i]["eventId"]}" href="#" style="font-size:40px;color:#F74C64">${data[i]["title"]}</a>`
              }
              else if(data[i]["rankId"] == 2){
                html+=`<a class="tagcloudItem b02" eventId="${data[i]["eventId"]}" href="#" style="font-size:36px;color:#FFA633">${data[i]["title"]}</a>` 
              }
              else if(data[i]["rankId"] == 3){
                html+=`<a class="tagcloudItem b02" eventId="${data[i]["eventId"]}" href="#" style="font-size:32px;color:#F9C824">${data[i]["title"]}</a>` 
              }
              else if(data[i]["rankId"] == 4){
                html+=`<a class="tagcloudItem b02" eventId="${data[i]["eventId"]}" href="#" style="font-size:28px;color:#4FC8FF">${data[i]["title"]}</a>` 
              }
              else if(data[i]["rankId"] == 5){
                html+=`<a class="tagcloudItem b02" eventId="${data[i]["eventId"]}" href="#" style="font-size:24px;color:#FFFFFF">${data[i]["title"]}</a>` 
              }
            }
            
        html+=`</div> </div>`  

   
    //更新图表
    //this.chart.render(data, cfg);
    this.container.html(html)
    /*3D标签云*/
    tagcloud({
        selector: ".tagcloud",  //元素选择器
        fontsize: 24,       //基本字体大小, 单位px
        radius: 100,         //滚动半径, 单位px 页面宽度和高度的五分之一
        mspeed: "slow",   //滚动最大速度, 取值: slow, normal(默认), fast
        ispeed: "slow",   //滚动初速度, 取值: slow, normal(默认), fast
        direction: 135,     //初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
        keep: false          //鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
    });
    //如果有需要的话,更新样式

    $("#leaderEmotionCloud .tagcloudItem").click(function(){
      console.log($(this).attr("eventId"));
      that.emit('click', {eventId:$(this).attr("eventId")}); 
    })

    this.updateStyle();
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});