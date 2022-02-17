
/* 
author :chengpan
function :地图卷帘
date: 2022-02-15
*/
import '../css/mapBaseStyle.css'

import {initMap} from "../imageLayer/initMap"
var $ = require("../thirdParty/jquery-3.2.1.min.js")





/*
接口参数说明：
(1) fatherContainID: 父级容器
(2) leftLayer:左侧图层
(3) rightLayer:右侧图层
(4) options:其他设置
*/

function CreatCompareMap(fatherContainID, leftLayer, rightLayer, options) {


  options = options || {};

  $("#" + fatherContainID).show();

    $("#" + fatherContainID).append("<div class='swipeCompareMap'><input type='range' id='swipeIdCompareBar'/>" +
    "<div class='swipe-bar' id='swipeBarCompareMap'></div></div>" +
    "<div id='beforeCompareMap' class='systemCompareMap'></div>" +
    "<div id='afterCompareMap' class='systemCompareMap'></div>" +
    "</div>");

    var beforeMapOptions=options;
    beforeMapOptions.container='beforeCompareMap';
    beforeMapOptions.layers = leftLayer;

    var beforeMap = initMap(beforeMapOptions);

    var afterMapOptions=options;
    afterMapOptions.container='afterCompareMap';
    afterMapOptions.layers = rightLayer;

    var afterMap = initMap(afterMapOptions);


  // var beforeMap = new mapboxgl.Map({
  //   container: 'beforeCompareMap',
  //   style: 'mapbox://styles/mapbox/light-v10',
  //   center: options.center||[0, 0],
  //   zoom: options.zoom||0
  // });

  // var afterMap = new mapboxgl.Map({
  //   container: 'afterCompareMap',
  //   style: 'mapbox://styles/mapbox/dark-v10',
  //   center: options.center||[0, 0],
  //   zoom: options.zoom||0
  // });




  var maps = [beforeMap, afterMap];
  maps.forEach(map => {
    var mapDom = map.getContainer().getAttribute('id')
    // 鼠标进入的时候注册事件
    map.on('mouseover', e => {
      var mouseDom = e.target.getContainer().getAttribute('id')
      if (mouseDom === mapDom) {
        map.on('move', moveEvent)
      } else {
        map.off('move', moveEvent)
      }
    })
    // 鼠标移除的时候关闭事件
    map.on('mouseout', e => {
      maps.forEach(map => {
        map.off('move', moveEvent)
      })
    })
  })

  function moveEvent(e) {
    var c = e.target.getCenter();
    var d = e.target.getContainer().getAttribute('id')
    var z = e.target.getZoom();
    var p=e.target.getPitch();
    var b=e.target.getBearing();
    //倾角/
    maps.forEach(map => {
      if (d !== map.getContainer().getAttribute('id')) {
        map.setCenter(c);
        map.setZoom(z);
        map.setBearing(b);
        map.setPitch(p);
      }
    })
  }

  var map1 = document.getElementById('beforeCompareMap')
  var map2 = document.getElementById('afterCompareMap')
  var WIDTH = map1.clientWidth
  var HEIGHT = map1.clientHeight

  var swipe = document.getElementById('swipeIdCompareBar')
  var MAX = 1000;
  swipe.setAttribute('min', 0)
  swipe.setAttribute('max', MAX)
  swipe.setAttribute('value', MAX / 2)
  swipe.oninput = function (e) {
    setStyle()
  }
  setStyle()
  function setStyle() {
    var v = swipe.value
    var left = Math.ceil((v / MAX) * WIDTH)
    map1.style.clip = `rect(0, ${left}px, ${HEIGHT}px, 0)`
    map2.style.clip = `rect(0, ${WIDTH}px, ${HEIGHT}px, ${left}px)`
    // 设置bar样式
    var swipeBar = document.getElementById('swipeBarCompareMap')
    swipeBar.style.left = `${left - 2}px`
    // 设置swipe样式
    var hWIDTH = MAX / 2
    var isLeft = v < hWIDTH
    var offsetL = Math.abs(((hWIDTH - v) / hWIDTH) * 18)
    // swipe.style.left = isLeft ? `-${offsetL}px` : `${offsetL}px`
  }



}

function RemoveCompareMap(fatherContainID){
   $("#" + fatherContainID).hide();
   $(".swipeCompareMap").remove();
   $("#beforeCompareMap").remove();
   $("#afterCompareMap").remove();
}

export { CreatCompareMap,RemoveCompareMap }
