onmessage = function(event) {
    var data = event.data,
        imageData = data.imageData, 
        width = data.width, 
        height = data.height;
    
    // 这里计算距离图片上边100像素开始，高40像素区域的明暗程度
    var startIndex = width * 100 * 4;
    var endIndex = startIndex + width * 40 * 4;
    var res = 0;
    var index = 0;
    var bright = 0;
    var dark = 0;
    var halfWidth = Math.round(width / 2);
    for (var i = startIndex; i < endIndex; i += 4) {
        index ++;
        var r = imageData.data[i];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        var ave = (r + g + b) / 3;
        // 该点到中心的距离，用作加权，数值越小，权重越大。
        var w = Math.abs(halfWidth - (i / 4) % width);
        var factor = 1 - w / halfWidth;
        if (ave > 128) {
            bright += factor;
        } else {
            dark += factor;
        }
        res += ave;
    }
    var contrastRatio = bright / dark;
    var averageColor = res / index;
    if (contrastRatio > 1) {
        postMessage('black');
    } else {
        postMessage('white');
    }
    
}