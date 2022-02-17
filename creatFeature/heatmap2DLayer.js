/* 
author :chengpan
function :创建热力图层
date: 2022-02-16
*/

import { layerOperation } from '../baseTools/layerOperation'
/*
接口参数说明：
(1) map:地图
(2) layerName：图层名
(3) jsonInfo:数据源
(4) zoom:飞到点集位置
(5) options
*/

var defaultHeatSetting = {
    gradient: [0, "rgba(0,0,0,0)",
    0.2, "rgba(25,70,150, .7)",
    0.4, "rgba(60,160,70, .7)",
    0.6, "rgba(250,230,30, .8)",
    0.8, "rgba(250,130,45, .9)",
    1, "rgba(255,36,36, .9)"],
    radius: 20,
    blur: 20,
    opacity: 1.0
}


function heatmap2DLayer(map, layerName, jsonInfo, zoom, options) {
    options = options || {};
    this.map = map;
    this.layerName = layerName || "heatMapLayer"; //图层名

    //先清除已有的图层
    layerOperation.clearLayerByName(this.map, this.layerName);



    //支持geojson地址和数组两种形式
    var jsonPoint;

    if (jsonInfo instanceof Array) {
        jsonPoint = {
            'type': 'FeatureCollection',
            'features': []
        };

        var minx = Infinity;
        var miny = Infinity;
        var maxx = -Infinity;
        var maxy = -Infinity;
        for (var i = 0; i < jsonInfo.length; i++) {
            var info = jsonInfo[i];
            jsonPoint.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [info.x, info.y]
                },
                properties: info.properties
            });
            minx = Math.min(info.x, minx);
            miny = Math.min(info.y, miny);
            maxx = Math.max(info.x, maxx);
            maxy = Math.max(info.y, maxy);
        }

        if (zoom) {
            map.fitBounds([[minx, miny], [maxx, maxy]]);
        }
    } else {
        jsonPoint = jsonInfo;
    }

    var gradient=[
        "interpolate",
        ["linear"],
        ["heatmap-density"]
    ].concat(options.gradient||defaultHeatSetting.gradient);



    map.addSource(this.layerName + '_earthquakesSource', {
        "type": "geojson",
        //"data": "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
        "data": jsonPoint
    });

    map.addLayer({
        "id": this.layerName,
        "type": "heatmap",
        "source": this.layerName + '_earthquakesSource',
        "maxzoom": 22,
        "paint": {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": options.weight||1.0,
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 1,
                9, 3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": gradient,
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": options.radius || 50,
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity":options.opacity||defaultHeatSetting.opacity
            // "heatmap-opacity": [
            //     "interpolate",
            //     ["linear"],
            //     ["zoom"],
            //     7, 0.9,
            //     12, 0.9
            // ],
        }
    });


    layerOperation.registerLayerToMap(this.map, this.layerName, this);

}

heatmap2DLayer.prototype.clear = function () {
    var source = this.map.getSource(this.layerName + '_earthquakesSource');
    var layer = this.map.getLayer(this.layerName);
    if (source || layer) {
        this.map.removeLayer(this.layerName);
        this.map.removeSource(this.layerName + '_earthquakesSource');
    }
}

heatmap2DLayer.prototype.setVisible = function (visible) {
    //this.vectorLayer && this.vectorLayer.setVisible(visible)

}
heatmap2DLayer.prototype.getVisible = function () {
    // return this.vectorLayer && this.vectorLayer.getVisible();

}



export {
    heatmap2DLayer
}
