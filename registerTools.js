import { initMap } from './imageLayer/initMap'
import { layerOperation } from './baseTools/layerOperation'
import { measureDistance } from './baseTools/measureDistance'
import { measureArea } from './baseTools/measureArea'
import { CreatCompareMap, RemoveCompareMap } from './baseTools/CreatCompareMap'
import { CreatOverViewMap } from './baseTools/CreatOverViewMap'
import { globeTools } from './baseTools/globeTools'


import { heatmap2DLayer } from './creatFeature/heatmap2DLayer'


// import { CreatPointLayer } from './creatFeature/CreatPointLayer'
// import { CreatPolylineLayer } from './creatFeature/CreatPolylineLayer'
// import { CreatPolygonLayer } from './creatFeature/CreatPolygonLayer'
// import { CreatClusterLayer } from './creatFeature/CreatClusterLayer'
// import { EchartLayer } from './creatFeature/EchartLayer'
// import { changeMapColor } from './baseTools/changeMapColor'
// import { DrawFeature } from './baseTools/drawFeature'

// import { CreatFireWormLayer } from './creatFeature/CreatFireWormLayer'
// import { CreatMask } from './baseTools/CreatMask'
// import { addmvtTileLayer } from './imageLayer/addImageLayer'
// import { CreatColorMap } from './creatFeature/CreatColorMap'




var ARSCMapBox = {

    /*************************1_基础地图工具**************************** */

    /* 
     function :测量线长度、面积
   */
    initMap: function (options) {
        return initMap(options);

    },

    /* 
   function :测量线长度、面积
   */
    measure: function (map, type, options) {
        if (type == "Polygon" || type == "polygon") {
            return new measureArea(map, type, options);
        }
        return new measureDistance(map, type, options);

    },
    /* 
   function :地图卷帘
   */
    CreatCompareMap: function (containID, leftLayer, rightLayer, options) {
        return CreatCompareMap(containID, leftLayer, rightLayer, options);
    },
    /* 
   function :关闭地图卷帘
   */
    RemoveCompareMap: function (containID) {
        return RemoveCompareMap(containID);
    },
    /* 
   function :添加地图鹰眼
   */
    CreatOverViewMapControl: function (map, style, options) {
        globeTools.CloseOverViewMap();
        return new CreatOverViewMap(map, style, options);
    },
    /* 
    function :关闭鹰眼地图
    */
    CloseOverViewMapControl: function () {
        return globeTools.CloseOverViewMap();
    },

    //基础地图工具类
    //放大缩小、指北针导航控件
    NavigationControl: function (map) {
        return globeTools.NavigationControl(map);
    },
    //比例尺控件
    ScaleControl: function (map) {
        return globeTools.ScaleControl(map);
    },

    /* 
    function :绘制地图遮罩
    */
    CreatMask: function (map, jsonInfo, styleOptions) {
        //return new CreatMask(map, jsonInfo, styleOptions)
    },

    /* 
    function :改变地图颜色
    */
    changeMapColor: function (map, layer, cssString, options) {
        //return new changeMapColor(map, layer, cssString, options);
    },

    /* 
    function :手动绘制线、面等
    */
    DrawFeature: function (map, type, options, showPopup) {
        // return new DrawFeature(map, type, options, showPopup);
    },




    /*************************2_添加切片底图**************************** */

    /* 
   function :加载mvt矢量切片
   */
    addmvtTileLayer: function (map, jsonInfo) {
        // addmvtTileLayer(map, jsonInfo)
    },


    /*************************3_绘制要素类**************************** */

    /* 
    function :绘制图标
    */
    CreatPointLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
        //return new CreatPointLayer(map, layerName, jsonInfo, zoom, options, clickCallBack)
    },

    /* 
    function :绘制线
    */
    CreatPolylineLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
        //return new CreatPolylineLayer(map, layerName, jsonInfo, zoom, options, clickCallBack)
    },

    /* 
    function :绘制热力
    */
    heatmap2DLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
        return new heatmap2DLayer(map, layerName, jsonInfo, zoom, options, clickCallBack)
    },

    /* 
    function :绘制面
    */
    CreatPolygonLayer: function (map, layerName, jsonInfo, zoom, options) {
        //return new CreatPolygonLayer(map, layerName, jsonInfo, zoom, options)
    },

    /* 
    function :绘制聚合
    */
    CreatClusterLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
        //return new CreatClusterLayer(map, layerName, jsonInfo, zoom, options, clickCallBack)
    },

    /* 
    function :echart_迁徙图
    */
    // CreatEchartLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
    //     return new EchartLayer(map, layerName, jsonInfo, zoom, options, clickCallBack);
    // },

    /* 
   function :绘制萤火虫图标
   */
    CreatFireWormLayer: function (map, layerName, jsonInfo, zoom, options, clickCallBack) {
        //return new CreatFireWormLayer(map, layerName, jsonInfo, zoom, options, clickCallBack)
    },

    /* 
    function :绘制色阶图
    */
    CreatColorMap: function (map, layerName, jsonInfo, valueField, zoom, options) {
        //return new CreatColorMap(map, layerName, jsonInfo, valueField, zoom, options)
    },


    //图层操作_清除图层
    clearLayerByName: function (map, layerName) {
        layerOperation.clearLayerByName(map, layerName);
    },

    //图层操作_控制图层可见性
    setLayerVisibleByName: function (map, layerName, visible) {
        layerOperation.setLayerVisibleByName(map, layerName, visible);
    },

}

export { ARSCMapBox }