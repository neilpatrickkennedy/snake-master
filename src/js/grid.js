export class GridItem {

    constructor(width, height, X, Y, classNames) {
        classNames = classNames || [];
        this.width = width;
        this.height = height;
        this.X = X;
        this.Y = Y;
        this.classNames = new Set(classNames);
    }

    addClasses(classNames) {
        classNames.forEach(className => this.classNames.add(className));
    }

    removeClasses(classNames) {
        classNames.forEach(className => this.classNames.delete(className));
    }

    copy() {
        return new GridItem(this.width, this.height, this.X, this.Y, [...this.classNames]);
    }

    render() {
        let classStr = [...this.classNames].join(" ");
        let styleStr = `grid-area: ${this.height - this.Y} / ${this.X + 1}`;
        let div = `<div class="${classStr}" style="${styleStr}"></div>`;
        return div
    }

    loadFromDiv(div) {
        this.X = parseInt(div.style.gridRow.slit("/")[0].trim()) - 1;
        this.Y = self.height - selfparseInt(div.style.gridColumn.slit("/")[0].trim());
        this.classNames = new Set(div.className.split(" "));
    }

}
