jQuery(function() {

	initFancybox();
	initOpenClose();
	initSort();
	initRemove();
	initCollectionStates();
	initGrids();
	initAddCollectionFromUrl();
	initStickyCollections();
	initAppendCollection();
	initCookiesDetect();

});

function initCookiesDetect() {
	var $doc = jQuery(document);
	var $body = jQuery('body');
	var cookiesClass = 'cookies-disabled';
	var items = jQuery('.cookies-bar');
	if (navigator.cookieEnabled) {
		$body.removeClass(cookiesClass);
	} else {
		$body.addClass(cookiesClass);
		jQuery('[data-link]').each(function() {
			var link = jQuery(this);
			link.css({
				'display': 'none'
			});
		});
	}

	items.each(function() {
		var item = jQuery(this);
		item.on('click', '.close', function() {
			$body.removeClass(cookiesClass);
		});
	});
}

// Handle dropdowns on mobile devices.
function initTouchNav(holder) {
	holder.find('.image-collection:has(.image-description)').each(function() {
		new TouchNav({
			navBlock: this,
			menuItems: '.image-holder',
		});
	});
}

// Get same tags for emblems in collection.
function getSameTags(holder) {
	var imgHolders = holder.find('.image-description');
	var imgTags = holder.find('.tag-wrapper .slide li');
	var imgTagsLength = imgTags.length
	var allTags = [];
	var uniqTags = [];
	var numberField = ('.tags-count');
	var activeClass = 'active';

	imgHolders.each(function() {
		var imgHolder = jQuery(this);
		imgHolder.data('numberField', imgHolder.find('.tags-count'));
		imgHolder.data('tagsList', imgHolder.find('.tag-list').empty());

		if (allTags.length) {
			if (Array.isArray(allTags[0])) {
				allTags = allTags[0].concat(imgHolder.data('imgTags'));
			} else {
				allTags = allTags.concat(imgHolder.data('imgTags'));
			}
		} else {
			allTags.push(imgHolder.data('imgTags'));
		}
	});

	uniqTags = removeDuplicate(allTags);

	function removeDuplicate(arr) {
		return arr.filter(function(a){
			return arr.indexOf(a) !== arr.lastIndexOf(a)
		});
	}

	for (var j = 0; j < imgTagsLength; j++) {
		if (uniqTags.indexOf(imgTags.eq(j).text()) > -1) {
			imgTags.eq(j).addClass(activeClass);
			imgTags.eq(j).closest('.image-description').data('tagsList').append(imgTags.eq(j).clone());
		} else {
			imgTags.eq(j).removeClass(activeClass);
		}
	}

	imgHolders.each(function() {
		var imgHolder = jQuery(this);
		var imgTags = imgHolder.find('.tag-wrapper .slide li.active');
		imgHolder.data('numberField').text(imgTags.length);
	});
}

// Init the sticky collections drawer.
function initStickyCollections(activate) {
	var $html = jQuery('html');
	var $body = jQuery('body');
	var activeClass = 'emblems-active';
	var classHalf = 'half-state';
	var classFull = 'full-state';

	jQuery('.collections-wrapper').each(function() {
		var container = jQuery(this);
		var collectionsHolder = container.find('.all-collections');
		var openerHolder = container.find('.opener-holder');
		var btnsHolder = container.find('.js-btns');
		var btnUp = btnsHolder.find('.btn-up');
		var btnDown = btnsHolder.find('.btn-down');
		var btnClose = btnsHolder.find('.btn-close');

		btnClose.on('click', hideSlide);

		btnUp.on('click', function(e) {
			e.preventDefault();

			$html.addClass(activeClass);

			if ($html.hasClass(classHalf)) {
				setFullState();
			} else {
				if (getHalfHeight() + openerHolder.outerHeight() >= window.innerHeight - getFullHeight()) {
					setFullState();
				} else {
					setHalfState();
				}
			}
		});

		btnDown.on('click', function(e) {
			e.preventDefault();
			if ($html.hasClass(classHalf)) {
				hideSlide(e);
			} else {
				setHalfState();
			}
		});

		function setHalfState() {
			$html
				.removeClass(classFull)
				.addClass(classHalf);

			container.css({
				'top': window.innerHeight - getHalfHeight() + 'px',
				'bottom': 0 + 'px',
				'marginTop': 0
			});
		}

		function setFullState() {
			$html
				.addClass(classFull)
				.removeClass(classHalf);

			container.css({
				'top': getFullHeight() + openerHolder.outerHeight() + 'px',
				'bottom': 0 + 'px',
				'marginTop': 0
			});
		}

		function getFullHeight() {
			var fullHeight = 0;

			if ($body.hasClass('fixed-header')) {
				fullHeight = jQuery('#header .header-wrap').outerHeight();
			}

			return fullHeight;
		}

		function getHalfHeight() {
			var collectionBottom = 0;
			var extraHeight = 0;

			if (container.find('.collection-wrapper').length) {
				var firstCollection = container.find('.collection-wrapper').eq(0);
				var emblems = container.find('.image-description');

				if (emblems.length) {
					if (firstCollection.find('.image-description').length) {
						var firstEmblem = firstCollection.find('.image-description').eq(0);
						extraHeight = firstEmblem.position().top + firstEmblem.outerHeight()
					} else {
						extraHeight = emblems.eq(0).outerHeight()
					}
				} else {
					extraHeight = window.innerHeight / 3;
				}

				collectionBottom = firstCollection.position().top + extraHeight;
			} else {
				collectionBottom = window.innerHeight / 3;
			}

			return collectionBottom;
		}

		function hideSlide(e) {
			e.preventDefault();
			$html.removeClass(classHalf);
			$html.removeClass(classFull);
			$html.removeClass(activeClass);
			container.css({
				'top': '',
				'bottom': '',
				'marginTop': ''
			});
		}
	});

}

// Add a new collection.
function initAddCollection(arr, obj) {
	arr.unshift(obj);
	localStorage.setItem('atalanta_emblems', JSON.stringify(arr));
}

// Refresh existing collections.
function refreshCollections() {
	var arr = [];
	jQuery('.all-collections .collection-wrapper').each(function() {
		var collection = jQuery(this);
		var collectionName = collection.find('.collection-name .name') ? collection.find('.collection-name .name').text() : '';
		var emblemsArr = [];

		var obj = {
			'collection_name': collectionName,
			'emblems': ''
		};

		collection.find('[data-emblem-id]').each(function() {
			var curEmblem = jQuery(this);
			emblemsArr.push(curEmblem.data('emblemId').toString());
		});

		obj.emblems = emblemsArr.length ? emblemsArr : '';
		arr.push(obj);

	});
	localStorage.setItem('atalanta_emblems', JSON.stringify(arr));
}

// Add emblem to collection.
function initAddEmblem(name, arr) {
	var curCollections = initGetCollections();
	var curCollectionsLength = curCollections.length;

	for (var i = 0; i < curCollectionsLength; i++) {
		if (curCollections[i].collection_name.trim().toLowerCase() === name.trim().toLowerCase()) {
			if (Array.isArray(curCollections[i].emblems)) {
				curCollections[i].emblems = curCollections[i].emblems.concat(arr);
			} else {
				curCollections[i].emblems = arr;
			}
		}
	}

	localStorage.setItem('atalanta_emblems', JSON.stringify(curCollections));
}

// Get collections.
function initGetCollections() {
	var keyName = 'atalanta_emblems';
	var storageData = localStorage.getItem(keyName);
	var arr = [];

	if (storageData && storageData.length) {
		arr = JSON.parse(storageData);
	}

	return arr;
}

function getImgSize() {
	var mainHolder = jQuery('.all-collections');
	var size = '320';
	if (mainHolder.length) {
		var sizeActive = mainHolder.find('.grids .selected');

		if (sizeActive.length) {
			var grid = sizeActive.data('grid');

			if (grid === 'small') {
				size = '320';
			} else {
				size = '640';
			}
		}
	}

	return size;
}

// Append collection to existing collections.
function initAppendCollection(obj, newState) {
	var mainHolder = jQuery('.all-collections');
	var gridsHolder = mainHolder.find('.grids-content');
	var path = '/templates/collection/collection.html';
	var size = getImgSize();

	if (mainHolder.length) {
		jQuery.ajax({
			url: path,
			type: 'GET',
			success: function(data) {
				var $data = jQuery('<div>').html(data);

				if (obj) {
					$data.find('[data-name]').text(obj.collection_name);
					var emblems = obj.emblems;
					var emblemsLength = emblems.length;
					var index = 0;

					jQuery($data.html()).prependTo(gridsHolder);

					for (var j = 0; j < emblemsLength; j++) {
						var id = ('0' + parseFloat(emblems[j]).toString()).slice(-2);
						initAppendEmblem(id, index, j, emblems.length, size, true, newState);
					}
				} else {
					var arr = initGetCollections();
					var arrLength = arr.length;

					for (var i = 0; i < arrLength; i++) {
						$data.find('[data-name]').text(arr[i].collection_name);
						var emblems = arr[i].emblems;
						var emblemsLength = emblems.length;

						jQuery($data.html()).appendTo(gridsHolder);

						for (var j = 0; j < emblemsLength; j++) {
							var id = ('0' + parseFloat(emblems[j]).toString()).slice(-2);
							initAppendEmblem(id, i, j, emblems.length, size);
						}
					}
				}
				initCollectionStates();
				initFancybox();
			}
		});
	}
}

// Get collection from shared url data.
function initAddCollectionFromUrl() {
	if (window.location.href.indexOf('#collection_name') !== -1) {
		var url = window.location.href.substr(0, window.location.href.indexOf('#collection_name'));
		var obj;
		var $html = jQuery('html');
		var $body = jQuery('body');
		var activeClass = 'emblems-active';
		var classHalf = 'half-state';
		var classFull = 'full-state';
		var container = jQuery('.collections-wrapper');
		var collectionsHolder = container.find('.all-collections');
		var openerHolder = container.find('.opener-holder');
		var btnsHolder = container.find('.js-btns');
		var btnUp = btnsHolder.find('.btn-up');
		var btnDown = btnsHolder.find('.btn-down');
		var btnClose = btnsHolder.find('.btn-close');

		function getFullHeight() {
			var fullHeight = 0;

			if ($body.hasClass('fixed-header')) {
				fullHeight = jQuery('#header .header-wrap').outerHeight();
			}

			return fullHeight;
		}

		function setFullState() {
			$html
				.addClass(classFull)
				.removeClass(classHalf);

			container.css({
				'top': getFullHeight() + openerHolder.outerHeight() + 'px',
				'bottom': 0 + 'px',
				'marginTop': 0
			});
		}
		
		setFullState();
		$html.addClass(activeClass);

		if (window.location.href.indexOf('&emblems') !== -1) {
			obj = {
				'collection_name': decodeURI(window.location.href.match("collection_name=(.*)&emblems")[1]),
				'emblems': window.location.href.split('&emblems=').pop().split(',')
			}
		} else {
			obj = {
				'collection_name': decodeURI(window.location.href.match("collection_name=(.*)")[1]),
				'emblems': ''
			}
		}

		if (initGetCollections() && initGetCollections().length) {
			if (JSON.stringify(initGetCollections()).indexOf(obj.collection_name) > -1) {
				history.pushState(null, null, url);
			} else {
				history.pushState(null, null, url);
				initAddCollection(initGetCollections(), obj);
			}
		} else {
			history.pushState(null, null, url);
			initAddCollection(initGetCollections(), obj);
		}
	}

}

// Init load of Atalanta emblem JSON.
function initAppendEmblem(id, index, counter, max, size, scrollFlag, newState) {
	var path = '/json/atalanta-emblems.json';
	var template = jQuery('#template');
	var data = {
		"id": id,
		"name": parseFloat(id),
		"size": size
	};

	if (template.length) {
		Mustache.parse(template.html());

		loadData(index);

		// load data
		function loadData(index) {
			var $rendered = jQuery(Mustache.render(template.html(), data));
			var tags = [];

			if ($rendered) {
				
				var tagsHolder = $rendered.find('.tag-wrapper .slide');
				$rendered.data('index', index);
				jQuery.getJSON(path, function(result) {
					jQuery.each(result, function(i, field) {
						if (field.emblems.indexOf(parseFloat(id).toString()) !== -1) {
							tagsHolder.append('<li><a href="javascript:;">' + field.searchTerm + '</a></li>');
							tags.push(field.searchTerm);
						}
					});

					$rendered.data('imgTags', tags);

					if (counter >= max - 1 && $rendered.closest('.image-collection').length) {
						setTimeout(function() {
							getSameTags($rendered.closest('.collection-wrapper'));
						},0);
					}
				});
				jQuery('.collection-wrapper').eq(index).find('.image-collection').append($rendered);
				if (scrollFlag) {
					var scrollOffset = 0;
					jQuery('.js-btns .btn-up').trigger('click');
					setTimeout(function() {
						if (newState) {
							scrollOffset = 0;
						} else {
							scrollOffset = jQuery('.collection-wrapper').eq(index).find('.image-collection').find($rendered).position().top;
						}
						jQuery('.all-collections').stop().scrollTop(scrollOffset)
					}, 500);
					
				}
				initOpenClose();
				initSort();
				initFancybox();
				initCollectionStates(jQuery('.collection-wrapper').eq(index));
				initTouchNav(jQuery('.collection-wrapper').eq(index))
			}
		}
	}
}

// Init grids.
function initGrids() {
	var selectedClass = 'selected';

	jQuery('.grids').each(function() {
		var linksHolder = jQuery(this);
		var links = linksHolder.find('a');
		var contentHolder = jQuery(linksHolder.data('target'));
		var curActive = links.filter('.' + selectedClass);
		var suffix = '-grid';
		var mainHolder = linksHolder.closest('.all-collections');

		if (!curActive.length) {
			curActive = links.eq(0);
		}

		switchState(curActive)

		links.each(function() {
			var link = jQuery(this);
			link.on('click', function(e) {
				e.preventDefault();
				switchState(link);
			});
		});

		function switchState(item) {
			if (curActive.length) {
				contentHolder.removeClass(curActive.data('grid') + suffix);
				curActive.removeClass(selectedClass);
			}

			contentHolder.addClass(item.data('grid') + suffix);
			curActive = item;
			curActive.addClass(selectedClass);

			if (curActive.data('grid') !== 'small') {
				var state = 'large';
				replaceImg(state);
			} else {
				var state = 'small';
				replaceImg(state);
			}
		}

		function replaceImg(state) {
			var images = mainHolder.find('.image-holder img');

			if (images.length) {
				images.each(function() {
					var img = jQuery(this);
					if (state === 'small' && img.attr('src').indexOf('320') < 0) {
						img.attr('src', img.attr('src').replace(/640/g, '320'))
					}
					if (state === 'large' && img.attr('src').indexOf('640') < 0) {
						img.attr('src', img.attr('src').replace(/320/g, '640'))
					}
				});
			}
		}
	});
}

// Init collection states.
function initCollectionStates(item) {
	var holders;
	var hiddeClass = 'hidden';
	if (item) {
		holders = item;
	} else {
		holders = jQuery('.collection-wrapper');
	}

	holders.each(function() {
		var holder = jQuery(this);
		var items = holder.find('.image-description');
		var urlLink = holder.find('[data-link="url"]')

		if (items.length) {
			urlLink.removeClass(hiddeClass);
		} else {
			urlLink.addClass(hiddeClass);
		}
	});
}

// Remove emblem from collection.
function initRemove() {
	var $doc = jQuery(document);

	$doc.on('click', '.image-description a:has(.icon-trash)', function(e) {
		e.preventDefault();
		var $target = jQuery(this);
		var holder = $target.closest('.collection-wrapper');
		var parent = $target.closest('.image-description');
		parent.remove();
		initCollectionStates(holder);
		refreshCollections();
		getSameTags(holder);
	});
}

// Init emblem sorting functionality in collection.
function initSort() {
	jQuery('.image-collection').each(function() {
		var item = jQuery(this);
		item.sortable({
			containment: 'parent',
			tolerance: 'pointer',
			handle: '.image-holder.hover',
			update: function( event, ui ) {
				refreshCollections();
			}
		});
	});
}

// open-close init
function initOpenClose() {
	var $doc = jQuery(document);

	jQuery('.tag-wrapper').each(function() {
		var holder = jQuery(this);

		if (!holder.data('OpenClose')) {
			holder.openClose({
				activeClass: 'active',
				opener: '.tag-opener',
				slider: '.slide',
				animSpeed: 400,
				effect: 'slide'
			});
		}
	});

	$doc.on('click', '.tag-wrapper .all-tags', function(e) {
		e.preventDefault();
		var link = jQuery(e.target);
		var holder = link.closest('.tag-wrapper');
		var openCloseAPI = holder.data('OpenClose');

		if (openCloseAPI && !holder.hasClass(openCloseAPI.options.activeClass)) {
			openCloseAPI.showSlide();
		}
	});
}



// Init lightbox.
function initFancybox() {
	jQuery('a.lightbox, [data-fancybox]').fancybox({
		parentEl: 'body',
		margin: [50, 0],
		touch: false,
		closeExisting: true,
		afterLoad: function(instance, current) {
			var opener = instance.$trigger;
			opener.data('link')
			if (opener.data('link')) {
				switch (opener.data('link')) {
					case 'delete': 
						var nameField = current.$content.find('.collection-to-remove');

						if (nameField.length) {
							nameField.text(instance.$trigger.closest('.top-holder').find('.name').text());
						}

						current.$content.on('click', '[data-link="confirm"]', function(e) {
							e.preventDefault();
							var parent = opener.closest('.collection-wrapper');
							if (parent.length) {
								parent.remove();
								refreshCollections();
								jQuery.fancybox.close();
							}
						});
					case 'zoom':
						var $img = current.$content.find('.img-holder img');
						var holder = instance.$trigger.closest('[data-emblem-id]');
						var nameField = current.$content.find('.image-name');
						var cropSize = '960';
						var newName = holder.find('.name').text();
						var newSrc = '/images/emblems/' + cropSize + '/emblem' + ('0' + holder.data('emblemId')).slice(-2) + '.' + cropSize + '.jpg';
						var tagsHolder = holder.find('.tag-wrapper .slide');

						$img.attr('src', newSrc);
						nameField.text(newName);

						if (tagsHolder.length) {
							current.$content.find('.slide').append(tagsHolder.children().clone())
						}
						break;

					case 'create':
						var createForm = current.$content.find('.collection-form');
						var errorclass = 'input-error';
						var errorField = createForm.find('.error-message');

						if (createForm.length) {
							var input = createForm.find('input[type="text"]');

							if (opener.data('collectionName') && opener.data('collectionName').length) {
								input.val(opener.data('collectionName'));
							}

							input.on('focus keyup', function() {
								input.removeClass(errorclass);
								errorField.empty();
							});
							createForm.on('submit', function(e) {
								e.preventDefault();

								if (input.val().trim().length) {
									var curArr = initGetCollections();
									var errorFlag = false;
									var regex = new RegExp('\\b' + input.val().trim() + '\\b');

									if (curArr && curArr.length) {
										var curArrLength = curArr.length;
										for (var i = 0; i < curArrLength; i++) {
											if (curArr[i].collection_name.length === input.val().trim().length && regex.test(curArr[i].collection_name)) {
												errorFlag = true;
												errorField.text('This name already exists.')
											}
										}
									}

									if (errorFlag) {
										input.addClass(errorclass);
									} else {
										var obj = {
											'collection_name': input.val(),
											'emblems': instance.$trigger.data('newEmblems') ? instance.$trigger.data('newEmblems').toString().split(',') : ''
										}

										initAddCollection(initGetCollections(), obj);
										initAppendCollection(obj, true);
										if (jQuery('.side-popup').length) {
											jQuery('.side-popup').find('.close').trigger('click');
										}
										jQuery.fancybox.close();
									}
								} else {
									input.addClass(errorclass);
								}
							});
						}
						break;

					case 'add':
						var $img = current.$content.find('.img-holder img');
						var nameField = current.$content.find('.image-name');
						var createLink = current.$content.find('[data-link="create"]');
						var collectionList = current.$content.find('.collection-list');
						var cropSize = getImgSize();
						var newName = instance.$trigger.closest('[data-emblem-id]').find('.name').text();
						var curCollections = initGetCollections();
						var newSrc;

						if (instance.$trigger.data('addId').toString().split(',').length > 1) {
							var newStr = instance.$trigger.data('addId').replace(/,/g, ', ')
							nameField.text('Emblems ' + newStr);
							newSrc = '/images/emblems/' + cropSize + '/emblem' + ('0' + instance.$trigger.data('addId').substr(0, instance.$trigger.data('addId').indexOf(','))).slice(-2) + '.' + cropSize + '.jpg';
							$img.attr('src', newSrc);
						} else {
							nameField.text('Emblem ' + parseFloat(instance.$trigger.data('addId')));
							newSrc = '/images/emblems/' + cropSize + '/emblem' + ('0' + instance.$trigger.data('addId')).slice(-2) + '.' + cropSize + '.jpg';
							$img.attr('src', newSrc);
						}

						if (curCollections && curCollections.length) {
							var curCollectionsLength = curCollections.length;
							var newE = instance.$trigger.data('addId').toString().split(',');

							for (var i = 0; i < curCollectionsLength; i++) {
								var ifAdded = false;
								var newELength = newE.length;

								for (var j = 0; j < newELength; j++) {
									var curNew = ('0' + parseFloat(newE[j]).toString()).slice(-2);

									if (curCollections[i].emblems.toString().indexOf(curNew) > -1) {
										ifAdded = true;
										j = newE.length;
									}
								}

								if (!ifAdded) {
									collectionList.append('<li><a href="javascript:;">' + curCollections[i].collection_name + '</a></li>');
								}
							}

							collectionList.on('click', 'a', function(e) {
								e.preventDefault();
								var curLink = jQuery(this);
								var newEmblems = instance.$trigger.data('addId').toString().split(',');
								var newEmblemsLength = newEmblems.length;

								initAddEmblem(curLink.text(), newEmblems);

								for (var j = 0; j < newEmblemsLength; j++) {
									var id = ('0' + parseFloat(newEmblems[j]).toString()).slice(-2);
									initAppendEmblem(id, curLink.closest('li').index(), j, newEmblemsLength, cropSize, true);
								}

								if (jQuery('.side-popup').length) {
									jQuery('.side-popup').find('.close').trigger('click');
								}

								jQuery.fancybox.close();
							});
						}

						if (createLink.length) {
							createLink.attr('data-new-emblems', instance.$trigger.data('addId'));
						}


						initFancybox();
						break;

					case 'url':
						var urlItem = document.querySelectorAll('[data-clipboard-target]');
						var curUrl = window.location.href;

						if (urlItem.length) {
							var collectionWrapper = instance.$trigger.closest('.collection-wrapper');
							var emblems = collectionWrapper.find('[data-emblem-id]');
							var emblemsArray = [];
							emblems.each(function() {
								var emblem = jQuery(this);
								emblemsArray.push(emblem.data('emblemId'));
							});
							if (curUrl.indexOf('#') !== -1) {
								curUrl = curUrl.substr(0, curUrl.indexOf('#'));
							}
							var $target = jQuery(urlItem[0].getAttribute('data-clipboard-target'));
							$target.text(curUrl + '#collection_name=' + encodeURIComponent(collectionWrapper.find('[data-name]').text()) + '&emblems=' + emblemsArray.join(','));
							var successClass = 'success-state';
							var clipboard = new ClipboardJS(urlItem);
							var successTimer;

							if (ClipboardJS.isSupported()) {
								clipboard.on('success', function(e) {
									$target.addClass(successClass);

									clearTimeout(successTimer);

									successTimer = setTimeout(function() {
										$target.removeClass(successClass);
									}, 2000);
								});
							}
						}
						break;

					case 'add-new':
						var items = current.$content.find('.image-list li');
						var activeClass = 'active';
						var disabledClass = 'disabled';
						var addLink = current.$content.find('.add-link');
						var arr = [];
						var size = getImgSize;
						var curEmblems = instance.$trigger.closest('.collection-wrapper').find('.image-description');
						var curArray = [];

						curEmblems.each(function() {
							var curEmblem = jQuery(this);
							curArray.push(curEmblem.data('emblemId').toString());
						});

						items.each(function() {
							var item = jQuery(this);
							var itemEmblemId = ('0' + parseFloat(item.find('[data-emblem-id]').data('emblemId'))).slice(-2);

							if (curEmblems.length && curEmblems.length < items.length && curArray.indexOf(itemEmblemId) > -1) {
								item.addClass('hidden-item');
							}

							item.on('click', function(e) {
								e.preventDefault();
								item.toggleClass(activeClass);
								isSelected();
							});
						});

						function isSelected() {
							var state;
							if (items.filter('.' + activeClass).length) {
								addLink.removeClass(disabledClass);
							} else {
								addLink.addClass(disabledClass);
							}
						}

						addLink.on('click', function(e) {
							e.preventDefault();
							var selectedItems = items.filter('.' + activeClass);

							if (!selectedItems.length) return;

							items.filter('.' + activeClass).each(function() {
								var item = jQuery(this);
								arr.push(('0' + parseFloat(item.find('.img-holder').data('emblemId')).toString()).slice(-2));
							});

							if (arr.length) {
								var arrLength = arr.length;
								initAddEmblem(instance.$trigger.closest('.collection-name').find('.name').text(), arr);

								for (var j = 0; j < arrLength; j++) {
									var id = ('0' + parseFloat(arr[j]).toString()).slice(-2);
									initAppendEmblem(id, instance.$trigger.closest('.collection-wrapper').index(), j, arrLength, size);
								}
							}

							jQuery.fancybox.close();
						});
						break;
				}
			}
		}
	});
}
