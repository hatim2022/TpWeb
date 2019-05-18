class Plot {

    constructor(svg){

        this.svg = svg;
        this.dataset = {
            labels: ["info 1", "info 2", "info 3", "info 4"],
            data: [19, -10, 30, -3],
        };

        this.prepareSvg();
    }

    prepareSvg() {

        const { labels, data } = this.dataset;

        // Get svg coordinates
        const svgX = this.svg.currentTranslate.x;
        const svgY = this.svg.currentTranslate.y;

        const svgHeight = this.svg.clientHeight;
        const svgWidth = this.svg.clientWidth;
        const width = svgWidth - 30;
        const height = svgHeight - 30;


        // calculate grid coordinate
        const { min, max } = this.getDataInterval(data);

        // Generate x axis
        const xAxisW = width / labels.length;
        for(let i=labels.length-1, x=svgX+svgWidth-5-xAxisW, y=svgY+svgHeight-30/2; i >= 0; --i) {

            const line = this.createGridLine(x, y, height+5, 'Vertical');
                        
            this.svg.appendChild(line);

            const labelText = this.createTextFromLabel(labels[i], x+5, y, 'rgba(128, 128, 128, 0.5)');
            this.svg.appendChild(labelText);

            x -= xAxisW;
        }

        // Generate y axis
        const MAX_BOUND = Math.ceil(height / 30);
        const MIN_BOUND = Math.ceil(height / 50);
        let yAxisH = max-min;
        let yAxisScale;
        let res_bound;
        
        for(let i = MIN_BOUND;i <= MAX_BOUND; ++i) {
            if( (i&1) === 0 && yAxisH%i === 0) {
                yAxisScale = i;
                res_bound = yAxisH / i;
                yAxisH = height / i;
                break;
            }
        }

        for(let i=0, m=min, x=svgX+svgWidth-5, y=svgY+svgHeight-30/2; i <= yAxisScale; ++i) {
            
            const line = this.createGridLine(x, y, width+5);
            
            this.svg.appendChild(line);

            const labelText = this.createTextFromLabel(m.toString(), x-svgWidth+30/2, y-5, 'rgba(128, 128, 128, 0.5)');
            this.svg.appendChild(labelText);
            m += res_bound;

            y -= yAxisH;
        }

        // Plot data
        for(let i=labels.length-1, x=svgX+svgWidth-5-xAxisW, y=svgY+svgHeight-30/2; i >= 0; --i) {

            const rectHeight = Math.abs(data[i]*(yAxisH/res_bound));

            const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

            // Dealing with the height and y attributes is the most crucial task
            if(max === 0) {
                rect.setAttributeNS(null, 'y', 30/2);
            }
            else if(min < 0) {
    
                if(data[i] > 0) rect.setAttributeNS(null, 'y', y - rectHeight - height/2);
                else rect.setAttributeNS(null, 'y', y - height/2);

            }
            else {
                rect.setAttributeNS(null, 'y', y - rectHeight);
            }
            rect.setAttributeNS(null, 'height', rectHeight);

            rect.setAttributeNS(null, 'width', xAxisW-2*5);
            rect.setAttributeNS(null, 'x', x+5);
            rect.setAttributeNS(null, 'fill', '#B0C4DE');

            this.svg.appendChild(rect);

            x -= xAxisW;
        }

    }

    createTextFromLabel(label, x, y, color='red') {
        const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.innerHTML = label.substring(0, 10);
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y+15);
        text.setAttributeNS(null, 'fill', color);

        return text;
    }

    createGridLine(x, y, length, type = 'Horizontal') {
        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttributeNS(null, 'x1', x);
        line.setAttributeNS(null, 'y1', y);

        if(type === 'Horizontal')
            line.setAttributeNS(null, 'x2', x-length);
        else
            line.setAttributeNS(null, 'x2', x);
        
        if(type === 'Vertical')
            line.setAttributeNS(null, 'y2', y-length);
        else
            line.setAttributeNS(null, 'y2', y);
        
        line.style.stroke = 'rgba(128, 128, 128, 0.5)';
        line.style.strokeWidth = '1';

        return line;
    }

    getDataInterval(data) {
        // get the max in order to create the grid
        let max = -Infinity;
        let min = +Infinity;
        for(let d of data){
            if(d>max)
                max = d;
            if(d<min)
                min = d;
        }

        if (max < 0) {
            max = 0;
            min = Math.ceil(Math.abs(min) / 10) * -10;
        }else {
            max = Math.ceil(max / 10) * 10;
            min = min >= 0 ? 0 : -max;
        }

        return {min, max};
    }
}