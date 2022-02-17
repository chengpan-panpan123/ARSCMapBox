
var layerOperation = {
    registerLayerToMap: function (map, layerName, owner) {
        if (!map.arscMapLayerCollection) {
            map.arscMapLayerCollection = {};
        }
        map.arscMapLayerCollection[layerName] = owner;

    },
    clearLayerByName: function (map, layerName) {
        if (map.arscMapLayerCollection && map.arscMapLayerCollection[layerName]) {
            map.arscMapLayerCollection[layerName].clear();
        }
    },
    setLayerVisibleByName: function (map, layerName, visible) {
        if (map.arscMapLayerCollection && map.arscMapLayerCollection[layerName]) {
            map.arscMapLayerCollection[layerName].setVisible(visible);
        }
    }
}

export { layerOperation }