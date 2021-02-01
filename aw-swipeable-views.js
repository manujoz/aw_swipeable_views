import { PolymerElement, html, FlattenedNodesObserver, Polymer } from "../aw_polymer_3/polymer/polymer-element.js";

class AwSwipeableViews extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                #container {
                    overflow: hidden;
                    position: relative;
                    transition: height 0.2s;
                }
            </style>
            <div id="container">
                <slot id="slot"></slot>
            </div>
        `;
    }

    static get properties() {
        return {
            view: { type: Number, value: 0, observer: "_viewChange" },
        };
    }

    /**
     * @method constructor
     */
    constructor() {
        super();

        this.views = [];
        this.active = null;
        this.slotObserver = null;
    }

    /**
     * @method connectedCallback
     */
    connectedCallback() {
        super.connectedCallback();

        // Observamos el cambio de nodes
        this.slotObserver = new FlattenedNodesObserver(this.$.slot, (info) => {
            if (info.addedNodes.length > 0) {
                this._viewsAdded(info.addedNodes);
            }

            if (info.removedNodes.length > 0) {
                this._viewsRemoved(info.removedNodes);
            }
        });

        //Resolvemos el componente
        this.removeAttribute("unresolved");
    }

    /**
     * @method disconectedCallback
     */
    disconectedCallback() {
        super.disconectedCallback();

        this.slotObserver.disconnect();
    }

    /**
     * @method  change
     *
     * Cambia la vista
     *
     * @param {number} view
     */
    change(view) {
        if (!this.existsView(view)) {
            console.error("[aw-swipeable-views]: There is no view with index " + view);
            return;
        }

        this.view = parseInt(view);
    }

    /**
     * @method existsView
     *
     * Indica si una vista existe o no
     *
     * @return {boolean}
     */
    existsView(view) {
        if (!this.views[parseInt(view)]) {
            return false;
        }

        return true;
    }

    /**
     * @method getActiveView
     *
     * Devuelve la vista activa
     *
     * @returns {HTMLElement}
     */
    getActiveView() {
        return this.views[this.view];
    }

    /**
     * @method  lastIndexView
     *
     * Devuelve el última índice
     *
     * @returns {number}
     */
    lastIndexView() {
        return this.views.length > 0 ? this.views.length-- : null;
    }

    /**
     * @method next
     *
     * Pasa a la próxima vista
     */
    next(recursive = false) {
        if (!recursive && this.view === this.views.length - 1) {
            return;
        }

        this.view = this.view === this.views.length - 1 ? 0 : this.view + 1;
    }

    /**
     * @method previous
     *
     * Pasa a la vista anterior
     */
    previous(recursive = false) {
        if (!recursive && this.view === 0) {
            return;
        }

        this.view = this.view > 0 ? this.view - 1 : this.views.length - 1;
    }

    /**
     * @method viewChange
     *
     * Cambia de vista
     */
    async _viewChange() {
        if (this.views.length === 0 || this.view === this.active || !this.views[this.view]) {
            return;
        }

        let direction = "left";
        if (this.active !== null && this.view < this.active) {
            direction = "right";
        }
        
        const height = await this._viewHeight(this.view);
        this.$.container.style.height = height + "px";

        this.views[this.view].style.visibility = null;
        this.views[this.view].style.transform = direction === "left" ? "translate(100%,0)" : "translate(-100%,0)";

        Polymer.Animate(
            this.views[this.view],
            {
                transform: "translate(0,0)",
                opacity: 1,
            },
            {
                speed: 200,
            }
        );

        if (this.active !== null) {
            Polymer.Animate(
                this.views[this.active],
                {
                    transform: direction === "left" ? "translate(-100%,0)" : "translate(100%,0)",
                    opacity: 0,
                },
                {
                    speed: 200,
                }
            );
        }

        this.active = this.view;
    }

    /**
     * @method  viewHeight
     *
     * Devuelve la altura de una vista
     *
     * @param {number} view
     * @returns {Promise}
     */
    _viewHeight(view) {
        return new Promise(( resolve ) => {
            const div = document.createElement("DIV");
            div.setAttribute("style", "position:absolute; bottom: 0; right: 0; z-index: -11111; visibility:hidden");

            const clone = this.views[view].cloneNode(true);
            clone.removeAttribute("style");

            div.appendChild(clone);
            document.body.appendChild(div);

            setTimeout(() => {
                const h = div.offsetHeight;
                resolve(h);
                document.body.removeChild(div);
            }, 200);
        });
        
    }

    /**
     * @method viewsAdded
     *
     * @param {HTMLElement[]} nodes
     */
    _viewsAdded(nodes) {
        const length = this.views.length;

        nodes.forEach((node, i) => {
            if (node.nodeName === "VIEW") {
                node.style.visibility = "hidden";
                node.style.position = "absolute";
                node.style.width = "100%";
                node.style.transform = "translate(100%,0)";
                node.style.opacity = 0;
                this.views.push(node);
            }
        });

        if (length === 0 && this.views.length > 0) {
            this._viewChange();
        }
    }

    /**
     * @method viewsRemoved
     *
     * @param {HTMLElement[]} nodes
     */
    _viewsRemoved(nodes) {
        nodes.forEach((node) => {
            if (node.nodeName === "VIEW") {
                for (let i = 0; i < this.views.length; i++) {
                    if (this.views[i] === node) {
                        this.views.splice(i, 1);
                        break;
                    }
                }
            }
        });
    }
}

window.customElements.define("aw-swipeable-views", AwSwipeableViews);
