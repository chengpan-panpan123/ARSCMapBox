

/* 
author :chengpan
function :选择要素的公共点击
date: 2022-01-13
*/

function registerMapSingleClick(map) {

    //单击事件
    if (map.registerMapSingleClick) {
        return;
    }
    map.registerMapSingleClick = map.on('singleclick', function (evt) {

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            if(layer && layer.clickFunction){
                layer.clickFunction(evt,feature,layer);
            }         
        })
    });
}
function registerMapDoubleClick(map) {
    //双击事件

}

export { registerMapSingleClick, registerMapDoubleClick }