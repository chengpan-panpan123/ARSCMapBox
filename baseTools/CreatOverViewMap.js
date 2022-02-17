
/* 
author :chengpan
function :地图卷帘
date: 2022-02-15
*/
import '../css/mapBaseStyle.css'

import { initMap } from "../imageLayer/initMap"



var $ = require("../thirdParty/jquery-3.2.1.min.js")


/*
接口参数说明：
(1) fatherContainID: 父级容器
(2) leftLayer:左侧图层
(3) rightLayer:右侧图层
(4) options:其他设置
*/

var defaultLineStyle = {
  'line-color': 'red',
  'line-width': 2,
  'line-opacity': 0.65
}



var defaultFillStyle = {
  'fill-color': 'red',
  'fill-opacity': 0.3
}

function CreatOverViewMap(map, layers, options) {

  this.map = map;


  options = options || {};
  this.options=options;

  var zoomScale = options.zoomDifference || 3;
  var container = map.getContainer();
  var id = container.id;

  $("#" + id).append("<div id='mapbox_overviewMap'></div>");

  var center = map.getCenter();
  var zoom = map.getZoom();
  var overMapZoom = (zoom - zoomScale) >= 0 ? (zoom - zoomScale) : 0;


  var mapOptions = {
    center: center, // 初始中心点坐标
    zoom: overMapZoom,     // starting zoom 地图初始的拉伸比例
    // pitch: 60,  //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
    //bearing: -17.6, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北
    antialias: false, //抗锯齿，通过false关闭提升性能
  };
  mapOptions.container = 'mapbox_overviewMap';
  mapOptions.layers = layers || (map.initialMapLayers && map.initialMapLayers.layers);

  var overViewMap = initMap(mapOptions);

  this.map.overviewMap = overViewMap;

  this.overviewMap = overViewMap;


  var that = this;
  // 拖拽
  function mapdrag() {
    overViewMap.setCenter(map.getCenter());

    that.reDrawPolygon();
  }
  function overviewdrag() {
    map.setCenter(overViewMap.getCenter());

    that.reDrawPolygon();
  }
  //   放大缩小
  function mapzoom() {
    var zoom = (map.getZoom() - zoomScale) >= 0 ? (map.getZoom() - zoomScale) : 0;
    overViewMap.setZoom(zoom);
    that.reDrawPolygon();
  }
  function overviewzoom() {
    map.setZoom(overViewMap.getZoom() + zoomScale);

    that.reDrawPolygon();
  }

  function mapPan(){
    overViewMap.setCenter(map.getCenter());
    that.reDrawPolygon();

    overViewMap.setPitch(map.getPitch());
    overViewMap.setBearing(map.getBearing());
  }

  map.on("drag", mapdrag);
  map.on("zoom", mapzoom);
  map.on("moveend", mapPan);
  let overview = document.getElementById("mapbox_overviewMap");
  overview.addEventListener("mouseover", function () {
    //移除地图的拖拽监听
    map.off("drag", mapdrag);
    map.off("zoom", mapzoom);
    //添加鹰眼的拖拽监听
    overViewMap.on("drag", overviewdrag);
    overViewMap.on("zoom", overviewzoom);

    that.reDrawPolygon();
  });
  overview.addEventListener("mouseout", function () {
    //添加地图的拖拽监听
    map.on("drag", mapdrag);
    map.on("zoom", mapzoom);
    //移除鹰眼的拖拽监听
    overViewMap.off("drag", overviewdrag);
    overViewMap.off("zoom", overviewzoom);

    that.reDrawPolygon();

  });

  var bounds = (this.map.getBounds()).toArray();
  var extentPolygonCoord = getExtentCoord(bounds);

  this.overviewMap.on('load', function () {
    that.overviewLoaded = true;
    that.addPolygon(extentPolygonCoord, options);
  });



}
CreatOverViewMap.prototype.reDrawPolygon = function () {
  var bounds = (this.map.getBounds()).toArray();
  var extentPolygonCoord = getExtentCoord(bounds);
  var options=this.options;
  this.overviewLoaded && (this.addPolygon(extentPolygonCoord, options));
}
CreatOverViewMap.prototype.addPolygon = function (extentPolygonCoord, options) {
  var map = this.overviewMap;

  if (map.getSource("overviewPolygonSource")) {
    map.getSource("overviewPolygonSource").setData({
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [extentPolygonCoord]
      }
    });
  } else {

    map.addSource("overviewPolygonSource", {
      type: 'geojson',
      data: {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [extentPolygonCoord]
        }
      }
    });
    map.addLayer({
      id: "overviewPolygonLayer_fill",
      type: 'fill',
      source: "overviewPolygonSource",
      paint: options.fillStyle || defaultFillStyle
    });
    map.addLayer({
      id: "overviewPolygonLayer_stroke",
      type: 'line',
      source: "overviewPolygonSource",
      paint: options.lineStyle || defaultLineStyle
    });
  }

}

function getExtentCoord(bounds) {
  return [bounds[0], [bounds[0][0], bounds[1][1]], bounds[1], [bounds[1][0], bounds[0][1]], bounds[0]];
}

function CloseOverViewMap(){
   $("#mapbox_overviewMap").remove();
}



export { CreatOverViewMap }
