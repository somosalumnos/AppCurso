/* Configuración de jQuery Mobile */

$(document).on('mobileinit', function() {
	/* Botón atrás */
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.page.prototype.options.backBtnText = "atrás";
	
	/* Temas por defecto */
	$.mobile.page.prototype.options.theme = 'a';
	$.mobile.page.prototype.options.backBtnTheme = 'a';
	$.mobile.page.prototype.options.headerTheme = 'a';
	$.mobile.page.prototype.options.footerTheme = 'a';
	$.mobile.page.prototype.options.contentTheme = 'a';
	
	$.mobile.listview.prototype.options.filterTheme = 'a';
	$.mobile.listview.prototype.options.countTheme = 'a';
	$.mobile.listview.prototype.options.dividerTheme = 'a';
	
	$.mobile.pageLoadErrorMessageTheme = 'a';
	$.mobile.loadingMessageTheme = 'a';
	
	/* Transiciones */
	$.mobile.defaultPageTransition = 'slide';
});
