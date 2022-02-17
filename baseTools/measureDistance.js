
/* 
author :chengpan
function :测距
date: 2022-02-15
*/
import '../css/measureTipTools.css'
var mapboxgl = require('../mapbox-gl');  //引入组件
var turf = require("../thirdParty/turf.min.js");

/*
接口参数说明：
(1) map:地图
(2) measureClass:"Polygon"/"LineString"
(3) styleOptions:线、面颜色设置
*/

var defaultLineStyle={
  'line-color': '#ff0000',
  'line-width': 2,
  'line-opacity': 0.65
}

var defaultPointStyle = {
  'circle-color': '#ffffff',
  'circle-radius': 3,
  'circle-stroke-width': 2,
  'circle-stroke-color': '#ff0000'
}

function measureDistance(map, measureClass, styleOptions) {

  if(map.publicMeasureingRecord){
    alert("请先结束上一次绘制");
    return;
  }

  styleOptions = styleOptions || {};
  this.isMeasure = true;

  this.map = map;
  // 禁止双击缩放
  this.map.doubleClickZoom.disable();
  this.map.getCanvas().style.cursor = 'default';

  this.layerId = newGuid();

  map.publicMeasureingRecord = true;

  this.clearMeasure();

  var jsonPoint = {
    'type': 'FeatureCollection',
    'features': []
  };
  var jsonLine = {
    'type': 'FeatureCollection',
    'features': []
  };
  var points = [];
  var ele = document.createElement('div');
  // ele.setAttribute('class', 'measure-result');
  ele.className = 'measure-result';
  var option = {
    element: ele,
    anchor: 'left',
    offset: [8, 0]
  };

  var tooltip = new mapboxgl.Marker(option)
    .setLngLat([0, 0])
    .addTo(map);
  var markers = [];


  this.layerId_pointsSource = this.layerId + "_pointsSource";
  this.layerId_linemoveSource = this.layerId + "_linemoveSource";
  this.layerId_lineSource = this.layerId + "_lineSource";

  this.layerId_pointsLayer = this.layerId + "_pointsLayer";
  this.layerId_linemovLayer = this.layerId + "_linemoveLayer";
  this.layerId_lineLayer = this.layerId + "_lineLayer";

  var source = map.getSource(this.layerId_pointsSource);
  if (source) {
    map.getSource(this.layerId_pointsSource).setData(jsonPoint);
    map.getSource(this.layerId_linemoveSource).setData(jsonLine);
    map.getSource(this.layerId_lineSource).setData(jsonLine);
  } else {
    map.addSource(this.layerId_pointsSource, {
      type: 'geojson',
      data: jsonPoint
    });
    map.addSource(this.layerId_lineSource, {
      type: 'geojson',
      data: jsonLine
    });
    map.addSource(this.layerId_linemoveSource, {
      type: 'geojson',
      data: jsonLine
    });
    map.addLayer({
      id: this.layerId_linemovLayer,
      type: 'line',
      source: this.layerId_linemoveSource,
      paint: styleOptions.lineStyle||defaultLineStyle
    });
    map.addLayer({
      id: this.layerId_lineLayer,
      type: 'line',
      source: this.layerId_lineSource,
      paint: styleOptions.lineStyle||defaultLineStyle
    });
    map.addLayer({
      id: this.layerId_pointsLayer,
      type: 'circle',
      source: this.layerId_pointsSource,
      paint: styleOptions.pointStyle||defaultPointStyle
    });
  }
  function addPoint(coords, lineSourceId, pointSourceId) {
    if (jsonPoint.features.length > 0) {
      var prev = jsonPoint.features[jsonPoint.features.length - 1];
      jsonLine.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [prev.geometry.coordinates, coords]
        }
      });
      map.getSource(lineSourceId).setData(jsonLine);
    }
    jsonPoint.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
    map.getSource(pointSourceId).setData(jsonPoint);
  }

  function getLength(coords) {
    var _points = points.concat([coords]);
    var line = turf.lineString(_points);
    var len = turf.length(line);
    if (len < 1) {
      len = Math.round(len * 1000) + 'm';
    } else {
      len = len.toFixed(2) + 'km';
    }
    return len;
  }

  function addMeasureRes(coords) {
    var ele = document.createElement('div');
    ele.className = 'measure-result';
    var option = {
      element: ele,
      anchor: 'left',
      offset: [8, 0]
    };
    ele.innerHTML = points.length === 0 ? '起点' : getLength(coords);
    var marker = new mapboxgl.Marker(option)
      .setLngLat(coords)
      .addTo(map);
    markers.push(marker);
  }

  var self = this;


  self.clickEvent = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      addMeasureRes(coords);
      addPoint(coords, self.layerId_lineSource, self.layerId_pointsSource);
      points.push(coords);
    }
  };

  map.on('click', self.clickEvent);

  self.mousemoveClick = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      if (jsonPoint.features.length > 0) {
        var prev = jsonPoint.features[jsonPoint.features.length - 1];
        var json = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [prev.geometry.coordinates, coords]
          }
        };
        map.getSource(self.layerId_linemoveSource).setData(json);
        ele.innerHTML = getLength(coords);

      } else {
        ele.innerHTML = '点击地图开始测量';
      }
      tooltip.setLngLat(coords);
    }
  }

  map.on('mousemove', self.mousemoveClick);

  self.dblclickEvent = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      addPoint(coords, self.layerId_lineSource, self.layerId_pointsSource);
      self.isMeasure = false;
      map.getCanvas().style.cursor = '';
      // jsonPoint.features = [];
      // jsonLine.features = [];
      tooltip.remove();
      // 添加关闭按钮
      var ele = document.createElement('div');
      // ele.setAttribute('class', 'measure-result close');
      ele.className = 'measure-result_close';
      var option = {
        element: ele,
        anchor: 'bottom-left',
        offset: [-5, -10]
      };
      ele.innerHTML = '×';
      self.deleteBtnTip = new mapboxgl.Marker(option)
        .setLngLat(coords)
        .addTo(map);
      ele.onclick = function (__e) {
        __e.stopPropagation();
        self.deleteBtnTip.remove();
        self.clearMeasure();
      }
    }

    //清除地图监听事件
    map.off('mousemove', self.mousemoveClick);
    map.off('click', self.clickEvent);
    map.off('dblclick', self.dblclickEvent);
    map.publicMeasureingRecord = false;
  }

  map.on('dblclick', self.dblclickEvent);

  this.marker = markers;


}

function newGuid() {
  return ('xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
}

measureDistance.prototype.clearMeasure = function () {
  var map = this.map;
  var markers = this.marker || [];

  for (var i = 0; i < markers.length; i++) {
    markers[i].remove();
  }

  // $(".measure-result").remove();
  var source = map.getSource(this.layerId_pointsSource);
  var json = {
    'type': 'FeatureCollection',
    'features': []
  };
  if (source) {
    map.getSource(this.layerId_pointsSource).setData(json);
    map.getSource(this.layerId_linemoveSource).setData(json);
    map.getSource(this.layerId_lineSource).setData(json);
  }

}

export { measureDistance }
