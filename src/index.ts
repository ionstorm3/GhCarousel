interface ICarouselInit {
    containerId: string;
    isAutoRotationEnabled: boolean;
    autoRotationInterval: number;
}

class GhCarousel {

    //#region Properties

    private readonly m_containerId: string = "";
    private m_interval: number = -1;

    private m_cardsContainer: Element = {} as Element;
    private m_descsContainer: Element = {} as Element;
    private m_linksContainer: Element = {} as Element;

    private m_cardsInOriginalOrder: Element[] = [];
    private m_descsInOriginalOrder: Element[] = [];

    private readonly m_isAutoRotationEnabled: boolean = false;
    private readonly m_autoRotationInterval: number = 500;

    //#endregion

    //#region Constructor

    public constructor(param: ICarouselInit) {
        this.m_containerId = param.containerId;
        this.m_isAutoRotationEnabled = param.isAutoRotationEnabled;
        this.m_autoRotationInterval = param.autoRotationInterval;
        this.initialize();
    }

    //#endregion

    //#region Methods

    private initialize(): void {
        let parentContainer: HTMLElement | null = document.getElementById(this.m_containerId);
        if (parentContainer === null) {
            console.log("Parent container not found.");
            return;
        }

        let cardsContainer: Element | null = parentContainer.querySelector(".gh-cards-container");
        let descsContainer: Element | null = parentContainer.querySelector(".gh-descs-container");
        let linksContainer: Element | null = parentContainer.querySelector(".gh-links-container");

        if (cardsContainer === null) {
            console.log("Cards container not found.");
            return;
        } else {
            this.m_cardsContainer = cardsContainer;
        }
        if (descsContainer === null) {
            console.log("Descs container not found.");
            return;
        } else {
            this.m_descsContainer = descsContainer;
        }
        if (linksContainer === null) {
            console.log("Links container not found.");
            return;
        } else {
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

    private addOrderAttribute(elem: Element): void {
        for (let i: number = 0; i < elem.children.length; i++) {
            let child: Element = elem.children[i];
            child.setAttribute("data-order", i.toString());
        }
    }

    private addListeners(linksContainer: Element): void {
        for (let i: number = 0; i < linksContainer.children.length; i++) {
            let link: Element = linksContainer.children[i];
            link.addEventListener("mouseover", (e: Event) => {
                window.clearInterval(this.m_interval);
                this.show(link);
            });
            link.addEventListener("mouseout", (e: Event) => {
                this.setInterval();
            });
        }
    }

    private show(link: Element): void {
        let idx: number = [...this.m_linksContainer.children].indexOf(link);
        if (idx === -1) {
            return;
        }

        console.log("idx:", idx);

        let cardsStack: Element[] = [];
        let descsStack: Element[] = [];

        for (let i = 0; i < this.m_cardsInOriginalOrder.length; i++) {
            if (i <= idx) {
                cardsStack.push(this.m_cardsInOriginalOrder[i]);
                descsStack.push(this.m_descsInOriginalOrder[i]);
            } else {
                cardsStack.unshift(this.m_cardsInOriginalOrder[i]);
                descsStack.unshift(this.m_descsInOriginalOrder[i]);
            }
        }

        this.replaceNodes(this.m_cardsContainer, cardsStack);
        this.replaceNodes(this.m_descsContainer, descsStack);
        console.log("next card:", descsStack[0].innerHTML);
    }

    private showNext(): void {
        //
    }

    private setInterval(): void {
        if (!this.m_isAutoRotationEnabled) {
            return;
        }
        this.m_interval = window.setInterval(() => {
            this.showNext();
        }, this.m_autoRotationInterval);
    }


    private arrangeByOrder(elem: Element): Element[] {
        let orderedNodes: Element[] = [...elem.children].sort((a, b) => {
            let aOrder: string | null = a.getAttribute("data-order");
            let bOrder: string | null = b.getAttribute("data-order");
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

    private replaceNodes(target: Element, source: Element[]): void {
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        for (let i = 0; i < source.length; i++) {
            target.appendChild(source[i]);
        }
    }

    //#endregion

}

function init(): void {
    new GhCarousel({
        containerId: "car-one",
        isAutoRotationEnabled: false, autoRotationInterval: 1000
    });
}
