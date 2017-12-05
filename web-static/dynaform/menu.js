var LOADPAGETYPE = "page";
var LOADHELPTYPE = "help";
var HELP_TIP_ID = "helpNullTip";
var MEMU_LEAF = "leaf";
var gLoadType = LOADPAGETYPE;
var TOTALLEVEL = 4;
var LoadPageIndex = {init:function(){
						this.stageMenu0 = -1;
						this.stageMenu1 = -1;
						this.stageMenu2 = -1;
						this.stageMenu3 = -1;
					}};

(function helpLoadPro()
{
	var currentUrl = location.href;
	var mainUrl, urlPara, tmpArr, tmpParaArr, tmpIndex;

	tmpArr = currentUrl.split("#");
	mainUrl = tmpArr[0];
	LoadPageIndex.init();

	if (currentUrl.indexOf("#help") >= 0 && undefined != tmpArr[1] && tmpArr[1].length != 0)
	{
		urlPara = tmpArr[1];
		tmpParaArr = urlPara.split("&");

		gLoadType = tmpParaArr[0];
		location.href = mainUrl + "#help";

		for (var i = 1, len = tmpParaArr.length; i < len; i++)
		{
			tmpIndex = tmpParaArr[i].split("=");
			LoadPageIndex[tmpIndex[0]] = tmpIndex[1];
		}
	}
})();

function menuTool_BC()
{
	this.menuOption = {
		menuUlId:"",
		menuConId:"",
		conId:"",
		menuList:{},
		menuClickPreHd:{},
		initCallBack:{},
		menuClickCallBack:{},
		niceScrollStyles:{},
		loadNewPage:true,
		menuLevel:0
	};

	if (typeof menuTool_BC.prototype.init == "undefined")
	{
		menuTool_BC.prototype.init = function(optionObj)
		{
			this.menuOptionInit(optionObj);
			this.menuCreate();
		};

		menuTool_BC.prototype.menuOptionInit = function(optionObj)
		{
			var menuOption = this.menuOption;
			for (var prop in optionObj)
			{
				if (menuOption[prop] != undefined)
				{
					menuOption[prop] = optionObj[prop];
				}
			}
		};

		menuTool_BC.prototype.menuCreate = function()
		{
			var objThis = this;
			var menuOption = this.menuOption;
			var menuUl = id(menuOption.menuUlId);
			var menuObject, li, i, lbl, listScroll, liId;
			var menuList = menuOption.menuList;

			menuUl.innerHTML = "";
			for(var menuObj in menuList)
			{
				menuObject = menuList[menuObj];
				if (menuObject === null)
				{
					continue;
				}

				liId = menuObj.toString();
				li = document.createElement("li");
				li.id = liId;
				li.url = menuObject.url;
				li.className = "menuLi";
				li.onclick = (function(url, liId, type, loadHd){
					return function(){
						objThis.menuClick(url, liId, type, loadHd);
					}
				})(menuObject.url, liId, menuObject.type, menuObject.load);
				li.onmouseover = function(){
					if (this.className == "menuLiClick")
					{
						this.className = "menuLiClick menuLiClickHover";
					}
					else
					{
						this.className = "menuLi menuLiHover";
					}
				};
				li.onmouseout = function(){
					if (this.className.indexOf("menuLiClick") >= 0)
					{
						this.className = "menuLiClick";
					}
					else
					{
						this.className = "menuLi";
					}
				};

				/*i = document.createElement("i");
				i.className = "menuImg " + menuObject.className;
				li.appendChild(i);*/

				lbl = document.createElement("label");
				lbl.innerHTML = menuObject.value;
				lbl.className = "menuLbl";
				li.appendChild(lbl);

				/*i = document.createElement("i");
				i.className = "menuC";
				li.appendChild(i);*/

				menuUl.appendChild(li);
			}

			if (typeof menuOption.initCallBack == "function")
			{
				menuOption.initCallBack(LoadPageIndex["stageMenu" + menuOption.menuLevel]);
			}
			else
			{
				menuUl.childNodes[0].onclick();
			}

			/* 创建niceScroll */
			if (0 != menuOption.menuConId.length)
			{
				listScroll = new NiceScroll(menuOption.menuConId)
				listScroll.scrollTipOpacity(1);
				listScroll.scrollTipSet(menuOption.niceScrollStyles);
				listScroll.init();
				listScroll.scrollTo(0);
			}
		};

		menuTool_BC.prototype.menuLoad = function(url, callBack, loadNewPage, type)
		{
			var menuOption = this.menuOption;
			var pageCon = id(menuOption.conId);

			if (isIESix == true)
			{
				pageCon.style.height = "";
			}

			if (true == loadNewPage)
			{
				var tmp = url.split(".");

				pageCon.innerHTML = "";

				if (gLoadType == LOADHELPTYPE)
				{
					if (null != id(tmp[0]))
					{
						pageCon.innerHTML = id(tmp[0]).outerHTML;
					}
					else
					{
						if (type == MEMU_LEAF)
						{
							pageCon.innerHTML = id(HELP_TIP_ID).outerHTML;
						}
						else
						{
							loadPage(url, menuOption.conId, function(){
								typeof callBack == "function" && callBack(url);
							});
						}
					}
				}
				else
				{
					loadPage(url, menuOption.conId, function(){
						typeof callBack == "function" && callBack(url);
					});
				}
			}
			else
			{
				typeof callBack == "function" && callBack(url);
			}
		};

		menuTool_BC.prototype.menuClick = function(url, objId, type, loadHd)
		{
			var menuOption = this.menuOption;
			var menuClickCallBack = menuOption.menuClickCallBack;
			var subLi = id(menuOption.menuUlId).childNodes;
			var subLiObj, targetLi;
			var loadNewPage = true;
			var menuClickPreHd = menuOption.menuClickPreHd;
			var noLiNum = 0;

			for (var i = 0, j = subLi.length; i < j; i++)
			{
				subLiObj = subLi[i];
				if (subLiObj.nodeType != 1 || subLiObj.tagName.toLowerCase() != "li")
				{
					noLiNum++;
					continue;
				}

				if (subLiObj.id == objId)
				{
					subLiObj.className = "menuLiClick";
					targetLi = subLiObj;

					if (gLoadType == LOADPAGETYPE)
					{
						LoadPageIndex["stageMenu" + menuOption.menuLevel] = i - noLiNum;
						for (var k = menuOption.menuLevel + 1; k < TOTALLEVEL; k++)
						{
							LoadPageIndex["stageMenu" + k] = -1;
						}
					}
					else
					{
						LoadPageIndex["stageMenu" + menuOption.menuLevel] = -1;
					}
				}
				else
				{
					subLiObj.className = "menuLi";
				}
			}

			/* 如果在menuClick之前的处理函数返回的是false，则直接退出 */
			if ((targetLi != undefined) && (typeof menuClickPreHd != "function" || true == menuClickPreHd({url:url, id:objId, load:loadHd})))
			{
				if (menuOption.loadNewPage === false)
				{
					loadNewPage = false;
					if (true === menuOption.menuList[objId].loadNewPage)
					{
						loadNewPage = true;
					}
				}
				else if (menuOption.loadNewPage === true)
				{
					loadNewPage = true;
					if (false === menuOption.menuList[objId].loadNewPage)
					{
						loadNewPage = false;
					}
				}

				this.menuLoad(url, function(){
					typeof basicPHAutoFit == "function" && basicPHAutoFit();
					typeof menuClickCallBack == "function" && menuClickCallBack({url:url, id:objId});
				}, loadNewPage, type);
			}
		};
	}
}

/* 一级菜单 */
function menuInit_Basic()
{
	var menuList;
	var basicCon = id("basicCon");
	var menuTool = new menuTool_BC();
	var basicPreviewUrl = "BasicPreview.htm";
	var basicReplayPageUrl = "BasicRePlay.htm";

	if (gLoadType == LOADPAGETYPE)
	{
		LoadPageIndex.init();
	}

	if ($.group == GROUP_GUEST)
	{
		menuList = {
			basic_preview_rsMenu:{
				value:menuStr.preview,
				className:"",
				type:MEMU_LEAF,
				url:basicPreviewUrl
			}
		};
	}
	else
	{
		menuList = {
			basic_preview_rsMenu:{
				value:menuStr.preview,
				className:"",
				type:MEMU_LEAF,
				url:basicPreviewUrl
			},
			basic_review_reMenu:{
				value:menuStr.review,
				className:"",
				type:MEMU_LEAF,
				url:basicReplayPageUrl
			},
			basic_tool_rsMenu:{
				value:menuStr.tool,
				className:"",
				type:MEMU_LEAF,
				url:"",
				load:function(){
					basicCon.innerHTML = '<div class="basicConL">' +
						'<ul id="toolMenuS" class="menuS"></ul>' +
						'</div>' +
						'<fieldset style="overflow-y:auto;">' +
						'<div id="toolCon" class="basicConR1" style="margin-top:16px;margin-right:40px;position:relative;"></div>' +
						'</fieldset>';
					menuInit_Tool_S();
				}
			},
			basic_conf_rsMenu:{
				value:menuStr.configure,
				className:"",
				url:"",
				load:function(){
					basicCon.innerHTML = '<div class="basicConL">' +
											'<ul id="confMenuS" class="menuS"></ul>' +
										'</div>' +
										'<fieldset style="overflow-y:auto;">' +
											'<div id="confCon" class="basicConR1" style="margin-top:16px;margin-right:40px;position:relative;"></div>' +
										'</fieldset>';
					menuInit_conf_S();
				}
			}
		};
	}

	menuTool.init({
		menuUlId:"basicMenuUl",
		conId:"basicCon",
		menuList:menuList,
		menuLevel:0,
		initCallBack:function(index){
			if (index == -1 || undefined == index)
			{
				index = 0;
			}

			gBasicMenuUl.childNodes[index].onclick();
		},
		menuClickPreHd:function(paraObj){
			try
			{
				if (basicPreviewUrl == paraObj.url)
				{
					basicResizeArrRemove("basicPreview");
				}
			}
			catch(ex)
			{}

			/* 如果有加载函数，则直接执行加载函数，不再加载具体的页面 */
			if (typeof paraObj.load == "function")
			{
				paraObj.load();
				return false;
			}
			else
			{
				return true;
			}
		}
	});
}

/* 二级菜单==工具 */
function menuInit_Tool_S()
{
	var toolCon = id("toolCon");
	var menuList = {
		tool_download_rsMenu:{
			value:menuStr.toolDownload,
			className:"",
			url:"",
			load:function(){
				toolCon.innerHTML = '<ul id="toolDownloadUlSSS" class="menuSSS"></ul>' +
									'<div id="toolDownloadCon"></div>';

				menuInit_tool_download_SSS({menuId:"toolDownloadUlSSS", conId:"toolDownloadCon"});
			}
		}/*,
		tool_overline_rsMenu:{
			value:menuStr.overlineCount,
			className:"",
			type:MEMU_LEAF,
			url:"ToolOverLine.htm"
		}*/
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"toolMenuS",
		conId:"toolCon",
		menuList:menuList,
		menuLevel:1,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		},

		menuClickPreHd:function(paraObj){
			if ("tool_download_rsMenu" == paraObj.id)
			{
				if (typeof paraObj.load == "function")
				{
						paraObj.load();
						return false;
				}
			}

			menuToolList[paraObj.id](paraObj.id);
			return false;
		}
	});
}

/* 四级菜单==工具==下载 */;
function menuInit_tool_download_SSS(paraObj)
{
	var menuList = {
		info_tool_download_rsMenu:{
			value:menuStr.toolDownload,
			className:"",
			type:MEMU_LEAF,
			url:"ToolDownload.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 二级菜单==设置 */
function menuInit_conf_S()
{
	var confCon = id("confCon");

	/* 二级菜单==设置 */
	var menuList = {
		conf_camera_rsMenu:{
			value:menuStr.camera,
			className:"",
			url:""
		},
		conf_event_rsMenu:{
			value:menuStr.event,
			className:"",
			url:""
		},
		conf_storage_rsMenu:{
			value:menuStr.storage,
			className:"",
			url:""
		},
		conf_network_rsMenu:{
			value:menuStr.network,
			className:"",
			url:""
		},
		conf_cloud_rsMenu:{
			value:menuStr.cloudService,
			className:"",
			url:"",
			load:function(){

				confCon.innerHTML = '<ul id="confCloudServiceUlSSS" class="menuSSS"></ul>' +
									'<div id="confCloudServiceCon"></div>';
				menuInit_conf_cloud_SSS({menuId:"confCloudServiceUlSSS", conId:"confCloudServiceCon"});
			}
		},
		conf_sys_rsMenu:{
			value:menuStr.system,
			className:"",
			url:""
		}
	};

	/* 三级菜单==摄像头 */
	var menuList_camera = {
		conf_camera_play_rsMenu:{
			value:menuStr.display,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confCameraDisplayUlSSS" class="menuSSS"></ul>' +
									'<div id="confCameraDisplayCon"></div>';
				menuInit_conf_camera_SSS();
			}
		},
		conf_camera_code_rsMenu:{
			value:menuStr.codeStream,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confStreamDisplayUlSSS" class="menuSSS"></ul>' +
									'<div id="confStreamDisplayCon"></div>';
				menuInit_conf_stream_SSS();
			}
		}
	};

	/* 三级菜单==存储 */
	var menuList_storage = {
		conf_sto_video_plan_rsMenu:{
			value:menuStr.videoPlan,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confStorageRecorPlanUlSSS" class="menuSSS"></ul>' +
									'<div id="confStorageRecorPlanCon"></div>';
				menuInit_conf_record_plan_SSS();
			}
		},
		conf_sto_picture_plan_rsMenu:{
			value:menuStr.picturePlan,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confPicturePlanUlSSS" class="menuSSS"></ul>' +
									'<div id="confPicturePlanCon"></div>';
				menuInit_conf_picture_plan_SSS();
			}
		},
		conf_sto_disk_rsMenu:{
			value:menuStr.storageManage,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confStorageStorageUlSSS" class="menuSSS"></ul>' +
									'<div id="confStorageStorageCon"></div>';
				menuInit_conf_storage_SSS();
			}
		},
		conf_sto_local_rsMenu:{
			value:menuStr.localStorage,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="conflocalStorageUlSSS" class="menuSSS"></ul>' +
									'<div id="conflocalStorageCon"></div>';
				menuInit_conf_local_storage_SSS();
			}
		}
	}

	/* 三级菜单==事件 */
	var menuList_event = {
		conf_event_vedio_rsMenu:{
			value:menuStr.vedioCheck,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confVideoDetectionUlSSS" class="menuSSS"></ul>' +
									'<div id="confVideoDetectionCon"></div>';
				menuInit_conf_video_detection_SSS({menuId:"confVideoDetectionUlSSS", conId:"confVideoDetectionCon"});
			}
		},
		conf_event_intelligent_rsMenu:{
			value:menuStr.intelligentCheck,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confIntelligentCheckUlSSS" class="line"></ul>' +
									'<div id="confIntelligentCheckCon"></div>';
				menuInit_conf_intelli_Check_SSS({menuId:"confIntelligentCheckUlSSS", conId:"confIntelligentCheckCon"});
			}
		},/*
		conf_event_overline_rsMenu:{
			value:menuStr.overlineCheck,
			className:"",
			type:MEMU_LEAF,
			url:"ConfOverLineDetection.htm"
		},*/
		conf_event_alarm_rsMenu:{
			value:menuStr.alarmDevice,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confAlarmUlSSS" class="menuSSS"></ul>' +
									'<div id="confAlarmCon"></div>';
				menuInit_conf_alarm_SSS({menuId:"confAlarmUlSSS", conId:"confAlarmCon"});
			}
		},
		conf_event_exception_rsMenu:{
			value:menuStr.exceptionCheck,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confExpDetectionUlSSS" class="menuSSS"></ul>' +
									'<div id="confExpDetectionCon"></div>';
				menuInit_conf_exp_detection_SSS({menuId:"confExpDetectionUlSSS", conId:"confExpDetectionCon"});
			}
		}
	};

	/* 三级菜单==网络 */
	var menuList_network = {
		conf_network_tcpip_rsMenu:{
			value:menuStr.connect,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwConnectUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwConnectCon"></div>';
				menuInit_conf_nw_connect_SSS({menuId:"confNwConnectUlSSS", conId:"confNwConnectCon"});
			}
		},
		conf_network_port_rsMenu:{
			value:menuStr.port,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwPortUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwPortCon"></div>';
				menuInit_conf_nw_port_SSS({menuId:"confNwPortUlSSS", conId:"confNwPortCon"});
			}
		},
		conf_network_ddns_rsMenu:{
			value:menuStr.ddns,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwDdnsUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwDdnsCon"></div>';
				menuInit_conf_nw_ddns_SSS({menuId:"confNwDdnsUlSSS", conId:"confNwDdnsCon"});
			}
		},
		conf_network_upnp_rsMenu:{
			value:menuStr.upnp,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwUpnpUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwUpnpCon"></div>';
				menuInit_conf_nw_upnp_SSS({menuId:"confNwUpnpUlSSS", conId:"confNwUpnpCon"});
			}
		},
		conf_network_ipFilter_rsMenu:{
			value:menuStr.ipFilter,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwIpFilterUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwIpFilterCon"></div>';
				menuInit_conf_nw_ipFilter_SSS({menuId:"confNwIpFilterUlSSS", conId:"confNwIpFilterCon"});
			}
		},
		conf_network_advancedConfig_rsMenu:{
			value:menuStr.advancedConfig,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwAdvancedConfigUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwAdvancedConfigCon"></div>';
				menuInit_conf_nw_advancedConfig_SSS({menuId:"confNwAdvancedConfigUlSSS", conId:"confNwAdvancedConfigCon"});
			}
		},
		conf_network_multicast_rsMenu:{
			value:menuStr.multicast,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confNwMulticastUlSSS" class="menuSSS"></ul>' +
									'<div id="confNwMulticastCon"></div>';
				menuInit_conf_nw_multicast_SSS({menuId:"confNwMulticastUlSSS", conId:"confNwMulticastCon"});
			}
		}
	};

	/* 三级菜单==系统 */
	var menuList_system = {
		conf_system_basicSet_rsMenu:{
			value:menuStr.basicSet,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confSysBasicSettingUlSSS" class="menuSSS"></ul>' +
									'<div id="confSysBasicSettingCon"></div>';
				menuInit_conf_sys_bcsetting_SSS({menuId:"confSysBasicSettingUlSSS", conId:"confSysBasicSettingCon"});
			}
		},
		conf_system_manager_rsMenu:{
			value:menuStr.manager,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confSysManagerUlSSS" class="menuSSS"></ul>' +
									'<div id="confSysManagerCon"></div>';
				menuInit_conf_sys_manager_SSS({menuId:"confSysManagerUlSSS", conId:"confSysManagerCon"});
			}
		},
		conf_system_systemSet_rsMenu:{
			value:menuStr.systemSet,
			className:"",
			url:"",
			load:function(){
				confCon.innerHTML = '<ul id="confSysSettingUlSSS" class="menuSSS"></ul>' +
									'<div id="confSysSettingCon"></div>';
				menuInit_conf_sys_setting_SSS({menuId:"confSysSettingUlSSS", conId:"confSysSettingCon"});
			}
		}
	};

	var showSubMenuUl = null;
	var menuTool = new menuTool_BC();
	var menuToolCamera = new menuTool_BC();
	var menuToolStorage = new menuTool_BC();
	var menuToolEvent = new menuTool_BC();
	var menuToolNetwork = new menuTool_BC();
	var menuToolCloud = new menuTool_BC();
	var menuToolSystem = new menuTool_BC();
	var menuToolList = {
		conf_camera_rsMenu: function(menuConId){
			subMenuInit({
				menuList:menuList_camera,
				menuUlId:"confCameraUl",
				menuTool:menuToolCamera,
				menuConId:menuConId
			});
		},
		conf_storage_rsMenu: function(menuConId){
			subMenuInit({
				menuList:menuList_storage,
				menuUlId:"confStorageUl",
				menuTool:menuToolStorage,
				menuConId:menuConId
			});
		},
		conf_event_rsMenu: function(menuConId){
			subMenuInit({
				menuList:menuList_event,
				menuUlId:"confEventUl",
				menuTool:menuToolEvent,
				menuConId:menuConId
			});
		},
		conf_network_rsMenu: function(menuConId){
			subMenuInit({
				menuList:menuList_network,
				menuUlId:"confNetworkUl",
				menuTool:menuToolNetwork,
				menuConId:menuConId
			});
		},
		conf_sys_rsMenu: function(menuConId){
			subMenuInit({
				menuList:menuList_system,
				menuUlId:"confSystemUl",
				menuTool:menuToolSystem,
				menuConId:menuConId
			});
		}
	};

	/* 三级菜单显示和初始化控制 */
	function subMenuInit(paraObj)
	{
		var menuUl = id(paraObj.menuUlId);

		/* 隐藏显示的子菜单 */
		if (null != showSubMenuUl && showSubMenuUl != menuUl)
		{
			showSubMenuUl.style.display = "none";
		}

		/* 初始化未创建的子菜单 */
		if (null == menuUl)
		{
			menuUl = document.createElement("ul");
			menuUl.id = paraObj.menuUlId;
			menuUl.className = "menuSS";
			$("#" + paraObj.menuConId).after(menuUl);

			paraObj.menuTool.init({
				menuUlId:paraObj.menuUlId,
				conId:"confCon",
				menuLevel:2,
				menuList:paraObj.menuList,
				initCallBack:function(index){
					if (index == -1 ||undefined == index || null == index)
					{
						index = 0;
					}

					menuUl.childNodes[index].onclick();
				},
				menuClickPreHd:function(paraObj){
					/* 如果有加载函数，则直接执行加载函数，不再加载具体的页面 */
					if (typeof paraObj.load == "function")
					{
						paraObj.load();
						return false;
					}
					else
					{
						return true;
					}
				}
			});
		}
		else
		{
			menuUl.style.display = "";
			menuUl.childNodes[0].onclick();
		}

		showSubMenuUl = menuUl;
	}

	menuTool.init({
		menuUlId:"confMenuS",
		conId:"confCon",
		menuList:menuList,
		menuLevel:1,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		},
		menuClickPreHd:function(paraObj){
			if ("conf_cloud_rsMenu" == paraObj.id)
            {
            	/* 隐藏显示的子菜单 */
				if (null != showSubMenuUl)
				{
					showSubMenuUl.style.display = "none";
				}

				if (typeof paraObj.load == "function")
				{
						paraObj.load();
						return false;
				}
            }

			menuToolList[paraObj.id](paraObj.id);
			return false;
		}
	});
}

/* 四级菜单==摄像头==显示 */
function menuInit_conf_camera_SSS()
{
	var menuList = {
		info_conf_camera_image_rsMenu:{
			value:menuStr.image,
			className:"",
			type:MEMU_LEAF,
			url:"ConfCameraDisplayPic.htm"
		},
		info_conf_camera_OSD_rsMenu:{
			value:menuStr.OSD,
			className:"",
			type:MEMU_LEAF,
			url:"ConfOSD.htm"
		},
		info_conf_camera_coverRange_rsMenu:{
			value:menuStr.coverRange,
			className:"",
			type:MEMU_LEAF,
			url:"ConfCameraCover.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"confCameraDisplayUlSSS",
		conId:"confCameraDisplayCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==摄像头==码流 */
function menuInit_conf_stream_SSS()
{
	var menuList = {
		info_conf_stream_video_rsMenu:{
			value:menuStr.video,
			className:"",
			type:MEMU_LEAF,
			url:"ConfCameraStreamVedio.htm"
		},
		info_conf_stream_audio_rsMenu:{
			value:menuStr.audio,
			className:"",
			type:MEMU_LEAF,
			url:"ConfCameraStreamAudio.htm"
		},
		info_conf_stream_ROI_rsMenu:{
			value:menuStr.ROI,
			className:"",
			type:MEMU_LEAF,
			url:"ConfCameraStreamRoi.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"confStreamDisplayUlSSS",
		conId:"confStreamDisplayCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

// 设置-存储-录像计划
function menuInit_conf_record_plan_SSS()
{
	var menuList = {
		info_storage_record_parameter_rsMenu:{
			value:menuStr.videoPlan,
			className:"",
			type:MEMU_LEAF,
			url:"ConfLocalStorageRecordPlan.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"confStorageRecorPlanUlSSS",
		conId:"confStorageRecorPlanCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

// 设置-存储-抓图计划
function menuInit_conf_picture_plan_SSS()
{
	var menuList = {
		info_storage_storage_timing_rsMenu:{
			value:menuStr.timingPicture,
			className:"",
			type:MEMU_LEAF,
			url:"ConfTimingPicturePlan.htm"
		},
		info_storage_picture_event_rsMenu:{
			value:menuStr.eventPicture,
			className:"",
			type:MEMU_LEAF,
			url:"ConfEventPicturePlan.htm"
		},
		info_storage_picture_parameter_rsMenu:{
			value:menuStr.pictureParam,
			className:"",
			type:MEMU_LEAF,
			url:"ConfPicturePlanParameter.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"confPicturePlanUlSSS",
		conId:"confPicturePlanCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

// 设置-存储-存储管理
function menuInit_conf_storage_SSS()
{
	var menuList = {
		info_storage_storage_disk_rsMenu:{
			value:menuStr.diskManage,
			className:"",
			type:MEMU_LEAF,
			url:"ConfDiskManage.htm"
		},
		info_storage_plan_highSet_rsMenu:{
			value:menuStr.nas,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNasManage.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"confStorageStorageUlSSS",
		conId:"confStorageStorageCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

// 设置-存储-本地存储
function menuInit_conf_local_storage_SSS()
{
	var menuList = {
		info_storage_local_storage_rsMenu:{
			value:menuStr.localStorage,
			className:"",
			type:MEMU_LEAF,
			url:"ConfLocalStorage.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"conflocalStorageUlSSS",
		conId:"conflocalStorageCon",
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(this.menuUlId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==事件==异常检测 */
function menuInit_conf_exp_detection_SSS(paraObj)
{
	var menuList = {
		info_conf_exp_visit_detection_rsMenu:{
			value:menuStr.accessException,
			className:"",
			type:MEMU_LEAF,
			url:"ConfExcetptionDetection.htm"
		},
		info_conf_sdCard_full_detection_rsMenu:{
			value:menuStr.sdCardFull,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSDCardFullDetection.htm"
		},
		info_conf_sdCard_err_detection_rsMenu:{
			value:menuStr.sdCardError,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSDCardErrDetection.htm"
		},
		info_conf_net_down_detection_rsMenu:{
			value:menuStr.netBroken,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetBrokenDetection.htm"
		},
		info_conf_ip_conflict_detection_rsMenu:{
			value:menuStr.ipConflict,
			className:"",
			type:MEMU_LEAF,
			url:"ConfIPConflictDetection.htm"
		}
/*		info_conf_exp_sys_detection_rsMenu:{
			value:menuStr.sysException,
			className:"",
			type:MEMU_LEAF,
			url:"ConfExpSysExcetption.htm"
		}*/
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==系统==基本设置 */
function menuInit_conf_sys_bcsetting_SSS(paraObj)
{
	var menuList = {
		info_conf_sysInfo_rsMenu:{
			value:menuStr.sysInfo,
			className:"",
			type:MEMU_LEAF,
			url:"SysInfo.htm"
		},
		info_conf_sys_basic_setting_manage_rsMenu:{
			value:menuStr.basicSet,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSysBasicSettingDetail.htm"
		},
		info_conf_sys_basic_setting_upgrate_rsMenu:{
			value:menuStr.timeDate,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSysBasicSettingTime.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==系统==用户管理 */
function menuInit_conf_sys_manager_SSS(paraObj)
{
	var menuList = {
		info_conf_sysManager_rsMenu:{
			value:menuStr.manager,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSysUserMgt.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==系统==系统设置 */
function menuInit_conf_sys_setting_SSS(paraObj)
{
	var menuList = {
		info_conf_sys_setting_log_rsMenu:{
			value:menuStr.syslog,
			className:"",
			type:MEMU_LEAF,
			url:"SysLog.htm"
		},
		info_conf_sys_setting_manage_rsMenu:{
			value:menuStr.sysConfManage,
			className:"",
			type:MEMU_LEAF,
			url:"SysConf.htm"
		},
		info_conf_sys_setting_upgrate_rsMenu:{
			value:menuStr.swUpgrate,
			className:"",
			type:MEMU_LEAF,
			url:"SysUpgrade.htm"
		},
		info_conf_sys_setting_maintain_rsMenu:{
			value:menuStr.sysMaintain,
			className:"",
			type:MEMU_LEAF,
			url:"ConfSysSettingMaintaining.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==事件==视频检测 */
function menuInit_conf_video_detection_SSS(paraObj)
{
	var menuList = {
		info_conf_video_motion_detection_rsMenu:{
			value:menuStr.motionDetection,
			className:"",
			type:MEMU_LEAF,
			url:"ConfVideoMotionDetection.htm"
		},
		info_conf_video_tamper_detection_rsMenu:{
			value:menuStr.tamperDetection,
			className:"",
			type:MEMU_LEAF,
			url:"ConfVideoTamperDetection.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==事件==报警设备 */
function menuInit_conf_alarm_SSS(paraObj)
{
	var menuList = {
		info_conf_alarm_in_rsMenu:{
			value:menuStr.alarmInDetection,
			className:"",
			type:MEMU_LEAF,
			url:"ConfAlarmIn.htm"
		},
		info_conf_alarm_out_rsMenu:{
			value:menuStr.alarmOutDetection,
			className:"",
			type:MEMU_LEAF,
			url:"ConfAlarmOut.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==事件==智能检测 */
function menuInit_conf_intelli_Check_SSS(paraObj)
{
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";
	var menuList = [{str:menuStr.lineCrossingDetection, value:'lineCrossingDetection'},
					{str:menuStr.intrusionDetection, value:'intrusionDetection'},
					{str:menuStr.regionEntranceDetection, value:'regionEntranceDetection'},
					{str:menuStr.regionExitingDetection, value:'regionExitingDetection'},
					{str:menuStr.loiteringDetection, value:'loiteringDetection'},
					{str:menuStr.gatheringDetection, value:'gatheringDetection'},
					{str:menuStr.fastMovingDetection, value:'fastMovingDetection'},
					{str:menuStr.parkingDetection, value:'parkingDetection'},
					{str:menuStr.unattendedBaggageDetection, value:'unattendedBaggageDetection'},
					{str:menuStr.objectRemoveDetection, value:'objectRemoveDetection'},
					/*{str:menuStr.defocusDetection, value:'defocusDetection'},*/ //虚焦侦测暂无算法，页面先隐藏
					{str:menuStr.sceneChangeDetection, value:'sceneChangeDetection'},
					{str:menuStr.faceDetection, value:'faceDetection'},
					{str:menuStr.audioAbnormal, value:'audioException'}];

	var menuSpan = id(menuId);
	menuSpan.className = "line confIntelligentTop";
	menuSpan.innerHTML = "";
	if (isIESix || isIESeven)
	{
		menuSpan.style.height = "32px";
	}

	var li = document.createElement("li");
	li.className = "line";
	menuSpan.appendChild(li);

	var span = document.createElement("span");
	span.className = "selCon IEPZD";
	if (isIESix || isIESeven)
	{
		span.style.width = "194px";
	}
	li.appendChild(span);

	var spanSel = document.createElement("span");
	spanSel.id = "eventSel";
	spanSel.className = "select";
	span.appendChild(spanSel);

	var spanVal = document.createElement("span");
	spanVal.className = "value hsValueA";
	spanSel.appendChild(spanVal);

	var iframe = document.createElement("iframe");
	iframe.frameborder="0";
	iframe.className = "intellIframe";
	li.appendChild(iframe);

	var i = document.createElement("i");
	i.className = "arrow";
	spanSel.appendChild(i);

	li = document.createElement("li");
	li.className = "line";
	li.style.marginLeft = "20px";
	menuSpan.appendChild(li);

	var div = document.createElement("div");
	//div.style.marginLeft = "20px";
	div.className = "switchCon";
	div.id = "intelligentDetectionSwitch";
	li.appendChild(div);

	i = document.createElement("i");
	i.className = "switchBg";
	div.appendChild(i);

	i = document.createElement("i");
	i.className = "switchBall";
	div.appendChild(i);

	var label = document.createElement("label");
	label.id = "intelligentDetectionSwitchDes";
	label.className = "des desA";
	label.style.marginLeft = "10px";
	li.appendChild(label);

	function callBack(){
		typeof basicPHAutoFit == "function" && basicPHAutoFit();
	}

	function selEvent(val)
	{
		var pageCon = id(conId);
		var loadNewPage = true;
		var url;

		if (isIESix == true)
		{
			pageCon.style.height = "";
		}

		switch (val)
		{
			case "lineCrossingDetection":
				url = "ConfSmartLineCrossingDetection.htm";
				break;
			case "intrusionDetection":
				url = "ConfSmartIntrusionDetection.htm";
				break;
			case "regionEntranceDetection":
				url = "ConfSmartRegionEntranceDetection.htm";
				break;
			case "regionExitingDetection":
				url = "ConfSmartRegionExitingDetection.htm";
				break;
			case "loiteringDetection":
				url = "ConfSmartLoiteringDetection.htm";
				break;
			case "gatheringDetection":
				url = "ConfSmartGatheringDetection.htm";
				break;
			case "fastMovingDetection":
				url = "ConfSmartFastMovingDetection.htm";
				break;
			case "parkingDetection":
				url = "ConfSmartParkingDetection.htm";
				break;
			case "unattendedBaggageDetection":
				url = "ConfSmartUnattendedBaggageDetection.htm";
				break;
			case "objectRemoveDetection":
				url = "ConfSmartObjectRemoveDetection.htm";
				break;
			case "defocusDetection":
				url = "ConfSmartDefocusDetection.htm";
				break;
			case "sceneChangeDetection":
				url = "ConfSmartSceneChangeDetection.htm";
				break;
			case "faceDetection":
				url = "ConfSmartFaceDetection.htm";
				break;
			case "audioException":
				url = "ConfSmartAudioExceptionDetection.htm";
				break;
		}

		if (true == loadNewPage)
		{
			var tmp = url.split(".");
			pageCon.innerHTML = "";

			if (gLoadType == LOADHELPTYPE)
			{
				if (null != id(tmp[0]))
				{
					pageCon.innerHTML = id(tmp[0]).outerHTML;
				}
				else
				{
					/*if (type == MEMU_LEAF)
					{*/
						pageCon.innerHTML = id(HELP_TIP_ID).outerHTML;
					/*}
					else
					{
						loadPage(url, conId, function(){
							typeof callBack == "function" && callBack(url);
						});
					}*/
				}
			}
			else
			{
				loadPage(url, conId, function(){
					typeof callBack == "function" && callBack(url);
				});
			}
		}
		else
		{
			typeof callBack == "function" && callBack(url);
		}
	}

	var iframeBg = $(".intellIframe");
	var maxSize;
	var classObj = {
		optHideHd:function(){
			iframeBg.hide();
		},
		optHideAllHd:function(){
			iframeBg.hide();
		},
		optShowHd:function(){
			iframeBg.show();
		}
	};
	selectInit("eventSel", menuList, "lineCrossingDetection", selEvent, maxSize, classObj);
	selEvent("lineCrossingDetection");
}
/* 四级菜单==设置==网络==连接 */
function menuInit_conf_nw_connect_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_connect_rsMenu:{
			value:menuStr.netConnect,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNwStaOrDyn.htm"
		},
		info_conf_nw_pppoe_rsMenu:{
			value:menuStr.pppoe,
			className:"",
			type:MEMU_LEAF,
			url:"PPPoE.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==端口 */
function menuInit_conf_nw_port_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_port_rsMenu:{
			value:menuStr.port,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetworkPort.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==DDNS */
function menuInit_conf_nw_ddns_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_ddns_rsMenu:{
			value:menuStr.ddns,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetworkDdns.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==端口映射 */
function menuInit_conf_nw_upnp_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_upnp_rsMenu:{
			value:menuStr.upnp,
			className:"",
			type:MEMU_LEAF,
			url:"Upnp.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==IP权限*/
function menuInit_conf_nw_ipFilter_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_ipFilter_rsMenu:{
			value:menuStr.ipFilter,
			className:"",
			type:MEMU_LEAF,
			url:"IpFilter.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==高级配置 */
function menuInit_conf_nw_advancedConfig_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_ftp_rsMenu:{
			value:menuStr.Ftp,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetworkFtp.htm"
		},
		info_conf_nw_email_rsMenu:{
			value:menuStr.Email,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetworkEmail.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==网络==组播 */
function menuInit_conf_nw_multicast_SSS(paraObj)
{
	var menuList = {
		info_conf_nw_multicast_rsMenu:{
			value:menuStr.multicast,
			className:"",
			type:MEMU_LEAF,
			url:"ConfNetworkMulticast.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}

/* 四级菜单==设置==云服务*/
function menuInit_conf_cloud_SSS(paraObj)
{
	var menuList = {
		info_conf_cloud_rsMenu:{
			value:menuStr.cloudService,
			className:"",
			type:MEMU_LEAF,
			url:"CloudServiceBindID.htm"
		}
	};

	var menuTool = new menuTool_BC();
	var menuId = paraObj.menuId != undefined ? paraObj.menuId : "menuId";
	var conId = paraObj.conId != undefined ? paraObj.conId : "conId";

	menuTool.init({
		menuUlId:menuId,
		conId:conId,
		menuLevel:3,
		menuList:menuList,
		initCallBack:function(index){
			if (index == -1 ||undefined == index || null == index)
			{
				index = 0;
			}

			id(menuId).childNodes[index].onclick();
		}
	});
}
