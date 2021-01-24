interface AwSwipeableViews extends HTMLElement {
    view: number;
    views: HTMLElement[];

	/**
	 * @method change
	 * 
	 * Cambia a la vista dada en el parámetro view
     * 
     * @param {number} view
	 */
	change( view: number ) : void;

	/**
	 * @method existsView
	 * 
	 * Determina si existe una vista
	 * 
	 * @param {number} view
	 */
	existsView( view: number ) : void;

	/**
	 * @method getActiveView
	 * 
	 * Obtiene la vista activa
	 */
	getActiveView() : HTMLElement;

	/**
	 * @method	lastIndexView
	 * 
	 * Devuelve el último índice en el que tenemos una vista
	 */
	lastIndexView() : number;

	/**
	 * @method	next
	 * 
	 * Pone la vista siguiente. Si se pasa true mostrará la primera vista si la 
     * activa es la última
	 */
	next( recusive?: boolean) : void

	/**
	 * @method	previous
	 * 
	 * Pone la vista anterior. Si se pasa true, mostrará la última vista si la activa
     * es la primera
	 */
	previous( recusive?: boolean) : void
}