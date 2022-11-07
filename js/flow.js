(function(){
	window.templateBind = function(){};
	window.endingRender = function(){};
	window.template = function( selector , template , params ){
		if(!selector) 
			selector = Global.contentSelector;
		if(!template) 
			template = Global.templateSelector;
		if(!params){
			params = {};
		}
		$(selector).html(_.template($(template).html() , params) );
		$('.search-input').val( Global.query.searchText );
		$(".scan_search").val(Global.query.searchText).select();
		$('[carousel]').tinycarousel({
			interval : true,
			intervalTime : 9000
		});
		$('.easy-pie-chart').easyPieChart({size:40});
		
//		$('.rateit').rateit();
		
		$(".banner").slide({
			mainCell : ".pic",
			effect : "fold",
			autoPlay : true,
			delayTime : 600,
			trigger : "click",
			autoPage : true,
			titCell : ".hd ul"
		});
		TouchSlide({
			slideCell : "#slideBox",
			titCell : ".hd ul",
			mainCell : ".bd ul",
			effect : "leftLoop",
			autoPage : true
		});
		$('img[data-url]').each(function(){
			var normal = $(this).attr('src');
			var dataUrl = $(this).attr('data-url');
			function setParam(uri, key, val) {
			    return uri
			        .replace(new RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"), "&"+key+"="+encodeURIComponent(val))
			        .replace(/^([^?&]+)&/, "$1?");
			}
			if(Global.locale){
				dataUrl = setParam( dataUrl ,"locale" , Global.locale);
			}
			var dataName = $(this).attr('data-name');
			var loaded = $.cookie('FILTER_NOT_FOUND_IMG') || {};
			if(!loaded[dataName]){
				$(this).attr('src' , dataUrl);
			}
			$(this).error(function(){
				errorOnGetTypeIcon( this , dataName , normal);
			});
		});
		$('[navtap]').removeClass('active');
		$("[navtap="+Global.pathName+"]").addClass('active');
		//$('title').text(Global.titleMap[Global.hash || Global.pathName]);
		document.title = Global.titleMap[Global.hash || Global.pathName];
		FLOW.pagination(Global.dataName);
		endingRender();
		if(Global.scrollTop){
			window.scroll(0,0);
		}
		var count = 1;
		$.map( Global.selectorMap , function( action , selector){
			$( selector ).bind( action ,function(event){
				if($(this).is('a') || $(this).find('>a').is('a')){
					event.preventDefault();
				}
			});
			if(count == 1){
				window.templateBind();
			}
			$( selector ).bind( action ,function(event){
				if(action == "keydown" && event.keyCode != 13) return;
				FLOW.change();
				window.template( Global.contentSelector , Global.templateSelector , {});
			});
			count++;
		});
	};
	
	window.FLOW = {
		init : function( _property , _path , afterSuccess ){
			$.map( Global.apiMap , function( property , path  ){
				if(!_property || _property == property){
					var searchText = Global.query.searchText;
					//Global.filterSearch为了给事项归类查询
					if(Global.filterSearch){
						if(searchText){
							searchText = searchText +","+Global.filterSearch;
						} else {
							searchText = Global.filterSearch;
						}
						
					}
					var keyword = '&keyword='+ searchText;
					if(!searchText){
						keyword = "";
					}
					if(keyword){
						keyword = encodeURI( decodeURI(keyword) );
					}
					var order="";
					if(Global.order){
						order="&order="+Global.order;
					}
					var unread="";
					if(Global.query.unread){
						unread="&unread="+Global.query.unread;
					}
					path = path.replace('limit=%s','limit='+Global.query.limit)
							.replace('start=%s','start='+Global.query.start).replace('&keyword=%s',keyword).replace("&order=%s",order).replace("&unread=%s",unread);
					if(Global.query.department){
						path += path.indexOf('?')>-1 ? "&" : "?" ;
						path += "department="+Global.query.department;
					}
					path = _path ? _path : path;
					if(path.indexOf('%s') < 0){
						Global.isLoading = true;
						if(Global.contentpath.indexOf(";jsessionid")>-1){
							Global.contentpath=Global.contentpath.split(";jsessionid")[0];
						}
						$.ajax({
							type : "post",
							url : Global.contentpath +  path,
							data : Global.query.data ? Global.query.data : {},
							dataType : "json",
							success : function( response ) {
								if($.isFunction(afterSuccess)){
									afterSuccess(response);
								}
								if(property == Global.dataName){
									Global.isLoading = false;
								}
								if (response.errno != 0&&!response.entities) {
									showError(response.error);
								}
								if(response.errno == 0 || (Global.errorLevel && Global.errorLevel == "warn")||response.entities){
									Global[property] = response.entities;
									Global['dataLength'][property] = response.total;
									//通用过滤器 start
									if($.isFunction(window.doFilter)){
										doFilter();
									}
									//通用过滤器end
									window.FLOW.change();
									
									template( Global.contentSelector );
								}
								
							},
							error : function(xhr, error) {
							}
						});
					}
				}
			});
		},
		parse : function( data ){
			if($.type( data ) != 'string'){
				return data;
			}else{
				return JSON.parse(Base64.decode( data ));
			}
		},
		change : function( options ){
			window.globalMap = {};
			var apps = this.parse( Global.apps );
			var prevChoosenTag = $.cookie('prev_choosen_tag');
			Global.query.choosenTag = (Global.query.choosenTag || prevChoosenTag || Global.defaultTags.ALL);
			var choosenTag = Global.query.choosenTag || Global.defaultTags.ALL;
			var searchText = $('.search-input').val();
			Global.query.searchText = searchText;
			var _apps = [] , tags = [] , recommends = [] , departments = [] , favorites = [] , searchHistories = [] , tagApps = {} 
				,_tagApps = {}, collects = $.cookie('COLLECT') || {},histories = $.cookie('search_cookie') || {};
			if(!$.isEmptyObject(apps)){
				tags = [Global.defaultTags.ALL , Global.defaultTags.COLLECT ];
			}
			
			var highestApp;
			
			$.each( apps , function( index , app){
				
				FLOW.resetApp( app );
				
				if (!$.trim(app.tags)){
					app.tags = "基础服务";
				}
				if(!app.recommend){
					app.recommend = 0;
				}
				
				app.favorite = false;
				app.palette = app.palette || Global.app.palette;
				
				if (app.department) {
					var departmentArr=app.department.split(",");
					for(var i=0;i<departmentArr.length;i++){
						if ($.inArray(departmentArr[i], departments) < 0) {
							departments.push(departmentArr[i]);
						}
					}
					
				}
				
				var splitTag = app.tags.split(',')[0];

				if ($.inArray( splitTag , tags) < 0) {
					tags.push( splitTag );
				}
				
				var isVisible = (choosenTag == splitTag || choosenTag == Global.defaultTags.ALL 
						|| choosenTag == Global.defaultTags.COLLECT ) 
						&& (!searchText || app.name.indexOf(searchText) > -1||(app.department||"").indexOf(searchText) > -1);
				if($.isFunction( Global.appVisible )){
					isVisible = Global.appVisible( app );
				}
				
				if( isVisible ){
					_apps.push(app);
					if(collects){
						$.map(collects, function(index, key) {
							if (app.id == key) {
								app.favorite = true;
								favorites.push(app);
							}
						});
					}
					if(choosenTag == Global.defaultTags.COLLECT){
						tagApps[choosenTag] = {
							apps : favorites
						};
					}else{
						if(tagApps[choosenTag]){
							tagApps[choosenTag].apps.push(app);
						}else{
							tagApps[choosenTag] = {
								apps : [app]
							};
						}
					}
					if(choosenTag != Global.defaultTags.ALL){
						_tagApps = tagApps;
					}else{
						if(_tagApps[splitTag]){
							_tagApps[splitTag].apps.push(app);
						}else{
							_tagApps[splitTag] = {
								apps : [app]
							};
						}
					}
					FLOW.Array.sort( tagApps[choosenTag].apps );
					if(_tagApps[choosenTag]){
						FLOW.Array.sort( _tagApps[choosenTag].apps );
					}
				}
				
				if(!highestApp && app.rating){
					highestApp = app;
				}
				
				if(highestApp && highestApp.rating && highestApp.rating < app.rating){
					highestApp = app;
				}
				
				if (app.recommend && app.recommend > 0) {
					recommends.push(app);
					recommends.sort(function(a, b) {
						return b.recommend - a.recommend;
					});
				}
				
			});
			
			globalMap.tags = tags;
			
			if(recommends.length == 0 && highestApp){
				recommends.push( highestApp );
			}
			globalMap.recommends = recommends;
			
			globalMap.favorites = favorites;
			globalMap.searchHistories = histories;
			globalMap.apps = _apps;
			globalMap.tagApps = tagApps;
			globalMap._tagApps = _tagApps;
			globalMap.collects = collects;
			globalMap.departments = departments;
			
			var processes = this.parse( Global.processes );
			var todos = this.parse( Global.todos );
			var _meTodos = [] , _auditingTodos = [] , _topTodos = [] ,_todos = [], sticks = $.cookie('STICKS') || {};
			var actionSearch = false;
			
			var pageSearch = false;
			
			$.each( todos , function(index , todo){
				
				if($.isFunction(Global.pageSearch)){
					pageSearch = Global.pageSearch(todo);
				}
				
				if(Global.query.actionSearch){
					actionSearch = ((todo.process.tags || "").indexOf(Global.query.actionSearch) > -1 
							 || todo.process.entry == Global.query.actionSearch 
							 || todo.name == Global.query.actionSearch);
				}
				if ( !searchText || (todo.process.name || "").indexOf(searchText) > -1
						|| todo.process.entry == searchText	|| actionSearch || pageSearch){
					var appDepartment = todo.process.app ? todo.process.app.department : "";
					if(!Global.query.department || (appDepartment||"").indexOf(Global.query.department) > -1){
						todo.stick = false;
						if(sticks){
							$.map(sticks, function(index, key) {
								if (todo.id == key) {
									todo.stick = true;
									_topTodos.push(todo);
								}
							});
						}
						if(!todo.stick){
							if(todo.process.owner && todo.process.owner.id == Global.userId){
								_meTodos.push( todo );
							}else{
								_auditingTodos.push( todo );
							}
						}
						_todos.push( todo );
					}
				} 
				todo.process.__tags = [];
				if(todo.process.tags){
					todo.process.__tags = _.escape(todo.process.tags).split(",");
				}
				if ( todo.process.app ) {
					FLOW.toggleValue( "apps" , "id" , todo.process.app.id , function( app ){
						if(app.assignCount){
							app.assignCount++;
						}else{
							app.firstAssignUri = todo.uri;
							app.firstAssignTime = todo.assignTime;
							app.assignCount=1;
						}
						if(todo.process.owner &&  Global.userId == todo.process.owner.id && todo.assignTime < app.firstAssignTime && todo.uri ){
							app.firstAssignUri = todo.uri;
							app.firstAssignTime = todo.assignTime;
						}
						return app;
					});
				}
				
				if(processes && processes.length > 0 && todo.process.id == processes[0].id){
					processes[0].actions = todo.actions;
					processes[0].taskId = todo.id;
				}
				
				
			});
			Global.query.actionSearch = "";
			$.each( [_meTodos,_auditingTodos,_topTodos,_todos] , function( i , __TODOS ){
				if(__TODOS && !Global.noStick){
					__TODOS.sort(function(a,b){
						if(a.stick>b.stick)
							return -1;
						else if(a.stick<b.stick)
							return 1;
						else return 0;
					});
				}
			});
			
			
			globalMap._todos = _todos;
			globalMap.todos = todos;
			
			globalMap.meTodos = _meTodos;
			globalMap.auditingTodos = _auditingTodos;
			
			
			globalMap.topTodos = _topTodos;
			globalMap.sticks = sticks;
			
			globalMap.processes = processes;
			
			var doings = this.parse( Global.doings );
			globalMap.doings = doings;
			
			var dones = this.parse( Global.dones );
			globalMap.dones = dones;
			
			var completeds = this.parse( Global.completeds );
			globalMap.completeds = completeds;
			
			var ccs = this.parse( Global.ccs );
			globalMap.ccs = ccs;
			
			var im = this.parse( Global.im );
			globalMap.im = im;
			
			var unrates = this.parse( Global.unrates );
			globalMap.unrates = unrates;
			
			var merges = this.parse( Global.merges );
			globalMap.merges = merges;
			
			var mergeTodos = this.parse( Global.mergeTodos );
			globalMap.mergeTodos = mergeTodos;
			
			var myApplies = this.parse( Global.myApplies );
			globalMap.myApplies = myApplies;
			
			var apply = this.parse( Global.apply );
			globalMap.apply = apply;
			
			var approval = this.parse( Global.approval );
			globalMap.approval = approval;
			
			var applied = this.parse( Global.applied );
			globalMap.applied = applied;
			
			var approvaled = this.parse( Global.approvaled );
			globalMap.approvaled = approvaled;
			
			var entrustTodos = this.parse( Global.entrustTodos );
			globalMap.entrustTodos = entrustTodos;
			
			$.each( [ globalMap.merges ,globalMap.mergeTodos , globalMap.completeds , globalMap.ccs , globalMap.dones , globalMap.auditingTodos] , function( i , __Array ){
				if(__Array && Global.personal){
					__Array.sort(function(a,b){
						return b.update - a.update;
					});	
				}
			});
			
		},
		
		resetApp : function( app ){
			app.firstAssignUri = "";
			app.firstAssignTime = 0;
			app.assignCount=0;
		},
		
		prevChoosenTag : function( unable ){
			if(!unable){
				$.cookie('prev_choosen_tag', Global.query.choosenTag, {
					expires : 60 , path: '/'
				});
			}else{
				$.cookie('prev_choosen_tag' , null);
			}
		},
		toggleValue : function( modelName , property , value , handleValue ){
			
			var model;
			if(globalMap[modelName]){
				for(var m in globalMap[modelName]){
					if(globalMap[modelName][m] && globalMap[modelName][m][property] == value){
						model = globalMap[modelName][m];
						if(model){
							return (globalMap[modelName][m] = handleValue(model));
						}
					}
				}
			}
		},
		go : function( callback ){
			//var hash = window.location.hash.replace('#','');
			var hash = Global.hash || Global.pathName;
			if(window.Global.hashMap[hash]){
				Global.templateSelector = "#"+Global.hashMap[hash];
			}
			if($.isFunction(callback)){
				callback();
			}
		},
		rapidCc:{
			toggle:function(ccIdentity){
				if(Global.rapidCc.checked[ccIdentity]){
					Global.rapidCc.checked[ccIdentity] = false;
				}else{
					Global.rapidCc.checked[ccIdentity] = true;
				}
				var chooseCount=0;
				var ccList=$.grep(globalMap.ccs,function(item){
					if(item.read&&item.read>item.ccCreate){
						return false;
					}
					return true;
				});
				_.each(ccList,function(item){
					if(Global.rapidCc.checked[item.id]){
						chooseCount++;
					};
				})
				if(chooseCount==ccList.length){
					Global.rapidCc.chooseAll=true;
				}else if(chooseCount<ccList.length&&chooseCount>0){
					Global.rapidCc.chooseAll="center";
				}else if(chooseCount==0){
					Global.rapidCc.chooseAll=false;
				}
			},
			chooseAllToggle:function(ccChooseStatu){
				var ccList=$.grep(globalMap.ccs,function(item){
					if(item.read&&item.read>item.ccCreate){
						return false;
					}
					return true;
				});
				if(ccChooseStatu=="true"){
					_.each(ccList,function(item){
						var exit=false;
						for(key in Global.rapidCc.checked){
							if(item.id==key){
								exit=true;
								break;
							}
						}
						if(!exit||Global.rapidCc.checked[item.id]==false){
							Global.rapidCc.checked[item.id]=true;
						}
					})
					Global.rapidCc.chooseAll=true;
				}else if(ccChooseStatu=="false"){
					_.each(ccList,function(item){
						Global.rapidCc.checked[item.id]=false;
					})
					Global.rapidCc.chooseAll=false;
				}else if(ccChooseStatu=="center"){
					_.each(ccList,function(item){
						Global.rapidCc.checked[item.id]=false;
					})
					Global.rapidCc.chooseAll="center";
				}
			},
			doCc:function(afterSuccess){
				var loading=$("<div class='loadingContainer' style='position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1040;background:rgba(0,0,0,.5);'><div class='loading_inner' style='color: #e8e8e8;font-size: 16px;height: 100%;display: flex;align-items: center;justify-content: center;'><img src='"+Global.resSys+"/images/loading-2.gif' style='margin-right:10px'>正在标记，请稍等...</div></div>")
				$(document.body).append(loading);
				var ccIdStr="";
				var ccIdStrArr=[];
				var ccIdArr=[];
				for(key in Global.rapidCc.checked){
					if(Global.rapidCc.checked[key]){
						ccIdArr.push(key);
					}
				}
				//如果超出最大长度，则分段去查询
				var maxLength=50;
				if(ccIdArr.length<=maxLength){
					for(var i=0;i<ccIdArr.length;i++){
						ccIdStr=ccIdStr+ccIdArr[i]+",";
					}
					ccIdStr = ccIdStr.substr(0, ccIdStr.length - 1);
					ccIdStrArr.push(ccIdStr);
				}else{
					var forCount=Math.ceil(ccIdArr.length/maxLength);
					for(var j=0;j<forCount;j++){
						ccIdStr="";
						var start=j*maxLength;
						var end=(j+1)*maxLength;
						if(ccIdArr.length<end){
							end=ccIdArr.length;
						}
						for(var i=start;i<end;i++){
							ccIdStr=ccIdStr+ccIdArr[i]+",";
						}
						ccIdStr = ccIdStr.substr(0, ccIdStr.length - 1);
						ccIdStrArr.push(ccIdStr);
					}
				}
				var successCount=0;
				for(var i=0;i<ccIdStrArr.length;i++){
					$.ajax({
						type: "POST",
						url: Global.contentpath+'api/process/' + ccIdStrArr[i],
						data: {"action":"read"},
						success: function(json){
							if(json && json.errno==0 ){
								successCount=successCount+1;
								if(successCount==ccIdStrArr.length){
									Global.rapidCc.chooseAll=false;
									Global.rapidCc.checked={};
									$(".loadingContainer").remove();
									TCUtils.alert("已标记为已读！");
									window.FLOW.init( "ccs" );
									if($.isFunction(afterSuccess)){
										afterSuccess();
									}
								}
							}else{
								$(".loadingContainer").remove();
								if (json.error && json.error == "用户信息失效，请重新登录！") {
									showErrorToReload(json.error);
								} else {
									TCUtils.alert("标记为已读过程中出现异常！");
								}
								
							}
						},
						error:function(xhr,error){
						}
					});
				}
				
			}
		},
		rapidHandle : {
			toggle : function( todoIdentity ){
				if(Global.rapidHandle.checked[todoIdentity]){
					Global.rapidHandle.checked[todoIdentity] = false;
				}else{
					Global.rapidHandle.checked[todoIdentity] = true;
				}
				
				var length = 0;
				Global.rapidHandle.actions = {};
				$.each(Global.rapidHandle.checked , function( id , checked ){
					if(checked){
						length++;
						var model = FLOW.toggleValue( "todos" , "id" , id , function( todo ){
							return todo;
						});
						if(model && model.actions && model.actions.length > 0){
							for(var i in model.actions){
								var idName = model.actions[i].id + trim(model.actions[i].name);
								if( Global.rapidHandle.actions[idName] ){
									Global.rapidHandle.actions[idName].size += 1;
								}else{
									Global.rapidHandle.actions[idName] = {
										name : trim(model.actions[i].name), size : 1 , model : model , id : model.actions[i].id
									}
								}
							}
						}
					}
				});
				Global.rapidHandle.length = length;
				Global.rapidHandle.names = {};
				$.each( Global.rapidHandle.actions , function( key ,value ){
					if(value && value.size == length){
						Global.rapidHandle.names[trim(value.name)] = value;
					}
				});
			},
			start : function(){
				Global.rapidHandle.isFinshed=false;
				$('.modal-qh').html(  _.template(  $('#modalTemplate').html() , {}) );
				console.log($('.modal-qh'));
				$('.modal-qh .modal').modal('show');
				$('.modal-qh .input-remark span').click(function(){
					if($('.modal-qh .textarea-remark').is(':visible')){
						$('.modal-qh .textarea-remark').hide();
					}else{
						$('.modal-qh .textarea-remark').show();
					}
				});
				var count = 0;
				$('.modal-qh .modal-submit').click(function(){
					if($.isFunction(window.doWait)){
						doWait();
					}
					setTimeout(function(){
						Global.rapidHandle.remark = $('.modal-qh .textarea-remark').val();
						var onAction = Global.rapidHandle.names[Global.rapidHandle.onAction];
						$.each(Global.rapidHandle.checked , function( id , checked ){
							if(checked){
								var headers = {};
								headers['RequestVerificationCSRFToken'] = Global.CSRFToken;
								$.ajax({
									async: false, 
									type: "POST",
									headers: headers,
									url: Global.contentpath+'api/task/' + id,
									data: { "actionId" : onAction.id ,"remark": (Global.rapidHandle.remark || "") },
									success: function(json){
										count++;
										if(json && json.errno==0 ){
											delete Global.rapidHandle.checked[id];
										}else{
											if (json.error && json.error == "用户信息失效，请重新登录！") {
												showErrorToReload(json.error);
												return false;
											} else {
												TCUtils.alert("一键办理过程中出现异常！");
											}
											
										}
									},
									error:function(xhr,error){
										count++;
									}
								});
								if(count == Global.rapidHandle.length){
									TCUtils.alert("一键办理完成！");
									$('.modal-qh .modal').modal('hide');
									Global.rapidHandle = { checked : {} , names : {} , actions : {},isFinshed:true};
									window.FLOW.init( "todos" );
								}
							}
						});
					},0)
				});
				$('.modal-qh .modal-remove').click(function(){
					if(count == 0 || !Global.rapidHandle.length || count == Global.rapidHandle.length){
						$('.modal-qh .modal').modal('hide');
						Global.rapidHandle = { checked : {} , names : {} , actions : {},isFinshed:true};
						window.FLOW.init( "todos" );
					}else{
						TCUtils.alert("请等待一键办理完成！");
					}
				});
			}
		},
		rate : function( callback , __success ){
			$('.modal-rate').html(  _.template(  $('#rateTemplate').html() , {}) );
			if($.isFunction(callback)){
				callback();
			}
			$('.bigstars').rateit({
				step : 1
		    });
			$('.bigstars').rateit('value' , Global.rate.rating);
			$('.modal-rate .modal').modal('show');
			
			$('.modal-rate .modal-submit').click(function(){
				var rating = $('.bigstars').rateit('value') || 0;
				if(!$.isNumeric(rating)){
					rating = Global.rate.rating;
				}
				Global.rate.review = $('.modal-rate textarea').val();
				if( rating<=2 && !Global.rate.review){
					TCUtils.alert("评分低于3分请给出评论！");
					return false;
				}
				$.ajax({
					async: false, 
					type: "POST",
					url: Global.contentpath+'api/process/' + Global.rate.id + "?action=rate&rating=" + rating + "&comment=" + encodeURI(Global.rate.review),
					success: function(json){
						if(json && json.errno==0 ){
							$('.modal-rate .modal').modal('hide');
							Global.rate = {};
							window.FLOW.init( "dones" );
							TCUtils.alert("评价成功！");
							if($.isFunction(__success)){
								__success();
							}
						}else{
							if (json.error && json.error == "用户信息失效，请重新登录！") {
								showErrorToReload(json.error);
							} else {
								TCUtils.alert("评价失败！");
							}
							
						}
					},
					error:function(xhr,error){
					}
				});
			});
			$('.modal-rate .modal-remove').click(function(){
				$('.modal-rate .modal').modal('hide');
				Global.rate = {};
				window.FLOW.init( "dones" );
			});
		},
		processLoading : function( id , isLoad , taskIdentity ){
			if(isLoad){
				$.ajax({
					async: false, 
					type: "POST",
					url: Global.contentpath+'api/process/' + id,
					success: function(json){
						if(json.errno != 0) {
							showError(json.error);
						}else{
							var model = FLOW.toggleValue( Global.dataName , "id" , taskIdentity || id , function( data ){
								data.tasks = json.entities[0].tasks;
								data.milestones = json.entities[0].milestones;
								data.opened = true;
								return data;
							});
						}
					},
					error:function(xhr,error){
					}
				});
			}else{
				var model = FLOW.toggleValue( Global.dataName , "id" ,taskIdentity || id , function( data ){
					data.tasks = [];
					data.milestones = [];
					data.opened = false;
					return data;
				});
			}
			
		},
		pagination : function(dataName) {
			var pagenumber =( Global.query.start + Global.query.limit )/Global.query.limit || 1;
			var total = Global['dataLength'][dataName] ? Global['dataLength'][dataName] : 0; 
			total = Global.query.dataLength || total;
			Global.query.Pagination = $("[pagination]").easyPaging( total , {
				page : pagenumber,
				perpage : Global.query.pageSize,
				onSelect : Global.query.onSelect || function(page) {
					$("[pagination] li a").click(function() {
						var page = $(this).attr('data-page');
						Global.query.currentPage = page;
						if (page) {
							Global.query.start = (page-1) * Global.query.limit;
							window.FLOW.init( dataName );
						}
					});
				},
				onFormat : Global.query.onFormat,
				format : Global.query.format
			});
		},
		COLLECT : {
			add : function(element){
				this.toggle( element , false);
			},
			remove : function(element){
				this.toggle( element , true);
			},
			toggle : function( element , isDelete){
				if($.type( isDelete ) == 'undefined')
					isDelete = true;
				var id = $(element).attr('app-identity');
				if(globalMap.collects[id] && isDelete){
					delete globalMap.collects[id];
				}else{
					globalMap.collects[id] = true;
				}
				$.cookie('COLLECT', globalMap.collects, {
					expires : 60 , path: '/'
				});
			}
		},
		STICK : {
			add : function(element){
				this.toggle(element,false);
			},
			remove : function(element){
				this.toggle(element,true);
			},
			toggle : function(element , isDelete){
				//待办被办掉之后去掉cookie中的置顶数据
				var todoIdArr=[];
				for(var i=0;i<Global.todos.length;i++){
					todoIdArr.push(Global.todos[i].id);
				}
				var todoIdStr=todoIdArr.toString();
				for(key in globalMap.sticks){
					if(todoIdStr.indexOf(key)<0){
						delete globalMap.sticks[key];
					}
				}
				if($.type( isDelete ) == 'undefined')
					isDelete = true;
				var id = $(element).attr('todo-identity');
				if(globalMap.sticks[id] && isDelete){
					delete globalMap.sticks[id];
				}else{
					globalMap.sticks[id] = true;
				}
				$.cookie('STICKS', globalMap.sticks, {
					expires : 60 , path: '/'
				});
			}
		},
		Array : {
			sort : function( targetArray ){
				targetArray.sort(function(a, b) {
					if(a.ready>b.ready)
						return -1;
					else if(a.ready<b.ready)
						return 1;
					else
						if(a.recommend>b.recommend)
							return -1;
						else if(a.recommend<b.recommend)
							return 1;
						else
							try{
								return a.name.localeCompare(b.name);
							}catch(e){
								if(a.shouzimu>b.shouzimu)
									return -1;
								else if(a.shouzimu<b.shouzimu)
									return 1;
								else 
									return 0
							}
							
				});
				return targetArray;
			}
		},
		remarkOperate:function(entry,status){//设置当前实例优先级高(一般)
			if(confirm("您确定设置当前实例的优先级高(低)吗?")){
				var url = Global.contentpath+"api/processes/mark?id=" + entry + "&status=" + status;
				$.ajax({
					type : "get",
					async : false,
					url :  url,
					success : function(data) {
						if(data.success){
							alert("操作成功");
							toGetItem();
						}else{
							if (data.error && data.error == "用户信息失效，请重新登录！") {
								showErrorToReload(data.error);
							} else {
								alert(data.error);
							}	
						}
					}
				}); 
			}
		},
		resumeOperate:function(entry,status) {//暂停(恢复)当前实例
			if(confirm("您确定暂停(恢复)当前实例吗?")){
				if(status == "killed"){
					alert("当前实例已结束，不能暂停(恢复)!");
				}else if(status == "done" ){
					alert("当前实例已结束，不能暂停(恢复)!")
				}else{
					var url = "";
	 				if(status == "suspended"){
						url = Global.contentpath+"api/processes/resume?id=" + entry + "&status=" + status;
					}else{
						url = Global.contentpath+"api/processes/suspend?id=" + entry + "&status=" + status;
					}
					$.ajax({
						type : "get",
						async : false,
						url :  url,
						success : function(data) {
							if(data.success){
								alert("操作成功");
								toGetItem();
							}else{
								if (data.error && data.error == "用户信息失效，请重新登录！") {
									showErrorToReload(data.error);
								} else {
									alert(data.error);
								}	
							}
						}
					});
				}
			}	
		},
		setResumeOperate:function(resumes,statuses){//批量暂停
			if(resumes.length>0){
			    if(statuses.indexOf("killed")!=-1||statuses.indexOf("done")!=-1){
			    	alert("存在已结束实例，不能暂停(恢复)");
			    	return;
			    }else{
			  		if(confirm("您确定暂停(恢复)这些实例吗?")){
			  			 for(var i=0;i<resumes.length;i++){
			  			 	var status=resumes[i].status;
			  			 	var entry=resumes[i].entry;
			  			 	var url = "";
			 				if(status == "suspended"){
								url = Global.contentpath+"api/processes/resume?id=" + entry + "&status=" + status;
							}else{
								url = Global.contentpath+"api/processes/suspend?id=" + entry + "&status=" + status;
							}
							$.ajax({
								type : "get",
								async : false,
								url :  url,
								success : function(data) {
									if(data.success){
										if(i==resumes.length-1){
											alert("操作成功");
											toGetItem();
										}
									}else{
										if (data.error && data.error == "用户信息失效，请重新登录！") {
											showErrorToReload(data.error);
										} else {
											alert(data.error);
										}	
									}
								}
							});
						}
			  		}
			    }
		    }else{
		    	alert("实例不能为空");
		    }
		},
		killOperate:function(entry,status) {//终止当前实例
			if(status == "killed" ){
				alert("当前实例已结束，不能终止");
				return false;
			}else if(status == "done" ){
				alert("当前实例已结束，不能终止!")
				return false;
			}else{
				var remark=prompt("确定要终止这个实例吗？请输入终止理由：","");
				if(remark==""||remark==null){
					alert("终止理由不能为空!");
				}else if(remark!=null&&remark!=""){
					this.kill_d2(entry,status,remark);
				}
			}
		},
		kill_d2:function(entry,status,remark) {
		    remark=encodeURI(remark);
		    if(remark==""||remark==null){
		    	alert("终止理由不能为空!");
		    	return false;
		    }else{
			   $.ajax({
					type : "get",
					async : false,
					url :  Global.contentpath+"api/processes/kill?id=" + entry + "&status=" + status+"&remark="+remark ,
					success : function(data) {
						if(data.success){
							alert("操作成功");
//							window.location.reload();
							toGetItem();
						}else{
							if (data.error && data.error == "用户信息失效，请重新登录！") {
								showErrorToReload(data.error);
							} else {
								alert(data.error);
							}	
						}
					}
				});
			}
		},
		compensation:function(entry,status) {  //补偿
			if(confirm("您确定补偿当前实例吗?")){
				if(status == "killed" || status == "done"){
					alert("当前实例已结束，不能补偿!"); 
				}else{
					$.ajax({
						type : "get",
						async : false,
						url :  Global.contentpath+"api/processes/compensation?id=" + entry + "&status=" + status ,
						success : function(data) {
							if(data.success){
								alert("操作成功");
							}else{
								if (data.error && data.error == "用户信息失效，请重新登录！") {
									showErrorToReload(data.error);
								} else {
									alert(data.error);
								}
							} 
						}
					});
				}
		   		
			}	
		},
		archive:function(entry ,status) {//归档
			if(status == "doing" ){
				alert("当前实例在进行中，不能删除!");
			}else if(status == "suspended" ){
				alert("当前实例已暂停，不能删除!")
			}else{
			    var remark=prompt("确定要删除这个实例吗？请输入删除理由：","");
				if(remark==""||remark==null){
					alert("删除理由不能为空!");
				}else if(remark!=null&&remark!=""){
					this.delete_d(entry,status,remark);
				}
			} 
		},
		delete_d:function(entry,status,remark) {
		    remark=encodeURI(remark);
		    if(remark==""||remark==null){
		    	alert("删除理由不能为空!");
		    	return false;
		    }else{
			    $.ajax({
					type : "get",
					async : false,
					url : Global.contentpath+"api/processes/archive?id=" + entry + "&status=" + status +"&remark="+remark,
					success : function(data) {
						if(data.success){
							alert("操作成功");
							toGetItem();
						}else{
							if (data.error && data.error == "用户信息失效，请重新登录！") {
								showErrorToReload(data.error);
							} else {
								alert(data.error);
							}
						}
					}
				}); 
			}
		},
		setKillOperate:function(kills,statuses){//批量kill
		    if(kills.length>0){
			    if(statuses.indexOf("killed")!=-1||statuses.indexOf("done")!=-1){
			    	alert("存在已结束实例，不能终止");
			    	return;
			    }else{
			  		var remark=prompt("确定要终止这些实例吗？请输入终止理由：","");
					if(remark==""||remark==null){
						alert("终止理由不能为空!");
					}else if(remark!=null&&remark!=""){
						this.kill_d(kills,remark);
					}
			    }
		    }else{
		    	alert("实例不能为空");
		    }
		},
		kill_d:function(kills,remark) {
		    remark=encodeURI(remark);
		    if(remark==""||remark==null){
		    	alert("终止理由不能为空!");
		    	return false;
		    }else{
			    for(var i=0;i<kills.length;i++){
				    $.ajax({
						type : "get",
						async : false,
						url:Global.contentpath+"api/processes/kill?id=" + kills[i].entry + "&status=" + kills[i].status+"&remark="+remark,
						success : function(data) {
							if(data.success){
								if(i==kills.length-1){
									alert("操作成功");
									toGetItem();
								}
							}else{
								if (data.error && data.error == "用户信息失效，请重新登录！") {
									showErrorToReload(data.error);
								} else {
									alert(data.error);
								}
							}
						}
					});
				}
			}
		},
		batchCompensation:function(comArr,statuses){//批量补偿
			if(confirm("您确定补偿当前实例吗?")){
			    if(comArr.length>0){
				    if(statuses.indexOf("killed")!=-1||statuses.indexOf("done")!=-1){ 
				    	alert("当前实例已结束，不能补偿!");
				    }else{
				 	  	for(var i=0;i<comArr.length;i++){
					 	  	$.ajax({
								type : "get",
								async : false,
								url : Global.contentpath+"api/processes/compensation?id=" + comArr[i].entry + "&status=" + comArr[i].status ,
								success : function(data) {
									if(data.success){
										if(i==comArr.length-1){
											alert("补偿成功");
										}
									}else{
										if (data.error && data.error == "用户信息失效，请重新登录！") {
											showErrorToReload(data.error);
										} else {
											alert(data.error);
										}
									}
								}
							});
				 	    } 
				 	}
				} 
			}
		},
		//撤回
		withdraw:function(stepId,status) {//撤回
			if(status==2){
				status="done";
			}else if(status==1){
				status="doing";
			}
			if(confirm("您确定撤回当前实例吗?")){
				$.ajax({
					type : "get",
					async : false,
					url : Global.contentpath+"api/processes/withdraw?id=" + stepId + "&status=" + status ,
					success : function(data) {
						if(data.success){
							alert("操作成功");
							toGetItem();
						}else{
							if (data.error && data.error == "用户信息失效，请重新登录！") {
								showErrorToReload(data.error);
							} else {
								alert(data.error);
							}
						}
					}
				});
			}
		}
		
	};
})(window);


