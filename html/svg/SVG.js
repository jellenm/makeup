function SVG(id){
    this.viewBoxX = 0;
    this.viewBoxY = 0;
    this.clickFlag = false;
    this.svgDom = document.getElementById(id);
    this.clickFlag = false;
    this.position = {x:0,y:0};
    this.downPosition = {x:0,y:0};
    this.children = [];
    this.scale = 0;
}
SVG.prototype.init = function(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.viewBoxW = this.width;
    this.viewBoxH = this.viewBoxW*this.height/this.width;
    this.viewBoxRate = this.viewBoxW/this.width;
    this.cx = this.width/2;
    this.cy = this.height/2;
    this.resetViewBox();
};
SVG.prototype.resetViewBox = function(){
    this.svgDom.setAttribute('viewBox',this.viewBoxX+' '+this.viewBoxY+' '+this.viewBoxW+' '+this.viewBoxH);
};
SVG.prototype.parseAttrs = function(child){
    var i;
    if(child['tagName'] === 'path'){
        var d ='';
        switch (child['type']){
            case 'line':
                d += 'M'+parseFloat((this.cx + child['attrs']['d']['M']['x']).toFixed(2)) + ' '+parseFloat((this.cy + child['attrs']['d']['M']['y']).toFixed(2));
                for(i in child['attrs']['d']){
                    if(i !== 'M'){
                        d += 'L'+ parseFloat((this.cx + child['attrs']['d'][i]['x']).toFixed(2)) +' '+parseFloat((this.cy + child['attrs']['d'][i]['y']).toFixed(2));
                    }
                }
        }
        return d;
    }
};
SVG.prototype.createEle = function(child,reset){
    var ele = document.createElementNS('http://www.w3.org/2000/svg',child.tagName),j;
    for( j in child.styles){
        ele.style[j] = child.styles[j];
    }
    if(child['tagName'] === 'path'){
        child['d'] = this.parseAttrs(child);
        ele.setAttribute('d',child['d']);
    }else{

    }
    if(!reset){
        this.children.push(child);
    }
    this.svgDom.appendChild(ele);
};
SVG.prototype.resetChildren = function(){
    var self = this;
    while (this.svgDom.lastChild){
        this.svgDom.removeChild(this.svgDom.lastChild);
    }
    this.children.forEach(function(item){
        self.createEle(item,1);
    })
};
SVG.prototype.zoom = function(){
    var w = parseFloat(this.width*(1-this.scale).toFixed(2));
    var h = parseFloat(w*this.height/this.width.toFixed(2));
    this.viewBoxRate = w/this.width;
    this.viewBoxX -= (w - this.viewBoxW)/2;
    this.viewBoxY -= (h - this.viewBoxH)/2;
    this.viewBoxW = w;
    this.viewBoxH = h;
    this.position['x'] = -this.viewBoxX/this.viewBoxRate;
    this.position['y'] = -this.viewBoxY/this.viewBoxRate;
    this.resetViewBox();
};