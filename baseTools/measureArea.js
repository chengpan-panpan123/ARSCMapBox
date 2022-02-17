
/* 
author :chengpan
function :测面
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

var defaultLineStyle = {
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

var defaultFillStyle = {
  'fill-color': '#ff0000',
  'fill-opacity': 0.1
}
function measureArea(map, measureClass, styleOptions) {
  if (map.publicMeasureingRecord) {
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
  ele.setAttribute('class', 'measure-result');
  const option = {
    element: ele,
    anchor: 'left',
    offset: [8, 0]
  };
  var tooltip = new mapboxgl.Marker(option)
    .setLngLat([0, 0])
    .addTo(map);

  this.tooltip = tooltip;

  this.layerId_pointsAreaSource = this.layerId + "_pointsareaSource";
  this.layerId_lineAreaSource = this.layerId + "_linearea";
  // this.layerId_lineSource = this.layerId + "_lineSource";

  this.layerId_pointsLayer = this.layerId + "_pointsLayer";
  this.layerId_lineAreaLayer = this.layerId + "_lineAreaLayer";
  this.layerId_lineStrokeLayer = this.layerId + "_lineStrokeLayer";

  var source = map.getSource(this.layerId_pointsAreaSource);
  if (source) {
    map.getSource(this.layerId_pointsAreaSource).setData(jsonPoint);
    map.getSource(this.layerId_lineAreaSource).setData(jsonLine);
  } else {
    map.addSource(this.layerId_pointsAreaSource, {
      type: 'geojson',
      data: jsonPoint
    });
    map.addSource(this.layerId_lineAreaSource, {
      type: 'geojson',
      data: jsonLine
    });
    map.addLayer({
      id: this.layerId_lineAreaLayer,
      type: 'fill',
      source: this.layerId_lineAreaSource,
      paint: styleOptions.fillStyle || defaultFillStyle
    });
    map.addLayer({
      id: this.layerId_lineStrokeLayer,
      type: 'line',
      source: this.layerId_lineAreaSource,
      paint: styleOptions.lineStyle || defaultLineStyle
    });
    map.addLayer({
      id: this.layerId_pointsLayer,
      type: 'circle',
      source: this.layerId_pointsAreaSource,
      paint: styleOptions.pointStyle || defaultPointStyle
    });
  }

  function getArea(coords) {
    var pts = points.concat([coords]);
    pts = pts.concat([points[0]]);
    var polygon = turf.polygon([pts]);
    var area = turf.area(polygon);
    if (area < 1000) {
      area = Math.round(area) + 'm²';
    } else {
      area = (area / 1000000).toFixed(2) + 'km²';
    }
    return area;
  }
  function addPoint(coords, id) {
    jsonPoint.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
    map.getSource(id).setData(jsonPoint);
  }


  var self = this;

  self.mousemoveEvent = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      var len = jsonPoint.features.length;
      if (len === 0) {
        ele.innerHTML = '点击地图开始测量';
      } else if (len === 1) {
        ele.innerHTML = '点击地图继续绘制';
      } else {
        var pts = points.concat([coords]);
        pts = pts.concat([points[0]]);
        var json = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [pts]
          }
        };
        map.getSource(self.layerId_lineAreaSource).setData(json);
        ele.innerHTML = getArea(coords);
      }
      tooltip.setLngLat(coords);
    }
  }

  map.on('mousemove', self.mousemoveEvent);


  self.clickEvent = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      points.push(coords);
      addPoint(coords, self.layerId_pointsAreaSource);
    }
  };

  map.on('click', self.clickEvent);

  self.dbClickEvent = function (_e) {
    if (self.isMeasure) {
      var coords = [_e.lngLat.lng, _e.lngLat.lat];
      points.push(coords);
      self.isMeasure = false;
      ele.innerHTML = getArea(coords);
      tooltip.setLngLat(coords);
      // 添加关闭按钮
      var _ele = document.createElement('div');
      _ele.setAttribute('class', 'measure-result_close');
      var option = {
        element: _ele,
        anchor: 'bottom-left',
        offset: [-5, -10]
      };
      _ele.innerHTML = '×';
      var deleteToolTip = new mapboxgl.Marker(option)
        .setLngLat(coords)
        .addTo(map);
      _ele.onclick = function (__e) {
        __e.stopPropagation();
        //map.doubleClickZoom.enable();
        self.clearMeasure();
        deleteToolTip.remove();
      }

      //清除地图监听事件
      map.off('mousemove', self.mousemoveEvent);
      map.off('click', self.clickEvent);
      map.off('dblclick', self.dbClickEvent);
      map.publicMeasureingRecord = false;
    }
  }

  map.on('dblclick', self.dbClickEvent);

}

function newGuid() {
  return ('xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
}

measureArea.prototype.clearMeasure = function () {

  var map = this.map;
  this.tooltip && this.tooltip.remove();

  var json = {
    'type': 'FeatureCollection',
    'features': []
  };

  var sourceArea = map.getSource(this.layerId_pointsAreaSource);
  if (sourceArea) {
    map.getSource(this.layerId_pointsAreaSource).setData(json);
    map.getSource(this.layerId_lineAreaSource).setData(json);
  }
}

export { measureArea }
