$(document).one('pageinit', function() {
	
	document.addEventListener('deviceready', onDeviceReady, false);
	
	var menuEjemplos = '\
		<ul data-role="listview" data-inset="true">\
			<li data-role="list-divider">Categoría de ejemplos</li>\
			<li><a href="#pageTiempo">Comunicación con servidores</a></li>\
			<li><a href="#pageAlmacenamiento">Almacenamiento de datos</a></li>\
			<li><a href="#pageMultimedia">Multimedia</a></li>\
			<li><a href="#pageGeolocalizacion">Geolocalización</a></li>\
			<li><a href="#pageCamara">Cámara</a></li>\
			<li><a href="#pageContactos">Contactos</a></li>\
		</ul>';
	var panel = '<div data-role="panel" id="panelEjemplo">' + menuEjemplos + '</div>';
	var btnPanel = '\
		<div class="botonera ui-btn-right">\
			<a href="#pageHome" data-icon="home" data-iconpos="notext" data-role="button" data-inline="true">Home</a>\
			<a href="#panelEjemplo" data-icon="bars" data-iconpos="notext" data-role="button" data-inline="true">Panel</a>\
		</div>';
	
	$('div[data-role="page"]').prepend(panel);
	$('div[data-role="header"]').append(btnPanel);
	
	$('#pageHome').one('pagebeforeshow', function() {
		$(this).find('div[data-role="content"]').append(menuEjemplos);
		$(this).trigger('create');
	});
	
	/* API de phonegap lista */
	function onDeviceReady() {
		
		$('#pageContactos').on('pagebeforeshow', function() {
			var options = new ContactFindOptions();
			options.multiple = true;
			var fields = ['name', 'phoneNumbers', 'emails'];
			navigator.contacts.find(fields, listaContactos, error, options);
			
			$('.btnAddContact').on('click', function() {
				$.mobile.changePage('#pageNuevoContacto');
			});
		});
		
		$('#pageNuevoContacto').on('pagebeforeshow', function() {
			borraFormulario();
			
			$('form.addContact .btnCancelar').on('click', function() {
				borraFormulario();
			});
			
			$('form.addContact .btnGuardar').one('click', function() {
				var contact = navigator.contacts.create();
				
				contact.name = new ContactName();
				contact.name.givenName = $('#frmContactName').val();
				contact.name.familyName = $('#frmContactLastName').val();
				
				var phoneNumbers = [];
				phoneNumbers[0] = new ContactField('home', $('#frmContactTel').val());
				contact.phoneNumbers = phoneNumbers;
				
				var emails = [];
				emails[0] = new ContactField('home', $('#frmContactMail').val());
				contact.emails = emails;
				
				contact.save(contactoGuardado, error);
			});
		});
		
		function contactoGuardado() {
			alert("Contacto guardado correctamente");
			$.mobile.changePage('#pageContactos', {reverse: true});
		}
		
		function borraFormulario() {
			$('form.addContact').trigger('reset');
		}
		
		function listaContactos(contacts) {
			var numeroContactos = contacts.length;
			var listadoContactos = '';
			
			if (numeroContactos > 0) {
				$.each(contacts, function(index, contact) {
					listadoContactos += '<li><span class="nombre">' + contact.name.givenName + ' ' + contact.name.familyName + '</span>';
					
					if (contact.phoneNumbers != null) {
						listadoContactos += '<span class="tlf">' + contact.phoneNumbers[0].value + '</span>';
					}
					
					if (contact.emails != null) {
						listadoContactos += '<span class="email">' + contact.emails[0].value + '</span>';
					}
					
					listadoContactos += '</li>';
				});
				
				$('#listadoContactos').html(listadoContactos).listview('refresh');
			}
		}
		
		function error(error) {
			alert("Error: " + error);
		}
		
		
		
		
		/* Geolocalización */
		$('#pageGeolocalizacion').on('pagebeforeshow', function() {
			navigator.geolocation.watchPosition(muestraCoordenadas, error);
		});
		
		function muestraCoordenadas(position) {
			$('#frmGeoLatitude').val(position.coords.latitude);
			$('#frmGeoLongitude').val(position.coords.longitude);
			
			/* Mapa */
			var mapOptions = {
				zoom: 10,
				center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
		}
		
		
		
		
		/* Cámara */
		$('#pageCamara').on('pagebeforeshow', function() {
			$('.btnPhoto').on('click', function() {
				navigator.camera.getPicture(muestraFoto, error);
			});
		});
		
		function muestraFoto(img) {
			alert(img);
			$('.photo').attr('src', img);
			$('.photo').css('display', 'block');
		}
		
		
		
		/* Tiempo */
		$('#pageTiempo').on('pagebeforeshow', function() {
			
			/* Tiempo a petición inicial */
			/*$('.btnTiempo').on('click', function() {
				if ($('#frmTiempoCiudad').val() != '') {
					
					$('.resultadoTiempo').html('<p>Cargando...</p>');
					
					$.getJSON('http://api.openweathermap.org/data/2.5/weather', {
						q: $('#frmTiempoCiudad').val(),
						lang: 'sp',
						units: 'metric'
					})
						.done(function(data) {
							var resultado = '';
							
							resultado += '<p>Ciudad: ' + data.name + '</p>';
							resultado += '<p><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="' + data.weather[0].main + '" />\
								' + data.weather[0].description + '</p>';
							resultado += '<p>Temperatura: ' + data.main.temp + 'ºC </p>';
							resultado += '<p>Humedad: ' + data.main.humidity + '% </p>';
							
							$('.resultadoTiempo').html(resultado);
							//$('.resultadoTiempo').text(JSON.stringify(data));
						})
						.fail(function(error) {
							alert("Error: " + JSON.stringify(error));
						});
				
				} else {
					alert("Debes indicar una ciudad");
				}
			});*/
			
			/* Mejora para añadir tiempo local más petición */
			navigator.geolocation.getCurrentPosition(muestraTiempoGPS, error);
			
			/* Tiempo a petición con funciones */
			$('.btnTiempo').on('click', function() {
				if ($('#frmTiempoCiudad').val() != '') {
					
					$('.resultadoTiempo').html('<p>Cargando...</p>');
					
					$.getJSON('http://api.openweathermap.org/data/2.5/weather', {
						q: $('#frmTiempoCiudad').val(),
						lang: 'sp',
						units: 'metric'
					})
						.done(muestraTiempo)
						.fail(errorJSON);
				
				} else {
					alert("Debes indicar una ciudad");
				}
			});
			
			function muestraTiempo(data) {
				var resultado = '';
				
				resultado += '<p>Ciudad: ' + data.name + '</p>';
				resultado += '<p><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="' + data.weather[0].main + '" />\
					' + data.weather[0].description + '</p>';
				resultado += '<p>Temperatura: ' + data.main.temp + 'ºC </p>';
				resultado += '<p>Humedad: ' + data.main.humidity + '% </p>';
				
				$('.resultadoTiempo').html(resultado);
				//$('.resultadoTiempo').text(JSON.stringify(data));
			}
			
			function muestraTiempoGPS(position) {
				$('.resultadoTiempo').html('<p>Cargando...</p>');
				
				$.getJSON('http://api.openweathermap.org/data/2.5/weather', {
					lat: position.coords.latitude,
					lon: position.coords.longitude,
					lang: 'sp',
					units: 'metric'
				})
					.done(muestraTiempo)
					.fail(errorJSON);
			}
			
			function errorJSON(error) {
				alert("Error: " + JSON.stringify(error));
			}
			
		});
		
		
		
		/* Multimedia */
		$('#pageMultimedia').on('pagebeforeshow', function() {
			var radio = new Audio('http://91.121.166.38:7420');
			
			$('.btnAudioPlay').on('click', function() {
				radio.play();
			});
			
			$('.btnAudioStop').on('click', function() {
				radio.pause();
			});
		});
		
		/* Almacenar datos */
		/* Datos permanentes */
		$('#pageAlmacenaDatos').on('pagebeforeshow', function() {
			window.localStorage.clear();
			
			$('.btnAlmacenaDatos').on('click', function() {
				window.localStorage.setItem('datos', $('#frmAlmacenaDatos').val());
				$.mobile.changePage('#pageAlmacenamiento', {reverse: true});
			});
		});
		
		$('#pageMuestraDatos').on('pagebeforeshow', function() {
			if (window.localStorage.getItem('datos')) {
				$('#frmMuestraDatos').val(window.localStorage.getItem('datos'));
			} else {
				$('#frmMuestraDatos').val("No hay datos almacenados");
			}
		});
		
		/* Datos de sesión */
		$('#pageAlmacenaSesion').on('pagebeforeshow', function() {
			window.sessionStorage.clear();
			
			$('.btnAlmacenaSesion').on('click', function() {
				window.sessionStorage.setItem('sesion', $('#frmAlmacenaSesion').val());
				$.mobile.changePage('#pageAlmacenamiento', {reverse: true});
			});
		});
		
		$('#pageMuestraSesion').on('pagebeforeshow', function() {
			if (window.sessionStorage.getItem('sesion')) {
				$('#frmMuestraSesion').val(window.sessionStorage.getItem('sesion'));
			} else {
				$('#frmMuestraSesion').val("No hay datos almacenados");
			}
		});
		
		
		
	}
});
