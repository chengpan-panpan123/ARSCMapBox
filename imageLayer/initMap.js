
/* 
author :chengpan
function :初始地图加载
date: 2022-02-15
*/
import '../mapbox-gl/src/css/mapbox-gl.css'
import '../css/mapBaseStyle.css'
var $ = require("../thirdParty/jquery-3.2.1.min.js")
var mapboxgl = require('../mapbox-gl');  //引入组件
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmdwYW4iLCJhIjoiY2t6bW5kcmwyMms0cjJwbjJobW0yanA5dCJ9.A_TrkQ0EvPEeRJw9bXBKIw'; //这里请换成自己的token


function initMap(options) {
  var mapOptions = options;
  var mapStyle = mapOptions.layers;
  mapOptions.style = {
    "version": 8,
    "sources": {},
    "layers": []
  };
  for (var i = 0; i < mapStyle.length; i++) {
    var currentMapStyle = mapStyle[i];

    if (currentMapStyle.serviceType == "WMTS" || !currentMapStyle.serviceType) {
      mapOptions.style.sources["sourceTilesIndex_" + i] = {
        "type": "raster",
        'tiles': [currentMapStyle.serviceUrl],
        "tileSize": currentMapStyle.tileSize || 256
      }
      mapOptions.style.layers.push({
        "id": currentMapStyle.id || ("simple-tiles-" + i),
        "type": "raster",
        "source": "sourceTilesIndex_" + i,
        "minzoom": currentMapStyle.minzoom || 0,
        "maxzoom": currentMapStyle.maxzoom || 24
      })
    }

  }
  //mapOptions.layers = undefined;

  var map = new mapboxgl.Map(mapOptions);
  map.initialMapLayers = options;


  return map;
}

function test() {
  // var map=new mapboxgl.Map({
  //   container: options.container, // container id 绑定的组件的id
  //   // style: 'mapbox://styles/mapbox/streets-v11', //地图样式，可以使用官网预定义的样式,也可以自定义
  //   //加载高德地图
  //   style: {
  //     "version": 8,
  //     "sources": {
  //       "raster-tiles": {
  //         "type": "raster",
  //         'tiles': [
  //           // wprd0{1-4} 
  //           // scl=1&style=7 为矢量图（含路网和注记）
  //           // scl=2&style=7 为矢量图（含路网但不含注记）
  //           // scl=1&style=6 为影像底图（不含路网，不含注记）
  //           // scl=2&style=6 为影像底图（不含路网、不含注记）
  //           // scl=1&style=8 为影像路图（含路网，含注记）
  //           // scl=2&style=8 为影像路网（含路网，不含注记）
  //           "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
  //         ],
  //         "tileSize": 256
  //       }
  //     },
  //     "layers": [{
  //       "id": "simple-tiles",
  //       "type": "raster",
  //       "source": "raster-tiles",
  //       "minzoom": 0,
  //       // "maxzoom": 18
  //     }]
  //   },
  //   center: [118.726533,32.012005], // 初始坐标系，这个是南京建邺附近
  //   zoom: 15,     // starting zoom 地图初始的拉伸比例
  //  // pitch: 60,  //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
  //   //bearing: -17.6, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北
  //   antialias: false, //抗锯齿，通过false关闭提升性能
  //   }); 

  //return map;
}


export { initMap }
