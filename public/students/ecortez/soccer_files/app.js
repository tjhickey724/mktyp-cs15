var SR = {
	q: '',
	L: function(e, s, p) {
		if (!this.q)
			return false;
		new Ajax.Updater(e, '/req/search/list.req.php', {
			method: 'post',
			postBody: 'q='+encodeURIComponent(this.q)+'&s='+s+'&p='+p
		});
		return false;
	}
}

var PG = {
	N: false, P:false,
	I: function() {
		document.onkeydown = function(e) {
			var e = e || window.event;
			if (e.keyCode == 39 && PG.N) {
				if (PG.CK(e))
					return true;
				document.location.href = PG.N;
				PG.K();
				return false;
			}
			if (e.keyCode == 37 && PG.P) {
				if (PG.CK(e))
					return true;
				document.location.href = PG.P;
				PG.K();
				return false;
			}
			return true;
		}
	},
	K: function() {
		document.onkeydown = function() { };
	},
	CK: function(e) {
		if (e.target) {
			if (e.target.tagName.toUpperCase() != 'HTML' && e.target.tagName.toUpperCase() != 'BODY')
				return true;
			return false;
		}
		else if (e.srcElement) {
			if (e.srcElement != document.body)
				return true;
			return false;
		}
		return false;
	}
}

var WP = {
	Zoom: function(id) {
		var ws = getWS();
		Ui.Req('/req/wp/zoom.req.php', {
			method: 'post',
			postBody: 'id='+id+'&w='+ws[0]+'&h='+ws[1],
			onAfterDraw: function() {
				$('ajopc').style.height = getDocHeight() + 'px';
				var tb = $('ajopc').getElementsByTagName('table')[0];
				tb.style.marginTop = (getScrollTop() + 20) + 'px';
			}
		});
		return false;
	},
	dl: function(id) {
		new Ajax.Request('/req/wp/dl.req.php', { method: 'post', postBody:'id='+id, asynchronous:false, onComplete: function(t) { if (t.responseText.length) alert(t.responseText); } });
	},
	Fav: function(id, f) {
		new Ajax.Request('/req/wp/fav.req.php', {
			method: 'post',
			postBody:'id='+id+'&f='+f,
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('favc').innerHTML = a[1];
					$('favsc').innerHTML = a[2];
				} else {
					alert(t.responseText);
				}
			}
		});
		return false;
	},
	rover: function(r) {
		for (var i = 1; i <= 5; i++) {
			$('sr_'+i).src = '/images/star'+(i <= r ? 1 : 0)+'.png';
		}
	},
	rate: function(id, r) {
		for (var i = 1; i <= 5; i++) {
			$('sl_'+i).onclick = function() { return false; };
			$('sl_'+i).onmouseover = function() { return false; };
			$('sl_'+i).onmouseout = function() { return false; };
		}
		new Ajax.Updater('ratec', '/req/wp/rate.req.php', { method: 'post', postBody:'id='+id+'&r='+r });
		return false;
	},
	Rep: function(id) {
		Ui.Req('/req/wp/report_wp.req.php', {
			method: 'post',
			postBody: 'id='+id
		});
		return false;
	},
	RepDo: function(f, id) {
		$('xsubmit').disabled = true;
		$('xe_option').innerHTML = '';
		$('xe_comments').innerHTML = '';
		$('xm_main').innerHTML = '';
		$('xm_main').style.display = 'none';
		$('xe_option').style.display = 'none';
		$('xe_comments').style.display = 'none';
		var option_id = 0;
		for (var i = 0; i < f.option_id.length; i++)
			if (f.option_id[i].checked)
				option_id = f.option_id[i].value;
		if (!option_id) {
			$('xe_option').innerHTML = 'Choose an option';
			$('xe_option').style.display = 'block';
			$('xsubmit').disabled = false;
			return false;
		}
		if ((option_id == 9 || option_id == 7) && !f.comments.value.length) {
			$('xe_comments').innerHTML = 'Additional comments are required for the selected option';
			$('xe_comments').style.display = 'block';
			$('xsubmit').disabled = false;
			return false;
		}
		new Ajax.Request('/req/wp/report_wp_do.req.php', {
			method: 'post',
			postBody: 'id='+id+'&option_id='+option_id+'&comments='+encodeURIComponent(f.comments.value),
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('xm_main').innerHTML = 'Your report has been saved and will be processed.<br />Thank you.';
					$('xm_main').style.display = 'block';
				} else {
					alert(t.responseText);
					$('xsubmit').disabled = false;
				}
			}
		});
		return false;
	},
	commDo: function(f) {
		$('e_comment').innerHTML = '';
		$('e_comment').style.display = 'none';
		$('cm_main').innerHTML = '';
		$('cm_main').style.display = 'none';
		if (!f.comment.value.length) {
			$('e_comment').innerHTML = 'Write a comment';
			$('e_comment').style.display = 'block';
			return false;
		}
		$('csubmit').disabled = true;
		new Ajax.Request('/req/wp/comm_do.req.php', {
			method: 'post',
			postBody: 'id='+this.id+'&comment='+encodeURIComponent(f.comment.value),
			f: f,
			onComplete: function(t, j, o) {
				$('csubmit').disabled = false;
				var a = t.responseText.split("@@@@@");
				if (a[0] == 'OK') {
					o.options.f.comment.value = '';
					$('cm_main').innerHTML = 'Comment posted';
					$('cm_main').style.display = 'block';
					$('comments').innerHTML = a[1];
				} else {
					alert(t.responseText);
				}
			}
		});
		return false;
	},
	gdc: function(id, c) {
		var c = c ? 1 : 0;
		$('gad_c_'+id).innerHTML = '<img src="/images/loading.gif" width="16" height="11" />';
		new Ajax.Request('/req/wp/gdc.req.php', {
			method: 'post',
			postBody: 'id='+id+'&c='+c,
			id: id,
			onComplete: function(t, j, o) {
				$('gad_c_'+o.options.id).innerHTML = 'OK';
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					
				} else {
					alert(t.responseText);
				}
			}
		});
		return false;
	}
}

var IM = {
	Rep: function(id) {
		Ui.Req('/req/wp/report.req.php', {
			method: 'post',
			postBody: 'id='+id
		});
		return false;
	},
	RepDo: function(f, id) {
		$('xsubmit').disabled = true;
		$('xe_option').innerHTML = '';
		$('xe_comments').innerHTML = '';
		$('xm_main').innerHTML = '';
		$('xm_main').style.display = 'none';
		$('xe_option').style.display = 'none';
		$('xe_comments').style.display = 'none';
		var option_id = 0;
		for (var i = 0; i < f.option_id.length; i++)
			if (f.option_id[i].checked)
				option_id = f.option_id[i].value;
		if (!option_id) {
			$('xe_option').innerHTML = 'Choose an option';
			$('xe_option').style.display = 'block';
			$('xsubmit').disabled = false;
			return false;
		}
		if ((option_id == 9 || option_id == 7) && !f.comments.value.length) {
			$('xe_comments').innerHTML = 'Additional comments are required for the selected option';
			$('xe_comments').style.display = 'block';
			$('xsubmit').disabled = false;
			return false;
		}
		new Ajax.Request('/req/wp/report_do.req.php', {
			method: 'post',
			postBody: 'id='+id+'&option_id='+option_id+'&comments='+encodeURIComponent(f.comments.value),
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('xm_main').innerHTML = 'Your report has been saved and will be processed.<br />Thank you.';
					$('xm_main').style.display = 'block';
				} else {
					alert(t.responseText);
					$('xsubmit').disabled = false;
				}
			}
		});
		return false;
	},
	Ban: function(id) {
		$('banlink').onclick = function() { return false; };
		new Ajax.Request('/req/wp/ban.req.php', {
			method: 'post',
			postBody: 'id='+id,
			onComplete: function(t) {
				var a = t.responseText.split("\n");
				if (a[0] == 'OK') {
					$('banlink').innerHTML = 'Banned';
				} else {
					alert(t.responseText);
				}
			}
		});
		return false;
	}
}

var App = {
	p: true,
	e: {
		'10': 'Please type your name',
		'20': 'Please type your email address',
		'25': 'Invalid email address',
		'27': 'This email address is already in our database.<br />Please use the <a href="#" onclick="return App.Rec();">password recovery</a> function.',
		'30': 'Please type the desired login',
		'35': 'Invalid login',
		'37': 'This login is not available',
		'40': 'Please type the desired password',
		'45': 'The password must be at least 4 characters long',
		'50': 'Please re-type the password',
		'55': 'The passwords do not match',
		
		'1010': 'Please type your login',
		'1020': 'Please type the password',
		'1030': 'Login failed',
		
		'2010': 'Please type the login',
		
		'3017': 'Email address not found in database'
	},
	
	m: {
		'10': 'Registration Successful',
		'2010': 'Your details have been saved',
		'2020': 'Settings saved',
		'3010': 'Your password has been sent'
	},
	
	LoadOps: function() {
		new Ajax.Request('/req/account/ops.req.php', {
			onComplete: function(t) {
				var a = t.responseText.split("@@@@@");
				$('usrops').innerHTML = a[0];
				var e = $('usrops2');
				if (e)
					e.innerHTML = a[1];
			}
		});
	},
	
	Reg: function() {
		Ui.Req('/req/account/register.req.php');
		return false;
	},
	RegDo: function(f) {
		if (this.RegVal(f)) {
			$('xsubmit').disabled = true;
			new Ajax.Request(
				'/req/account/register_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							App.ClrFrm(document.xdfrm);
							Ui.Cl();
							App.LoadOps();
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]], 'xe');
							}
							$('xsubmit').disabled = false;
						} else {
							alert(t.responseText);
							$('xsubmit').disabled = true;
						}
					}
				}
			);
		}
		return false;
	},
	RegVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.name.value.length)
			this.p = this.E(f.name, this.e[10], 'xe');
		if (!f.email.value.length)
			this.p = this.E(f.email, this.e[20], 'xe');
		else if (!/^[a-zA-Z0-9]([\w\.-]*[a-zA-Z0-9])?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(f.email.value))
			this.p = this.E(f.email, this.e[25], 'xe');
		if (!f.login.value.length)
			this.p = this.E(f.login, this.e[30], 'xe');
		else if (!/^[a-zA-Z0-9]+$/.test(f.login.value))
			this.p = this.E(f.login, this.e[35], 'xe');
		if (!f.password.value.length)
			this.p = this.E(f.password, this.e[40], 'xe');
		else if (f.password.value.length < 4)
			this.p = this.E(f.password, this.e[45], 'xe');
		if (!f.password2.value.length)
			this.p = this.E(f.password2, this.e[50], 'xe');
		else if (f.password.value != f.password2.value)
			this.p = this.E(f.password2, this.e[55], 'xe');
		return this.p;
	},
	
	onLogout: function() {
		
	},
	Logout: function() {
		new Ajax.Request('/req/account/logout.req.php', {
			onComplete: function(t) {
				var a = t.responseText.split("@@@@@");
				$('usrops').innerHTML = a[0];
				var e = $('usrops2');
				if (e)
					e.innerHTML = a[1];
				App.onLogout();
			}
		});
		return false;
	},
	
	Log: function() {
		Ui.Req('/req/account/login.req.php');
		return false;
	},
	onLogin: function() {
		
	},
	LogDo: function(f) {
		if (this.LogVal(f)) {
			$('xsubmit').disabled = true;
			new Ajax.Request(
				'/req/account/login_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							App.ClrFrm(document.xdfrm);
							Ui.Cl();
							App.LoadOps();
							App.onLogin();
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]], 'xe');
							}
							$('xsubmit').disabled = false;
						} else {
							alert(t.responseText);
							$('xsubmit').disabled = true;
						}
					}
				}
			);
		}
		return false;
	},
	LogVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.login.value.length)
			this.p = this.E(f.login, this.e[1010], 'xe');
		else if (!/^[a-zA-Z0-9\_]+$/.test(f.login.value))
			this.p = this.E(f.login, this.e[35], 'xe');
		if (!f.password.value.length)
			this.p = this.E(f.password, this.e[1020], 'xe');
		else if (f.password.value.length < 4)
			this.p = this.E(f.password, this.e[45], 'xe');
		return this.p;
	},
	
	Acc: function(p) {
		document.location.href = '/profile/';
		return false;
		var p = p || {};
		Ui.Req('/req/account/account.req.php', p);
		return false;
	},
	
	AccDo: function(f) {
		if (this.AccVal(f)) {
			$('submit').disabled = true;
			new Ajax.Request(
				'/req/account/account_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							$('submit').disabled = false;
							App.M('main', App.m[2010]);
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]]);
							}
							$('submit').disabled = false;
						} else {
							alert(t.responseText);
							$('submit').disabled = true;
						}
					}
				}
			);
		}
		return false;
	},
	AccVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.name.value.length)
			this.p = this.E(f.name, this.e[10]);
		if (!f.email.value.length)
			this.p = this.E(f.email, this.e[20]);
		else if (!/^[a-zA-Z0-9]([\w\.-]*[a-zA-Z0-9])?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(f.email.value))
			this.p = this.E(f.email, this.e[25]);
		if (!f.login.value.length)
			this.p = this.E(f.login, this.e[2010]);
		else if (!/^[a-zA-Z0-9]+$/.test(f.login.value))
			this.p = this.E(f.login, this.e[35]);
		if (!f.password.value.length)
			this.p = this.E(f.password, this.e[1020]);
		else if (f.password.value.length < 4)
			this.p = this.E(f.password, this.e[45]);
		if (!f.password2.value.length)
			this.p = this.E(f.password2, this.e[50]);
		else if (f.password.value != f.password2.value)
			this.p = this.E(f.password2, this.e[55]);
		return this.p;
	},
	
	Rec: function() {
		Ui.Req('/req/account/recover.req.php');
		return false;
	},
	RecDo: function(f) {
		if (this.RecVal(f)) {
			$('xsubmit').disabled = true;
			$('xloading').style.display = 'block';
			new Ajax.Request(
				'/req/account/recover_do.req.php', {
					method: 'post',
					postBody: _GDU(f),
					onComplete: function(t) {
						var a = t.responseText.split("\n");
						if (a[0] == 'OK') {
							$('xsubmit').disabled = false;
							$('xloading').style.display = 'none';
							App.ClrFrm(document.xdfrm);
							App.M('main', App.m[3010], 'xm');
						} else if (a[0] == 'ERR') {
							for (var i = 1; i < a.length; i++) {
								b = a[i].split(',');
								App.E(b[0], App.e[b[1]], 'xe');
							}
							$('xsubmit').disabled = false;
							$('xloading').style.display = 'none';
						} else {
							alert(t.responseText);
							$('xsubmit').disabled = false;
							$('xloading').style.display = 'none';
						}
					}
				}
			);
		}
		return false;
	},
	RecVal: function(f) {
		this.p = true;
		this.ClrErr(f);
		if (!f.email.value.length)
			this.p = this.E(f.email, this.e[20], 'xe');
		else if (!/^[a-zA-Z0-9]([\w\.-]*[a-zA-Z0-9])?@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(f.email.value))
			this.p = this.E(f.email, this.e[25], 'xe');
		return this.p;
	},
	
	ClrErr: function(f) {
		var a = f.getElementsByTagName('div');
		for (var i = 0; i < a.length; i++)
			if (a[i].className == 'err')
				a[i].innerHTML = '';
	},
	ClrFrm: function(f) {
		var b = getFormElements(f);
		for (var i = 0; i < b.length; i++)
			b[i].value = '';
	},
	E: function(e, t, prefix) {
		var prefix = prefix || 'e';
		if (a = $(prefix + '_'+(typeof(e) == 'string' ? e : e.name))) {
			a.style.display = 'block';
			a.innerHTML = t;
		}
		else
			alert(t);
		if (this.p) {
			try {
				e.focus();
			} catch (e) { };
		}
		return false;
	},
	M: function(e, t, prefix) {
		var prefix = prefix || 'm';
		var t = t || '';
		if (a = $(prefix + '_'+e)) {
			a.style.display = t ? 'block' : 'none';
			a.innerHTML = t;
		}
		else
			alert(t);
		return false;
	}
}

var Ui = {
	Req: function(f, p) {
		var p = p || {};
		p.onComplete = function(t, j, o) {
			if (o.options.obBeforeDraw)
				o.options.obBeforeDraw(t, j, o);
			
			$('ajopr').innerHTML = t.responseText;
			$('ajopc').style.height = getDocHeight() + 'px';
			var tb = $('ajopc').getElementsByTagName('table')[0];
			tb.style.marginTop = (getScrollTop() + 60) + 'px';
			
			if (o.options.onAfterDraw)
				o.options.onAfterDraw(t, j, o);
		};
		
		new Ajax.Request(f, p);
	},
	Cl: function() {
		$('ajopr').innerHTML = '';
		return false;
	}
}

function getScrollTop() { 
	if (typeof(pageYOffset) != 'undefined')
        return pageYOffset; 
	var B = document.body;
	var D = document.documentElement; 
	D = (D.clientHeight) ? D: B;
	return D.scrollTop;
}

function getDocHeight() {
	var D = document;
    return Math.max(
		Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
		Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
		Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function _GDU(f) {
	var s = '';
	var e = getFormElements(f);
	for (var i = 0; i < e.length; i++)
		if ((e[i].tagName.toLowerCase() == 'input' && (e[i].type == 'text' || e[i].type == 'password' || e[i].type == 'hidden')) || e[i].tagName.toLowerCase() == 'textarea' || (e[i].tagName.toLowerCase() == 'select' && !e[i].multiple))
			s += '&' + encodeURIComponent(e[i].name) + '=' + encodeURIComponent(e[i].value);
		else if (e[i].tagName.toLowerCase() == 'select' && e[i].multiple) {
			for (var j = 0; j < e[i].options.length; j++)
				if (e[i].options[j].selected)
					s += '&' + encodeURIComponent(e[i].name) + '=' + encodeURIComponent(e[i].options[j].value);
		}
		else if (e[i].tagName.toLowerCase() == 'input' && e[i].type == 'checkbox')
			s += '&' + encodeURI(e[i].name).replace(/&/g, '%26') + '=' + (e[i].checked?1:0);
		else if (e[i].tagName.toLowerCase() == 'input' && e[i].type == 'radio' && e[i].checked)
			s += '&' + encodeURI(e[i].name).replace(/&/g, '%26') + '=' + encodeURIComponent(e[i].value);
	return s.substr(1);
}

function getFormElements(f) {
	var ret = [];
	var e = f.getElementsByTagName('input');
	for (var i = 0; i < e.length; i++)
		if (e[i].type.toLowerCase() != 'submit')
			ret.push(e[i]);
	var e = f.getElementsByTagName('textarea');
	for (var i = 0; i < e.length; i++)
		ret.push(e[i]);
	var e = f.getElementsByTagName('select');
	for (var i = 0; i < e.length; i++)
		ret.push(e[i]);
	return ret;
}

function getWS() {
	var winW = 630, winH = 460;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	return [winW, winH];
}

function getScrollTop() { 
	if (typeof(pageYOffset) != 'undefined')
        return pageYOffset; 
	var B = document.body;
	var D = document.documentElement; 
	D = (D.clientHeight) ? D: B;
	return D.scrollTop;
}

function getDocHeight() {
	var D = document;
    return Math.max(
		Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
		Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
		Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

String.prototype.trim = function(mask) {
	var mask = mask || '\\s';
	var Re = new RegExp('^['+mask+']+|['+mask+']+$', 'g');
	return this.replace(Re, '');
};

var Prototype = {
	Version: '1.4.0_pre10_ajax',
	
	emptyFunction: function() {},
	K: function(x) {return x}
}

var Class = {
	create: function() {
		return function() { 
			this.initialize.apply(this, arguments);
		}
	}
}

var Abstract = new Object();

Object.extend = function(destination, source) {
	for (property in source) {
		destination[property] = source[property];
	}
	return destination;
}

Object.inspect = function(object) {
	try {
		if (object == undefined) return 'undefined';
		if (object == null) return 'null';
		return object.inspect ? object.inspect() : object.toString();
	} catch (e) {
		if (e instanceof RangeError) return '...';
		throw e;
	}
}

Function.prototype.bind = function(object) {
	var __method = this;
	return function() {
		return __method.apply(object, arguments);
	}
}

Function.prototype.bindAsEventListener = function(object) {
	var __method = this;
	return function(event) {
		return __method.call(object, event || window.event);
	}
}

Object.extend(Number.prototype, {
	toColorPart: function() {
		var digits = this.toString(16);
		if (this < 16) return '0' + digits;
		return digits;
	},

	succ: function() {
		return this + 1;
	},
	
	times: function(iterator) {
		$R(0, this, true).each(iterator);
		return this;
	}
});

var Try = {
	these: function() {
		var returnValue;

		for (var i = 0; i < arguments.length; i++) {
			var lambda = arguments[i];
			try {
				returnValue = lambda();
				break;
			} catch (e) {}
		}

		return returnValue;
	}
}


var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
	initialize: function(callback, frequency) {
		this.callback = callback;
		this.frequency = frequency;
		this.currentlyExecuting = false;

		this.registerCallback();
	},

	registerCallback: function() {
		setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
	},

	onTimerEvent: function() {
		if (!this.currentlyExecuting) {
			try { 
				this.currentlyExecuting = true;
				this.callback(); 
			} finally { 
				this.currentlyExecuting = false;
			}
		}
	}
}





var Ajax = {
	getTransport: function() {
		return Try.these(
			function() {return new ActiveXObject('Msxml2.XMLHTTP')},
			function() {return new ActiveXObject('Microsoft.XMLHTTP')},
			function() {return new XMLHttpRequest()}
		) || false;
	}
}

Ajax.Base = function() {};
Ajax.Base.prototype = {
	setOptions: function(options) {
		this.options = {
			method:			 'post',
			asynchronous: true,
			parameters:	 ''
		}
		Object.extend(this.options, options || {});
	},

	responseIsSuccess: function() {
		return this.transport.status == undefined
				|| this.transport.status == 0 
				|| (this.transport.status >= 200 && this.transport.status < 300);
	},

	responseIsFailure: function() {
		return !this.responseIsSuccess();
	}
}

Ajax.Request = Class.create();
Ajax.Request.Events = 
	['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
	initialize: function(url, options) {
		this.transport = Ajax.getTransport();
		this.setOptions(options);
		this.request(url);
	},

	request: function(url) {
		var parameters = this.options.parameters || '';
		if (parameters.length > 0) parameters += '&_=';

		try {
			if (this.options.method == 'get')
				url += '?' + parameters;

			this.transport.open(this.options.method, url,
				this.options.asynchronous);

			if (this.options.asynchronous) {
				this.transport.onreadystatechange = this.onStateChange.bind(this);
				setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
			}

			this.setRequestHeaders();

			var body = this.options.postBody ? this.options.postBody : parameters;
			this.transport.send(this.options.method == 'post' ? body : null);

		} catch (e) {
		}
	},

	setRequestHeaders: function() {
		var requestHeaders = 
			['X-Requested-With', 'XMLHttpRequest',
			 'X-Prototype-Version', Prototype.Version];

		if (this.options.method == 'post') {
			requestHeaders.push('Content-type', 
				'application/x-www-form-urlencoded');

			if (this.transport.overrideMimeType)
				requestHeaders.push('Connection', 'close');
		}

		if (this.options.requestHeaders)
			requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);

		for (var i = 0; i < requestHeaders.length; i += 2)
			this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
	},

	onStateChange: function() {
		var readyState = this.transport.readyState;
		if (readyState != 1)
			this.respondToReadyState(this.transport.readyState);
	},
	
	evalJSON: function() {
		try {
			var json = this.transport.getResponseHeader('X-JSON'), object;
			object = eval(json);
			return object;
		} catch (e) {
		}
	},

	respondToReadyState: function(readyState) {
		var event = Ajax.Request.Events[readyState];
		var transport = this.transport, json = this.evalJSON();

		if (event == 'Complete')
			(this.options['on' + this.transport.status]
			 || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
			 || Prototype.emptyFunction)(transport, json);

		(this.options['on' + event] || Prototype.emptyFunction)(transport, json, this);

		if (event == 'Complete')
			this.transport.onreadystatechange = Prototype.emptyFunction;
	}
});

Ajax.Updater = Class.create();
Ajax.Updater.ScriptFragment = '(?:<script.*?>)((\n|.)*?)(?:<\/script>)';

Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
	initialize: function(container, url, options) {
		this.containers = {
			success: container.success ? $(container.success) : $(container),
			failure: container.failure ? $(container.failure) :
				(container.success ? null : $(container))
		}

		this.transport = Ajax.getTransport();
		this.setOptions(options);

		var onComplete = this.options.onComplete || Prototype.emptyFunction;
		this.options.onComplete = (function(transport, object) {
			this.updateContent();
			onComplete(transport, object);
		}).bind(this);

		this.request(url);
	},

	updateContent: function() {
		var receiver = this.responseIsSuccess() ?
			this.containers.success : this.containers.failure;

		var match		= new RegExp(Ajax.Updater.ScriptFragment, 'img');
		var response = this.transport.responseText.replace(match, '');
		var scripts	= this.transport.responseText.match(match);

		if (receiver) {
			if (this.options.insertion) {
				new this.options.insertion(receiver, response);
			} else {
				receiver.innerHTML = response;
			}
		}

		if (this.responseIsSuccess()) {
			if (this.onComplete)
				setTimeout(this.onComplete.bind(this), 10);
		}

		if (this.options.evalScripts && scripts) {
			match = new RegExp(Ajax.Updater.ScriptFragment, 'im');
			setTimeout((function() {
				for (var i = 0; i < scripts.length; i++)
					eval(scripts[i].match(match)[1]);
			}).bind(this), 10);
		}
	}
});

Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
	initialize: function(container, url, options) {
		this.setOptions(options);
		this.onComplete = this.options.onComplete;

		this.frequency = (this.options.frequency || 2);
		this.decay = 1;

		this.updater = {};
		this.container = container;
		this.url = url;

		this.start();
	},

	start: function() {
		this.options.onComplete = this.updateComplete.bind(this);
		this.onTimerEvent();
	},

	stop: function() {
		this.updater.onComplete = undefined;
		clearTimeout(this.timer);
		(this.onComplete || Ajax.emptyFunction).apply(this, arguments);
	},

	updateComplete: function(request) {
		if (this.options.decay) {
			this.decay = (request.responseText == this.lastText ? 
				this.decay * this.options.decay : 1);

			this.lastText = request.responseText;
		}
		this.timer = setTimeout(this.onTimerEvent.bind(this), 
			this.decay * this.frequency * 1000);
	},

	onTimerEvent: function() {
		this.updater = new Ajax.Updater(this.container, this.url, this.options);





	}
});

function $() {
	var elements = new Array();

	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);

		if (arguments.length == 1) 
			return element;

		elements.push(element);
	}

	return elements;
}