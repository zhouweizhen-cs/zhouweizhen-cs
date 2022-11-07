
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

//MDN PolyFil for IE8 (This is not needed if you use the jQuery version)
if (!Array.prototype.forEach){
	Array.prototype.forEach = function(fun /*, thisArg */){
	"use strict";
	if (this === void 0 || this === null || typeof fun !== "function") throw new TypeError();
	
	var
	t = Object(this),
	len = t.length >>> 0,
	thisArg = arguments.length >= 2 ? arguments[1] : void 0;

	for (var i = 0; i < len; i++)
	if (i in t)
		fun.call(thisArg, t[i], i, t);
	};
}

function showError(content) {
	if(content != null && content != '') {
		if (content == "用户信息失效，请重新登录！") {
			showErrorToReload(content);
		} else {
			$.gritter.add({
				title: '错误',
				text: content,
				image: Global.resSys + '/images/avatars/avatar3.png',
				//sticky: true,
				time: 1000,
				class_name: 'gritter-error gritter-light gritter-width'
			});
		}
		
	}
}

function showErrorToReload(content){
	if(content != null && content != '') {
		layer.confirm(content, {
			btn: ['重新登录'] //按钮
		}, function(index){
			layer.close(index);
			window.location.reload();;
		});
	}
}

function scanShowError1(content){
	layer.alert('<p>'+content+'</p>', {
		skin: 'dialog_Error',
	  	closeBtn: 0
	},function(index){
		layer.close(index);
		$("#scan_section_code").val("").prop("disabled",false).focus();
	})
}
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

function getSmpFormatDate(date, isFull) {
	var pattern = "";
	if (isFull == true || isFull == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	} else {
		pattern = "yyyy-MM-dd";
	}
	return getFormatDate(date, pattern);
}

function getSmpFormatNowDate(isFull) {
	return getSmpFormatDate(new Date(), isFull);
}

function getSmpFormatDateByLong(l, isFull) {
	return getSmpFormatDate(new Date(l), isFull);
}

function getFormatDateByLong(l, pattern) {
	return getFormatDate(new Date(l), pattern);
}

function getFormatDate(date, pattern) {
	if (date == undefined) {
		date = new Date();
	}
	if (pattern == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return date.format(pattern);
}

//计算时间差
function getFormatTime(time1, time2) {
	var timeDifference = Math.round(time1 - time2);

	//天
	if (timeDifference > 86400) {
		return getFormatDateByLong(time2 * 1000, "yyyy-MM-dd hh:mm");
	}
	//小时
	if (timeDifference > 3600) {
		if (getFormatDateByLong(time2 * 1000, "dd") == getFormatDateByLong(time1 * 1000, "dd")) {
			return getFormatDateByLong(time2 * 1000, "今天 hh:mm");
		} else {
			return getFormatDateByLong(time2 * 1000, "MM/dd hh:mm");
		}
	}
	//分钟
	if (timeDifference > 60) {
		return Math.round(timeDifference / 60) + "分钟前";
	}
	//秒钟
	return timeDifference + "秒前";

}

function regTrim(s) {
	var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
	var imp_c = {};
	imp_c["^"] = "\\^";
	imp_c["."] = "\\.";
	imp_c["\\"] = "\\\\";
	imp_c["|"] = "\\|";
	imp_c["("] = "\\(";
	imp_c[")"] = "\\)";
	imp_c["*"] = "\\*";
	imp_c["+"] = "\\+";
	imp_c["-"] = "\\-";
	imp_c["$"] = "\$";
	imp_c["["] = "\\[";
	imp_c["]"] = "\\]";
	imp_c["?"] = "\\?";
	s = s.replace(imp, function(o) {
		return imp_c[o];
	});
	return s;
}

var Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
    

TCUtils = {
	doQuery : function(query_string) {
		$("i[chevron]").attr("chevron","down");
		$("i[chevron]").click();
		
		_tokens = $.trim(query_string).split(" ");
		$(".task").each(function(i, div) {
			var count = 0;
			$("[queryAble=true]", $(this)).each(function(i, ele) {
				_text = $(ele).text();
				$.each(_tokens, function(index, token) {
					if (token === "") {
						return;
					}
					var reg = new RegExp(regTrim(token), "gi");
					if (reg.test(_text)) {
						//_text = _text.replace(reg, "♂" + token + "♀");
						count++;
					}
				});

				//_text = _text.replace(/♂/g, "<span rel='mark' style='background-color:yellow;' >").replace(/♀/g, "</span>");
				//$(ele).html(_text);
			});
			count = (count>=_tokens.length) ? 1 : 0;
			if (count || !query_string) {
				$(this).css("display", "block");
			} else if (!count) {
				$("input[name='checkbox1']" , this).prop('checked',false);
				$(this).removeClass("task-select");
				$(this).css("display", "none");
			}
		});
	},
	replaceParam : function(url, name, replace) {
		var re = eval('/(' + name + '=)([^&]*)/gi');
		var _url = url.replace(re, name + '=' + replace);
		return _url;
	},
	merge: function( first , second ){
		return $.grep( first ,function(n , i){
			return ( $.inArray( n , second ) > -1 ) ? true : false;
		});
	},
	getLocalStorage : function(name) {
		var json_collect = localStorage.getItem(name) || '{}';
		var json = JSON.parse(json_collect);
		return json;
	},
	setLocalStorage : function(name, json) {
		localStorage.setItem(name, JSON.stringify(json));
	},
	isCache : function(id) {
		var cache = this.getLocalStorage("CACHE_EXPIRES");
		var expires = cache[id];
		if (!expires)
			return false;
		return expires > (new Date()).getTime();
	},
	cacheData : function(name, json, expires) {
		var cache = this.getLocalStorage("CACHE_EXPIRES");
		cache['FLOW_WAITING'] = (new Date()).getTime() + ((expires || 5 * 60) * 1000);
		this.setLocalStorage('CACHE_EXPIRES', cache);

		this.setLocalStorage(name, json);
	},
	menuHidden : function( menuCancel ){
		if(menuCancel){
			if(menuCancel.indexOf("5")>-1){
				$('[navtap=evaluation]').remove();
			}

			if(menuCancel.indexOf("4")>-1){
				$('[navtap=done]').remove();
			}

			if(menuCancel.indexOf("3")>-1){
				$('[navtap=doing]').remove();
			}

			if(menuCancel.indexOf("2")>-1){
				$('[navtap=waiting]').remove();
			}

			if(menuCancel.indexOf("1")>-1){
				$('[navtap=allow]').remove();
			}
		}
	},
	alert: function(content){
		
		var dialog = $('#alert-dialog');
		if(dialog.length){
			$("#alert-dialog h2").text(content);
			$('#alert-dialog .modal').modal('show');
		}else{
			dialog = $('<div id="alert-dialog"></div>');
			dialog.empty().append('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="myModalLabel">提示</h4></div><div class="modal-body"><h2>'+content+'</h2></div><div class="modal-footer"><button type="button" class="btn btn-default modal-remove">关闭</button></div></div></div></div>');
			$(document.body).append(dialog);
			
			dialog.find(".modal-remove").click(function(){
				$('#alert-dialog .modal').modal('hide');
			});
			
			$('#alert-dialog .modal').modal('show');
		}
	},getLength: function(_description, maxLength) {
	    var _length = 0;
	    var count = 0;
	    for (var i = 0; i < _description.length; i++) {
	        if (count > maxLength) return _length;
	        if (_description.charCodeAt(i) > 127 || _description.charCodeAt(i) == 94) {
	            count += 2;
	        } else {
	            count++;
	        }
	        _length++;
	    }
	    return _length;
	}
}


//function prettyDate(date){
//	
//	var time_formats = [
//		[60, '刚刚', '刚刚'], // 60
//		[3600, '分钟', 60], // 60*60, 60
//		[86400, '小时', 3600], // 60*60*24, 60*60
//		[172800, '昨天', '明天'], // 60*60*24*2
//		[604800, '天', 86400], // 60*60*24*7, 60*60*24
//		[1209600, '上周', '下周'], // 60*60*24*7*4*2
//		[2419200, '周', 604800], // 60*60*24*7*4, 60*60*24*7
//		[4838400, '上个月', '下个月'], // 60*60*24*7*4*2
//		[29030400, '个月', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
//		[58060800, '去年', '明年'], // 60*60*24*7*4*12*2
//		[2903040000, '年', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
//		[5806080000, '', ''], // 60*60*24*7*4*12*100*2
//		[58060800000, '', ''] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
//	];
//  var seconds = (new Date() - date) / 1000;
//	var token = '前', list_choice = 1;
//	if (seconds < 0) {
//		seconds = Math.abs(seconds);
//		token = '后';
//		list_choice = 2;
//	}
//	var i = 0, format;
//	while (format = time_formats[i++]) {
//		if (seconds < format[0]) {
//			if (typeof format[2] == 'string')
//				return format[list_choice];
//			else
//				return Math.floor(seconds / format[2]) + format[1] + token;
//		}
//	}
//	return date;
//};
function prettyDate(dateTimeStamp){
	var dateStr=$.timeago(dateTimeStamp);
	return dateStr;
}


//function rateInit(__rate) {
//	var _HTML = "";
//	var _rate = __rate || 1;
//	if (_rate) {
//		var rate = Math.round(_rate * 2 / 20) / 2;
//		_HTML = '<div class="rateit" data-rateit-value="' + rate + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>';
//	}
//	return _HTML;
//}

function rateInit(__rate) {
	var _HTML = "";
	var _rate = __rate || 1;
	var width = 0;
	if (_rate) {
		var rate = Math.round(_rate * 2 / 20) / 2;
		width = rate * (80/5);
	}
	_HTML = '<div class="rateit" ><div class="rateit-range" style="width:80px;height:16px;" ><div class="rateit-selected" style="width:'+width+'px;height:16px"></div></div></div>';
	
	return _HTML;
}

function storageCookieImage( name ){
	
	var loaded = $.cookie('FILTER_NOT_FOUND_IMG') || {};
	if(!loaded[name]){
		loaded[name] = true;
	}
	$.cookie('FILTER_NOT_FOUND_IMG', loaded , {
		expires : 2 , path: '/'
	});
	
}


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) 
    	return decodeURIComponent(r[2]); 
    return null; 
}

function getSaftyParams(str){
	var str=str;
	if(str){
		str=str.replace("<","");
	}
	if(str){
		str=str.replace(">","");
	}
	if(str){
		str=str.replace("'","");
	}
	if(str){
		str=str.replace(":","");
	}
	return str;
	
}

function errorOnGetTypeIcon( thiz , tag , normal ){
	storageCookieImage( tag );
	$(thiz).attr('src', normal );
}

//...
function bannerImageError($this){
	$($this).remove();
}

function getAppUrl( appUrl , preview, remark){
	var returnUrl = "" , membership = "";
	returnUrl="back=1&x_posted=true";
	if(Global.membership){
		membership = "membership=" + Global.membership;
		if(remark==true){
			membership=membership+"&showRemark=true";
		}else if(remark==false){
			membership=membership+"&showRemark=false";
		}
	}
	
	if(Global.deviceName != 'mobile' && !ISWXPC()){
		returnUrl = "";
	}
	
	if(membership ){
		if(appUrl.indexOf('?')>-1){
			appUrl += "&"  + membership;
		}else{
			appUrl += "?"  + membership;
		}
	}
	
	if(returnUrl){
		if(appUrl.indexOf('?')>-1){
			appUrl += "&"  + returnUrl;
		}else{
			appUrl += "?"  + returnUrl;
		}
	}
	
	if(preview){
		if(appUrl.indexOf('?')>-1){
			appUrl += "&preview=true";
		}else{
			appUrl += "?preview=true";
		}
	}
	
	return appUrl;
}

//判断是否是在微信pc端
function ISWXPC(){
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf("windowswechat") > -1) {
		return true;
	}
	return false;
}


function getWeiTuoUrl( appUrl){
	if(appUrl){
			if(appUrl.indexOf('?')>-1){
				appUrl += "&entrust=true";
			}else{
				appUrl += "?entrust=true";
			}
			return appUrl;
	}

}
//---------------------------------------------扫码start--------------------------------------------

/*判断是pc端还是移动端 pc端返回true 移动端返回false*/
function IsPC(){  
	var userAgentInfo = navigator.userAgent;  
   	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
   	var flag = true;  
   	for (var v = 0; v < Agents.length; v++) {  
    	if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
   	}  
   	return flag;  
} 
/*
   
   * pc端根据数据新建li
   * 参数1：json形式的数据
   * 参数2：把新建的li插入该元素
   * 参数3:插入的位置,接受两种字符串，before after，如果为空，默认是after
   * */
function pcCreatLi(dataJson,parent,location){
	for(var type in dataJson){
		var arr=dataJson[type];
		for(var i=0;i<arr.length;i++){
			var li=$("<li id='"+arr[i].id+"' dataType='"+type+"'>"+
				  "<div class='title_item title_item_time'>"+prettyDate(arr[i].process.update*1000)+"</div>"+
			      "<div class='title_item title_item_entry'><p>"+arr[i].process.entry+"</p></div>"+
				  "<div class='title_item title_item_name'><a href='"+arr[i].uri+"' target='_blank'>"+arr[i].process.name+"</a></div>"+
				  "<div class='title_item title_item_people'>"+arr[i].process.owner.name+"</div>"+
			"</li>");
			if(parent.attr("dataType")=="choose"){
				li.find(".title_item_name a").html(arr[i].process.name+"-"+arr[i].name);
				var choose=$("<div class='mobile_scan_choose'><p></p></div>");
				li.append(choose);
				if(type=="done"){
//					var img=$("<img src='"+Global.resSys+"/images/look.png' />");
//					li.append(img);
					var showStatus=$("<span class='showScanStatus'>您已收取，可选择查看</span>");
					li.append(showStatus);
				}else if(type=="helpdo"){
//					var img=$("<img src='"+Global.resSys+"/images/collect.png' />");
//					li.append(img);
					var showStatus=$("<span class='showScanStatus'>等待别人收取(暂不支持代收)</span>");
					li.append(showStatus);
				}
			}
			if(type=="finished"){
				var thingCode=$.cookie("thingCode");
				var titleItemThingCode=$("<div class='title_item title_item_thingCode'>"+thingCode+"</div>");
				li.append(titleItemThingCode);
			}
			if(location=="before"){
				if(parent.children("li").length>0){
					parent.find("li").eq(0).before(li);
				}else{
					parent.append(li);
				}
			}else{
				parent.append(li);
			}
		}
	}

}

/*
   
   * 移动端根据数据新建li
   * 参数1：json形式的数据
   * 参数2：把新建的li插入该元素
   * 参数3:插入的位置,接受两种字符串，before after，如果为空，默认是after
   * */
function mobileCreatLi(dataJson,parent,location){
	for(var type in dataJson){
		var arr=dataJson[type];
		for(var i=0;i<arr.length;i++){
			var li=$("<li id='"+arr[i].id+"' dataType='"+type+"'>"+
						"<div class='mobile_scan_li_left'>"+
							"<p class='mobile_scan_name title_item_name'><a target='_blank' href='"+arr[i].process.uri+"'>"+arr[i].process.name+"</a></p>"+
							"<p class='mobile_scan_step'>发起人："+arr[i].process.owner.name+"</p>"+
						"</div>"+
						"<div class='mobile_scan_li_right'>"+
							"<p class='mobile_scan_entry'>流水号："+arr[i].process.entry+"</p>"+
							"<p class='mobile_scan_time'>"+prettyDate(arr[i].process.update*1000)+"</p>"+
						"</div>"+
					"</li>");
			if(parent.attr("dataType")=="choose"){
				var choose=$("<div class='mobile_scan_choose'><p></p></div>");
				li.append(choose);
				if(type=="done"){
					var img=$("<img src='"+Global.resSys+"/images/look.png' />");
					li.append(img);
				}else if(type=="helpdo"){
					var img=$("<img src='"+Global.resSys+"/images/collect.png' />");
					li.append(img);
				}
			}
			if(type=="finished"){
				var thingCode=$.cookie("thingCode");
				var titleItemThingCode=$("<p class='mobile_scan_thingCode'>物品码："+thingCode+"</p>");
				li.find(".mobile_scan_step").before(titleItemThingCode);
			}
			if(location=="before"){
				if(parent.children("li").length>0){
					parent.find("li").eq(0).before(li);
				}else{
					parent.append(li);
				}
			}else{
				parent.append(li);
			}
		}
	}
}
/*
   * 获取待收物品显示
   * 参数1：回调函数（新建li的函数，区分移动端和pc端）
   * */
function getThingTodo(callBack,isOpen){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	//初始化
	$("#scan_section_code,#mobile_scan_txt").val("").prop("disabled",false);
	//解决打开时input框获取焦点的问题
	setTimeout("$('#scan_section_code,#mobile_scan_txt').focus()",50);
	$("."+mobile+"scan_title").find("li").first().addClass("active")
	.siblings().removeClass("active");
	$("."+mobile+"scan_content").first().addClass("active")
	.siblings().removeClass("active");
	$("."+mobile+"finishedInfo").empty();
	if(!isOpen){
		$("."+mobile+"done_detail").find("li").remove();
		$("."+mobile+"doneCount").css("display","none");
		$("."+mobile+"noDone").html("您还未收取物品").css("display","block");
		$("."+mobile+"noTodo").html("正在加载...").css("display","block");
	}
	$("."+mobile+"todo_detail").find("li").remove();
	var randomNum=Math.random();
	$.ajax({
		type:"get",
		url:Global.contentpath+"api/me/tasks/todo?thing=true&randomNum="+randomNum,
//		url:Global.resSys+"/json/todoNew.json",
		success:function(response){
			if(response.errno==0){
				if(response.entities.length!=0){
					$("."+mobile+"noTodo").css("display","none");
					$("."+mobile+"todoCount").html(response.entities.length).css("display","inline-block");
					var dataJson={
						"todo":response.entities
					};
					callBack(dataJson,$("."+mobile+"todo_detail"));
				}else{
					$("."+mobile+"noTodo").html("您现在没有等待收取的物品！").css("display","block");
				}
			}else{
				$("."+mobile+"noTodo").html("获取待办物品失败！").css("display","block");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			$("."+mobile+"noTodo").html("获取待办物品失败！").css("display","block");
       	}
	});
}


/*根据一维码获取物品信息。
   * 参数1:输入框元素（用来取值和绑定错误信息）
   * 参数2:弹出框的大小（类似["100px","200px"]表示宽高）
   * 参数3：各种弹出框的位置
   * 参数4:回调函数（移动端和pc端传入的函数不同）
   * */
function getDataByThingCode(_input,_chooseAreaArr,layerOffsetParam,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	$("."+mobile+"scan_title").find("li").first().addClass("active")
	.siblings().removeClass("active");
	$("."+mobile+"scan_content").first().addClass("active")
	.siblings().removeClass("active");
	if(_input.val()!=""){
		//把物品码存到cookie中
		$.cookie("thingCode",_input.val());
		$.ajax({
			type:"get",
			url:Global.contentpath+"api/thing/"+_input.val()+"/tasks",
//			url:Global.resSys+"/json/get.json",
			success:function(response){
				if(response.errno==0){
					var info={
						todo:[],
						helpdo:[],
						done:[]
					}
					var entities=response.entities;
					for(var i=0;i<entities.length;i++){
						if(entities[i].status==2){
							info.done.push(entities[i]);
						}else if(entities[i].status==1){
							if(entities[i].assignUser&&entities[i].assignUser.id==Global.userId){
								info.todo.push(entities[i]);
							}else{
								info.helpdo.push(entities[i]);
							}
						}
					}
					//判断是待收，代收还是已收
					var todo=info.todo;
					var helpdo=info.helpdo;
					var done=info.done;
					var id="";
					var dataJson={};
					//先查看是否有待收
					if(todo.length==1){
						id=todo[0].id;
						judgeAction(todo[0],"",_input,layerOffsetParam,callBack);
					}else if(todo.length>1){
						//弹出框供用户选择
						dataJson["todo"]=todo;
						alertChooseOne(dataJson,_chooseAreaArr,_input,layerOffsetParam,callBack);
					}else{
						//判断代收和已收的数量
						var len=helpdo.length+done.length;
						if(len==0){
							scanShowError("当前没有该物品的待收！",_input);
						}else if(len==1){
							//判断是代收还是已收
							if(helpdo.length==1){
								id=helpdo[0].id;
								dataJson["helpdo"]=helpdo;
								alertChooseOne(dataJson,_chooseAreaArr,_input,layerOffsetParam,callBack);
//								layer.prompt({
//									title:"请输入代收码：",
//									formType:1,
//									btn2:function(){
//										_input.prop("disabled",false).select();
//									},
//									cancel:function(){
//										_input.prop("disabled",false).select();
//									}
//								},function(pass,index){
//									layer.close(index);
//									judgeAction(helpdo[0],pass,_input,layerOffsetParam,callBack);
//								})
							}
							if(done.length==1){
								var doneUrl=done[0].uri;
								scanShowError("该物品已被收取！",_input);
//								window.open(doneUrl,"_blank");
								_input.val("").prop("disabled",false).focus();
							}
						}else if(len>1){
							dataJson["helpdo"]=helpdo;
							dataJson["done"]=done;
							alertChooseOne(dataJson,_chooseAreaArr,_input,layerOffsetParam,callBack);
						}
					}
				}else{
					scanShowError("当前没有该物品的待收！",_input);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
	          	scanShowError("获取对应物品失败！",_input);
	       	}
		});
	}
}
/**
   *弹出多个物品供用户选择
   * 参数1：数据用来产生li 
   * 参数2：弹出框的大小
   * 参数3：输入框元素
   * 参数4：各种弹出框的位置
   * 参数5：回调函数
   */
function alertChooseOne(dataJson,_chooseAreaArr,_input,layerOffsetParam,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var	_contentEle=$("."+mobile+"chooseOne_detail");
	layer.open({
		title:"请选择需要收取的物品：",
	    type: 1,
	    offset:layerOffsetParam.chooseOffset,
	    btn: ["确定","取消"],
	    yes:function(){
	    	var isChoose=false;
	    	$("."+mobile+"chooseOne_detail li").each(function(index,item){
	    		var choose=$(item).find(".mobile_scan_choose");
	    		if(choose.hasClass("select")){
	    			isChoose=true;
	    		}
	    	});
	    	if(isChoose){
	    		chooseOneTodo(dataJson,_input,layerOffsetParam,callBack);
	    	}else{
	    		return false;
	    	}
	    },
	    btn2:function(){
	    	_input.prop("disabled",false).select();	
	    },
	    area: _chooseAreaArr, //宽高
	    content: $("."+mobile+"chooseOne"),
	    success: function(layero, index){
	    	_contentEle.attr("dialogIndex",index);
	        _contentEle.html("");
			callBack(dataJson,_contentEle);
	    },
	  	cancel:function(layero,index){
	  		_input.prop("disabled",false).select();						  		
	  	}
	});
}
/*
   
   * 对应多个物品的时候，选择一条执行
   * 参数1：json数据
   * 参数2：输入框元素
   * 参数3：各种弹出框的位置
   * 参数4：回调函数
   * */
function chooseOneTodo(dataJson,_input,layerOffsetParam,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var obj={};
	var lis=$("."+mobile+"chooseOne_detail li");
	var type="";
	var id="";
	var uri="";
	for(var i=0;i<lis.length;i++){
		var cb=$(lis[i]).find(".mobile_scan_choose");
		if(cb.hasClass("select")){
			id=$(lis[i]).attr("id");	
			type=$(lis[i]).attr("dataType");
			uri=$(lis[i]).find(".title_item_name").find("a").attr("href");
			break;
		}
	}

	if(dataJson["todo"]==undefined){
		if(dataJson["done"]==undefined){
			var arr=dataJson["helpdo"];
		}else{
			var arr=dataJson["helpdo"].concat(dataJson["done"]);
		}
	}else{
		var arr=dataJson["todo"];
	}
	for(var i=0;i<arr.length;i++){
		if(arr[i]&&arr[i].id==id){
			obj=arr[i];
		}
	}
	if(type=="done"){
		window.open(uri,"_blank");
	}else if(type=="helpdo"){
		layer.prompt({
			title: '请输入代收码：',
			offset:layerOffsetParam.promotOffset,
			formType: 1
		}, function(pass, index){
		  	layer.close(index);
		  	layer.close($("."+mobile+"chooseOne_detail").attr("dialogIndex"));
		  	judgeAction(obj,pass,_input,layerOffsetParam,callBack);
		});
	}else if(type="todo"){
		layer.close($("."+mobile+"chooseOne_detail").attr("dialogIndex"));	
		judgeAction(obj,"",_input,layerOffsetParam,callBack);
	}
}
/*
   
   * 判断actions的多个情况
   * 参数1：对应的那条Task
   * 参数2：代收码
   * 参数3：输入框元素
   * 参数4：各种弹出框的位置
   * 参数5：回调函数
   * */
function judgeAction(obj,pass,_input,layerOffsetParam,callBack){
	var data={};
	//判断是代收还是待收
	//判断action的数量，如果没有就直接报错，如果有多个就列出来选择。
	var actionsArr=obj.actions;
	if(actionsArr==null){
		scanShowError("该物品不能进行扫码收取",_input);
	}else{
		if(actionsArr.length==0){
			scanShowError("该步骤未定义收取动作，请与系统管理员联系",_input);
		}else if(actionsArr.length==1){
			var actionId=obj.actions[0].id;
			ExistInTodoOrNot(obj,pass,actionId,_input,layerOffsetParam,callBack);
		}else if(actionsArr.length>1){
			//弹出来供用户选择
			layer.open({
				title:"请选择对应的action：",
			    type: 1,
			    offset:layerOffsetParam.actionOffset,
			    btn: ["确定","取消"],
			    yes:function(){
			    	var lis=$(".chooseActions li")
			    	for(var i=0;i<lis.length;i++){
						var cb=$(lis[i]).find(".actionSelect");
						if(cb.hasClass("select")){
							var actionId=$(lis[i]).find(".actionSelect").attr("actionId");
							layer.close($(".chooseActions").attr("actionIndex"));
							ExistInTodoOrNot(obj,pass,actionId,_input,layerOffsetParam,callBack);
							break;
						}
					}
			    },
			    btn2:function(){
				  	_input.prop("disabled",false).select();						  		
			    },
			    area: ['280px','200px'], //宽高
			    content: $(".chooseActions"),
			    success: function(layero, index){
			    	$(".chooseActions").attr("actionIndex",index).find("li").remove();
	    			for(var i=0;i<actionsArr.length;i++){
	    				var li=$("<li><p class='actionSelect' actionId='"+actionsArr[i].id+"'></p>"+actionsArr[i].name+"</li>");
	    				$(".chooseActions").append(li);
	    			}
			    },
			  	cancel:function(layero,index){
			  		_input.prop("disabled",false).select();						  		
			  	}
			});
		}
	}	
}
/*
   
   * 判断是否在待办列表中存在
   * 参数1：对应的那条Task
   * 参数2：代收码
   * 参数3：actionId
   * 参数4：输入框元素
   * 参数5：各种弹出框的位置
   * 参数6：回调函数
   * */
function ExistInTodoOrNot(obj,pass,actionId,_input,layerOffsetParam,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var id=obj.id;
	if(id!=""&&$("."+mobile+"todo_detail #"+id).size()!=0){
		$("#"+id).css({"display":"none"});
		$("#"+id).insertBefore($("."+mobile+"todo_detail").find("li").first());
		$("#"+id).slideDown("fast",function(){
			handleApi(obj,pass,actionId,_input,layerOffsetParam,callBack);
		});
	}else{
		handleApi(obj,pass,actionId,_input,layerOffsetParam,callBack);
	}
}
/*
   
   * 调一键办理接口办理
   * 参数1：对应的那条Task
   * 参数2：代收码
   * 参数3：actionId
   * 参数4：输入框元素
   * 参数5：各种弹出框的位置
   * 参数6：回调函数
   * */
function handleApi(obj,pass,actionId,_input,layerOffsetParam,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var id=obj.id;
	var name=obj.process.name;
	var isfalse=true;
	var returnMessage="";
	var thingCode="";
	Global.isScanDoing=true;
	var handleNowIndex=layer.msg("<p>正在办理"+name+"，请稍后.....</p>",{
		icon: 16,
		skin:'dialog_doingNow',
		offset:layerOffsetParam.handleOffset,
		time:0,
		shade: [0.3, '#000'],
		area:['300px','150px']
	},function(){
		if(isfalse){
			playAfterHandle(obj,callBack);
			var n = $("."+mobile+"finishedInfo").noty({
				text:"办理完成！",
				type:"alert",
				timeout:5000,
				maxVisible: 4,
				callback:{
					onShow:function(){
						$("."+mobile+"finishedInfo").css("display","block");
					},
					afterClose:function(){
						if($("."+mobile+"finishedInfo").find("ul").find("li").length==0){
							$("."+mobile+"finishedInfo").css("display","none");
						}
					}
				}
			});
			if(returnMessage!="success"){
				var finishIndex=layer.alert("<p>"+returnMessage+"</p>",{
					skin:'dialog_describe',
					time:0,
					btn:["关闭"],
					shade: [0.3, '#000'],
					success:function(layero,index){
					},
					cancel:function(layero,index){
				  	}
				},function(){
					layer.close(finishIndex);
				})
			}
		}else{
			Global.isScanDoing=false;
			scanShowError(returnMessage,_input);
		}

	});
	
	thingCode=$.cookie("thingCode");
	var data={};
	if(obj.assignUser&&obj.assignUser.id==Global.userId){
		data={
			actionId:actionId,
			thing:thingCode
		}
	}else{
		data={
			actionId:actionId,
			thing:thingCode,
			pass:pass
		}
	}
	var headers = {};
	headers['RequestVerificationCSRFToken'] = Global.CSRFToken;
	$.ajax({
		type:"get",
		url:Global.contentpath+"api/task/"+id,
//		url:Global.resSys+"/json/fastHandle.json",
		headers: headers,
		data:data,
		success:function(response){
			if(response.errno==0){
				returnMessage=response.error;
				layer.close(handleNowIndex);
			}else{
				isfalse=false;
				returnMessage="一键办理出错！";
				layer.close(handleNowIndex);
			}
			_input.val("").prop("disabled",false).focus();
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
          	scanShowError("一键办理出错",_input);
       	}
	});
}
/*
 
 * 办理好之后的页面操作
 * 参数1：对应的那条task
 * 参数2：回调函数
 * 
 * */
function playAfterHandle(obj,callBack){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var id=obj.id;
	var arr=[];
	arr.push(obj);
	var dataJson={
		"finished":arr
	}
	if(id!=""&&$("."+mobile+"todo_detail #"+id).size()!=0){
		var img=$("<img src='"+Global.resSys+"/images/finished.png' class='scan_finished_pic'/>");
		$("."+mobile+"todo_detail #"+id).append(img);
		setTimeout(function(){
			var _this=$("#"+id);
			var scrollTop=$(window).scrollTop();
			var flyImg=$("."+mobile+"todo_detail #"+id).find(".scan_finished_pic");
			var bag=$("."+mobile+"scan_title li").eq(1);
			flyImg.css({width:"30px",height:"30px",zIndex:"10000000000000000",borderRadius:"50%"});
			flyImg.fly({
				start:{
					left:flyImg.offset().left,
					top:flyImg.offset().top-scrollTop
				},
				end:{
					left:bag.offset().left+bag.width()*3/5,
					top:bag.offset().top-scrollTop+bag.height()/2,
					width:0,
					height:0
				},
				vertex_Rtop:0,
				speed:0.7,
				onEnd:function(){
					flyImg.remove();
					_this.slideUp("fast",function(){
						callBack(dataJson,$("."+mobile+"done_detail"),"before");
						_this.remove();
						showByNum();
						Global.isScanDoing=false;
						if(Global.isKeepAlive&&Global.isKeepAlive==true){
							getThingTodo(pcCreatLi,true);
							Global.isKeepAlive==false;
						}
					});
				}
			})
		},100)
	}else{
		callBack(dataJson,$("."+mobile+"done_detail"),"before");
		showByNum();
	}
}



/*
   
   * 错误信息的提示
   * 参数1:错误信息内容
   * 参数2：绑定错误信息的元素
   * */
function scanShowError(content,ele){
	//$("#scan_section_code").prop("disabled",false).select();
	ele.prop("disabled",false).select();
	layer.tips("<p>"+content+"</p>",ele, {
	  	tips: [1, 'rgb(221,1,63)'],
	  	tipsMore:false,
	  	shift:6,
	  	time:0,
	  	skin:"errorTips",
	  	success:function(layero,index){
	  		ele.attr("errorIndex",index);
	  		$(".errorTips").click(function(){
				layer.close(ele.attr("errorIndex"));
	  		})
	  		$(".errorTips").find("a.doneUrl_a").click(function(event){
	  			event.stopPropagation();
	  		})
	  	}
	});
}


//判断代收物品和已收物品的数量来决定视图的显示
function showByNum(){
	if(IsPC()){
		var mobile="";
	}else{
		var mobile="mobile_";
	}
	var todoNum=$("."+mobile+"todo_detail").find("li").size();
	var doneNum=$("."+mobile+"done_detail").find("li").size();
	if(todoNum!=0){
		$("."+mobile+"todoCount").html(todoNum).css("display","inline-block");
		$("."+mobile+"noTodo").css("display","none");
	}else{
		$("."+mobile+"todoCount").html(todoNum).css("display","none");
		$("."+mobile+"noTodo").html("您现在没有等待收取的物品").css("display","block");
	}
	if(doneNum!=0){
		$("."+mobile+"doneCount").html(doneNum).css("display","inline-block");
		$("."+mobile+"noDone").css("display","none");
	}else{
		$("."+mobile+"doneCount").html(doneNum).css("display","none");
		$("."+mobile+"noDone").html("您还未收取物品").css("display","block");
	}
}



//---------------------------------------------扫码end----------------------------------------------

function trim(str){   
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');   
}