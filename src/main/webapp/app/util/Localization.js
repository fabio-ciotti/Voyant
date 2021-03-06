Ext.define('Voyant.util.Localization', {
	statics: {
		DEFAULT_LANGUAGE: 'en',
		LANGUAGE: 'en'
	},
	
    languageStore: Ext.create('Ext.data.ArrayStore', {
        fields: ['code', 'language'],
        data : [
                ['en', 'English']
        ]
    }),
	
	getLanguage: function(code) {
		var record = this.languageStore.findRecord(code.length==2 ? 'code' : 'language', code);
		if (record) {return record.get(code.length==2 ? 'language' : 'code');}
	},
	
	localize: function(key, config) {
		return this._localizeObject(this, key, config);
	},
	
	_localizeObject: function(object, key, config) {

		var val = this._localizeClass(Ext.ClassManager.getClass(object), key, config);
		if (val) {return val;}
		if (object.mixins) { // look at mixins first
			for (mixin in object.mixins) {
				var val = this._localizeClass(Ext.ClassManager.getClass(object.mixins[mixin]), key, config);
				if (val) {return val;}
			}
		}
		if (object.superclass) { // then superclasses
			val =  this._localizeObject(object.superclass, key, config);
			if (val) {return val;}
		}
		return config && config['default']!=undefined ? config['default'] : '['+key+']';
	},
	
	_localizeClass: function(clazz, key, config) {
		if (clazz && clazz.i18n && clazz.i18n[key]) {
			var use = false;
			if (clazz.i18n[key]) {
				use = clazz.i18n[key];
			}
			/*
			if (config && config.lang && clazz.i18n[key][config.lang]) {
				use = clazz.i18n[key][config.lang];
			}
			else if (clazz.i18n[key][Voyant.util.Localization.LANGUAGE]) {
				use = clazz.i18n[key][Voyant.util.Localization.LANGUAGE];
			}
			else if (clazz.i18n[key][Voyant.util.Localization.DEFAULT_LANGUAGE]) {
				use = clazz.i18n[key][Voyant.util.Localization.DEFAULT_LANGUAGE];
			}
			*/
			if (use) {
				if (use.isTemplate) { // template
					return use.apply(config);
				}
				return use; // string
			}
			return config && config['default']!=undefined ? config['default'] : '['+key+']'; // no language key found, so just return the key
		}
		return false
	}
	
});
