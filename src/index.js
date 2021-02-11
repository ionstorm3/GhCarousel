"use strict";
class GhCarousel {
    //#endregion
    //#region Constructor
    constructor(param) {
        //#region Properties
        this.m_containerId = "";
        this.m_interval = -1;
        this.m_cardsContainer = {};
        this.m_descsContainer = {};
        this.m_linksContainer = {};
        this.m_cardsInOriginalOrder = [];
        this.m_descsInOriginalOrder = [];
        this.m_isAutoRotationEnabled = false;
        this.m_autoRotationInterval = 500;
        this.m_containerId = param.containerId;
        this.m_isAutoRotationEnabled = param.isAutoRotationEnabled;
        this.m_autoRotationInterval = param.autoRotationInterval;
        this.initialize();
    }
    //#endregion
    //#region Methods
    initialize() {
        let parentContainer = document.getElementById(this.m_containerId);
        if (parentContainer === null) {
            console.log("Parent container not found.");
            return;
        }
        let cardsContainer = parentContainer.querySelector(".gh-cards-container");
        let descsContainer = parentContainer.querySelector(".gh-descs-container");
        let linksContainer = parentContainer.querySelector(".gh-links-container");
        if (cardsContainer === null) {
            console.log("Cards container not found.");
            return;
        }
        else {
            this.m_cardsContainer = cardsContainer;
        }
        if (descsContainer === null) {
            console.log("Descs container not found.");
            return;
        }
        else {
            this.m_descsContainer = descsContainer;
        }
        if (linksContainer === null) {
            console.log("Links container not found.");
            return;
        }
        else {
            this.m_linksContainer = linksContainer;
        }
        //Ensure the number of children in each container is the same
        if (this.m_descsContainer.children.length !== this.m_cardsContainer.children.length) {
            console.log("The descs container child count does not match the cards container child count.  All containers must have the same number of children.");
        }
        if (this.m_linksContainer.children.length !== this.m_cardsContainer.children.length) {
            console.log("The links container child count does not match the cards container child count.  All containers must have the same number of children.");
        }
        //Set the cards container order
        this.addOrderAttribute(this.m_cardsContainer);
        this.addOrderAttribute(this.m_descsContainer);
        this.addOrderAttribute(this.m_linksContainer);
        //
        this.m_cardsInOriginalOrder = this.arrangeByOrder(this.m_cardsContainer);
        this.m_descsInOriginalOrder = this.arrangeByOrder(this.m_descsContainer);
        this.addListeners(this.m_linksContainer);
    }
    addOrderAttribute(elem) {
        for (let i = 0; i < elem.children.length; i++) {
            let child = elem.children[i];
            child.setAttribute("data-order", i.toString());
        }
    }
    addListeners(linksContainer) {
        for (let i = 0; i < linksContainer.children.length; i++) {
            let link = linksContainer.children[i];
            link.addEventListener("mouseover", (e) => {
                window.clearInterval(this.m_interval);
                this.show(link);
            });
            link.addEventListener("mouseout", (e) => {
                this.setInterval();
            });
        }
    }
    show(link) {
        let idx = [...this.m_linksContainer.children].indexOf(link);
        if (idx === -1) {
            return;
        }
        console.log("idx:", idx);
        let cardsStack = [];
        let descsStack = [];
        for (let i = 0; i < this.m_cardsInOriginalOrder.length; i++) {
            if (i <= idx) {
                cardsStack.push(this.m_cardsInOriginalOrder[i]);
                descsStack.push(this.m_descsInOriginalOrder[i]);
            }
            else {
                cardsStack.unshift(this.m_cardsInOriginalOrder[i]);
                descsStack.unshift(this.m_descsInOriginalOrder[i]);
            }
        }
        this.replaceNodes(this.m_cardsContainer, cardsStack);
        this.replaceNodes(this.m_descsContainer, descsStack);
        console.log("next card:", descsStack[0].innerHTML);
    }
    showNext() {
        //
    }
    setInterval() {
        if (!this.m_isAutoRotationEnabled) {
            return;
        }
        this.m_interval = window.setInterval(() => {
            this.showNext();
        }, this.m_autoRotationInterval);
    }
    arrangeByOrder(elem) {
        let orderedNodes = [...elem.children].sort((a, b) => {
            let aOrder = a.getAttribute("data-order");
            let bOrder = b.getAttribute("data-order");
            if (aOrder === null || bOrder === null) {
                return 0;
            }
            if (parseInt(aOrder) < parseInt(bOrder)) {
                return -1;
            }
            if (parseInt(aOrder) > parseInt(bOrder)) {
                return 1;
            }
            return 0;
        });
        return orderedNodes;
    }
    replaceNodes(target, source) {
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        for (let i = 0; i < source.length; i++) {
            target.appendChild(source[i]);
        }
    }
}
function init() {
    new GhCarousel({
        containerId: "car-one",
        isAutoRotationEnabled: false, autoRotationInterval: 1000
    });
}
//# sourceMappingURL=index.js.map