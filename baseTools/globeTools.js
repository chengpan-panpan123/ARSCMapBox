


import '../css/navigationTool.css'

var mapboxgl = require('../mapbox-gl');  //引入组件
var $ = require("../thirdParty/jquery-3.2.1.min.js")

var globeTools = {

    CloseOverViewMap: function () {
        //移除鹰眼地图
        $("#mapbox_overviewMap").remove();
    },
    NavigationControl: function (map) {
        //实例化导航控件(放大、缩小、罗盘)
        var nav = new mapboxgl.NavigationControl(
            {
                //是否显示指南针，默认为true
                "showCompass": true,
                //是否显示缩放按钮，默认为true
                "showZoom": true
            }
        );
        //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'top-right'
        map.addControl(nav, 'top-left');


        $(".mapboxgl-ctrl-group").css("position", "absolute");
        $(".mapboxgl-ctrl-group").css("top", "80px");
        $(".mapboxgl-ctrl-group").css("left", "80px");
    },
    ScaleControl: function (map,option) {

        var container = map.getContainer();
        var id = container.id;
        //比例尺控件
        var scale = new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
        });
        map.addControl(scale, "bottom-left");

        //设计样式
        $(".mapboxgl-ctrl-scale").css("background-color", "transparent");
        $(".mapboxgl-ctrl-scale").css("border-color", "rgba(20,20,20,0.7)");
        $(".mapboxgl-ctrl-scale").css("position","absolute");
        $(".mapboxgl-ctrl-scale").css("left","30px");
        $(".mapboxgl-ctrl-scale").css("bottom","30px");

    }


}

export { globeTools }