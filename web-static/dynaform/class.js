function NiceScroll(targetId)
{
	this.taId = targetId;
	this.ta = id(this.taId);
	if (this.ta.nodeType != 1)
	{
		return null;
	}
	this.st = el("label");		// scroll tip
	this.sb = el("div");		// scroll bar
	this.sbH = 0;
	this.scH = 0;
	this.stH = 0;
	this.avg = 0;
	this.sbcH = 0;
	this.n = 20;
	this.enabled = true;
	this.mousePos = null;
	this.isScroll = false;
	this.onSb = false;
	this.show = false;
	this.checkTt = null;

	/* 滚动条动画效果相关 */
	this.wtId = null;			//动画timer的ids
	this.wtCounter = 0;			//timer循环次数
	this.wSpeed = 0;			//timer执行一次滚动条移动的距离
	this.woSpeed = 0;			//用于检测是否反向滚动
	/* endof 滚动条动画效果相关 */

	/* scrollBar的相关样式 */
	this.sbStyle = {
		"position":"absolute",
		"zIndex":1001,
		"width":"0.583em",
		"mTop":0,
		"mLeft":0
	};

	/* scrollTip的相关样式 */
	this.stStyle = {
		"width":"0.583em",
		"display":"inline-block",
		"background":"#34A9DA",
		"borderRadius":"3px",
		"position":"relative",
		"cursor":"pointer"
	};

	/* scrollTip的opacity */
	this.stOpacity = 0.1;

	if (typeof this.init != "function")
	{
		NiceScroll.prototype.init = function(){
			var obj = this;

			this.sb.id = this.taId + "niceScrollSb" + new Date().getTime();

			setStyle(this.sb, {"backgroundColor":(this.sbStyle.background || "transparent")});

			/* 将scrollTip添加到scrollBar中 */
			this.sb.appendChild(this.st);

			/* 将scrollBar添加到body中 */
			document.body.appendChild(this.sb);

			/* 设置scrollBar和scrollTip的静态样式 */
			setStyle(this.sb, this.sbStyle);
			setStyle(this.st, this.stStyle);

			/* 设置scrollBar和scrollTip的动态样式 */
			this._reset();

			/* 如果是PC浏览器设置target的overflow为hidden */
			if (false == OS.portable)
			{
				setStyle(this.ta, {"overflow":"hidden"});
			}
			else
			{
				setStyle(this.ta, {"overflow":"scroll"});
			}

			this._shSb();
			this._bind();
			this._scrollCheck();
		};

		NiceScroll.prototype._scrollCheck = function(){
			var obj = this;

			this.checkTt = window.setTimeout(function(){
				obj._scrollCheck();
			}, 10);
			this._check();
		};

		/* 设置scrollBar的样式 */
		NiceScroll.prototype.scrollBarSet = function(styles){
			if (typeof styles == "object")
			{
				for(var propy in styles)
				{
					this.sbStyle[propy] = styles[propy];
				}
			}
		};

		/* 设置scrollTip的样式 */
		NiceScroll.prototype.scrollTipSet = function(styles){
			if (typeof styles == "object")
			{
				for(var propy in styles)
				{
					this.stStyle[propy] = styles[propy];
				}
			}
		};

		/* 设置scrollTip的opacity */
		NiceScroll.prototype.scrollTipOpacity = function(opacity){
			this.stOpacity = opacity;
		};

		/* 滚动到指定的位置 */
		NiceScroll.prototype.scrollTo = function(hPos){
			var scollTop = parseFloat(hPos);

			if (true == isNaN(scollTop))
			{
				return false;
			}

			/* 设置scrollTip初始样式 */
			this.ta.scrollTop = scollTop;
		};

		/* 动态设置scrollBar和scrollTip的样式，主要是位置 */
		NiceScroll.prototype._reset = function(){
			var pos = $(this.ta).offset();
			var width = this.ta.offsetWidth;
			var height = this.ta.offsetHeight - this.sbStyle.mTop;
			var sHeight = this.ta.scrollHeight - this.sbStyle.mTop;
			var bdTWidth = parseFloat(getNodeDefaultView(this.ta, "borderTopWidth")) || 0;
			var bdBWidth = parseFloat(getNodeDefaultView(this.ta, "borderBottomWidth")) || 0;
			var bdRWidth = parseFloat(getNodeDefaultView(this.ta, "borderRightWidth")) || 0;
			var bdLWidth = parseFloat(getNodeDefaultView(this.ta, "borderLeftWidth")) || 0;

			this.scH = sHeight - height + bdTWidth + bdBWidth;
			this.stH = parseInt(height/sHeight*height*0.7);
			this.sbcH = height - (this.stH + 2);
			this.avg = this.scH/this.sbcH;

			if (sHeight - height <= 0)
			{
				setStyle(this.sb, {"visibility":"hidden", "top":"-9999px"});
				this.show = false;
				return;
			}
			else
			{
				this.show = true;
				setStyle(this.sb, {"visibility":"visible"});
			}

			/* 设置scrollBar初始样式 */
			setStyle(this.sb, {"top":pos.top + bdTWidth + this.sbStyle.mTop + "px",
							   "height":height + "px",
							   "left":pos.left - this.sbStyle.mLeft + width - bdRWidth - parseInt(this.sb.offsetWidth) + "px"});

			/* 设置scrollTip初始样式 */
			setStyle(this.st, {"top":(this.ta.scrollTop/this.scH)*this.sbcH + "px",
							   "height":this.stH + "px"});
		};

		NiceScroll.prototype._bind = function(){
			var obj = this;

			if (document.attachEvent)
			{
				this.ta.attachEvent("onmousewheel",  function(event){
					event = event || window.event;obj._scroll(event)});
				this.sb.attachEvent("onmousewheel",  function(event){
					event = event || window.event;obj._scroll(event)});
			}
			else
			{
				this.ta.addEventListener("mousewheel",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.ta.addEventListener("DOMMouseScroll",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.sb.addEventListener("mousewheel",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.sb.addEventListener("DOMMouseScroll",
					function(event){event = event || window.event;obj._scroll(event)}, false);
			}

			/* 触屏移动的处理函数 */
			function touchMoveHd(event)
			{
				event = event || window.event;
				var mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
				var len = mousePos.y - obj.mousePos.y;
				var top = parseFloat(obj.st.style.top) - len;

				top = (top >= obj.sbcH?obj.sbcH:(top <= 0?0:top));
				obj.st.style.top = top + "px";
				obj.mousePos.y = mousePos.y;
				obj.isScroll = true;

				if (false == OS.portable)
				{
					obj.ta.scrollTop = obj.scH*(top/obj.sbcH);
					eventPreventDefault(event);
				}

				clearSelection(event);
			}

			/* 触屏结束移动的处理函数 */
			function touchEndHd(event)
			{
				detachEvnt(document, "touchmove", touchMoveHd);
				detachEvnt(document, "touchend", touchEndHd);

				if (obj.onSb == false)
				{
					obj.isScroll = false;
				}
			}

			/* 触屏移动开始的处理函数 */
			attachEvnt(this.ta, "touchstart", function(event){
				event = event || window.event;
				obj.mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
				attachEvnt(document, "touchmove", touchMoveHd);
				attachEvnt(document, "touchend", touchEndHd);
			});

			/* 阻止事件的传播，修复select控件上点击滑块时出现的BUG */
			attachEvnt(this.st, "click", function(event){
				event = event || window.event;
				stopProp(event);
			});

			/* 对滑动块绑定鼠标函数 */
			this.st.onmousedown = function(event){
				var time = 0;

				obj.mousePos = getMousePos(event);
				document.onmouseup = function(event){
					event = event || window.event;
					document.onmousemove = null;
					document.onmouseup = null;
					if (obj.onSb == false)
					{
						obj.isScroll = false;
					}

					stopProp(event);
				};
				document.onmousemove = function(event){
					var mousePos = getMousePos(event);
					var len = mousePos.y - obj.mousePos.y;
					var top = parseFloat(obj.st.style.top) + len;

					time++;

					/* 解决IE8.0以下浏览器上滑块会不跟随鼠标的问题，该问题由于IE8.0以下的浏览器在
					   计算top时会出现从10-20-10-30的情况，为了减少出现上述问题的几率，作出如下修改。
					*/
					if (isIENormal == false)
					{
						if (time%4 == 0)
						{
							top = (top >= obj.sbcH?obj.sbcH:(top <= 0?0:top));
							obj.st.style.top = top + "px";
							obj.mousePos.y = mousePos.y;
							obj.ta.scrollTop = obj.scH*(top/obj.sbcH);
						}
					}
					else
					{
						top = (top >= obj.sbcH?obj.sbcH:(top <= 0?0:top));
						obj.st.style.top = top + "px";
						obj.mousePos.y = mousePos.y;
						obj.ta.scrollTop = obj.scH*(top/obj.sbcH);
					}

					obj.isScroll = true;
					clearSelection(event);
				};
			};

			/* 在scrollBar上绑定鼠标事件 */
			$("#"+this.sb.id)[0].onmouseover = function(event){
				event = event || window.event;
				obj.onSb = true;
				if (obj.show == true)
				{
					obj._scrollShow(event);
				}
			};
			$("#"+this.sb.id)[0].onmouseout = function(){
				obj.onSb = false;
				obj.isScroll = false;
			};
		};

		NiceScroll.prototype._close = function(){
			this.sb.style.visibility = "hidden";
			this.enabled = false;
		};

		NiceScroll.prototype._open = function(){
			this.enabled = true;
		};

		NiceScroll.prototype._shSb = function(){
			if (this.ta.style.display == "none" ||
				this.ta.visibility == "hidden")
			{
				this.sb.style.visibility = "hidden";
			}
			else
			{
				this.sb.style.visibility = "visible";
			}
		};

		NiceScroll.prototype._check = function(){
			if (id(this.taId) == null)
			{
				window.clearTimeout(this.checkTt);
				this.sb.parentNode.removeChild(this.sb);
				return;
			}
			if (this.enabled == false)
			{
				return;
			}

			if (checkInHorize(this.ta) == false)
			{
				this.sb.style.display = "none";
				return;
			}
			else
			{
				this.sb.style.display = "block";
			}

			if (parseInt(this.ta.offsetHeight) <= 0)
			{
				this.sb.style.visibility = "hidden";
			}
			this._reset();
		};

		NiceScroll.prototype._getWheelDelta = function(event){
			event = event || window.event;
			if (event.wheelDelta)
			{
				return window.opera&&window.opera.version < 9.5?-event.wheelDelta:event.wheelDelta;
			}
			else
			{
				return -event.detail*40;
			}
		};

		NiceScroll.prototype._wheelAnimateHandle = function ()
		{
			var temp = 0;
			var obj = this;

			obj.wtId = window.setTimeout(function(){
				obj._wheelAnimateHandle();
			}, 5);

			if (obj.wtCounter < 0)
			{
				clearTimeout(obj.wtId);
				obj.wtId = null;
				if (obj.onSb == false)
				{
					obj.isScroll = false;
				}
				return;
			}

			var newTop = parseFloat(obj.ta.scrollTop) + parseInt(obj.wSpeed);
			if (newTop >= obj.scH || newTop <= 0)
			{
				obj.wtCounter = 0;
			}

			obj.ta.scrollTop = newTop;
			temp = (obj.ta.scrollTop/obj.scH)*obj.sbcH;

			if (!isNaN(temp))
			{
				obj.st.style.top = temp + "px";	/* 同步滚动条 */
			}

			obj.wtCounter--;
		};

		NiceScroll.prototype._wheelAnimate = function(speed, counter){
			var oppsite = false;
			if (this.wtId)	/* 连续触发 */
			{
				oppsite = (this.woSpeed ^ speed) < 0;
				this.wtCounter = oppsite ? counter : (this.wtCounter + counter < 50 ? this.wtCounter + counter : 50);
				this.wSpeed = oppsite? speed : this.wSpeed*1.05;		/* 加速 */
				return;
			}
			this.wtCounter = counter;
			this.woSpeed = this.wSpeed = speed;
			this._wheelAnimateHandle();
		};

		NiceScroll.prototype._scrollShow = function(event){
			$("#"+this.sb.id).stop(true).css("visibility", "visible").css("opacity", 1);
			this.isScroll = true;
			eventPreventDefault(event);
		};

		NiceScroll.prototype._scroll = function(event){
			event = event || window.event;
			var delta = this._getWheelDelta(event);
			var st = this.ta.scrollTop;
			var result = delta > 0?-1:1;
			if (this.show == true && this.enabled == true)
			{
				this._scrollShow(event);
				this._wheelAnimate(5 * result, 7);
			}
		};
	}
}
function DateControl(dateConId, options)
{
	this.table;
	this.weekList;
	this.hourList;
	this.dateCon = id(dateConId);
	this.weekIsMouseDown = false;
	this.selDate = [0, 0, 0, 0, 0, 0, 0];
	this.dateArray = [0, 0, 0, 0, 0, 0, 0];
	this.cellHeight = 22;
	this.cellWidth = 22;
	this.cellSeColor = "#A0D468";
	this.cellDeColor = "#FCFCFC";
	this.cellPadding = 1;

	if (DateControl.prototype.init == undefined)
	{
		DateControl.prototype.hourStr = label.lHour;
		DateControl.prototype.weekDayNum = 7;
		DateControl.prototype.lineStr = "-";
		DateControl.prototype.selTag = "selTag";
		DateControl.prototype.cellBorderWidth = 1;
		DateControl.prototype.iCellIndex = 0;
		DateControl.prototype.weekArray = [label.Mon, label.Tue, label.Wen,
										   label.Thu, label.Fri, label.Sta, label.Sun];

		/* Date的初始化 */
		DateControl.prototype._init = function()
		{
			this._initOptions();
			this._dateConInit();
			this._hourListInit();
			this._weekListInit();
			this._dateTableInit();
		};

		/* 重新设置显示的时间 */
		DateControl.prototype.reset = function(dateArray)
		{
			var dayMask, tr, td, iCell, iCellIndex = this.iCellIndex;
			var objThis = this;

			if (dateArray instanceof Array == false ||
				dateArray == undefined ||
				dateArray.length != this.weekDayNum)
			{
				return;
			}

			for(var j = 0; j < this.weekDayNum; j++)
			{
				tr = this.table.rows[j];
				dayMask = dateArray[j];

				for (var i = 0; i < 24; i++)
				{
					td = tr.cells[i];
					iCell = td.childNodes[iCellIndex];

					if (dayMask != undefined)
					{
						this._setSel(iCell, dayMask%2);
						dayMask = (dayMask >> 1);
					}
					else
					{
						this._setSel(iCell, 0);
					}
				}
			}
		};

		/* 初始化options */
		DateControl.prototype._initOptions = function()
		{
			for (var propty in options)
			{
				if (typeof this[propty] != "undefined")
				{
					this[propty] = options[propty];
				}
			}
		};

		/* 获取已选择的时间 */
		DateControl.prototype.getSelDate = function()
		{
			var cell, selectNum, row, iCell;
			var weekDayNum = this.weekDayNum;
			var rows = this.table.rows;
			this.selDate = [0, 0, 0, 0, 0, 0, 0];

			for(var j = 0; j < weekDayNum; j++)
			{
				row = rows[j];

				for (var i = 0; i < 24; i++)
				{
					cell = row.cells[i];
					iCell = cell.childNodes[0];
					selectNum = parseInt(iCell.getAttribute("sel"));

					if (selectNum == 1)
					{
						this.selDate[j] += Math.pow(2, i);
					}
				}
			}

			return this.selDate;
		};

		DateControl.prototype._dateConInit = function()
		{
			this.dateCon.style.overflow = "hidden";
		};

		/* 时刻列表初始化 */
		DateControl.prototype._hourListInit = function()
		{
			var hourList = document.createElement("ul");
			var li, text, iCell, thisObj = this, span;

			hourList.className = "hourList";

			for(var i = 0; i <= 24; i++)
			{
				li = document.createElement("li");
				if (i != 24)
				{
					iCell = document.createElement("span");
					iCell.innerHTML = i;
					li.appendChild(iCell);
					li.style.width = this.cellWidth + this.cellPadding*2 + this.cellBorderWidth + "px";
					iCell.onclick = (function(index){
						return function(){
							var rows = thisObj.table.rows;
							var len = rows.length;
							var iCellIndex = thisObj.iCellIndex;
							var selMask = 1;

							for (var j = 0; j < len; j++)
							{
								selMask = selMask&parseInt(rows[j].cells[index].childNodes[iCellIndex].getAttribute("sel"));
								if (0 == selMask)
								{
									break;
								}
							}

							selMask = 1 - selMask;

							for (var j = 0; j < len; j++)
							{
								thisObj._setSel(rows[j].cells[index].childNodes[iCellIndex], selMask);
							}

							clearSelection();
						};
					})(i);
				}
				else
				{
					li.style.color = "#6EBFD9";
					li.innerHTML = this.hourStr;
				}

				hourList.appendChild(li);
			}

			this.dateCon.appendChild(hourList);
			this.hourList = hourList;
		};

		/* 星期列表初始化 */
		DateControl.prototype._weekListInit = function()
		{
			var weekList = document.createElement("ul");
			var li, thisObj = this;

			weekList.className = "weekList";

			for(var i = 0, len = this.weekDayNum; i < len; i++)
			{
				li = document.createElement("li");
				li.style.height = this.cellHeight + this.cellPadding*2 + this.cellBorderWidth + "px";
				li.style.lineHeight = this.cellHeight + this.cellPadding*2 + this.cellBorderWidth + "px";
				li.innerHTML = this.weekArray[i];
				li.onclick = (function(index){
					return function(){
						var cells = thisObj.table.rows[index].cells;
						var iCellIndex = thisObj.iCellIndex;
						var selMask = 1;

						for (var j = 0, len = cells.length; j < len; j++)
						{
							selMask = selMask&parseInt(cells[j].childNodes[iCellIndex].getAttribute("sel"));
							if (0 == selMask)
							{
								break;
							}
						}

						selMask = 1 - selMask;

						for (var j = 0, len = cells.length; j < len; j++)
						{
							thisObj._setSel(cells[j].childNodes[iCellIndex], selMask);
						}

						clearSelection();
					};
				})(i);
				weekList.appendChild(li);
			}

			this.dateCon.appendChild(weekList);
			this.weekList = weekList;
		};

		/* 设置时间块是否被选择 */
		DateControl.prototype._setSel = function(obj, num){
			obj.setAttribute("sel", num);
			obj.style.backgroundColor = (num == 1 ? this.cellSeColor : this.cellDeColor);
		};

		/* 生成时间cell */
		DateControl.prototype._dateCellCreate = function()
		{
			var dayMask, tr, td, iCell, index;
			var objThis = this;

			for (var j = 0, len = this.weekDayNum; j < len; j++)
			{
				tr = this.table.insertRow(-1);

				if (this.dateArray != undefined)
				{
					dayMask = this.dateArray[j];
				}

				for (var i = 0; i < 24; i++)
				{
					td = tr.insertCell(-1);
					td.style.padding = this.cellPadding + "px";
					td.className = "weekTd";

					iCell = document.createElement("i");
					iCell.className = "tableICell";
					iCell.style.height = this.cellHeight + "px";
					iCell.style.width = this.cellWidth + "px";
					td.appendChild(iCell);

					this._setSel(iCell, 0);

					if (dayMask != undefined)
					{
						this._setSel(iCell, dayMask%2);
						dayMask = (dayMask >> 1);
					}
					else
					{
						this._setSel(iCell, 0);
					}

					iCell.onmouseover = function (event){
						if (objThis.weekIsMouseDown == true)
						{
							objThis._setSel(this, 1 - parseInt(this.getAttribute("sel")));
						}
					};

					iCell.onmousedown = function (event){
						objThis._setSel(this, 1 - parseInt(this.getAttribute("sel")));
					};
				}
			}

			if (this.table.rows[0].cells[0].nodeType == 3)
			{
				this.iCellIndex = 1;
			}
		};

		/* 添加处理函数 */
		DateControl.prototype._dateCellBind = function()
		{
			var objThis = this;
			this.table.onmousedown = function (event){
				objThis.weekIsMouseDown = true;
				document.onmouseup = function (event){
					objThis.weekIsMouseDown = false;
				}
			};

			this.table.onmouseup = function (event){
				objThis.weekIsMouseDown = false;
			};
		};

		/* 生成时间表 */
		DateControl.prototype._dateTableCreate = function()
		{
			this.table = document.createElement("table");
			this.table.className = "tableWeek";
			this.table.cellspacing = "0px";
			this.table.cellpadding = "0px";
			this.dateCon.appendChild(this.table);
		};

		/* 初始化具体的时间表格 */
		DateControl.prototype._dateTableInit = function()
		{
			this._dateTableCreate();
			this._dateCellCreate();
			this._dateCellBind();
		};
	}

	this._init();
}
function PageFunc()
{
    this.pathStr = "../";
	this.htmlPathStr = this.pathStr + "pc/";
	this.gLoginId = "Login";
	this.cloudPageId = "CloudAccountPage";
	this.loadPageData = {url:"", id:"", options:{}, handle:{}, handlePre:{}};
    this.loginPageData = {url:"", id:""};
	this.showLoginHideNodesDelayHd;
	this.helpIdStr = "helpStr";
	this.helpTopClassStr = "helpTopClass";
	this.LGKEYSTR = "lgKey";
	this.LGKEYMD5STR = "lgKeyMD5";
	this.LGUSER = "lgUser";
	this.LGKEYTIMESTR = "lgKeyTime";
	this.PLGINFOCLOSE = "plgInfClose";
	this._gPageHeightLg = 0;
	this.gDomainDNS = "tplogin.cn";
	this.gDomainDetectArr = null;
	this.g_cur_host_mac = "00-00-00-00-00-00";
	this.g_pageLoadDelayTime = 0;		// 设置页面/数据加载时loading状态显示的延迟时间
	this.g_pageLoadingShow = true;		// 设置是否需要显示页面/数据加载时的loading状态
	this.g_pageLoadDelayTimeoutHd = null;

	this.$Init = function()
	{
		Load.call(jQuery);
		$.getExplorer();
		$.initUrl();
	};

	/* 刷新session */
	this.refreshSession = function(callBack)
	{
		$.refreshSession(this.htmlPathStr + "Content.htm", callBack);
	};

	this.loadPageHandleBg = function()
	{
		var helpBtns = $("i.helpBtn");
		var idStr, helpBtn, hpTopClass;

		/* bind input hover */
		//initHoverBd();

		/* bind help */
		for (var i = 0, len = helpBtns.length; i < len; i++)
		{
			helpBtn = helpBtns[i];
			idStr = "";
			idStr = helpBtn.getAttribute(helpIdStr);
			hpTopClass = helpBtn.getAttribute(helpTopClassStr);

			if (idStr != null)
			{
				helpBind(helpBtns[i], idStr, hpTopClass);
			}
		}
	};

	this.loadLgLessPage = function(url, id, callBack, options)
	{
		var opts = (options == undefined ? {} : options);

		opts.htmlPathStr = this.pathStr + "loginLess/";
		this.loadPage(url, id, callBack, opts);
	};

	this.loadAppPage = function(url, id, callBack, options)
	{
		var opts = (options == undefined ? {} : options);

		opts.htmlPathStr = "";
		this.loadPage(url, id, callBack, opts);
	};

	this.showDetailCon = function(){
		var detailConRs = $("div.detailConRs");
		var detailCon = $("div.detailCon");

		if (detailCon[0] != null)
		{
			detailCon.css("visibility", "visible");
		}

		if (detailConRs[0] != null)
		{
			detailConRs.css("visibility", "visible");
		}
	};

	this.bDetailConHidden = function(){
		var detailConRs = $("div.detailConRs");
		var detailCon = $("div.detailCon");

		if (detailCon[0] == null && detailConRs[0] == null)
		{
			return true;
		}
		else
		{
			if (detailCon.css("visibility") == "hidden" ||
				detailConRs.css("visibility") == "hidden")
			{
				return true;
			}
		}

		return false;
	};

	this.hideDetailCon = function(){
		var detailConRs = $("div.detailConRs");
		var detailCon = $("div.detailCon");

		if (detailCon[0] != null)
		{
			detailCon.css("visibility", "hidden");
		}

		if (detailConRs[0] != null)
		{
			detailConRs.css("visibility", "hidden");
		}
	};

	/* load page to the target container */
	this.loadPage = function(url, id, callBack, options, callBackPre)
	{
		var obj = this;

		/* for the bug of IE6.0 ~ IE8.0 */
		window.setTimeout(function(){
			var htmlPathStr = obj.htmlPathStr;
			var showToastHd = null;

			try
			{
				typeof hideBox == "function" && hideBox();
				typeof helpClose == "function" && helpClose();
				typeof closeAlert == "function" && closeAlert();
				typeof closeConfirm == "function" && closeConfirm();
				typeof closeLoading == "function" && closeLoading();
				typeof removeNoteAll == "function" && removeNoteAll();
				typeof basicAppUpgradeInfoClose == "function" && basicAppUpgradeInfoClose();
			}
			catch(ex){
				log(ex);
			}

			options = options == undefined ? {} : options;
			htmlPathStr = options.htmlPathStr == undefined ? htmlPathStr : options.htmlPathStr;

			if (false !== options.bRecordLoadPage)
			{
				/* 设置上下文环境参数 */
				typeof setLoadPage == "function" && setLoadPage(url, id, options, callBack, callBackPre);
			}

			if (true == $.local)
			{
				log(url);
			}

			if (g_pageLoadingShow == true && options.pageLoadingShow !== false)
			{
				showToastHd = $.setTimeout(function(){
					showToast();
				}, g_pageLoadDelayTime);

				clearTimeout(g_pageLoadDelayTimeoutHd);
				g_pageLoadDelayTimeoutHd = setTimeout(function(){
					try
					{
						if (bDetailConHidden() == true)
						{
							closeToast();
							showDetailCon();
						}
					}
					catch(ex){
						log(ex);
					}
				}, 5 * 1000);

				/* 设置加载完Dom后的回调函数，该函数在callBack和callBackPre之间 */
				options.callBackLoadedDom = function(){
					if (g_pageLoadingShow == true)
					{
						clearTimeout(showToastHd);
						closeToast();

						if (false == $.local)
						{
							hideDetailCon();
						}
					}
				};
			}

			$.load(htmlPathStr + url, function(result){
				typeof callBack == "function" && callBack(result);
			}, id, options, function(result){
				closeProgBar();
				typeof callBackPre == "function" && callBackPre(result);
			});
		}, 0);
	};

	this.unloadDetail = function(canvasId)
	{
		var detail = id(canvasId);
		if (detail)
		{
			emptyNodes(detail);
		}
	};

	this.detailShow = function(conId, callBack)
	{
		$("#"+conId).fadeIn(800, callBack);
	};

	this.detailHide = function(conId, canvasId)
	{
		$("#"+conId).fadeOut(800, function(){
			$("#"+conId).css("display", "none");
			window.unloadDetail(canvasId);
		});
	};

	this.selectChange = function(objId, obj)
	{
		id(objId).value = obj.options[obj.selectedIndex].text;
	};

	this.showCon = function(idStr){
		var con = id(idStr);
		var node, nodes = document.body.childNodes;
		var conDis, otherDis;

		for(var index in nodes)
		{
			node = nodes[index];
			if (node.nodeName != undefined
				&& node.nodeName.toUpperCase() == "DIV"
				&& node.id != idStr)
			{
				setStyle(node, {"display":"none"});
			}
		}

		setStyle(con, {"display":"block"});
	};

	this.loginChange = function(showTag)
	{
		var loginCon = this.id(this.gLoginId);
		var other = "block", login = "none";
		var node, nodes = document.body.childNodes;
		var obj = this;

		/* 如果是帮助页面的框架，则直接退出 */
		if (LOADHELPTYPE != undefined && gLoadType == LOADHELPTYPE)
		{
			return;
		}

		if (showTag == true)
		{
			other = "none";
			login = "block";
			_gPageHeightLg = parseInt(document.body.offsetHeight);
		}

		emptyNodes(loginCon);

		function hideNodes()
		{
			for(var index in nodes)
			{
				node = nodes[index];
				if (node.nodeName != undefined
					&& node.nodeName.toUpperCase() == "DIV"
					&& node.id != obj.gLoginId && node.id != obj.CoverId
					&& node.id != "timePickerCon" && node.id != "laydate_box")
				{
					obj.setStyle(node, {"display":other});
				}
			}

			obj.setStyle(loginCon, {"display":login});
			typeof showLoginHideNodesDelayHd == "function" && showLoginHideNodesDelayHd();
		}

		if (showTag == true)
		{
			var authCode = $.authRltObj["code"];

			if (ESYSRESET == authCode)
			{
				gIsFactory = true;
				if (OS.portable == true && OS.iPad == false)
				{
					loadLgLessPage("PhoneSetPwd.htm", "Con", undefined, {bRecordLoadPage:false, pageLoadingShow:false});
				}
				else
				{
					document.body.style.height = "auto";
					loadPage("LoginChgPwd.htm", "Login", hideNodes, {bRecordLoadPage:false, pageLoadingShow:false});
				}

				emptyNodes(id("Con"));
				setLoadPage("Content.htm", "Con");
			}
			/*else if (ESYSLOCKEDFOREVER == authCode || ESYSLOCKED == authCode)
			{
				document.body.style.height = "auto";
				$.queryAuthLog(function(result){
					$.authRltObj["authLog"] = result["unauth_log_list"];
					$.authRltObj["client"] = result["curIP"];
					hideNodes();
					loadLgLessPage("LoginAuthLog.htm", "Login", undefined, {bRecordLoadPage:false, pageLoadingShow:false});
				});
			}*/
			else
			{
				gIsFactory = false;
				if (OS.portable == true && OS.iPad == false && phoneSet["bContinuePCSet"] == false)
				{
					loadLgLessPage("PhoneApp.htm", "Con", undefined, {bRecordLoadPage:false, pageLoadingShow:false});
				}
				else
				{
					document.body.style.height = "auto";
					loadPage("Login.htm", "Login", null, {bRecordLoadPage:false, pageLoadingShow:false}, hideNodes);
				}
			}
		}
		else
		{
			if (OS.portable == true && OS.iPad == false && phoneSet["bContinuePCSet"] == false)
			{
				document.body.style.height = "100%";
			}
			else
			{
				//document.body.style.height = _gPageHeightLg + "px";
				document.body.style.height = "100%";
			}

			this.loadPageData.options = this.loadPageData.options || {};
			this.loadPageData.options.bRecordLoadPage = false;

			if(this.loadPageData.url != "Content.htm"){
				emptyNodes(id("Con"));
				this.loadPage("Content.htm", "Con");
			}

			this.loadPage(this.loadPageData.url, this.loadPageData.id, function(){
				typeof obj.loadPageData.handle == "function" && obj.loadPageData.handle();
			}, this.loadPageData.options, function(){
				hideNodes();
				typeof obj.loadPageData.handlePre == "function" && obj.loadPageData.handlePre();
			});
		}
	};

	this.setLoadPage = function(url, idStr, options, handle, handlePre)
	{
		this.loadPageData.url = url;
		this.loadPageData.id = idStr;
		this.loadPageData.options = options;
		this.loadPageData.handle = handle;
		this.loadPageData.handlePre = handlePre;
	};

	this.localSgInit = function()
	{
		try
		{
			this.sessionLS.init();
			if (true == isIE && false == isIENormal)
			{
				(function(){
					sessionLS.setExpire(3*1000);
					window.setTimeout(arguments.callee, 1*1000);
				})();
			}
		}catch(ex){}

		this.getLgPwd();
	};

	this.auth = function()
	{
		$.auth($.username, $.pwd);
	};

	this.getLgPwd = function()
	{
		try
		{
			$.tmpPwdMD5 = $.pwdMD5 = sessionLS.getItem(this.LGKEYMD5STR);
			$.pwd = sessionLS.getItem(this.LGKEYSTR);
			$.username = sessionLS.getItem(this.LGUSER);
		}catch(ex){};
	};

	this.showLogin = function(func)
	{
		this.showLoginHideNodesDelayHd = func;
		this.loginChange(true);
	};

	this.unloadLogin = function()
	{
		this.loginChange(false);
	};

	this.ifrmOrgUrl = function(code)
	{
		return ("/stok=" + encodeURIComponent($.session) + "?code=" + code);
	};

	this.iFrmOnload = function (idStr, callBack, unAuthHandle)
	{
		var data = {}, errorno = ENONE;
		var ifrm = id(idStr);
		var isNum = false, j, ret;

		try
		{
			if (ifrm.contentWindow)
			{
				data.responeText = ifrm.contentWindow.document.body ? ifrm.contentWindow.document.body.innerHTML : null;
				data.responeXML = ifrm.contentWindow.document.XMLDocument ? ifrm.contentWindow.document.XMLDocument : ifrm.contentWindow.document;
			}
			else
			{
				data.responeText = ifrm.contentDocument.document.body ? ifrm.contentDocument.document.body.innerHTML : null;
				data.responeXML = ifrm.contentDocument.document.XMLDocument ? ifrm.contentDocument.document.XMLDocument : ifrm.contentDocument.document;
			}

			if (/(<pre>)?(.+)(<\/pre>)+/.test(data.responeText) ||
				/(<pre>)?(.+)/.test(data.responeText))
			{
				j = RegExp["$2"];
			}

			ret = JSON.parse(j);
			errorno = ret[ERR_CODE];

			/* 错误。直接退出 */
			if (errorno != ENONE)
			{
				closeProgBar();
			}

			callBack(errorno);
		}
		catch(ex)
		{
			closeProgBar();
			callBack(EINVFMT);
		}
	};

	this.windowSleep = function(milliSeconds)
	{
		var now = new Date();
		var exitTime = now.getTime() + milliSeconds;
		while (true)
		{
			now = new Date();
			if (now.getTime() > exitTime)
			{
				return;
			}
		}
	};

	/* 获取本机MAC地址 */
	this.getCurrPcMac = function()
	{
		var pos, result = $.getPeerMac();

		if (ENONE != result.errorno || "" == result.data)
		{
			return "00-00-00-00-00-00";
		}

		pos = result.data.indexOf("\r\n");
		return result.data.substring(0, pos);
	};

	/* 克隆本机MAC地址 */
	this.cloneLocalMac = function(){
		var system = $.readEx(SYSTEM_DATA_ID);
		var localMac = this.getCurrPcMac();
		var errNo = ENONE;

		if (system.mac[1] != localMac)
		{
			system.mac[1] = localMac;
			errNo = $.write($.toText(system), $.block);
		}

		return errNo;
	};

	/* 获取log */
	this.logSave = function()
	{
		var url = "/syslog.txt?disposition=1";
		var domain = $.domainUrl;

		if (domain.lastIndexOf("/") == (domain.length - 1))
		{
			domain = domain.substring(0, domain.length - 1);
		}

		location.href = domain + $.orgURL(url);

		return true;
	};

	/* check for dns redirect */
	this.pageRedirect = function()
	{
		var url = window.top.location.href;

		/* 处理DNS重定向 */
		if (USER_GROUP_REMOTE != $.authRltObj["group"] &&
			false == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(url) &&
			url.indexOf(gDomainDNS) < 0 && false == $.local)
		{
			window.top.location.href = $.httpTag + gDomainDNS;
		}
	};

	this.pageOnload = function()
	{
		var links = [{tag:"link", url:"../web-static/dynaform/DataGrid.css"},
					 {tag:"link", url:"../web-static/dynaform/DatePick.css"}];

		var scripts = [{tag:"script", url:"../web-static/dynaform/DataGrid.js"}];

		var delayscripts = [{tag:"script", url:"../web-static/lib/ajax.js"},
							{tag:"script", url:"../web-static/dynaform/uci.js"},
							{tag:"script", url:"../web-static/language/cn/str.js"},
							{tag:"script", url:"../web-static/language/cn/error.js"},
							{tag:"script", url:"../web-static/lib/verify.js"},
							{tag:"script", url:"../web-static/dynaform/DatePick.js"},
							{tag:"script", url:"../web-static/lib/jsencrypt.js"},
							{tag:"script", url:"../web-static/dynaform/menu.js"}];

		//根据浏览器版本,引入html5.js 和 excanvas.js
		/*var explorerInfoForCanvas = navigator.userAgent;
		var bMSIE = /msie ((\d+\.)+\d+)/i.test(explorerInfoForCanvas)?(document.mode || RegExp["$1"]):false;
		if ((bMSIE != false) && (bMSIE <= 8))
		{
			delayscripts[delayscripts.length] = {tag:"script", url:"../web-static/lib/html5.js"};
			delayscripts[delayscripts.length] = {tag:"script", url:"../web-static/lib/excanvas.js"};
		}*/

		var prescripts = [{tag:"script", url:"../web-static/lib/json.js"},
						  {tag:"script", url:"../web-static/lib/jquery-1.10.1.js"}];

		this.loadExternResource({scripts:prescripts, callBack:function(){
			this.loadExternResource({scripts:delayscripts, callBack:function()
			{
				var url = window.top.location.href;

				$Init();

				/* 注册相应处理函数 */
				$.setexternJSP(replaceJSP);
				$.setExternPageHandle(loadPageHandleBg);
				$.setLoginErrHandle(showLogin);
				//$.setPRHandle(pageRedirect);

				//window.authInfo = [];
				this.loadExternResource({scripts:scripts, links:links, callBack:function(){
					if (gLoadType == LOADHELPTYPE)
					{
						var helpLink = [{tag:"script", url:"../web-static/dynaform/help.css"}];
						this.loadExternResource({links:helpLink});
					}
				}});
				this.compatibleShow();
				this.localSgInit();

				if (true == $.local)
				{
					this.htmlPathStr = this.pathStr + "admin/";
					this.loadPage("Content.htm", "Con");
					return;
				}

				if (gLoadType == LOADHELPTYPE)
				{
					$.session = "";
					$.setLg("", "");
					this.loadLgLessPage("HelpFrame.htm", "Con", null, {pageLoadingShow:false});
				}
				/*else if (false == /^((http:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(url) &&
					url.indexOf(gDomainDNS) >= 0)
				{
					var reqData = {};

					reqData[uciSystem.actionName.getDomainArray] = null;
					$.action(reqData, function(result){
						if (ENONE == result[ERR_CODE])
						{
							var dataArry = result[uciSystem.dynData.domainArray];

							if (dataArry.length > 1)
							{
								this.gDomainDetectArr = dataArry;
								this.loadLgLessPage("RouterSelect.htm", "Con", undefined, {bRecordLoadPage:false});
							}
							else
							{
								this.loadPage("Content.htm", "Con", null, {pageLoadingShow:false});
							}
						}
						else
						{
							this.loadPage("Content.htm", "Con", null, {pageLoadingShow:false});
						}
					});
				}*/
				else
				{
					this.loadPage("Content.htm", "Con", null, {pageLoadingShow:false});
				}
			}});
		}});

		document.oncontextmenu = function(event){
			return false;
		};

		try
		{
			/* 关闭IE大写锁提示 */
			document.msCapsLockWarningOff = true;
		}
		catch(ex){}

		if (isIESix)
		{
			try{document.execCommand('BackgroundImageCache', false, true);}catch(e){};
		}
	};

	/* 异步加载资源 */
	this.loadExternResource = function(obj)
	{
		var elem, links, scripts, callBack, hasReadyState;
		var head = document.getElementsByTagName("head")[0];
		var ObjOrg = {links:null, scripts:null, callBack:null};

		/* 初始化参数列表 */
		for(var prop in obj)
		{
			ObjOrg[prop] = obj[prop];
		}

		links = ObjOrg.links;
		scripts = ObjOrg.scripts;
		callBack = ObjOrg.callBack;

		/* 加载CSS */
		if (links != undefined)
		{
			for (var i in links)
			{
				elem = document.createElement("link");
				elem.rel = "stylesheet";
				elem.href = links[i].url;
				head.appendChild(elem);
			}
		}

		/* 加载js */
		if (scripts != undefined)
		{
			var load, loadHandle, loadCallBack;

			elem = document.createElement("script");
			elem.type = "text/javascript";

			if (callBack != undefined)
			{
				hasReadyState = (elem.readyState != undefined);
				loadCallBack = function(index)
				{
					scripts[index].loadState = true;

					for (var j in scripts)
					{
						if (false == scripts[j].loadState)
						{
							return;
						}
					}

					callBack();
				};

				for (var i in scripts)
				{
					scripts[i].loadState = false;
				}
			}

			for (var i in scripts)
			{
				elem = document.createElement("script");
				elem.type = "text/javascript";

					if (callBack != undefined)
					{
						if (hasReadyState)
						{
							elem.onreadystatechange = (function(index){
								return function(){
									if (this.readyState == "loaded" || this.readyState == "complete")
									{
										this.onreadystatechange = null;
										loadCallBack(index);
									}
								};
							})(i);
						}
						else
						{
							elem.onload = (function(index){
								return function(){
									loadCallBack(index);
								};
							})(i);
						}
					}

				elem.src = scripts[i].url;
				head.appendChild(elem);
			}
		}
	};

/* 	this.upSysNtpTime = function(){
		var data = {};

		try
		{
			data[uciSystem.fileName] = {};
			data[uciSystem.fileName][uciSystem.actionName.bootSetDate] = {};
			data[uciSystem.fileName][uciSystem.actionName.bootSetDate][uciSystem.optName.seconds] = parseInt((new Date()).getTime() / 1000);

			同步电脑的时间请求，如果后台没有手动设置过时间或者没有设置NTP服务器或者没有连接到NVR
			$.action(data);
		}catch(ex){
			log(ex);
		}
	}; */
}
function Cover()
{
	Style.call(this);
	this.CoverId = "Cover";
	this.CoverIdB = "CoverB";

	this.hideCover = function(callBack, externStyles)
	{
		var cover = id(this.CoverId);

		this.setStyle(cover, {"display":"none", "visibility":"hidden"});
		this.setStyle(cover, externStyles);

		if (typeof callBack == "function")
		{
			callBack(cover);
		}

		emptyNodes(cover);
	};

	this.showCover = function(callBack, externStyles)
	{
		var cover = id(this.CoverId);

		this.setStyle(cover, {"display":"block", "visibility":"visible"});
		this.setStyle(cover, externStyles);
		$(cover).css("opacity", "0.1");

		if (typeof callBack != "undefined")
		{
			callBack(cover);
		}
	};

	/* 此Cover不随着loadPage消除 */
	this.showCoverB = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdB);

		if (undefined == cover)
		{
			cover = document.createElement("div");
			cover.id = this.CoverIdB;
			document.body.appendChild(cover);
		}

		this.setStyle(cover, {"display":"block", "visibility":"visible"});
		this.setStyle(cover, externStyles);
		$(cover).css("opacity", "0.5");

		if (typeof callBack != "undefined")
		{
			callBack(cover);
		}
	};

	this.hideCoverB = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdB);

		if (undefined != cover)
		{
			this.setStyle(cover, {"display":"none", "visibility":"hidden"});
			this.setStyle(cover, externStyles);

			if (typeof callBack == "function")
			{
				callBack(cover);
			}

			emptyNodes(cover);
		}
	};
}
function Style()
{
	this.disableCol = "#b2b2b2";

	/* set the element styles with the styles */
	this.setStyle = function (ele, styles)
	{
		if (ele == null || styles == null || ele.nodeType != 1)
		{
			return;
		}

		for (var property in styles)
		{
			try
			{
				ele.style[property] = styles[property];
			}catch(ex){}
		}
	};

	/* get the default style of the element*/
	this.getNodeDefaultView = function(element, cssProperty)
	{
		var dv = null;
		if (!(element))
		{
			return null;
		}

		try{
			if (element.currentStyle)
			{
				dv = element.currentStyle;
			}
			else
			{
				dv = document.defaultView.getComputedStyle(element, null);
			}

			if (cssProperty != undefined)
			{
				return dv[cssProperty];
			}
			else
			{
				return dv;
			}
		}catch(ex){}
	};
	/*disable hover while element is unclickable*/
	this.disableHover = function(ele, classValue)
	{
		if (!ele)
		{
			return;
		}
		ele = (ele instanceof window.jQuery)?ele:$(ele);
		for (var i = 0; i < ele.length; i++)
		{
			$(ele[i]).removeClass(classValue);
			$(ele[i]).addClass(classValue + "Dis");
		}
	}
	/*enable hover while element is clickable*/
	this.enableHover = function(ele, classValue)
	{
		if (!ele)
		{
			return;
		}
		ele = (ele instanceof window.jQuery)?ele:$(ele);
		for (var i = 0; i < ele.length; i++)
		{
			$(ele[i]).removeClass(classValue + "Dis");
			$(ele[i]).addClass(classValue);
		}
	}
}
function LocalStorageSD()
{
	try
	{
		if (null == this.sessionStorage)
		{
			this.sessionLS = {
				file_name:"user_data_default_SD",
				dom:null,
				init:function()
				{
					var dom = document.createElement('input');

					dom.type = "hidden";
					dom.addBehavior("#default#userData");
					document.body.appendChild(dom);
					dom.save(this.file_name);
					this.dom = dom;
				},
				setItem:function(k, v)
				{
					this.dom.setAttribute(k,v);
					this.dom.save(this.file_name);
				},
				getItem:function(k, file_name)
				{
					this.dom.load(this.file_name);
					return this.dom.getAttribute(k);
				},
				removeItem:function(k)
				{
					this.dom.removeAttribute(k);
					this.dom.save(this.file_name);
				},
				setExpire:function(timeSecond)
				{
				   var now = new Date();

				   now = new Date(now.getTime() + timeSecond);
				   this.dom.load(this.file_name);
				   this.dom.expires = now.toUTCString();
				   this.dom.save(this.file_name);
				}
			};
		}
		else
		{
			this.sessionLS = sessionStorage;
		}
	}catch(ex){};
}
function Explorer()
{
	this.isIE = false;
	this.isIESix = false;
	this.isIESeven = false;
	this.isIENormal = false;
	this.isIETenLess = false;
	this.isIETen = false;
	this.isFirefox = false;
	this.isChrome = false;
	this.isSafari = false;
	this.isOpera = false;
	this.isIE11 = false;
	this.isMsEdge = false;
	this.explorerInfo = navigator.userAgent;
	this.explorerTypeArr = ["IE", 0, "8.0"];

	this.getIEInfo = function ()
	{
		var bMSIE = /msie ((\d+\.)+\d+)/i.test(explorerInfo)?(document.mode || RegExp["$1"]):false;
		if (bMSIE != false)
		{
			if (bMSIE <= 6)
			{
				this.isIESix = true;
				this.explorerTypeArr = ["IE", 0, "6.0"];
			}
			else if (bMSIE == 7)
			{
				this.isIESeven = true;
				this.explorerTypeArr = ["IE", 0, "7.0"];
			}
			else if (bMSIE == 8)
			{
				this.explorerTypeArr = ["IE", 0, "8.0"];
			}
			else if (bMSIE >= 9)
			{
				if (bMSIE == 9)
				{
					this.explorerTypeArr = ["IE", 0, "9.0"];
				}
				else if (bMSIE == 10)
				{
					this.isIETen = true;
					this.explorerTypeArr = ["IE", 0, "10.0"];
				}

				this.isIENormal = true;
			}

			if (bMSIE <= 10)
			{
				this.isIETenLess = true;
			}

			this.isIE = true;
		}

		/* IE11.0 */
		if (/Trident\/[\d\.]+[\w\W]*rv:11\.[\d\.]+/i.test(explorerInfo) == true)
		{
			this.isIE11 = true;
			this.isIE = true;
			this.isIENormal = true;
			this.explorerTypeArr = ["IE", 0, "11.0"];
		}
	};

	this.judgeExplore = function(){
		var ua = navigator.userAgent;
		this.getIEInfo();

		if (this.isIE == false)
		{
			if (s = ua.match(/edge\/([\d.]+)/i))
			{
				/* ms edge is note IE */
				this.isMsEdge = s[1];
				this.explorerTypeArr = ["edge", 4, s[1]];
			}
			else if (s = ua.match(/firefox\/([\d.]+)/i))
			{
				this.isFirefox = s[1];
				this.explorerTypeArr = ["firefox", 1, s[1]];
			}
			else if (s = ua.match(/chrome\/([\d.]+)/i))
			{
				this.isChrome = s[1];
				this.explorerTypeArr = ["chrome", 2, s[1]];
			}
			else if (s = ua.match(/opera.([\d.]+)/i))
			{
				this.isOpera = s[1];
				this.explorerTypeArr = ["opera", 5, s[1]];
			}
			else if (s = ua.match(/version\/([\d.]+).*safari/i))
			{
				this.isSafari = s[1];
				this.explorerTypeArr = ["safari", 3, s[1]];
			}
		}
	};

	this.compatibleShow = function(){
		if (true == this.isIESix)
		{
			var posDiv, conDiv, i, span, spanClose;
			var closeKey = "ieSixClosed";

			if (document.cookie.indexOf(closeKey) >= 0)
			{
				return;
			}

			posDiv = $("div.ieSixCompatible");
			if (undefined == posDiv[0])
			{
				posDiv = el("div");
				posDiv.className = "ieSixCompatible";

				conDiv = el("div");
				conDiv.className = "ieSixCpCon";

				i = el("i");

				span = el("span");
				span.className = "spanNote";
				span.innerHTML = label.IESixCpTip;

				spanClose = el("span");
				spanClose.className = "spanClose";
				spanClose.innerHTML = label.iknown;
				spanClose.onclick = function(){
					document.cookie = closeKey + "=true";
					posDiv.style.visibility = "hidden";
					posDiv.style.top = "-9999px";
				};

				conDiv.appendChild(i);
				conDiv.appendChild(span);
				conDiv.appendChild(spanClose);
				posDiv.appendChild(conDiv);
				document.body.appendChild(posDiv);
			}
		}
	};

	this.createGroupRadio = function(name){
		var raidoEl;

		if (undefined == name)
		{
			return raidoEl;
		}

		if (this.isIE == true && this.isIENormal == false)
		{
			raidoEl = document.createElement("<input name='"+ name +"' />");
		}
		else
		{
			raidoEl = document.createElement("input");
			raidoEl.name = name;
		}

		return raidoEl;
	};

	this.judgeExplore();
}
function Tool()
{
	this.gAppPreUrl = "";
	Style.call(this);
	this.logSwitch = false;

	/* get element by id */
	this.id = function(idStr)
	{
		if (idStr != undefined)
		{
			return document.getElementById(idStr);
		}
	};

	/* create element */
	this.el = function(str)
	{
		try
		{
			return document.createElement(str);
		}catch(ex){return null;}
	};

	/* replace {%....%} to realize multi languages */
	/* replace {#appPreUrl#} to realize app url */
	this.replaceJSP = function(str)
	{
		var matches = null, strRepace;
		var tagL = "{%", tagR = "%}";
		var rp = /{%(\w+)\.(\w+)%}/i;

		matches = rp.exec(str);
		try
		{
			while(matches != null)
			{
				strRepace = language[matches[1]][matches[2]];
				str = str.replace(tagL + matches[1] + "." + matches[2] + tagR, strRepace);
				matches = rp.exec(str);
			}
		}catch(ex){}

		/* replace app url */
		try
		{
			str = str.replace(/{#appPreUrl#}/g, gAppPreUrl);
		}catch(ex){}

		return str;
	};

	/* get the offsetLeft and offsetTop to the border of the container(default is browser) */
	this.getoffset = function(obj, container)
	{
		var tempObj = obj;
		var relPo = {
			top:0,
			left:0
		};

		while(true)
		{
			if (tempObj == container || tempObj == null)
			{
				break;
			}

			relPo.left += parseInt(tempObj.offsetLeft);
			relPo.top += parseInt(tempObj.offsetTop);
			tempObj = tempObj.offsetParent;
		}

		return relPo;
	};

	this.attachEvnt = function(target, event, handle)
	{
		if (event.indexOf("on") == 0)
		{
			event = event.substring(2);
		}

		if (document.body.attachEvent)
		{
			target.attachEvent("on"+event, handle);
		}
		else
		{
			target.addEventListener(event, handle, false);
		}
	};

	this.detachEvnt = function(target, event, handle){
		if (event.indexOf("on") == 0)
		{
			event = event.substring(2);
		}

		if (document.body.attachEvent)
		{
			target.detachEvent("on" + event, handle);
		}
		else
		{
			target.removeEventListener(event, handle, false);
		}
	};

	/* stop propagation of event */
	this.stopProp = function (event)
	{
		event = event || window.event;
		if (undefined == event)
		{
			return;
		}

		if (event.stopPropagation)
		{
			event.stopPropagation();
		}
		else
		{
			event.cancelBubble = true;
		}
	};

	/* prevent defaut operation of event */
	this.eventPreventDefault = function (event)
	{
		event = event || window.event;
		if (undefined == event)
		{
			return;
		}

		if (event.preventDefault)
		{
			event.preventDefault();
		}
		else
		{
			event.returnValue = false;
		}
	};

	/* clear selection produced width mouse move */
	this.clearSelection = function ()
	{
		try
		{
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		}
		catch(ex){
			log("clearSelection: " + ex);
		}
	};

	/* 设置dom上range的光标位置 */
	this.setDomCursorPos = function (dom, pos)
	{
		if (dom.setSelectionRange)
		{
			dom.focus();
			dom.setSelectionRange(pos, pos);
		}
		else if (dom.createTextRange)
		{
			var range = dom.createTextRange()
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}

	/* get the pos of the mouse width the event */
	this.getMousePos = function (event)
	{
		event = event || window.event;
		var doc = document;
		var pos = (event.pageX || event.pageY) ? {x:event.pageX,y:event.pageY}:
				{x:event.clientX + doc.documentElement.scrollLeft - doc.documentElement.clientLeft,
				 y:event.clientY + doc.documentElement.scrollTop - doc.documentElement.clientTop};
		return pos;
	};

	/* 判断对象是否是数组 */
	this.isArray = function (obj)
	{
		return Object.prototype.toString.call(obj) === '[object Array]';
	};

	/* create up down */
	this.upDown = function (con, taId, classNameUp, classNameDown, callBack)
	{
		if (classNameUp == undefined || classNameDown == undefined)
		{
			return;
		}

		var lbl = this.el("label");

		lbl.className = classNameDown;
		lbl.onclick = function(){
			$("#"+taId).slideToggle("normal", function(){
				lbl.className = (lbl.className == classNameUp?classNameDown:classNameUp);
				if (callBack)
				{
					try
					{
						callBack();
					}catch(ex){}
				}
			});
		};
		con.appendChild(lbl);

		return lbl;
	};

	this.arrowUpDown = function (con, taId, callBack){
		this.upDown(con, taId, "arrowUp", "arrowDown", callBack);
	};

	/* 获取dom节点下指定类型的节点，index可选, filter:"input checkbox" */
	this.getChildNode = function(parent, filter, index){
		var childs = parent.childNodes;
		var nodes = [], count = 0, tempNode;
		var paras = filter.split(" ");
		var nodeName = paras[0], type = paras[1];

		for(var i = 0, len = childs.length;i < len; i++)
		{
			tempNode = childs[i];
			if (tempNode.nodeType == 1 && tempNode.tagName.toLowerCase() == nodeName)
			{
				if (type != undefined && tempNode["type"] == type)
				{
					nodes[count] = tempNode;
					count++;
				}
				else if (type == undefined)
				{
					nodes[count] = tempNode;
					count++;
				}
			}
		}
		if (index != undefined)
		{
			return nodes[index];
		}

		return nodes[0];
	};

	/* 检查节点是否可见 */
	this.checkInHorize = function(ta){
		var node = ta;
		while(node != null && node.nodeName.toUpperCase() != "HTML")
		{
			if (this.getNodeDefaultView(node, "visibility") == "hidden" ||
				this.getNodeDefaultView(node, "display") == "none")
			{
				return false;
			}
			node = node.parentNode;
		}

		return true;
	};

	this.setUrlHash = function(key, value)
	{
		var strH, strT, pos, tag ="";
		var url = location.href;
		var hash = location.hash;

		if (key == undefined ||
			value == undefined ||
			key.length == 0)
		{
			return;
		}

		if (hash.length != 0)
		{
			pos = hash.indexOf(key);
			if (pos >= 0)
			{
				strH = hash.substring(0, pos);
				strT = hash.substring(pos);
				pos = strT.indexOf("#");
				if (pos > 0)
				{
					strT = strT.substring(pos);
					hash = strH + key + "=" + value + strT;
				}
				else
				{
					hash = strH + key + "=" + value;
				}
			}
			else
			{
				if (hash.substring(hash.length - 1) != "#")
				{
					tag = "#";
				}
				hash += (tag + key + "=" + value);
			}

			location.href = url.substring(0, url.indexOf("#")) + hash;
		}
		else
		{
			if (url.lastIndexOf("#") == (url.length - 1))
			{
				location.href += (key + "=" + value);
			}
			else
			{
				location.href += ("#" + key + "=" + value);
			}
		}
	};

	this.getUrlHash = function(key)
	{
		var hash = location.hash;
		var pos = hash.indexOf(key);
		var strArr, tempArr, value = "";

		if (pos > 0)
		{
			strArr = hash.substring(1).split("#");
			for(var index in strArr)
			{
				tempArr = strArr[index].split("=");
				if (tempArr[0] == key)
				{
					value = tempArr[1];
					break;
				}
			}
		}

		return value;
	};

	this.changeUrlHash = function(str)
	{
		var url = location.href;
		var pos = url.indexOf("#");

		if (str == undefined)
		{
			return;
		}

		if (pos > 0)
		{
			location.href = url.substring(0, pos + 1) + str;
		}
		else
		{
			location.href = url + "#" +str;
		}
	};

	/* 设置输入框的光标的位置 */
	this.setInputCursor = function(input){
		var len = input.value.length;

		this.setDomCursorPos(input, len);
	};

	/* 获取字符串的长度 */
	this.getCNStrLen = function(str){
		return str.replace(/[^\x00-\xFF]/g, "xxx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};

	/* BEGIN: added by xiesimin */
	/* SLP采用UTF-8编码，存储中文时每个中文占3个字节，但页面显示时，每个中文字符的宽度还是按2个字符计算 */
	this.getDisplayStrLen = function(str) {
		return str.replace(/[^\x00-\xFF]/g, "xx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};
	/* END: added by xiesimin */

	/* 截取字符串，如果超过maxNum则以...结束 */
	this.getStrInMax = function(value, maxNum){
		var str = "", strTemp, j = 0;
		var tmpStr = value.replace(/[A-Z]/g, "xx");

		if (getDisplayStrLen(tmpStr) <= maxNum)
		{
			return value;
		}

		for(var count = 1; count <= maxNum; count++)
		{
			strTemp = value.charAt(j);
			if (strTemp == "")
			{
				break;
			}

			/*BEGIN: modified by xiesimin, SLP采用UTF-8编码*/
			if (getDisplayStrLen(strTemp) > 1)
			{
				count+=(getDisplayStrLen(strTemp)-1);
				str += strTemp;
				beCut = true;
			}
			else if (/[A-Z]/g.test(strTemp) == true)
			{
				count++;
				str += strTemp;
				beCut = true;
			}
			else
			{
				str += strTemp;
			}
			/*END: modified by xiesimin, SLP采用UTF-8编码*/

			j++;
		}
		return str + "...";
	};

	this.EncodeURLIMG = document.createElement("img");

	/* 对多字节字符编码 */
	this.escapeDBC = function(s)
	{
		var img = this.EncodeURLIMG;

		if (!s)
		{
			return "";
		}

		if (window.ActiveXObject)
		{
			/* 如果是IE, 使用vbscript */
			execScript('SetLocale "zh-cn"', 'vbscript');
			return s.replace(/[\d\D]/g, function($0) {
				window.vbsval = "";
				execScript('window.vbsval=Hex(Asc("' + $0 + '"))', "vbscript");
				return "%" + window.vbsval.slice(0,2) + "%" + window.vbsval.slice(-2);
			});
		}

		/* 其它浏览器利用浏览器对请求地址自动编码的特性 */
		img.src = "nothing.png?separator=" + s;

		return img.src.split("?separator=").pop();
	};

	/* 对URL的参数进行GBK或UTF-8编码 */
	this.encodeURL = function(s)
	{
		return encodeURIComponent(s);

		/* 把 多字节字符 与 单字节字符 分开，分别使用 escapeDBC 和 encodeURIComponent 进行编码 */
		/*return s.replace(/([^\x00-\xff]+)|([\x00-\xff]+)/g, function($0, $1, $2) {
			return escapeDBC($1) + encodeURIComponent($2 || '');
		});*/
	};

	this.doNothing = function()
	{
		return true;
	};

	/* 转换特殊的HTML标记 */
	this.htmlEscape = function(str)
	{
		var escapseStr = str;

		if (undefined != escapseStr)
		{
			escapseStr = escapseStr.toString().replace(/[<>&"]/g, function(match){
				switch(match)
				{
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				case "&":
					return "&amp;";
				case "\"":
					return "&quot;";
				}
			});
		}

		return escapseStr;
	};

	this.orgAuthPwd = function(pwd)
	{
		var strDe = "RDpbLfCPsJZ7fiv";
		var dic = "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciX"+
				  "TysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgML"+
				  "wygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3"+
				  "sfQ1xtXcPcf1aT303wAQhv66qzW";

		return this.securityEncode(pwd, strDe, dic);
	};

	this.securityEncode = function(input1, input2, input3)
	{
		var dictionary = input3;
		var output = "";
		var len, len1, len2, lenDict;
		var cl = 0xBB, cr = 0xBB;

		len1 = input1.length;
		len2 = input2.length;
		lenDict = dictionary.length;
		len = len1 > len2 ? len1 : len2;

		for (var index = 0; index < len; index++)
		{
			cl = 0xBB;
			cr = 0xBB;

			if (index >= len1)
			{
				cr = input2.charCodeAt(index);
			}
			else if (index >= len2)
			{
				cl = input1.charCodeAt(index);
			}
			else
			{
				cl = input1.charCodeAt(index);
				cr = input2.charCodeAt(index);
			}

			output += dictionary.charAt((cl ^ cr)%lenDict);
		}

		return output;
	};

	/* 模拟鼠标点击操作 */
	this.simulateMouseC = function (target)
	{
		if (true == isIE && false == isIENormal)
		{
			simulateMouseC = function(target){
				var event = document.createEventObject();

				event.sceenX = 100;
				event.sceenY = 0;
				event.clientX = 0;
				event.clientY = 0;
				event.ctrlKey = false;
				event.altKey = false;
				event.shiftKey = false;
				event.button = 0;

				target.fireEvent("onclick", event);
			};
		}
		else
		{
			simulateMouseC = function(){};
		}

		simulateMouseC(target);
	};

	/* 检查键盘是否开启大写按键 */
	this.checkCapsLockUp = function(event){
		var e = event || window.event;
		var capsLockKey = e.keyCode ? e.keyCode : e.which;
		var shifKey = e.shiftKey ? e.shiftKey:((capsLockKey == 16) ? true : false);

		if(((capsLockKey >= 65 && capsLockKey <= 90) && !shifKey) ||
			((capsLockKey >= 97 && capsLockKey <= 122) && shifKey))
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	this.emptyNodes = function(node)
	{
		/* for the bug of MSIE 6.0 */
		/*if (node)
		{
			node.innerHTML = "";
			return;
		}*/

		while(node && node.firstChild)
		{
			node.removeChild(node.firstChild);
		}
	};

	this.netSpeedTrans = function(speed)
	{
		var kSpeed = 1024;
		var mSpeed = kSpeed * 1024;
		var gSpeed = mSpeed * 1024;

		speed = parseInt(speed);

		if (speed >= gSpeed)
		{
			speed = (speed/gSpeed).toFixed(0) + "GB/s";
		}
		else if (speed >= mSpeed)
		{
			speed = (speed/mSpeed).toFixed(0) + "MB/s";
		}
		else
		{
			speed = (speed/kSpeed).toFixed(0) + "KB/s";
		}

		return speed.toString();
	};

	this.log = function(){
		var logStr = "", logLen = arguments.length;

		if (this.logSwitch === true || true == $.local)
		{
			for (var i = 0; i < logLen; i++)
			{
				logStr += "\'" + arguments[i] + "\', ";
			}

			logStr += "\'.\'";
			try
			{
				eval("console.log("+logStr+")");
			}catch(ex){}
		}
	};

	this.compareObj = function(objS, objT){
		var tag = true;

		for (var item in objS)
		{
			if ("object" == typeof objS[item])
			{
				if (undefined != objT[item])
				{
					tag = compareObj(objS[item], objT[item]);
					if (tag == false)
					{
						return false;
					}
				}
				else
				{
					return false;
				}
			}
			else
			{
				if (objS[item] != objT[item])
				{
					return false;
				}
			}
		}

		return tag;
	};

	this.strToArry = function(str)
	{
		if (/^\((\-?\w+\,)+\-?\w+\)$/gi.test(str) == true)
		{
			return str.substring(1, str.length - 1).split(",");
		}
	};
}
function Switch(switchId, state, callback)
{
	this.switchCon = id(switchId);
	this.switchBall = $("#" + switchId + " i.switchBall")[0];
	this.switchBg = $("#" + switchId + " i.switchBg")[0];
	this.switchTip = $("#" + switchId + " ~ label")[0];
	this.callback = callback;
	this.state = state;
	this.rightPos;
	this.padding = -9;
	this.step = 20;
	this.stepTime = 5;

	if (typeof Switch.prototype.switchInit != "function")
	{
		Switch.prototype.switchInit = function(){
			var objThis = this;
			var state = this.state;
			var switchBall = this.switchBall;
			var switchCon = this.switchCon;
			var switchBg = this.switchBg;

			if (switchCon == null || switchBall == null)
			{
				return;
			}

			this.rightPos = switchBg.offsetWidth;
			this.setState(state);
			typeof this.callback == "function" && this.callback(state);
			switchBall.onmousedown = this.draggableBind();
			switchBg.onclick = this.switchBgClick();
		};

		/* 设置状态 */
		Switch.prototype.setState = function(state){
			var switchCon = this.switchCon;
			var switchBall = this.switchBall;
			var switchBg = this.switchBg;
			var switchTip = this.switchTip;
			var posiLeft = this.padding;

			this.state = state;
			switchCon.value = state;
			switchBall.style.left = 0 - switchBall.offsetWidth / 2 + state * this.rightPos + "px";
			if (state == 1)
			{
				switchBg.style.background = "#6289D7";
				if (!isIETenLess || isIETen)
				{
					switchBg.style.background = "linear-gradient(#6289D7, #6599FF)";
				}
				(switchTip != null) && (switchTip.innerHTML = label.open);
			}
			else
			{
				switchBg.style.background = "#A7A9AE";
				if (!isIETenLess || isIETen)
				{
					switchBg.style.background = "linear-gradient(#A7A9AE, #B8BBC0)";
				}
				switchTip != null && (switchTip.innerHTML = label.close);
			}
			//hsSwitchState(switchCon.id, state);
		};

		/* 状态修改 */
		Switch.prototype.switchChgState = function(state){
			state = 1 - state;
			this.setState(state);
			typeof this.callback == "function" && this.callback(state);
		};

		/* 点击的响应函数 */
		Switch.prototype.switchCHandle = function(){
			/* 1为on, 0 为off */
			var state = this.state;
			var switchBall = this.switchBall;
			var tag = (state == 1 ? -1 : 1);
			var left = parseInt(switchBall.style.left);
			var width = this.rightPos;
			var obj = this;

			/* on to off */
			if ((state == 1 && left <= this.padding) || (state == 0 && left >= width + this.padding))
			{
				this.switchChgState(state);
				return;
			}

			switchBall.style.left = left + tag * width + "px";
			window.setTimeout(function(){obj.switchCHandle()}, 10);
		};

		Switch.prototype.msMove = function(ta, currMousePos, distance)
		{
			var taWidth = ta.offsetWidth;
			var posX = currMousePos.x - distance.x;
			var maxX = this.switchBg.offsetWidth - ta.offsetWidth / 2;

			posX = posX > -10 ? posX:-10;
			posX = posX > maxX ? maxX:posX;
			ta.style.left = posX + "px";
		};

		/* switchBg的点击处理函数 */
		Switch.prototype.switchBgClick = function(){
			var objThis = this;

			return function(event){
				event = event || window.event;
				var target = event.target || event.srcElement;

				if (objThis.switchBg == target)
				{
					objThis.switchCHandle();
				}
			};
		};

		Switch.prototype.draggableBind = function()
		{
			var thisObj = this;

			return function(event){
				event = event ? event : window.event;
				var currMousePos = getMousePos(event);
				var ta = event.target || event.srcElement;

				/* 记录鼠标按下瞬间鼠标与控件左上角的距离 */
				var distance = {x:currMousePos.x - ta.offsetLeft};

				document.onmousemove = function(event)
				{
					event = event ? event : window.event;
					var currMousePos = getMousePos(event);

					clearSelection();
					thisObj.msMove(ta, currMousePos, distance);
				};

				document.onmouseup = function(event)
				{
					clearSelection();
					document.onmousemove = null;
					document.onmouseup = null;
					thisObj.switchCHandle();
				};

				stopProp(event);
			};
		};
	}

	this.switchInit();
}
function HighSet()
{
	/* 用于设置页面的链接等的状态 */
	this.hsStatSet = function(state, des, idStr)
	{
		var handleRelCon, image, info;

		if (undefined == idStr)
		{
			handleRelCon = $("ul.gridStatus")[0];
			info = $("ul.gridStatus label")[0];
			statPic = $("ul.gridStatus i")[0];
		}
		else
		{
			handleRelCon = $("#" + idStr)[0];
			info = $("#" + idStr + " label")[0];
			statPic = $("#" + idStr + " i")[0];
		}

		switch(state)
		{
		case "null":
			handleRelCon.style.visibility = "hidden";
			break;
		case "correct":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -353px -122px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "error":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -306px -209px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "link":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -372px -123px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "exception":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -334px -123px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		default:
			handleRelCon.style.visibility = "hidden";
			break;
		}
	};

	/* 用于设置输入框中的图标的显示 */
	this.disInputTip = function(target, tag)
	{
		if (target == null || tag == undefined)
		{
			return;
		}

		if (tag.toLowerCase() == "error")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -116px -243px"});
		}
		else if (tag.toLowerCase() == "ok")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -95px -243px"});
		}
		else if (tag.toLowerCase() == "warn")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -137px -243px"});
		}
		else
		{
			target.style.visibility = "hidden";
		}
	};

	/* 设置编辑时输入框的样式 */
	this.initHoverBd = function()
	{
		$("input.hoverBd").bind("focus", function(){
			this.parentNode.style.border = "1px solid #A0D468";
		}).bind("blur", function(){
			this.parentNode.style.border = "1px solid #FFFFFF";
		});
	};

	/* 修改输入框的“启用”和禁用状态 */
	this.disableInput = function(target, disable){
		var input = (typeof target == "object" ? target : id(target));

		input.disabled = disable ? true : false;
		input.style.color = disable ? "#606060" : "#A0A0A0";
	};

	/* 修改输入框的“启用”和禁用状态 */
	this.disableBtn = function(target, disable){
		var input = (typeof target == "object" ? target : id(target));
		var className = input.className;

		if (input.disabled == disable)
		{
			return;
		}

		input.disabled = disable ? true : false;
		input.className = disable ? className.replace("subBtn", "subBtnDis") : className.replace("subBtnDis", "subBtn");
	};

	/* Added by XieSimin */
	this.disableClick = function(target, disable, func)
	{
		var input = (typeof target == "object" ? target : id(target));
		var origFunc = null;

		if (input.disableTimes == null)
		{
			input.disableTimes = 0;
		}

		if (disable == true)
		{
			if (input.disableTimes <= 0)
			{
				input.oldOnClick = input.onclick;
				input.onclick = null;
			}

			origFunc = input.oldOnClick;
			input.disableTimes++;

			return origFunc;
		}
		else
		{
			input.disableTimes--;

			if (input.disableTimes <= 0)
			{
				/* 如果已经重新设置了onclick，则不覆盖后来设置的值 */
				if (input.onclick == null)
				{
					input.onclick = input.oldOnClick;
				}

				input.oldOnClick = null;
			}

			return null;
		}
	};

	/* 控制loading等效果的显示和不显示的状态切换 */
	this.hsLoading = function(btnId, state, options){
		var subBtn = id(btnId);
		var con, subLoading, loadingCon, span;
		var imgUrl = "../web-static/images/loading.gif";
		var loadingLeft = 12;
		var conClassName = "hsLoadingCon";
		var noteStr = "";

		if (subBtn == null)
		{
			return;
		}

		if (null != options)
		{
			imgUrl = options.imgUrl || imgUrl;
			loadingLeft = options.loadingLeft || loadingLeft;
			conClassName = options.conClassName || conClassName;
			noteStr = options.noteStr || noteStr;
		}

		con = subBtn.parentNode;
		clearTimeout(con.handleDelayHd);

		/* 通过判断state的值，设置subLoading控件的显示情况 */
		if (true == state)
		{
			con.style.position = "relative";
			loadingCon = $("#" + btnId + " ~ div." + conClassName);

			/* 如果控件没有加载过，则进行加载 */
			if (loadingCon[0] == null)
			{
				loadingCon = el("div");
				loadingCon.className = conClassName;
				con.appendChild(loadingCon);

				subLoading = el("img");
				subLoading.src = imgUrl;
				loadingCon.appendChild(subLoading);

				span = el("span");
				loadingCon.appendChild(span);
			}
			else
			{
				subLoading = loadingCon.find("img")[0];
				span = loadingCon.find("span")[0];
				loadingCon = loadingCon[0];
			}

			loadingCon.style.top = subBtn.offsetTop + parseInt((subBtn.offsetHeight - parseInt(getNodeDefaultView(subLoading, "height")))/2)
									+  "px";
			loadingCon.style.left = subBtn.offsetLeft + subBtn.offsetWidth + loadingLeft + "px";

			if (noteStr.length != 0)
			{
				span.innerHTML = noteStr;
				loadingCon.style.width = parseInt(getNodeDefaultView(subLoading, "width")) +
							 span.offsetWidth + parseInt(getNodeDefaultView(span, "marginLeft")) + "px";
			}

			loadingCon.style.visibility = "visible";
		}
		else
		{
			con.handleDelayHd = window.setTimeout(function(){
				var loadingCon = $("#" + btnId + " ~ div." + conClassName)[0];

				con.handleDelayHd = null;
				if (undefined != loadingCon)
				{
					loadingCon.style.visibility = "hidden";
				}
			}, 500);
		}
	};

	this.hsSwitchState = function(conId, state)
	{
		var hsBCSwitchState = $("#" + conId + " ~ span.hsSwitchState")[0];

		if (hsBCSwitchState == null)
		{
			return;
		}

		if (1 == state)
		{
			hsBCSwitchState.innerHTML = statusStr.opened;
			hsBCSwitchState.style.color = "#86B157";
		}
		else
		{
			hsBCSwitchState.innerHTML = statusStr.closed;
			hsBCSwitchState.style.color = "#FB6E52";
		}
	};
}
function Basic()
{
	this.gIsFactory = false;
	this.NET_STATE_INDEX = 0;
	this.LINK_EPTMGT_INDEX = 1;
	this.APPS_MGT_INDEX = 2;
	this.ROUTE_SET_INDEX = 3;

	/* Content.htm页面的处理函数 */
	this.contentPageLoad = function(){
		loadBasic();
	};

	/* 设置页面加载的菜单的序号 */
	this.gBasicMenu = {menuIndex:NET_STATE_INDEX, subMenuUrl:""};

	this.setBasicMenu = function(menuIndex, subMenuUrl){
		this.gBasicMenu["menuIndex"] = (menuIndex == undefined ? this.gBasicMenu["menuIndex"] : menuIndex);
		this.gBasicMenu["subMenuUrl"] = (subMenuUrl == undefined ? this.gBasicMenu["subMenuUrl"] : subMenuUrl);
	};

	this.setBasicSubMenuUrl = function(subMenuUrl){
		this.gBasicMenu["subMenuUrl"] = subMenuUrl;
	};

	/* 加载Basic的页面 */
	this.loadBasic = function(menuIndex, subMenuUrl, callBack){
		//this.basicAutoFit();
		this.setBasicMenu(menuIndex, subMenuUrl);
		loadPage("Basic.htm", "Con", callBack);
	};

	/* 设置Basic页面的高度和fontSize */
	this.basicAutoFit = function()
	{
		var screenHeight = screen.height;
		var clientHeight = document.documentElement.clientHeight;

		/* 根据分辨率设置页面高度 */
		if (clientHeight < 768)
		{
			document.body.style.height = "768px";
		}
		else if (clientHeight > 900)
		{
			document.body.style.height = "900px";
		}

		/* 根据分辨率设置页面字体大小 */
		if (screenHeight <= 768)
		{
			document.body.style.fontSize = "12px";
		}
		else if (screenHeight > 900)
		{
			document.body.style.fontSize = "12px";
		}
		else
		{
			document.body.style.fontSize = "12px";
		}
	};
}
function ShowTips()
{
	this.alertTimeHd;
	this.shAltObjOrId;

	/* 用于显示错误的提示信息 */
	this.showAlert = function(errString, objOrId, screenMiddle, func){
		if (true == isIESix)
		{
			alert(errString);
			if (errStr.invPermissionDenied == errString)
			{
				$.logout();
			}
			return;
		}

		this.showCover(function(){
			var error = id("Error");
			var hsErr = id("hsErr");
			var p, input, ifm;
			var objThis = this;

			this.shAltObjOrId = objOrId;
			input = $("div.hsTip input.subBtn")[0];

			if (hsErr == null)
			{
				hsErr = document.createElement("div");
				hsErr.id = "hsErr";
				hsErr.className = "hsTip";

				ifm = el("iframe");
				ifm.frameborder = 0;
				ifm.className = "tipIframe";
				hsErr.appendChild(ifm);

				p = document.createElement("p");
				p.className = "detail";
				hsErr.appendChild(p);

				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA";
				input.value = btn.ok;
				hsErr.appendChild(input);

				error.appendChild(hsErr);
			}

			getChildNode(hsErr, "p").innerHTML = errString;

			if (screenMiddle)
			{
				hsErr.style.marginLeft = "280px";
			}

			input.onclick = function(){
				if (errStr.invPermissionDenied == errString)
				{
					$.logout();
					return;
				}
				typeof func == "function" && func();
				objThis.closeAlert(true);
			};

			error.style.visibility = "visible";
			error.style.display = "block";
			error.style.top = "160px";

			/* 如果是移动设备设置error的position为absolute */
			if (false == OS.portable)
			{
				setStyle(error, {"position":"fixed"});
			}
			else
			{
				setStyle(error, {"position":"absolute"});
			}

			if (false == OS.iPhone && false == OS.iPad)
			{
				input.focus();
			}

			this.alertTimeHd = $.setTimeout(function(){objThis.closeAlert(null, errString)}, 30000);
		});
	};

	/* 用于关闭错误的提示信息 */
	this.closeAlert = function(btnClick, errString){
		if (null != errString && errStr.invPermissionDenied == errString)
		{
			$.logout();
		}
		this.hideCover(
			function(){
				var error = id("Error");
				var objOrId = this.shAltObjOrId;

				if (error == null)
				{
					return;
				}

				error.style.top = "-9999px";
				error.style.visibility = "hidden";
				clearTimeout(this.alertTimeHd);
				this.alertTimeHd = null;

				if (true == btnClick && undefined != objOrId && (typeof objOrId == "object" || 0 != objOrId.length))
				{
					try
					{
						if (typeof objOrId != "object")
						{
							objOrId = id(objOrId);
						}

						objOrId.focus();
						objOrId.select();
					}catch(ex){};
				}
				else
				{
					this.shAltObjOrId = "";
				}
			}
		);
	};

	this.showConfirmIpc = function(confStr, callBack, btnTipOk, btnTipCancel){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var p, input, inputCol, confirmIframe;
			var objThis = this;
			var result;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTip";

				confirmIframe = el("iframe");
				confirmIframe.frameborder = 0;
				confirmIframe.className = "tipIframe";
				hsConf.appendChild(confirmIframe);

				p = document.createElement("p");
				p.className = "detail";
				hsConf.appendChild(p);

				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA";
				hsConf.appendChild(input);

				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA";
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			if (undefined != btnTipOk)
			{
				inputCol[0].value = btnTipOk;
			}
			else
			{
				inputCol[0].value = btn.cancel;
			}
			if (undefined != btnTipCancel)
			{
				inputCol[1].value = btnTipCancel;
			}
			else
			{
				inputCol[1].value = btn.ok;
			}
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "160px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});

	};

	/* 用于显示“确认信息” */
	this.showConfirm = function(confStr, callBack){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var p, input, inputCol;
			var objThis = this;
			var result;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTip";
				p =  document.createElement("p");
				p.className = "detail";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA";
				input.value = btn.cancel;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA marBtn";
				input.value = btn.ok;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "160px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	/* 用于关闭“确认信息” */
	this.closeConfirm = function(){
		this.hideCover(function(){
			var conf = id("Confirm");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	};

	/* 用于显示“确认信息”,显示图片 */
	this.showConfirmB = function(confStr, callBack){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var img, p, input, inputCol;
			var objThis = this;
			var result;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTip";
				img =  document.createElement("i");
				img.className = "confirmImg";
				hsConf.appendChild(img);
				p =  document.createElement("p");
				p.className = "detailImg";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btn.cloudRetry;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn cancel";
				input.value = btn.cloudBack;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "90px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	/* 用于关闭“确认信息” */
	this.closeConfirmB = function(){
		this.hideCover(function(){
			var conf = id("Confirm");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	}

	/* 用于显示“确认标头”和“确认信息” */
	this.showConfirmC = function(confTitle, confStr, callBack){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var title, i, p, input, inputCol;
			var objThis = this;
			var result;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTipC";
				title =  document.createElement("h4");
				title.className = "title";
				hsConf.appendChild(title);
				i =  document.createElement("i");
				i.id = "closeTip";
				hsConf.appendChild(i);
				p =  document.createElement("p");
				p.className = "detail";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtnB btnA";
				input.value = btn.cancel;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn btnA";
				input.value = btn.ok;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			id("closeTip").onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			getChildNode(hsConf, "h4").innerHTML = confTitle;
			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "160px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	/* 用于显示提示信息 */
	this.showNote = function(idStr, noteStr, className, paraObj){
		var target = id(idStr);
		var noteCon = $("div.cloudManageCon")[0] || $("div.basicConR1")[0] || $("div.lgCon")[0] || document.body, position;
		var width, pos, borderColor, borderWidth;
		var noteDiv, span, i, noteArrow, noteSpan, $noteDiv;
		var changeColor = "#FF5500";
		var changeBW = 1, len;

		if (undefined == target)
		{
			return;
		}

		if (undefined != paraObj)
		{
			changeColor = paraObj.changeColor == undefined ? changeColor : paraObj.changeColor;
			changeBW = paraObj.changeBW == undefined ? changeBW : paraObj.changeBW;
		}

		/* 绑定body上的showNote的隐藏处理 */
		/*if (document.body.showNote !== true)
		{
			document.body.showNote = true;
			attachEvnt(document.body, "click", function(event){
				var target;

				event = event || window.event;
				target = event.target || event.srcElement;

				if (target.tagName.toLowerCase() == "input" &&
					("text password number file button".indexOf(target.type.toLowerCase()) >= 0 || target.className.indexOf("text") >= 0))
				{
					if ("button" == target.type.toLowerCase() && target.value != btn.gridCancel)
					{
						return;
					}

					closeNoteAll();
				}
			});
		}*/

		id(idStr).onfocus = function(){closeNoteAll();}

		noteDiv = id(idStr + "noteDiv");
		if (null == noteDiv)
		{
			/* 创建note */
			noteDiv = el("div");
			noteDiv.className = (className == undefined ? "noteDiv" : "noteDiv " + className);
			noteDiv.id = idStr + "noteDiv";

			noteSpan = span = el("span");
			span.className = "noteStr";
			noteDiv.appendChild(span);

			noteArrow = i = el("i");
			i.className = "noteArrow";
			noteDiv.appendChild(i);
			noteCon.appendChild(noteDiv);

			borderColor = getNodeDefaultView(target, "border-left-color");
			if (borderColor == undefined || borderColor.length == 0)
			{
				borderColor = getNodeDefaultView(target, "borderLeftColor");
			}

			target.orgBC = borderColor;

			borderWidth = getNodeDefaultView(target, "border-left-width");
			if (borderWidth == undefined || borderWidth.length == 0)
			{
				borderWidth = getNodeDefaultView(target, "borderLeftWidth");
			}

			/*use isNaN to solve error in IE6 and IE8*/
			target.orgBW = borderWidth = (!isNaN(parseInt(borderWidth)) || "" == parseInt(borderWidth))?parseInt(borderWidth):0;
			target.changeBW = changeBW = parseInt(changeBW);
			target.wd = parseInt(getNodeDefaultView(target, "width"));
			target.ht = parseInt(getNodeDefaultView(target, "height"));
			target.lineht = parseInt(getNodeDefaultView(target, "lineHeight"));
		}
		else
		{
			$noteDiv = $(noteDiv);
			noteSpan = $noteDiv.find("span")[0];
			noteArrow = $noteDiv.find("i.noteArrow")[0];
		}

		if (undefined != noteStr)
		{
			noteSpan.innerHTML = noteStr;
		}

		target.style.borderColor = changeColor;
		target.style.boxShadow = "";
		target.style.borderWidth = target.changeBW + "px";
		len = (target.orgBW - target.changeBW) * 2;
		target.style.height = target.ht + len + "px";
		target.style.width = target.wd + len + "px";
		if(target.lineht){
			target.style.lineHeight = target.lineht + len + "px";
		}
		pos = getoffset(target, noteCon);
		height = noteDiv.offsetHeight;
		noteDiv.style.top = pos.top + target.clientHeight / 2 - height / 2 + "px";
		noteDiv.style.left = pos.left + target.clientWidth + 9 + "px";
		noteArrow.style.top = noteDiv.clientHeight / 2 - 5 + "px";
		noteDiv.style.visibility = "visible";
	};

	/* 用于关闭提示信息 */
	this.closeNote = function(idStr){
		var target = id(idStr);
		var noteDiv = id(idStr + "noteDiv");

		if (undefined != noteDiv)
		{
			try
			{
				if (undefined != target.orgBC && target.orgBC.length != 0)
				{
					target.style.borderColor = target.orgBC;
					target.style.borderWidth = target.orgBW + "px";
					target.style.height = target.ht + "px";
					target.style.width = target.wd + "px";
					target.style.borderColor = "";
					target.style.boxShadow = "";
					target.style.lineHeight = target.lineht + "px";
				}
			}
			catch(ex)
			{
				log(ex);
			}

			noteDiv.style.visibility = "hidden";
		}
	};

	/* 用于关闭所有提示信息 */
	this.closeNoteAll = function(){
		$("input").each(function(){
			if (("text password number file button".indexOf(this.type.toLowerCase()) >= 0 || this.className.indexOf("text") >= 0) && this.id.length > 0)
			{
				closeNote(this.id);
			}
		});
	};

	/* 用于删除所有提示信息 */
	this.removeNoteAll = function(){
		$("div.noteDiv").each(function(){
			this.parentNode.removeChild(this);
		});
	};

	/* 显示正在loading的状态 */
	this.showLoading = function(noteStr, closeCallBack, classObj, showBtn)
	{
		closeLoading();
		showCover(function(cover){
			var coverId = cover.id;
			var loadCon, load, loadCover;
			var loadImg, detail, close;
			var cover$ = $("#" + coverId);
			var loadConClass, loadClass;
			var coverLoadingClass, detailClass;
			var coverOpacity = 0.1;

			if (undefined != classObj)
			{
				loadConClass = classObj.loadConClass;
				loadClass = classObj.loadClass;
				coverLoadingClass = classObj.coverLoadingClass;
				detailClass = classObj.detailClass;
				coverOpacity = classObj.coverOpacity || 0;
			}

			/* 将cover设置为透明的 */
			cover$.css("opacity", coverOpacity);

			loadCover = el("div");
			loadCover.className = "LoadConCover";
			document.body.appendChild(loadCover);

			loadCon = el("div");
			loadCon.className = loadConClass || "coverLoadCon";
			loadCover.appendChild(loadCon);

			load = el("div");
			load.className = loadClass || "coverLoad";
			loadCon.appendChild(load);

			if (undefined == coverLoadingClass)
			{
				loadImg = el("img");
				loadImg.className = "coverLoading";
				loadImg.src = "../web-static/images/loading.gif";
				load.appendChild(loadImg);
			}
			else
			{
				loadImg = el("i");
				loadImg.className = coverLoadingClass;
				load.appendChild(loadImg);
			}

			detail = el("p");
			detail.className = detailClass || "coverLoadNote";
			detail.innerHTML = (noteStr == undefined ? label.checkingWait : noteStr);
			load.appendChild(detail);

			showBtn = (undefined == showBtn) ? true : showBtn;
			if (true == showBtn)
			{
				close = el("input");
				close.type = "button";
				close.className = "coverLoadClose cancelBtn";
				close.value = btn.cancel;
				close.onclick = function(){
					closeLoading(closeCallBack);
				};
				load.appendChild(close);
			}
		});
	};

	/* 关闭正在loading的状态 */
	this.closeLoading = function(closeCallBack)
	{
		var loadCover = $("div.LoadConCover")[0];

		if (null == loadCover)
		{
			return;
		}

		$("#" + this.CoverId).css("opacity", "");
		document.body.removeChild(loadCover);
		hideCover(closeCallBack);
	};

	/* 在设置向导中显示弹出框 */
	this.showPhWzdAlert = function(errString, callBack)
	{
		this.showCover(function(){
			var con, img, p, lbl;
			var conId = "phWzdAlertCon";
			var objThis = this;

			con = id(conId);
			if (null == con)
			{
				con = document.createElement("div");
				con.className = "phWzdAlertCon";
				con.id = conId;
				document.body.appendChild(con);

				img = document.createElement("img");
				img.src = "../web-static/images/redWarn.png";
				con.appendChild(img);

				p = document.createElement("p");
				con.appendChild(p);

				lbl = document.createElement("label");
				con.appendChild(lbl);
				lbl.innerHTML = btn.confirm;
			}
			else
			{
				p = $("#" + conId +" p")[0];
				lbl = $("#" + conId +" label")[0];
			}

			con.style.top = "150px";
			con.style.visibility = "visible";
			p.innerHTML = errString;
			lbl.onclick = function(){
				typeof callBack == "function" && callBack();
				objThis.closePhWzdAlert();
			};
		});
	};

	this.closePhWzdAlert = function()
	{
		this.hideCover(function(){
			var con = id("phWzdAlertCon");
			if (null != con)
			{
				con.style.top = "-9999px";
			}
		});
	};

	this.gToastConCoverId = "toastConCover";

	/* type值的范围: success为成功，loading为正在加载的状态，默认为loading*/
	this.showToast = function(type, options){
		showCover(function(cover){
			var coverOpacity = 0;
			var toastConCN = "toastCon";
			var toastConverCN = "toastConCover";
			var toastCover = $("#" + gToastConCoverId);
			var toastSpan, toastImg, toastIfm, stopSuccessTime = false;
			var loadGifUrl = "../web-static/images/loading.gif";
			var noteStr = "";

			if (undefined != options)
			{
				coverOpacity = options.coverOpacity || 0;
				toastConCN = options.toastConCN || toastConCN;
				toastConverCN = options.toastConverCN || toastConverCN;
				stopSuccessTime = options.stopSuccessTime || stopSuccessTime;
				loadGifUrl = options.loadGifUrl || loadGifUrl;
				noteStr = options.noteStr || noteStr;
			}

			/* 设置cover的透明度 */
			$("#" + cover.id).css("opacity", coverOpacity);

			if (null == toastCover[0])
			{
				toastCover = el("div");
				toastCover.className = toastConverCN;
				toastCover.id = gToastConCoverId;

				toastCon = el("div");
				toastCon.className = toastConCN;
				toastCover.appendChild(toastCon);

				toastIfm = el("iframe");
				toastIfm.frameborder = 0;
				toastCon.appendChild(toastIfm);

				toastImg = el("img");
				toastCon.appendChild(toastImg);

				toastSpan = el("span");
				toastCon.appendChild(toastSpan);

				document.body.appendChild(toastCover);

				attachEvnt(window, "resize", function(){
					if (toastCover.style.visibility != "hidden")
					{
						var top = (document.body.clientHeight - parseInt(getNodeDefaultView(toastCon, "height"))) / 2;

						toastCover.style.top = parseInt(top) + "px";
					}
				});
			}
			else
			{
				toastSpan = toastCover.find("span")[0];
				toastImg = toastCover.find("img")[0];
				toastCon = toastCover.find("div")[0];
				toastCover = toastCover[0];
			}

			try
			{
				clearTimeout(toastCover.closeTimehd);
				clearTimeout(toastCover.timeouthd);
			}
			catch(ex)
			{}

			switch(type)
			{
			case "success":
				noteStr = noteStr || label.optSuccess;
				toastImg.src = "../web-static/images/correct.png";
				if (true !== stopSuccessTime)
				{
					toastCover.closeTimehd = window.setTimeout(closeToast, 500);
				}
				toastImg.style.margin = "20px 0 0 110px";
				break;
			case "setNTPSuccess":
				noteStr = noteStr || label.saveNTPAddrSuccess;
				toastImg.src = "../web-static/images/correct.png";
				if (true !== stopSuccessTime)
				{
					toastCover.closeTimehd = window.setTimeout(closeToast, 500);
				}
				toastImg.style.margin = "20px 0 0 110px";
				break;
			case "fwUpload":
				noteStr = noteStr || label.fwUploadTip;
				toastImg.src = loadGifUrl;
				toastImg.style.margin = "20px 0 0 110px";
				break;
			case "bakUpload":
				noteStr = noteStr || label.bakUploadingTip;
				toastImg.src = loadGifUrl;
				toastImg.style.margin = "20px 0 0 110px";
				break;
			case "loading":
			default:
				noteStr = noteStr || label.plWait;
				toastImg.src = loadGifUrl;
				toastImg.style.margin = "20px 0 0 110px";
				break;
			}

			toastCover.style.top = parseInt((document.body.clientHeight - parseInt(getNodeDefaultView(toastCon, "height"))) / 2) + "px";
			toastSpan.innerHTML = noteStr;
			toastCover.style.visibility = "visible";
			toastCover.timeouthd = $.setTimeout(closeToast, 1000 * 120);
		});
	};

	this.closeToast = function(){
		var toastCover = id(gToastConCoverId);

		if (null != toastCover)
		{
			try
			{
				clearTimeout(toastCover.timeouthd);
				clearTimeout(toastCover.closeTimehd);
			}
			catch(ex)
			{
				log(ex);
			}

			toastCover.timeouthd = null;
			toastCover.closeTimehd = null;
			hideCover(function(){
				toastCover.style.visibility = "hidden";
				toastCover.style.top = "-9999px";
			});
		}
	};
}
function Select()
{
	this.selectUpInit = function(idStr, options, value, callback, maxSize)
	{
		var classObj = {
			type:"up"	/* value: up down */
		};

		selectInit(idStr, options, value, callback, maxSize, classObj);
	}

	this.selectInit = function(idStr, options, value, callback, maxSize, classObj)
	{
		var li, tmp, parent, valueCon, visible = "hidden", i;
		var ul = document.createElement("ul");
		var con = id(idStr), className = "selOptsUl";
		var colorN = "#FFFFFF", colorC = "#EEF3F8";
		var fontColorN = "#333333", fontColorC = "#000000";
		var valueColor = "#333333", valueDisColor = "#999999";
		var hoverColor = "#5A92FF", noHoverColor = "#C8CDD9";
		var valueConTmp, showSize, valueConWidth, fontSize;
		var escapeStr, listScroll, valueDef = value;
		var optHideHd,optHideAllHd, optShowHd;
		var scrollBg = "#999999";
		var scrollZIndex = 1001;
		var scrollMLeft = 3;
		var scrollMTop = 3;
		var type = "down";
		var bottom = "0px";
		var spMouseMove = true;
		var ulID;
		var disabled = true;

		/* ul中的每个li高度默认都为30px */
		var ulHeight = 30;

		if (undefined != classObj)
		{
			className = classObj.className == undefined ?className : classObj.className;
			colorN = classObj.colorN == undefined ?colorN : classObj.colorN;
			colorC = classObj.colorC == undefined ?colorC : classObj.colorC;
			fontColorN = classObj.fontColorN == undefined ?fontColorN : classObj.fontColorN;
			fontColorC = classObj.fontColorC == undefined ?fontColorC : classObj.fontColorC;
			valueColor = classObj.valueColor == undefined ?valueColor : classObj.valueColor;
			valueDisColor = classObj.valueDisColor == undefined ?valueDisColor : classObj.valueDisColor;
			scrollBg = classObj.scrollBg == undefined ? scrollBg : classObj.scrollBg;
			scrollZIndex = classObj.scrollZIndex == undefined ? scrollZIndex : classObj.scrollZIndex;
			scrollMLeft = classObj.scrollMLeft == undefined ? scrollMLeft : classObj.scrollMLeft;
			scrollMTop = classObj.scrollMTop == undefined ? scrollMTop : classObj.scrollMTop;
			type = classObj.type == undefined ? type : classObj.type;
			bottom = classObj.bottom == undefined ? bottom : classObj.bottom;
			optHideHd = classObj.optHideHd;
			optHideAllHd = classObj.optHideAllHd;
			optShowHd = classObj.optShowHd;
			spMouseMove = classObj.spMouseMove == undefined ? spMouseMove : classObj.spMouseMove;
			ulHeight  = classObj.ulHeight == undefined ? ulHeight : classObj.ulHeight;
		}

		parent = con.parentNode;
		valueConTmp = $("#"+idStr+" span.value");
		valueCon = valueConTmp[0];
		valueCon.value = 0;
		valueConWidth = parseInt(valueConTmp.css("width"));
		fontSize = (parseInt(valueConTmp.css("fontSize"))*0.61).toFixed(1);
		showSize = (maxSize == undefined ? parseInt(valueConWidth/fontSize) : maxSize);
		con.value = 0;
		ul.className = className;
		ulID = (className + idStr).replace(/ +/gi, "");
		ul.id = ulID;
		parent.appendChild(ul);

		con.onmouseover = function(){
			if (disabled){
				return;
			}
			if(ul.style.visibility == "visible")
			{
				con.style.borderColor = noHoverColor;
			}
			else
			{
				con.style.borderColor = hoverColor;
			}
		};

		con.onmouseout = function(){
			con.style.borderColor = noHoverColor;
		};

		function hiddenSelect(ul)
		{
			var visibilityVal, li;
			var options = ul.childNodes;

			for (var i = 0, len = options.length; i < len; i++)
			{
				li = options[i];
				if (li.tagName.toLowerCase() == "li")
				{
					visibilityVal = li.childNodes[0].style.visibility;
					li.style.backgroundColor = (visibilityVal == "visible"?colorC:colorN);
					li.style.color = (visibilityVal == "visible"?fontColorC:fontColorN);
				}
			}

			ul.style.visibility = "hidden";
			ul.style.top = "-9999px";
			ul.parentNode.style.position = "static";
			typeof optHideAllHd == "function" && optHideAllHd();

		}

		attachEvnt(document.body, "click", function(){
			var ul = $("#"+ulID)[0];

			if (typeof ul == "undefined")
			{
				return;
			}

			hiddenSelect(ul);
		});

		function optionClick(li, bCallHandle)
		{
			var con = id(idStr)
			var target = li;
			var parent = target.parentNode;
			var options = parent.childNodes;
			var valueCon = $("#"+idStr+" span.value")[0];
			var span, itemLi;

			if (target.childNodes[0].nodeType == 3)
			{
				return;
			}

			con.value = target.valueStr;
			valueCon.value = target.valueStr;

			for (var i = 0, len = options.length; i < len; i++)
			{
				itemLi = options[i];
				if (itemLi.tagName.toLowerCase() == "li")
				{
					itemLi.childNodes[0].style.visibility = "hidden";
					itemLi.style.backgroundColor = colorN;
					itemLi.style.color = fontColorN;
				}
			}

			if (target.childNodes[0].style.visibility != "visible" &&
				typeof callback == "function" && bCallHandle !== false)
			{
				callback(target.valueStr, con);
			}

			target.childNodes[0].style.visibility = "visible";
			target.style.backgroundColor = colorC;
			target.style.color = fontColorC;
			span = getChildNode(target, "span");
			span.className = "selCross";
			valueCon.innerHTML = htmlEscape(target.childNodes[1].nodeValue);
			parent.style.visibility = "hidden";
			parent.style.top = "-9999px";
			parent.parentNode.style.position = "static";

			typeof optHideHd == "function" && optHideHd();
		}

		function optionInit(options)
		{
			for (var i = 0, len = options.length; i < len; i++)
			{
				tmp = options[i];
				escapeStr = htmlEscape(getStrInMax(tmp.str.toString(), showSize));
				visible = "hidden";

				li = document.createElement("li");

				if ((tmp.value == undefined && i == valueDef) || (valueDef == tmp.value))
				{
					visible = "visible";
					valueCon.innerHTML = escapeStr;
					valueCon.value = valueDef;
					con.value = valueDef;
					li.style.backgroundColor = colorC;
					li.style.color = fontColorC;
					li.innerHTML = "<span class='selCross' style='visibility:" + visible + "'></span>" + escapeStr;
				}
				else
				{
					li.style.color = fontColorN;
					li.innerHTML = "<span class='selCrossOut' style='visibility:" + visible + "'></span>" + escapeStr;
				}

				li.title = (tmp.title===undefined)?tmp.str:tmp.title;
				li.valueStr = (tmp.value != undefined ? tmp.value : i);
				li.className = "option";
				li.onclick = function(event)
				{
					event = event || window.event;
					optionClick(this);
					stopProp(event);
				};

				if (true === spMouseMove)
				{
					li.onmouseover = function(event){
						event = event || window.event;
						var target = event.srcElement || event.target;
						var options, span, item;

						if (target.tagName.toLowerCase() == "span")
						{
							return;
						}

						options = target.parentNode.childNodes;

						for (var i = 0, len = options.length; i < len; i++)
						{
							item = options[i];
							if (item.tagName.toLowerCase() == "li")
							{
								item.style.backgroundColor = colorN;
								item.style.color = fontColorN;
								span = getChildNode(item, "span");
								span.className = "selCrossOut";
							}
						}

						span = getChildNode(target, "span");
						span.className = "selCross";
						target.style.backgroundColor = colorC;
						target.style.color = fontColorC;
					};
				}

				ul.appendChild(li);
			}
		}

		function selectClick(event)
		{
			var target = $("#"+ ulID);
			var sel = $("ul."+ className.split(" ")[0]);
			/* 减去2是因为增加了border的1px的宽度，盒模型宽度不包括border */
			var width = id(idStr).offsetWidth -2;
			var bottom = id(idStr).offsetHeight -1;
			var upTop = -1 * options.length * ulHeight - 1;
			var downTop = id(idStr).offsetHeight - 1;

			/* 先隐藏其他下拉列表 */
			sel.each(function(){
				if (this.style.visibility == "visible")
				{
					hiddenSelect(this);
				}
				return true;
			});

			if ("up" == type)
			{
				target.css({visibility:"visible", bottom:bottom, top:upTop, width:width, border:"solid 1px #C8CDD9", boxShadow:"0px -1px 2px rgba(0, 0, 0, 0.2)"});
			}
			else
			{
				target.css({visibility:"visible", top:downTop, width:width, border:"solid 1px #C8CDD9", boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.2)"});
			}

			/* 将con改为noHover状态 */
			con.style.borderColor = noHoverColor;

			target[0].parentNode.style.position = "relative";
			typeof optShowHd == "function" && optShowHd();
			stopProp(event);
		}

		optionInit(options);

		con.onclick = selectClick;
		con.disable = function(value){
			con.onclick = (value == true ? null : selectClick);
			disabled = (value == true ? true : false);
			valueCon.style.color = (value == true ? valueDisColor : valueColor);
		};
		con.changeSel = function(value){
			$("#"+ ulID + " li").each(function(){
				if (this.valueStr == value)
				{
					optionClick(this);
					return false;
				}
			});
		};

		/* 修改选项但不执行回调函数 */
		con.resetSel = function(value){
			$("#" + ulID +" li").each(function(){
				if (this.valueStr == value)
				{
					optionClick(this, false);
					return false;
				}
			});
		};
		con.resetOptions = function(options, value){
			ul.innerHTML = "";
			valueDef = value || 0;
			optionInit(options);
			con.resetSel(valueDef);
		};

		listScroll = new NiceScroll(ul.id);
		listScroll.scrollTipOpacity(1);
		listScroll.scrollTipSet({background:scrollBg});
		listScroll.scrollBarSet({zIndex:scrollZIndex, mLeft:scrollMLeft, mTop:scrollMTop});
		listScroll.init();
	};
}
function Help()
{
	var objThis = this;

	this.help = "Help";
	this.helpDetail = "helpDetail";
	this.helpContent = "helpContent";
	this.helpURL = "Help.htm";

	/* added By WuWeier, date 20140124 */
	this.setHelpURL = function(url)
	{
		this.helpURL = url;
	};
	this.helpInit = function(callBack)
	{
		var div;

		div = document.createElement("div");
		div.style.display = "none";
		div.style.visibility = "hidden";
		div.id = this.helpContent;
		document.body.appendChild(div);

		loadLgLessPage(this.helpURL, this.helpContent, callBack);
	};

	/* 触屏移动的处理函数 */
	this.touchMoveHd = function(event)
	{
		event = event || window.event;
		var mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
		var hp = id(objThis.help);
		var divWidth = hp.offsetWidth;
		var divHeight = hp.offsetHeight;
		var posX = mousePos.x - objThis.mousePos.x;
		var posY = mousePos.y - objThis.mousePos.y;
		var maxX = document.body.clientWidth - divWidth;
		var maxY = document.documentElement.scrollHeight - divHeight;

		posX = posX > 0 ? posX:0;
		posY = posY > 0 ? posY:0;
		posX = posX > maxX ? maxX:posX;
		posY = posY > maxY ? maxY:posY;
		hp.style.left = posX + "px";
		hp.style.top = posY + "px";
		eventPreventDefault(event);
		clearSelection(event);
	};

	/* 触屏结束移动的处理函数 */
	this.touchEndHd = function(event)
	{
		detachEvnt(document, "touchmove", touchMoveHd);
		detachEvnt(document, "touchend", touchEndHd);
	};
	this.helpBind = function(btn, helpIdStr, hpTopClass)
	{
		btn&&(btn.onclick = function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;

			helpShow(helpIdStr, target, hpTopClass);
		});
	};
	this.helpClose = function()
	{
		var hp = id(this.help);
		var hpDe = id(this.helpDetail);

		if (hpDe == null || hp == null)
		{
			return;
		}

		setStyle(hp, {"visibility":"hidden", "top":"-9999px"});
		hpDe.innerHTML = "";
	};

	this.helpVisible = function(btn)
	{
		var hp = id(this.help);
		var pos = $(btn).offset();
		var posTop = $("#basicContent").offset();
		var width = hp.offsetWidth;
		var height = hp.offsetHeight;
		var helpBtnHeight = btn.offsetHeight;
		var helpBtnWidth = btn.offsetWidth;
		var top, left;

		top = posTop.top + "px";
		left = pos.left - width + helpBtnWidth + "px";
		setStyle(hp, {"visibility":"visible", "top":top, "left":left});
	};
	this.helpDetailAppend = function(helpIdStr)
	{
		var hpDe;
		var helpCon = id(helpIdStr);

		if (null == helpCon)
		{
			return;
		}

		hpDe = id(this.helpDetail);
		hpDe.innerHTML = helpCon.outerHTML;
	};
	this.helpShow = function(helpIdStr, btn, hpTopClassName)
	{
		var hpTop = $("#" + this.help +" p.helpTop");

		this.helpClose();
		hpTopClassName = hpTopClassName == undefined ? "helpTop" : ("helpTop " + hpTopClassName);
		hpTop.attr("class", hpTopClassName);
		this.helpVisible(btn);
		helpDetailAppend(helpIdStr);
	};
	this.msMove = function(helpDiv, currMousePos, distance)
	{
		var divWidth = helpDiv.offsetWidth;
		var divHeight = helpDiv.offsetHeight;
		var posX = currMousePos.x - distance.x;
		var posY = currMousePos.y - distance.y;
		var maxX = document.body.clientWidth - divWidth;
		var maxY = document.documentElement.scrollHeight - divHeight;

		posX = posX > 0 ? posX:0;
		posY = posY > 0 ? posY:0;
		posX = posX > maxX ? maxX:posX;
		posY = posY > maxY ? maxY:posY;
		helpDiv.style.left = posX + "px";
		helpDiv.style.top = posY + "px";
	};
	this.draggableBind = function(divPaId)
	{
		var inFrame = 1;
		var inSetFrame = 2;
		var outChild = 0;
		var helpDiv = id(divPaId);

		return function(event){
			event = event ? event : window.event;
			var currMousePos = getMousePos(event);

			/* 记录鼠标按下瞬间鼠标与DIV控件左上角的距离 */
			var distance = {x:currMousePos.x - helpDiv.offsetLeft,
							y:currMousePos.y - helpDiv.offsetTop};

			document.onmousemove = function(event)
			{
				event = event ? event : window.event;
				var currMousePos = getMousePos(event);

				clearSelection();
				msMove(helpDiv, currMousePos, distance);
			};

			document.onmouseup = function()
			{
				clearSelection();
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	};

	this.basicAppUpgradeInfoShow = function(btn, info, top)
	{
		var infoConId = "basicAppUpgradeInfo";
		var infoCon = id(infoConId);
		var p, span, i, div;
		var $btn = $(btn);
		var pos = $btn.offset();
		var appNiceScroll;

		if (null == infoCon)
		{
			infoCon = document.createElement("div");
			infoCon.id = infoConId;
			document.body.appendChild(infoCon);

			p = document.createElement("p");
			p.className = "appsHelpTop";
			p.onmousedown = this.draggableBind(this.help);
			infoCon.appendChild(p);
			span = document.createElement("span");
			span.className = "helpDes";
			span.innerHTML = label.updateNoteStr;
			p.appendChild(span);
			i = document.createElement("i");
			i.onclick = function (){
				infoCon.style.display = "none";
				infoCon.style.top = "-9999px";
			};
			i.className = "helpClose";
			p.appendChild(i);
			div = document.createElement("div");
			div.id = "basicAppUpgradeInfoDetail";
			div.className = "basicAppUpgradeInfoDetail";
			infoCon.appendChild(div);

			appNiceScroll = new NiceScroll("basicAppUpgradeInfoDetail");
			appNiceScroll.scrollTipOpacity(1);
			appNiceScroll.scrollTipSet({"background":"#B0CB33"});
			appNiceScroll.scrollBarSet({"zIndex":"1004", "mLeft":"10"});
			appNiceScroll.init();
		}

		top = top || 0;
		infoCon.style.top = pos.top + $btn[0].offsetHeight + top + "px";
		infoCon.style.left = "515px";
		infoCon.style.display = "block";
		id("basicAppUpgradeInfoDetail").innerHTML = "<pre>" + info + "</pre>";
	}

	this.basicAppUpgradeInfoClose = function()
	{
		var infoCon = id("basicAppUpgradeInfo");

		if (null != infoCon)
		{
			infoCon.style.display = "none";
			infoCon.style.top = "-9999px";
		}
	}
}

/* 检测LAN是否可以连接DUT */
function LanDetect()
{
	this.lanDetectSuccess = false;
	this.LAN_DETECT_TIME = 1000;
	this.lanDetectTimeHd = null;

	this.lanDetectHandle = function(callBack)
	{
		if (false == $.result.timeout && false == this.lanDetectSuccess)
		{
			this.lanDetectSuccess = true;
			clearTimeout(this.lanDetectTimeHd);
			callBack();
		}
	}

	this.lanDetecting = function(callBack)
	{
		$.detect(function(){
			lanDetectHandle(callBack);
		});

		this.lanDetectTimeHd = $.setTimeout(function(){
			lanDetecting(callBack);
		}, this.LAN_DETECT_TIME);
	}
}

function ProgressBar()
{
	this.progressBar = null;
	this.progressDeWidth = null;
	this.progressBarHd = null;

	this.initProgBar = function()
	{
		var rebootCon = id("ProgressBar");
		var con, div, p;

		if (null == rebootCon)
		{
			rebootCon = document.createElement("div");
			rebootCon.id = "ProgressBar";
			document.body.appendChild(rebootCon);

			con = document.createElement("div");
			con.className = "progressBarCon";
			rebootCon.appendChild(con);

			p = document.createElement("p");
			p.className = "progressBarDes";
			con.appendChild(p);

			div = document.createElement("div");
			div.className = "progressBarBg";
			con.appendChild(div);

			p = document.createElement("p");
			p.className = "progressBarDe";
			div.appendChild(p);
		}

		this.progressBar = rebootCon;
		this.progressDeWidth = 0;
	};

	this.progRunning = function(showPercent, duration, callBack){
		var progressBarBg = $("div.progressBarBg");
		var progressBarDe = $("p.progressBarDe");
		var progressBarPercent = $("p.progressBarPercent");
		var deWidth = this.progressDeWidth + 2;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var time = duration/100, count = 0;
		var thisObj = this;

		function proRun()
		{
			if (count > 100)
			{
				if (undefined != callBack)
				{
					callBack();
				}

				return;
			}

			if (showPercent == true)
			{
				progressBarPercent[0].innerHTML = count + "%";
			}
			progressBarDe.css("width", deWidth + width*count + "px");
			count++;
			thisObj.progressBarHd = $.setTimeout(arguments.callee, time);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBar = function(duration, noteStr, callBack, showPercent)
	{
		this.showCover(function(){
			this.initProgBar();
			setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"260px"});

			if (undefined == noteStr)
			{
				noteStr = statusStr.rebooting;
			}

			showPercent = (showPercent == undefined ? false : showPercent);
			$("div.progressBarPCon").css("visibility", (showPercent == true ? "visible" : "hidden"));
			$("p.progressBarDes")[0].innerHTML = noteStr;
			this.progRunning(showPercent, duration, callBack);
		});
	};

	this.progRunningP = function(showPercent, callBack, complete, timeout){
		var node = this.progressBar;
		var progressBarPercent = $(node).find("p.progressBarPercent");
		var progressBarBg = $(node).find("div.progressBarBg");
		var progressBarDe = $(node).find("p.progressBarDe");
		var deWidth = this.progressDeWidth + 2;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var count = 0, rel = {}, code = ENONE;
		var obj = this;

		function run(rel)
		{
			count = parseInt(rel.count);
			code = rel[ERR_CODE];

			if (ERR_PERCENT == count)
			{
				obj.closeProgBar();
				(typeof complete == "function") && complete(false, code);
				return;
			}

			if (showPercent == true && false == isNaN(count))
			{
				if (count >= 100)
				{
					count = 100;
				}

			//	progressBarPercent[0].innerHTML = count + "%";
			}

			progressBarDe.css("width", deWidth + width*count + "px");

			if (count >= 100)
			{
				(typeof complete == "function") && complete(true);
			}
		}

		function proRun()
		{
			typeof callBack == "function" && callBack(run);
			obj.progressBarHd = $.setTimeout(arguments.callee, timeout);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBarP = function(noteStr, callBack, showPercent, complete)
	{
		this.showCover(function(){
			this.initProgBar();
			setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"260px"});

			if (undefined == noteStr)
			{
				noteStr = statusStr.rebooting;
			}

			showPercent = (showPercent == undefined ? true : showPercent);
			$("div.progressBarPCon").css("visibility", (showPercent == true ? "visible" : "hidden"));
			$("p.progressBarDes")[0].innerHTML = noteStr;
			this.progRunningP(showPercent, callBack, complete, 100);
		});
	};

	this.closeProgBar = function()
	{
		typeof hideCover == "function" && hideCover();
		setStyle(this.progressBar, {"display":"none", "visibility":"hidden", "top":"-9999px"});
		clearTimeout(this.progressBarHd);
	};
}

function BlockGrid()
{
	this._ops = {
		id:"",					/* 容器 ID */
		data:null,				/* 数据源 */
		dataInfo: []			/* 数据信息，每一项都是{str:"", value:"", unValue:""}*/
	};

	if (typeof BlockGrid.prototype.blockInit != "function")
	{
		BlockGrid.prototype.blockInit = function(options)
		{
			this._optionsInit(options);
			this.create();
		};

		BlockGrid.prototype._optionsInit = function(options)
		{
			var item;
			for(var prop in options)
			{
				item = options[prop];
				if (typeof this._ops[prop] == "undefined")
				{
					continue;
				}

				if (typeof item == "object" && !(item instanceof Array) && this._ops[prop] != null)
				{
					for(var p in item)
					{
						this._ops[prop][p] = item[p];
					}
				}
				else
				{
					this._ops[prop] = item;
				}
			}
		};

		BlockGrid.prototype.create = function()
		{
			var liNode, iNode;

			this.con = id(this._ops.id);
			emptyNodes(this.con);
			for (var i = 0; i < this._ops.dataInfo.length; i++)
			{
				var infoEntry = this._ops.dataInfo[i];
				var dataValue = this._ops.data[i];

				liNode = document.createElement("li");
				liNode.onclick = function() {
					var childNode = $(this).find("i")[0];
					var v = childNode.style.visibility;
					v = v == "visible" ? "hidden" : "visible";
					childNode.style.visibility = v;
				};
				liNode.innerHTML = infoEntry.str;

				iNode = document.createElement("i");
				liNode.appendChild(iNode);
				if (dataValue == infoEntry.value)
				{
					iNode.style.visibility = "visible";
				}

				this.con.appendChild(liNode);
			}
		};

		BlockGrid.prototype.getData = function()
		{
			var iNodeList = $("#" + this._ops.id).find("i");
			var data = [], v;
			for (var i = 0; i < iNodeList.length; i++)
			{
				var infoEntry = this._ops.dataInfo[i];
				var iNode = iNodeList[i];
				var style = iNode.style.visibility;

				if (style == "visible")
				{
					v = infoEntry.value;
				}
				else
				{
					v = infoEntry.unValue;
				}
				data.push(v);
			}

			return data;
		};
	}
}

function TimeControlSet()
{
	this.ENABLED = "1";
	this.DISABLED = "0";
	this.ACTION_ADD = 0;
	this.ACTION_EDIT = 1;
	this.blockGrid = null;
	this.gTimeLimitKeyName = null;
	this.gTimeLimitItem = null;
	this.gTimeLimitAction = this.ACTION_ADD;

	this.netCtrlListCreate = function(netCtrlList, delCallBack, saveCallBack, selInitCallback, isClock)
	{
		var divParent = id("netControlList");
		var ulNode, liNode, iNode, pNode, spanNode;
		var doc = document;
		var item, weekList, keyName, num = 0;

		var BNAME = uciHostsInfo.optName.name;
		var START_TIME = uciHostsInfo.optName.startTime;
		var END_TIME = uciHostsInfo.optName.endTime;
		var epWeekType = [label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta, label.Sun];

		emptyNodes(divParent);
		ulNode = doc.createElement("ul");
		divParent.appendChild(ulNode);
		isClock = (undefined == isClock) ? false : isClock;

		for (var i in netCtrlList)
		{
			var weekStr = "";

			num++;
			for (var key in netCtrlList[i])
			{
				keyName = key;
				item = netCtrlList[i][key];
			}

			liNode = doc.createElement("li");
			$(liNode).hover(
				function(){
					$(this).find("i").css("visibility", "visible");
				},
				function(){
					$(this).find("i").css("visibility", "hidden");
				});
			ulNode.appendChild(liNode);

			iNode = doc.createElement("i");
			iNode.onclick = (function(keyName, netCtrlList){
				return function() {
					delCallBack(keyName, netCtrlList);
				}
			})(keyName, netCtrlList);
			liNode.appendChild(iNode);
			liNode.onclick = (function(item, iNode, keyName){
				return function(event){
					event = event || window.event;
					var target = event.target || event.srcElement;
					if (iNode == target)
					{
						return;
					}

					var name = item[BNAME];
					var startTime = item[START_TIME];
					var endTime = item[END_TIME];

					gTimeLimitAction = ACTION_EDIT;
					gTimeLimitItem = item;
					gTimeLimitKeyName = keyName;
					weekList = objToWeekList(item);

					setNetControlPanel(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock);
					netControlPanelDis(true);
					beEdit = true;
				};
			})(item, iNode, keyName);

			pNode = doc.createElement("pre");
			pNode.innerHTML = htmlEscape(getStrInMax(item[BNAME], 16));
			liNode.appendChild(pNode);

			spanNode = doc.createElement("span");
			if (true == isClock)
			{
				spanNode.innerHTML = item[START_TIME] + label.wlanOn + " / " + item[END_TIME] + label.wlanOff;
			}
			else
			{
				spanNode.innerHTML = label.limitTime + label.colon + item[START_TIME] + " - " + item[END_TIME];
			}
			liNode.appendChild(spanNode);

			spanNode = doc.createElement("span");
			weekList = objToWeekList(item);
			for (var weekIndex in weekList)
			{
				if (weekList[weekIndex] == ENABLED)
				{
					weekStr += epWeekType[weekIndex] + label.sep;
				}
			}
			if (weekStr.length > 0)
			{
				weekStr = weekStr.substring(0, weekStr.length - 1);
			}
			spanNode.innerHTML = label.repeat + label.colon + weekStr;
			liNode.appendChild(spanNode);
		}

		divParent.num = num;
	};

	this.objToWeekList = function(item)
	{
		var MON = uciHostsInfo.optName.mon;
		var TUE = uciHostsInfo.optName.tue;
		var WED = uciHostsInfo.optName.wed;
		var THU = uciHostsInfo.optName.thu;
		var FRI = uciHostsInfo.optName.fri;
		var SAT = uciHostsInfo.optName.sat;
		var SUN = uciHostsInfo.optName.sun;

		var weekList = [];
		var keys = [MON, TUE, WED, THU, FRI, SAT, SUN];
		for (var i in keys)
		{
			var key = keys[i];
			if (item[key] == ENABLED)
			{
				weekList.push(ENABLED);
			}
			else
			{
				weekList.push(DISABLED);
			}
		}
		return weekList;
	};

	this.weekListToObj = function(obj, weekList)
	{
		var MON = uciHostsInfo.optName.mon;
		var TUE = uciHostsInfo.optName.tue;
		var WED = uciHostsInfo.optName.wed;
		var THU = uciHostsInfo.optName.thu;
		var FRI = uciHostsInfo.optName.fri;
		var SAT = uciHostsInfo.optName.sat;
		var SUN = uciHostsInfo.optName.sun;

		var keys = [MON, TUE, WED, THU, FRI, SAT, SUN];
		for (var i in weekList)
		{
			obj[keys[i]] = weekList[i];
		}
	};

	this.initTimeOptions = function(timeOptions, max)
	{
		var value, str, entry;

		for (var i = 0; i < max; i++) {
			str = i;
			if (i < 10)
			{
				str = "0" + i;
			}
			entry = {str: str, value: str};
			timeOptions.push(entry);
		}
	};

	this.setNetControlPanel = function(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock)
	{
		var stTokens = startTime.split(":");
		var etTokens = endTime.split(":");
		var sHour = stTokens[0];
		var sMinute = stTokens[1];
		var eHour = etTokens[0];
		var eMinute = etTokens[1];
		var netControlName;

		netControlPanelInit(saveCallBack, selInitCallback, isClock);
		netControlName = id("netControlName");
		netControlName.value = name;
		id("beginHour").changeSel(sHour);
		id("beginMinute").changeSel(sMinute);
		id("endHour").changeSel(eHour);
		id("endMinute").changeSel(eMinute);

		blockGrid = new BlockGrid();
		blockGrid.blockInit({
			id:"netControlWeek",
			data: weekList,
			dataInfo: [{str: label.MonB, value: ENABLED, unValue:DISABLED},
						{str: label.TueB, value: ENABLED, unValue:DISABLED},
						{str: label.WenB, value: ENABLED, unValue:DISABLED},
						{str: label.ThuB, value: ENABLED, unValue:DISABLED},
						{str: label.FriB, value: ENABLED, unValue:DISABLED},
						{str: label.StaB, value: ENABLED, unValue:DISABLED},
						{str: label.SunB, value: ENABLED, unValue:DISABLED}]
		});
	};

	this.netControlPanelDis = function(tag)
	{
		var vigNetControlCon = id("VigNetControlCon");
		if (true === tag)
		{
			showCoverB(function(){
				vigNetControlCon.style.visibility = "visible";
				vigNetControlCon.style.top = "150px";
			});
		}
		else
		{
			hideCoverB(function(){
				vigNetControlCon.style.visibility = "hidden";
				vigNetControlCon.style.top = "-9999px";
			});
		}
	};

	this.netControlPanelInit = function(saveCallBack, selInitCallback, isClock)
	{
		var div, divCon = id("VigNetControlCon");
		var DEFAULT_TIME = "0";
		var hourOptions = [];
		var miniteOptions = [];
		var startTimeStr, endTimeStr;

		if (null == divCon)
		{
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "VigNetControlCon";
			document.body.appendChild(divCon);
		}
		else
		{
			emptyNodes(divCon);
		}

		isClock = (undefined == isClock) ? false : isClock;
		if (true == isClock)
		{
			startTimeStr = label.beginClock;
			endTimeStr = label.endClock;
		}
		else
		{
			startTimeStr = label.beginTime;
			endTimeStr = label.endTime;
		}

		divCon.innerHTML = '<div class="vigNetControl" id="vigNetControl">'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+label.periodDesc+'</label>'+
				'<input type="text" class="text timeDesc" id="netControlName" maxlength="32">'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+startTimeStr+'</label>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="beginHour" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.hour+'</label>'+
				'</li>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="beginMinute" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.minute+'</label>'+
				'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+endTimeStr+'</label>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="endHour" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.hour+'</label>'+
				'</li>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="endMinute" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.minute+'</label>'+
				'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+label.repeat+'</label>'+
				'<ul class="netControlWeek" id="netControlWeek"></ul>'+
			'</ul>'+
			'<div class="netControlBtn">'+
				'<input type="button" class="subBtn eptBtnA" value="'+btn.ok+'" id="btnSaveWeek">'+
				'<input type="button" class="cancelBtn eptBtnA" value="'+btn.cancel+'" id="btnCancelWeek">'+
			'</div>'+
		'</div>';

		initTimeOptions(hourOptions, 24);
		initTimeOptions(miniteOptions, 60);

		/* 保存上网时间限制 */
		id("btnSaveWeek").onclick = saveCallBack;

		id("btnCancelWeek").onclick = function(){
			netControlPanelDis(false);
			beEdit = false;
		};

		if (typeof selInitCallback != "function")
		{
			selInitCallback = selectInitEptMgt;
		}

		selInitCallback("beginHour", hourOptions, DEFAULT_TIME);
		selInitCallback("beginMinute", miniteOptions, DEFAULT_TIME);
		selInitCallback("endHour", hourOptions, DEFAULT_TIME);
		selInitCallback("endMinute", miniteOptions, DEFAULT_TIME);
	};
}

/*added by WuWeier, 适用于Slp的函数 */
function Slp()
{
	this.ROLE_LOCAL  = 0;		// 本地主机
	this.ROLE_REMOTE = 1;		// 远程主机
	this._gController = "";		// LuCI框架中的Controller
	this._gMedia = "";		// LuCI框架中的Media
	this._gRole = ROLE_LOCAL;	// 登录的用户角色

	/* 设置全局的controller变量 */
	this.setController = function (c) {
		_gController = c;
	};

	/* 获取全局的controller变量 */
	this.getController = function () {
		return _gController;
	};

	/* 设置全局的media变量 */
	this.setMedia = function (m) {
		_gMedia = m;
	};

	/* 获取全局的media变量 */
	this.getMedia = function () {
		return _gMedia;
	};

	/* 设置全局的Role变量 */
	this.setRole = function (role) {
		_gRole = role;
	};

	/* 获取全局的Role变量 */
	this.getRole = function () {
		return _gRole;
	};

	this.initImagePath = function(media)
	{
		for (var mindex in imagePath)
		{
			imagePath[mindex] = media + "/" + imagePath[mindex];
		}
	};

	this.cloneObj = function(obj)
	{
		var re = {};

		if (typeof (obj) != 'object')
		{
			return obj;
		}

		if (obj.constructor == Array)
		{
			re = [];
		}

		for ( var i in obj)
		{
			re[i] = cloneObj(obj[i]);
		}

		return re;
	};

	this.hideLeadingZeros = function(str)
	{
		return str.replace(/0*(\d+)/g, "$1");
	};

	this.calcNextIndex = function(array, pos)
	{
		if (array == null || !(array instanceof Array))
		{
			return -1;
		}

		var indexArr = [];
		for (var i in array)
		{
			var name = array[i][".name"];
			if (typeof name == "undefined" || typeof name != "string")
			{
				continue;
			}

			var index = name.replace(/^.*_(\d+)$/g, '$1');
			indexArr[index] = true;
		}

		var len = indexArr.length;
		if (!(/\D/g.test(pos)) && pos >= len)
		{
			return pos;
		}

		var i = (/\D/g.test(pos)) ? 1 : pos;
		for (; i <= len; i++)
		{
			if (typeof indexArr[i] == "undefined")
			{
				return i;
			}
		}

		return (len + 1);
	};

	this.formatTableData = function(array)
	{
		var re = [];
		if (array == null || !(array instanceof Array))
		{
			return re;
		}

		for (var i in array)
		{
			var obj = array[i];
			for (var prop in obj)
			{
				obj[prop][SEC_NAME] = prop;
				re[i] = obj[prop];
			}
		}

		return re;
	};
}

/*
 * paras.id: 放置控件的父控件ID
 * paras.name: 文本名字
 * paras.value: 当前值 （默认：0）
 * paras.lowerBound: 最小值（默认：最小值）
 * paras.upperBound: 最大值（默认：100）
 * paras.cb: 值改变时的回调函数
 */
function DragLine(paras)
{
	this.id = "";
	this.name = "";
	this.value = 0;
	this.lowerBound = 0;
	this.upperBound = 100;
	this.cb = "";
	this.needLabel = "y";
	this.needInput = "y";
	this.needScale =  "n";
	this.scaleNum = 3; /* 显示多少个刻度 */
	this.scaleSidePad = 5; /* 刻度尺两边的空白像素 */
	this.errFix = false; /* 是否需要自动纠正输入框内容 */

	if (typeof DragLine.prototype.init != "function")
	{
		function fixRange(val, lowerBoundary, upperBoundary, errFix)
		{
			if (!errFix)
			{
				return val;
			}
			if (val < lowerBoundary)
			{
				val = lowerBoundary;
			}

			if (val > upperBoundary)
			{
				val = upperBoundary;
			}

			return val;
		}

		DragLine.prototype.init = function(paras){
			this.paraInit(paras)
			this.create();
		};

		DragLine.prototype.paraInit = function(paras){
			for (var prop in paras)
			{
				if (this[prop] != undefined && paras[prop] != undefined)
				{
					this[prop] = paras[prop];
				}
			}
		};

		DragLine.prototype.create = function(){
			var objThis = this;
			var dragLineId = this.id;
			var dragLineCon = id(dragLineId);

			if (null == dragLineCon)
			{
				return;
			}

			this.value = fixRange(this.value, this.lowerBound, this.upperBound, true);

			/* 创建HTML元素 */
			var dragLineLabel = document.createElement("label");
			dragLineLabel.className = "dragLineLabel";
			dragLineLabel.id = dragLineId + "DragLineLabel";
			dragLineLabel.innerHTML = this.name;

			if (this.needLabel == "y")
			{
				dragLineCon.appendChild(dragLineLabel);
			}

			var dragLineStrip = document.createElement("i");
			dragLineStrip.className = "dragLineStrip";
			dragLineStrip.id = dragLineId + "DragLineStrip";
			dragLineStrip.onclick = this.stripOnClick();
			dragLineCon.appendChild(dragLineStrip);

			var dragLineStripLeft = document.createElement("i");
			dragLineStripLeft.className = "dragLineStripLeft";
			dragLineStripLeft.id = dragLineId + "dragLineStripLeft";
			dragLineStrip.appendChild(dragLineStripLeft);

			var dragLinePointer = document.createElement("i");
			dragLinePointer.className = "dragLinePointer";
			dragLinePointer.id = dragLineId + "DragLinePointer";
			dragLinePointer.onmousedown = this.dragableBind();
			dragLineStrip.appendChild(dragLinePointer);

			var dragLineInput = document.createElement("input");
			dragLineInput.className = "dragLineInput";
			dragLineInput.id = dragLineId + "DragLineInput";
			dragLineInput.type = "text";
			dragLineInput.onchange = this.inputBlurHd();
			dragLineInput.onkeyup = this.inputValueChange();
			dragLineInput.maxLength = this.upperBound.toString().length;
			dragLineInput.onfocus = function()
			{
				dragLineInput.className = "dragLineInput dragLineInputFocus";
			}
			dragLineInput.onblur = function()
			{
				dragLineInput.className = "dragLineInput";
			}

			if (this.needInput == "y")
			{
				dragLineCon.appendChild(dragLineInput);
			}

			if (this.needScale == "y")
			{
				var scaleLine, ul, li;
				var stripW = dragLineStrip.offsetWidth;
				var sideW = this.scaleSidePad;
				var intUnitW = 0;
				var floatUnitW = 0;
				var floatPart = 0;
				if (this.scaleNum > 1)
				{
					floatUnitW = parseFloat((stripW - (2 * sideW) - this.scaleNum) / (this.scaleNum - 1));
					intUnitW = parseInt(floatUnitW);
					floatPart = floatUnitW - intUnitW;
				}

				/*scaleLine = document.createElement("div");
				scaleLine.className = "dragLineScale";
				dragLineCon.appendChild(scaleLine);*/

				ul = document.createElement("ul");
				ul.className = "scaleUl";

				for (var i = 1; i <= this.scaleNum; i++)
				{
					li = document.createElement("li");
					li.className = "scaleLi";
					if (i == 1)
					{
						li.style.marginLeft = 0 - 13 / 2 + "px";
						li.innerHTML = "低";
					}
					else if (i == this.scaleNum)
					{
						li.style.marginLeft = (floatUnitW + 1) - 13 / 2 + "px";
						li.innerHTML = "高";
					}
					else
					{
						li.style.marginLeft = floatUnitW- 13 / 2  + "px";
						li.innerHTML = "中";
					}

					ul.appendChild(li);
				}

				dragLineCon.appendChild(ul);
			}

			this.dragLineStrip = dragLineStrip;
			this.dragLineStripLeft = dragLineStripLeft;
			this.dragLinePointer = dragLinePointer;
			this.dragLineInput = dragLineInput;
			this.base = (this.dragLineStrip.offsetWidth - this.dragLinePointer.offsetWidth) / (this.upperBound - this.lowerBound);
			dragLinePointer.style.left = this.base * (this.value - this.lowerBound) + "px";
			dragLineStripLeft.style.width = this.base * (this.value - this.lowerBound) + "px";
			dragLineInput.value = this.value;
		};

		DragLine.prototype.setValue = function(value)
		{
			var dragLineInput = this.dragLineInput;
			var dragLinePointer = this.dragLinePointer;
			var dragLineStripLeft = this.dragLineStripLeft;
			var curValue;

			value = fixRange(parseInt(value, 10), this.lowerBound, this.upperBound, this.errFix);
			dragLineInput.value = value;
			value = fixRange(parseInt(value, 10), this.lowerBound, this.upperBound, true);
			curValue = (value - this.lowerBound) * (this.base);
			dragLinePointer.style.left = curValue + "px";
			dragLineStripLeft.style.width = curValue + "px";
		};

		DragLine.prototype.getValue = function()
		{
			return this.dragLineInput.value;
		}

		DragLine.prototype.inputBlurHd = function()
		{
			var thisObj = this;
			return function(event){
				event = event || window.event;

				var value = parseInt(this.value, 10);
				var key = event.keyCode;

				if (true == isNaN(value))
				{
					value = 0;
				}

				this.value = value;
				thisObj.setValue(value);
				typeof thisObj.cb == "function" && thisObj.cb(value);
			};
		};

		DragLine.prototype.inputValueChange = function()
		{
			var thisObj = this;
			return function(event){
				event = event || window.event;

				var value = parseInt(this.value, 10);
				var key = event.keyCode;

				if (undefined != key && key != 13)
				{
					return;
				}

				this.value = value;
				thisObj.setValue(value);
				typeof thisObj.cb == "function" && thisObj.cb(value);
			};
		};

		DragLine.prototype.getAbsoluteLeft = function(obj)
		{
			var curObj = obj;
			var objLeft = curObj.offsetLeft;

			while (curObj.offsetParent != null)
			{
				curObj = curObj.offsetParent;
				objLeft += curObj.offsetLeft;
			}

			return objLeft;
		};

		DragLine.prototype.stripOnClick = function()
		{
			var thisObj = this;
			return function(event){

				event = event ? event : window.event;
				var curMousePos = getMousePos(event);
				var stripX = thisObj.dragLineStrip.offsetLeft;
				var windowLeft = (window.screenLeft == undefined ? window.screenX : window.screenLeft);
				var tar = event.target || event.srcElement;
				var maxX = thisObj.dragLineStrip.offsetWidth - thisObj.dragLinePointer.offsetWidth;
				var curX, pixX;

				if (tar != undefined && tar == thisObj.dragLinePointer)
				{
					return;
				}

				clickPointX = event.clientX;
				lineX = thisObj.getAbsoluteLeft(thisObj.dragLineStrip);
				lineX -= (document.body.scrollLeft || document.documentElement.scrollLeft);
				curX = clickPointX - lineX;
				curX -= (thisObj.dragLinePointer.offsetWidth / 2);
				pixX = curX = fixRange(curX, 0, maxX, true);
				curX = Math.floor(curX / (thisObj.base));

				if ((curX * thisObj.base + (thisObj.base / 2)) < pixX && curX < thisObj.upperBound)
				{
					curX++;
				}

				thisObj.dragLinePointer.style.left = ((thisObj.base) * curX) + "px";
				thisObj.dragLineStripLeft.style.width = thisObj.dragLinePointer.style.left;
				thisObj.dragLineInput.value = curX + thisObj.lowerBound;
				closeNote(thisObj.dragLineInput.id);

				typeof thisObj.cb == "function" && thisObj.cb(thisObj.dragLineInput.value); //保存数据
			};
		};

		DragLine.prototype.dragableBind = function()
		{
			var thisObj = this;

			return function(event){
				event = event ? event : window.event;
				var ta = event.target || event.srcElement;

				$(thisObj.dragLineInput).addClass("dragLineInputFocus");
				thisObj.ponterClickPos = getMousePos(event);
				thisObj.orginalX = parseInt(thisObj.dragLinePointer.style.left, 10);

				document.onmousemove = function(event){
					event = event ? event :window.event;
					var curMousePos = getMousePos(event);
					var maxX = thisObj.dragLineStrip.offsetWidth - thisObj.dragLinePointer.offsetWidth;
					var offsetX = (curMousePos.x - thisObj.ponterClickPos.x);
					var curX, pixX;

					if (offsetX < -maxX)
					{
						offsetX = -maxX;
					}

					if (offsetX > maxX)
					{
						offsetX = maxX;
					}

					curX = offsetX + thisObj.orginalX;
					pixX = curX = fixRange(curX, 0, maxX, true);
					thisObj.dragLinePointer.style.left = (pixX) + "px";
					curX = Math.floor(curX / (thisObj.base));
					if ((curX * thisObj.base + (thisObj.base / 2)) < pixX && curX < thisObj.upperBound)
					{
						curX++;
					}
					thisObj.dragLineInput.value = curX + thisObj.lowerBound;
					closeNote(thisObj.dragLineInput.id);
					thisObj.dragLineStripLeft.style.width = (curX + thisObj.lowerBound) / 100 * 120 + "px";
					clearSelection();
				};

				document.onmouseup = function(event){
					thisObj.setValue(thisObj.dragLineInput.value);
					typeof thisObj.cb == "function" && thisObj.cb(thisObj.dragLineInput.value);
					clearSelection();
					$(thisObj.dragLineInput).removeClass("dragLineInputFocus");
					document.onmousemove = null;
					document.onmouseup = null;
				};

				stopProp(event);
			};
		};
	}

	this.init(paras);
};

/* 日夜时间区间 begin
 * paras.id: 控件容器ID，
 * paras.sunrise: 白天结束时间（默认：06:00），
 * paras.sunset: 白天结束时间（默认：18:00），
 * paras.LeftLabel: 左边标签（默认：“白天”），
 * paras.RightLabel：右边标签（默认：“夜晚”），
 * paras.leftCbk: 左边标签的回调函数，
 * paras.rightCbk：右边标签的回调函数，
 * paras.timeChangeCbk：改变时间之后的回调函数，
 * paras.unit: 最小的显示单位（单位：分钟，默认：10min），
 * paras.intTime: 是否以整数形式显示时间，默认：否，取值"y"则以整形表示
 */
function DayNightSwitch(paras)
{
	if (paras.id === undefined)
	{
		return;
	}

	this.id = "";
	this.sunrise = "00:00";
	this.sunset = "24:00";
	this.leftLabel = "白天";
	this.rightLabel = "夜晚";
	this.unit = 10; 			// 最小单元为10分钟
	this.leftCbk = "";
	this.rightCbk = "";
	this.timeChangeCbk = "";
	this.intTime = "n"; 		/* 时间是否显示为整形 */
	this.equalStartEndTime = "y"; 		/* 开始时间是否可以等于结束时间 */

	if (typeof DayNightSwitch.prototype.DayNightSwitchInit != "function")
	{
		DayNightSwitch.prototype.DayNightSwitchInit = function(paras){
			if (true == this.paraInit(paras))
			{
				this.create();
			}
		};
		DayNightSwitch.prototype.paraInit = function(paras)
		{
			for (var prop in paras)
			{
				if (this[prop] != undefined && paras[prop] != undefined)
				{
					this[prop] = paras[prop];
				}
			}

			this.DayNightSwitchCon = id(this.id);
			if (this.DayNightSwitchCon == undefined)
			{
				return false;
			}
			if (this.unit <= 0)
			{
				this.unit = 10;
			}
			this.pieces = (24 * 60) / this.unit;

			if ("y" == this.intTime)
			{
				this.sunrise = parseInt(this.sunrise, 10);
				this.sunset = parseInt(this.sunset, 10);
			}

			return true;
		}
		DayNightSwitch.prototype.create = function()
		{
			var timeLabelDiv = document.createElement("div");
			timeLabelDiv.className = "DNSTimeLabelDiv";

			var dayBeginTimeLabel = document.createElement("label");
			dayBeginTimeLabel.className = "DNSTimeLabel";
			timeLabelDiv.appendChild(dayBeginTimeLabel);

			var dayEndTimeLabel = document.createElement("label");
			dayEndTimeLabel.className = "DNSTimeLabel";
			timeLabelDiv.appendChild(dayEndTimeLabel);

			var timeLineDiv = document.createElement("div");
			timeLineDiv.className = "DNSTimeLineDiv";

			var timeLine = document.createElement("div");
			timeLine.className = "DNSLine";

			var firstPartOfNight = document.createElement("i");
			firstPartOfNight.className = "firstPartOfNight timeOfNight";

			var partOfDay = document.createElement("div");
			partOfDay.className = "timeOfDay";

			var secondPartOfNight = document.createElement("i");
			secondPartOfNight.className = "secondPartOfNight timeOfNight";

			var dayBeginPointer = document.createElement("i");
			dayBeginPointer.className="DNSPointer firstP";
			dayBeginPointer.id = this.id + "firstP";

			var dayEndPointer = document.createElement("i");
			dayEndPointer.className = "DNSPointer secondP";
			dayEndPointer.id = this.id + "secondP";

			timeLine.appendChild(firstPartOfNight);
			timeLine.appendChild(dayBeginPointer);
			timeLine.appendChild(partOfDay);
			timeLine.appendChild(secondPartOfNight);
			timeLine.appendChild(dayEndPointer);

			timeLineDiv.appendChild(timeLine);
			this.DayNightSwitchCon.appendChild(timeLabelDiv);
			this.DayNightSwitchCon.appendChild(timeLineDiv);

			this.dayBeginPointer = dayBeginPointer;
			this.dayEndPointer = dayEndPointer;
			this.firstPartOfNight = firstPartOfNight;
			this.secondPartOfNight = secondPartOfNight;
			this.timeLine = timeLine;
			this.dayBeginTimeLabel = dayBeginTimeLabel;
			this.dayEndTimeLabel = dayEndTimeLabel;
			this.partOfDay = partOfDay;

			this.TLWidth = timeLine.offsetWidth;
			this.DBPWidth = dayBeginPointer.offsetWidth;
			this.DEPWidth = dayEndPointer.offsetWidth;

			if (!(isIE))
			{
				var ua = explorerInfo.toLowerCase();
				var brow = {};
				var s;

				if ((s = ua.match(/firefox\/([\d.]+)/)))
				{
					brow.firefox = s[1];
				}
				else if (s = ua.match(/chrome\/([\d.]+)/))
				{
					brow.chrome = s[1];
				}
				else if (s = ua.match(/opera.([\d.]+)/))
				{
					brow.opera = s[1];
				}
				else if (s = ua.match(/version\/([\d.]+).*safari/))
				{
					brow.safari = s[1];
				}

				if (brow.chrome || brow.opera)
				{
					this.DBPWidth++;
				}
			}
			this.pixelOfEachUnit = (this.TLWidth - this.DEPWidth - this.DBPWidth) / this.pieces;

			this.setSunrise(this.sunrise);
			this.setSunset(this.sunset);

			dayBeginPointer.onmousedown = this.beginPointBind();
			dayEndPointer.onmousedown = this.endPointBind();
		}

		DayNightSwitch.prototype.textOverlay = function()
		{
			var dis = this.TLWidth - (this.firstPartOfNight.offsetWidth + this.secondPartOfNight.offsetWidth);
			dis -= ((this.DBPWidth + this.DEPWidth) / 2);
			var leWidth = this.dayBeginTimeLabel.offsetWidth;
			var lbWidth = this.dayEndTimeLabel.offsetWidth;

			var overLayLen = ((leWidth + lbWidth) / 2) - dis;
			return overLayLen;
		}

		DayNightSwitch.prototype.bindCbk = function(cbk)
		{
			return function()
			{
				cbk();
			};
		}

		DayNightSwitch.prototype.fixLabel = function()
		{
			var leftMin = ((this.DBPWidth - this.dayBeginTimeLabel.offsetWidth) / 2);
			var rightMin = ((this.DEPWidth - this.dayEndTimeLabel.offsetWidth) / 2);
			var overLayLen = this.textOverlay();
			var leftL = this.firstPartOfNight.offsetWidth + leftMin;
			var rightL = this.TLWidth - this.secondPartOfNight.offsetWidth - this.DEPWidth;
			rightL += rightMin;
			rightL -= this.dayBeginTimeLabel.offsetWidth;
			if (overLayLen > 0)
			{
				leftL -= (overLayLen / 2);
				rightL += (overLayLen / 2);
			}
			this.dayBeginTimeLabel.style.left = leftL + "px";
			this.dayEndTimeLabel.style.left = rightL + "px";
		}

		DayNightSwitch.prototype.setSunrise = function(value)
		{
			var pixelValue = this.convertTimeToValue(value);

			if (pixelValue > this.convertTimeToValue(this.sunset))
			{
				return false;
			}

			if (value == this.sunset)
			{
				this.setSunset(value);
			}

			if ("y" == this.intTime)
			{
				value = parseInt(value, 10);
				value = value.toString();
			}

			this.sunrise = value;
			var pointerPixelValue = Math.floor(pixelValue - this.DBPWidth);
			this.firstPartOfNight.style.width = pointerPixelValue + "px";
			this.dayBeginTimeLabel.innerHTML = value;

			var dayWid = this.TLWidth - pointerPixelValue - this.secondPartOfNight.offsetWidth;
			dayWid -= (this.DBPWidth + this.DEPWidth);
			this.partOfDay.style.width = dayWid + "px";

			this.fixLabel();
			return true;
		}
		DayNightSwitch.prototype.setSunset = function(value)
		{
			var pixelValue = this.convertTimeToValue(value);

			if (pixelValue < this.convertTimeToValue(this.sunrise))
			{
				return false;
			}
			if (pixelValue < this.firstPartOfNight.offsetWidth + this.DBPWidth)
			{
				pixelValue = this.firstPartOfNight.offsetWidth + this.DBPWidth;
			}

			if ("y" == this.intTime)
			{
				value = parseInt(value, 10);
				value = value.toString();
			}

			this.sunset = value;
			this.dayEndTimeLabel.innerHTML = value;
			var secondPartWidth = Math.floor(this.TLWidth - pixelValue - this.DEPWidth);
			this.secondPartOfNight.style.width = secondPartWidth + "px";

			var dayWid = this.TLWidth - this.firstPartOfNight.offsetWidth - secondPartWidth;
			dayWid -= (this.DBPWidth + this.DEPWidth);
			this.partOfDay.style.width = dayWid + "px";

			this.fixLabel();
			return true;
		}
		DayNightSwitch.prototype.getSunrise = function()
		{
			return this.sunrise;
		}
		DayNightSwitch.prototype.getSunset = function()
		{
			return this.sunset;
		}

		DayNightSwitch.prototype.beginPointBind = function()
		{
			var thisObj = this;

			return function(event)
			{
				event = event ? event : window.event;
				var ta = event.target || event.srcElement;
				var clickPointPos = getMousePos(event);
				var fPNWidth = parseInt(thisObj.firstPartOfNight.style.width, 10);
				var sPNWidth = parseInt(thisObj.secondPartOfNight.style.width, 10);;

				document.onmousemove = function(event)
				{
					event = event ? event :window.event;
					var curMousePos = getMousePos(event);
					clearSelection();
					var offsetX = curMousePos.x - clickPointPos.x;
					var maxOffset = thisObj.TLWidth - fPNWidth - sPNWidth - thisObj.DBPWidth - thisObj.DEPWidth;
					var offsetOfEachUnit = Math.floor(thisObj.pixelOfEachUnit);
					if ("n" == thisObj.equalStartEndTime)
					{
						if (offsetX >= 0)
						{
							if (offsetX > (maxOffset - offsetOfEachUnit))
							{
								offsetX = maxOffset - offsetOfEachUnit;
							}
						}
						else
						{
							if ((maxOffset - offsetX) > (thisObj.TLWidth - thisObj.DBPWidth - thisObj.DEPWidth - offsetOfEachUnit))
							{
								offsetX = maxOffset - (thisObj.TLWidth - thisObj.DBPWidth - thisObj.DEPWidth - offsetOfEachUnit);
							}
						}
					}
					else
					{
						if (offsetX > maxOffset)
						{
							offsetX = maxOffset;
						}
					}
					var pixelValue = (fPNWidth + offsetX);
					pixelValue = pixelValue > 0 ? pixelValue : 0;
					thisObj.firstPartOfNight.style.width = pixelValue + "px";

					var dayWid = thisObj.TLWidth - pixelValue - sPNWidth;
					dayWid -= (thisObj.DBPWidth + thisObj.DEPWidth);
					thisObj.partOfDay.style.width = dayWid + "px";

					if (pixelValue != 0)
					{
						pixelValue += (thisObj.DBPWidth);
					}
					thisObj.sunrise = thisObj.convertValueToTime(pixelValue);
					thisObj.dayBeginTimeLabel.innerHTML = thisObj.sunrise;

					thisObj.fixLabel();
				};

				document.onmouseup = function(event)
				{
					thisObj.fixLabel();
					clearSelection();
					typeof thisObj.timeChangeCbk == "function" && thisObj.timeChangeCbk("day_begin", thisObj.sunrise);
					document.onmousemove = null;
					document.onmouseup = null;
				};

			};

		};

		DayNightSwitch.prototype.endPointBind = function()
		{
			var thisObj = this;

			return function(event)
			{
				event = event ? event : window.event;
				var ta = event.target || event.srcElement;
				var clickPointPos = getMousePos(event);
				var fPNWidth = parseInt(thisObj.firstPartOfNight.style.width, 10);
				var sPNWidth = parseInt(thisObj.secondPartOfNight.style.width, 10);
				document.onmousemove = function(event)
				{
					event = event ? event :window.event;
					var curMousePos = getMousePos(event);
					clearSelection();
					var pixelValue;
					var offsetX = clickPointPos.x - curMousePos.x ;
					var maxOffset = thisObj.TLWidth - sPNWidth - fPNWidth - thisObj.DEPWidth - thisObj.DBPWidth;
					var offsetOfEachUnit = Math.floor(thisObj.pixelOfEachUnit);
					if ("n" == thisObj.equalStartEndTime)
					{
						if (offsetX >= 0)
						{
							if (offsetX > (maxOffset - offsetOfEachUnit))
							{
								offsetX = maxOffset - offsetOfEachUnit;
							}
						}
						else
						{
							if ((maxOffset - offsetX) > (thisObj.TLWidth - thisObj.DBPWidth - thisObj.DEPWidth - offsetOfEachUnit))
							{
								offsetX = maxOffset - (thisObj.TLWidth - thisObj.DBPWidth - thisObj.DEPWidth - offsetOfEachUnit);
							}
						}
					}
					else
					{
						if (offsetX > maxOffset)
						{
							offsetX = maxOffset;
						}
					}
					var secondPartWidth = (sPNWidth + offsetX);
					if (secondPartWidth < 0)
					{
						secondPartWidth = 0;
					}

					var pixelValue = thisObj.TLWidth - secondPartWidth - (thisObj.DEPWidth);
					thisObj.sunset = thisObj.convertValueToTime(pixelValue);

					thisObj.secondPartOfNight.style.width = secondPartWidth + "px";
					thisObj.dayEndTimeLabel.innerHTML = thisObj.sunset;
					var dayWid = thisObj.TLWidth - fPNWidth - secondPartWidth;
					dayWid -= (thisObj.DBPWidth + thisObj.DEPWidth);
					thisObj.partOfDay.style.width = dayWid + "px";

					thisObj.fixLabel();
				};

				document.onmouseup = function(event)
				{
					thisObj.fixLabel();
					clearSelection();
					typeof thisObj.timeChangeCbk == "function" && thisObj.timeChangeCbk("day_end", thisObj.sunset);
					document.onmousemove = null;
					document.onmouseup = null;
				};

			};

		};

		DayNightSwitch.prototype.convertTimeToValue = function(stringTime)
		{
			var len = stringTime.length;
			var hour;
			var minus = 0;
			if (this.intTime == "n")
			{
				var indexOfSlice = stringTime.lastIndexOf(":");
				hour = parseInt(stringTime.substring(0, indexOfSlice), 10);
				minus = parseInt(stringTime.substring(indexOfSlice + 1, len), 10);
			}
			else if (this.intTime == "y")
			{
				hour = parseInt(stringTime, 10);
			}

			minus += hour * 60;

			var res;

			var indexOfUnit;

			if (minus <= 0)
			{
				indexOfUnit = 0;
			}
			else
			{
				indexOfUnit = ((minus - 1) / this.unit) + 1;
			}
			indexOfUnit = Math.ceil(minus / this.unit);
			res = Math.floor(indexOfUnit * this.pixelOfEachUnit);
			res += this.DBPWidth;
			return res;
		};

		DayNightSwitch.prototype.convertValueToTime = function(value)
		{
			var hour;
			var minus;
			var indexOfUnit;
			var res;
			value -= this.DBPWidth;

			if (value <= 0)
			{
				indexOfUnit = 0;
			}
			else
			{
				indexOfUnit = Math.floor(((value - 1) / this.pixelOfEachUnit)) + 1;
			}

			minus = indexOfUnit * this.unit;
			hour = Math.floor(minus / 60);
			minus = minus % 60;
			hourStr = hour.toString();
			minusStr = minus.toString();

			if (this.intTime == "n")
			{
				if (hourStr.length < 2)
				{
					hourStr = "0" + hourStr;
				}
				if (minusStr.length < 2)
				{
					minusStr = "0" + minusStr;
				}
				res = hourStr + ":" + minusStr
			}
			else if (this.intTime == "y")
			{
				res = hourStr;
			}
			return res;
		};
	};

	this.DayNightSwitchInit(paras);
}

/* 块级开关 */
function BlockSwitch(optionPara)
{
	this.option = {
		id:"",
		blockList:"",
		className:"",
		classNameHit:"",
		click:"",
		initValue:0,
		createItemHd:null /* 用于创建具体的li的函数 */
	};

	if (typeof BlockSwitch.prototype._init != "function")
	{
		/* 初始化 */
		BlockSwitch.prototype._init = function(optionPara){
			this._optionInit(optionPara);
			this._create();
		};

		/* 参数初始化 */
		BlockSwitch.prototype._optionInit = function(optionPara)
		{
			var option = this.option;
			for (var prop in optionPara)
			{
				if (option[prop] != undefined)
				{
					option[prop] = optionPara[prop];
				}
			}
		};

		/* block switch 生成 */
		BlockSwitch.prototype._create = function()
		{
			var option = this.option;
			var blockObj = id(option.id);
			var blockList = option.blockList;
			var li, item, key, value;
			var objThis = this;
			var classNameHit = option.classNameHit;
			var initValue = option.initValue;
			var childLis = $("#" + option.id + " li");
			var createItemHd = option.createItemHd;

			if (null == blockObj)
			{
				return;
			}

			if (blockList[0].value == null)
			{
				for (var index = 0, len = blockList.length; index < len; index++)
				{
					blockList[index].value = index;
				}
			}

			if (0 == childLis.length)
			{
				blockObj.innerHTML = "";
				for (var index = 0, len = blockList.length; index < len; index++)
				{
					item = blockList[index];
					key = item.key;
					value = item.value;

					if (undefined != createItemHd)
					{
						li = createItemHd(index);
					}
					else
					{
						li = document.createElement("li");
						li.className = item.className;

						if (undefined != initValue)
						{
							if (value === initValue)
							{
								li.className = item.className + " " + (classNameHit.length == 0 ? "hitLi" : classNameHit);
							}
						}
						else if (index == 0)
						{
							li.className = item.className + " " + (classNameHit.length == 0 ? "hitLi" : classNameHit);
						}

						li.innerHTML = key;
						li.key = key;
						li.value = value;
						li.onclick = function(){
							objThis._click(this.key, this.value);
						};
					}

					blockObj.appendChild(li);
				}
			}
			else
			{
				if (childLis.length != blockList.length)
				{
					log("BlockSwitch._create: blockList is too less.");
					return;
				}

				for (var index = 0, len = childLis.length; index < len; index++)
				{
					item = blockList[index];
					li = childLis[index];
					li.key = item.key;
					li.value = item.value;
					li.onclick = function(){
						objThis._click(this.key, this.value);
					};
				}
			}
		};

		/* 点击函数 */
		BlockSwitch.prototype._click = function(key, value){
			var option = this.option;
			var blockObj = id(option.id);
			var classNameHit = option.classNameHit;
			var childNodes = blockObj.childNodes;
			var clickhd = option.click;
			var item, key, value;

			for (var i = 0, len = childNodes.length; i < len; i++)
			{
				item = childNodes[i];
				if (item.nodeType == 1 && item.tagName.toLowerCase() == "li")
				{
					classNameHit = classNameHit == undefined ? classNameHit : "hitLi";

					if (item.key == key || item.value == value)
					{
						if (item.className.indexOf(classNameHit) < 0)
						{
							item.className += (" " + classNameHit);
						}
					}
					else
					{
						item.className = item.className.replace(classNameHit, "");
					}
				}
			}

			this.value = value;
			this.key = key;
			if (typeof clickhd == "function")
			{
				clickhd(key, value);
			}
		};

		/* 点击函数 */
		BlockSwitch.prototype.click = function(key, value){
			this._click(key, value);
		};
	}

	this._init(optionPara);
}

/* 云帐号相关 */
function CloudCommon()
{
	this.cloudAccountEmailList = [
		{key:"gmail.com",	value:"https://mail.google.com"},
		{key:"live.com",	value:"http://mail.live.com"},
		{key:"live.cn",		value:"http://mail.live.com"},
		{key:"hotmail.com",	value:"http://mail.live.com"},
		{key:"outlook.com",	value:"http://mail.live.com"},
		{key:"qq.com",		value:"http://mail.qq.com"},
		{key:"126.com",		value:"http://mail.126.com"},
		{key:"163.com",		value:"http://mail.163.com"},
		{key:"yeah.net",	value:"http://mail.yeah.net"},
		{key:"sina.com",	value:"http://mail.sina.com.cn"},
		{key:"sohu.com",	value:"http://mail.sohu.com"},
		{key:"21cn.com",	value:"http://mail.21cn.com"},
		{key:"sina.com.cn",	value:"http://mail.sina.com.cn"},
		{key:"tom.com",		value:"http://mail.tom.com"},
		{key:"sogou.com",	value:"http://mail.sogou.com"},
		{key:"foxmail.com",	value:"http://mail.foxmail.com"},
		{key:"188.com",		value:"http://mail.188.com"},
		{key:"wo.cn",		value:"http://mail.wo.cn"},
		{key:"189.cn",		value:"http://mail.189.cn"},
		{key:"139.com",		value:"http://mail.10086.cn"},
		{key:"eyou.com",	value:"http://www.eyou.com"},
		{key:"aliyun.com",	value:"http://mail.aliyun.com"},
		{key:"263.net",		value:"http://mail.263.net"},
		{key:"2980.com",	value:"http://www.2980.com"}
	];

	this.emailLinkCheck = function(emallAddr){
		for (var index in cloudAccountEmailList)
		{
			var item = cloudAccountEmailList[index];
			if (emallAddr.indexOf(item.key) > 0)
			{
				return item.value;
			}
		}

		return null;
	};

	this.gCloudColObj = {
		cloudBackHd:null,
		cloudBackBRHd:null,
		account:""
	};

	this.cloudSetBackHd = function(handle){
		gCloudColObj.cloudBackHd = handle;
	};

	this.cloudGoBack = function(){
		var goBack = gCloudColObj.cloudBackHd;

		typeof goBack == "function" && goBack();
	};

	this.cloudSetBackBRHd = function(handle){
		gCloudColObj.cloudBackBRHd = handle;
	};

	this.cloudGoBackBR = function(arg){
		var goBack = gCloudColObj.cloudBackBRHd;

		hideCloudPage();
		typeof goBack == "function" && goBack(arg);
	};

	this.gCloudAccountBR = {
		bodyHeight:0,
		account:"",
		pwd:"",
		CAPTCHAR:"",
		accountType:"",
		success:false,
		noteF:"",
		noteS:"",
		pwdLen:0,
		softVersion:"",
		bFWzd:false
	};

	this.showCloudPage = function(url)
    {
		var cloudAccountPage = id(this.cloudPageId);

		if (null == cloudAccountPage)
		{
			cloudAccountPage = el("div");
			cloudAccountPage.id = this.cloudPageId;
			document.body.appendChild(cloudAccountPage);
		}

        loadPage(url, "CloudAccountPage", function(result){
			if (ENONE == result[ERR_CODE])
			{
				cloudPageSetNodes(true);
			}
		}, {bClearPageTickArray:false});
    };

	this.hideCloudPage = function(){
		try
		{
			emptyNodes(id(this.cloudPageId));
			cloudPageSetNodes(false);
		}catch(ex){}
	};

	this.cloudPageSetNodes = function(tag){
		var other = "none";
		var node, nodes = document.body.childNodes;
		var nodeId, calanderCon;

		if (true == tag)
		{
			cloudPage = "block";

			if (0 == gCloudAccountBR.bodyHeight)
			{
				gCloudAccountBR.bodyHeight = parseInt(document.body.offsetHeight);
			}

			document.body.style.height = "auto";
		}
		else
		{
			other = "block";
			document.body.style.height = gCloudAccountBR.bodyHeight + "px";
			gCloudAccountBR.bodyHeight = 0;
		}

		/* 设置节点显隐 */
		for(var index in nodes)
		{
			node = nodes[index];
			if (node.nodeName != undefined &&
				node.nodeName.toUpperCase() == "DIV")
			{
				nodeId = node.id;

				if (nodeId == this.cloudPageId)
				{
					if (true == tag)
					{
						setStyle(node, {"display":"block", "visibility":"visible", "top":"0px"});
					}
					else
					{
						setStyle(node, {"display":"none", "visibility":"hidden", "top":"-9999px"});
					}
				}
				else if (nodeId == "Con")
				{
					if (true == tag)
					{
						setStyle(node, {"position":"absolute", "visibility":"hidden", "top":"-9999px"});
					}
					else
					{
						setStyle(node, {"position":"static", "visibility":"visible", "top":"0px"});
					}
				}
				else if (nodeId != this.gLoginId &&
						 nodeId != this.CoverId &&
						 nodeId != gToastConCoverId &&
						 nodeId != "laydate_box")
				{
					setStyle(node, {"display":other});
				}
			}
		}

		id(this.gLoginId).style.display = "none";
		id(this.CoverId).style.display = "none";

		calanderCon = id("laydate_box");
		if (null != calanderCon)
		{
			calanderCon.style.display = "none";
		}
	};

	this.cloudErrHandle = function(errCode)
	{
		var code = parseInt(errCode);

		switch(code)
		{
		case EINVCLOUDERRORGENERIC:
		case EINVCLOUDERRORPARSEJSON:
		case EINVCLOUDERRORPARSEJSONNULL:
		case EINVCLOUDERRORSERVERINTERNALERROR:
		case EINVCLOUDERRORPERMISSIONDENIED:
		case EINVCLOUDERRORPARSEJSONID:
			showStr = errStr.invNetworkErr;
			break;
		case EINVERRORPERMISSIONDENIED:
			showStr = errStr.invPermissionDeny;
			break;
		case EINVCLOUDERRORMETHODNOTFOUND:
		case EINVCLOUDERRORPARAMSNOTFOUND:
		case EINVCLOUDERRORPARAMSWRONGTYPE:
		case EINVCLOUDERRORPARAMSWRONGRANGE:
		case EINVCLOUDERRORINVALIDPARAMS:
			showStr = errStr.invRequestFail;
			break;
		case EINVCLOUDERRORBINDDEVICEERROR:
			showStr = errStr.invTPIDLgFail;
			break;
		case EINVCLOUDERRORUNBINDDEVICEERROR:
			showStr = errStr.invTPIDUnBindFail;
			break;
		case EINVCLOUDERRORHWIDNOTFOUND:
		case EINVCLOUDERRORFWIDNOTSUPPORTDEVICE:
			showStr = label.cloudDeviceInfoExpt;
			break;
		case EINVCLOUDERRORDEVICEALIASFORMATERROR:
			showStr = errStr.invRouterNameFormat;
			break;
		case EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR:
			showStr = errStr.invCloudAccountFmtErr;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL:
		case EINVCLOUDERRORRESETMAILSENDFAIL:
			showStr = errStr.invCAPTCHASendFail;
			break;
		case EINVCLOUDERRORTOKENEXPRIED:
		case EINVCLOUDERRORTOKENINCORRECT:
			showStr = errStr.invTPIDTimeout;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEFAIL:
		case EINVCLOUDERRORACCOUNTACTIVETIMEOUT:
			showStr = errStr.invAccountCheckFail;
			break;
		case EINVCLOUDERRORRESETPWDTIMEOUT:
		case EINVCLOUDERRORRESETPWDFAIL:
			showStr = errStr.invAccountRstPwdFail;
			break;
		default:
			return {result:true};
		}

		return {result:false, tip:showStr};
	};
}

/* 云帐号相关 */
function CloudAction()
{
	this.cloudActionQueryStatusHd = null;
	this.cloudActionQueryStatusWaitHd = null;
	this.cloudActionStatusQuering = false;
	this.cloudActionQueryStoped = false;
	this.CLOUD_STATUS_QUERY_TIMEOUT = 1000;
	this.CLOUD_STATUS_QUERY_TIMEOUT_WAIT = 20 * 1000;
	this.cloudCloseLoadingHandle = null;

	this._cloudExptStopHandle = function(){
		clearTimeout(cloudActionQueryStatusWaitHd);
		closeLoading();
		closeToast();
		typeof cloudCloseLoadingHandle == "function" && cloudCloseLoadingHandle();
		_setCloudCloseLoadingHandle(null);
	};

	/* 云客户端动作执行结果查询的错误处理函数 */
	this._cloudQueryErrHandle = function(errNo, objOrId){
		var showStr = "";

		switch (parseInt(errNo))
		{
		case ENONE:
			return true;
		default:
			showStr = errStr.invRequestFail;
			break;
		}

		_cloudExptStopHandle();
		showAlert(showStr, objOrId);
		return false;
	};

	/* 云客户端动作执行和查询的错误处理函数 */
	this._cloudGetActnErrHandle = function(errNo, callBack){
		var showStr = "";
		var cloudErrRel;

		switch (parseInt(errNo))
		{
		case ENONE:		/* 执行成功 */
			return true;
		case EINVSENDREQMSGFAILED:		/* 发送失败 */
			showStr = errStr.invSendReqMsgFailed;
			break;
		case ESYSBUSY:
		case EINVLASTOPTIONISNOTFINISHED:		/* 上个动作执行中 */
			showStr = errStr.invLastOptionIsNotFinished;
			break;
		case ESYSTEM:
			showStr = errStr.invRequestFail;		/* 系统错误 */
			break;
		case ENOMEMORY:
			showStr = errStr.invMemoryOut;		/* 系统内存不足 */
			break;
		case EINVGETDATAFAILED:
			showStr = errStr.invGetDataFailed;		/* 获取数据失败 */
			break;
		case EINVPARAMETER:
			showStr = errStr.invParameter;		/* 请求参数非法 */
			break;
		case EINVREQUESTTIMEOUT:
			showStr = errStr.invRequestTimeout;		/* 请求超时，服务器无响应 */
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			showStr = label.cloudDeviceInfoExpt;		/* 设备非法 */
			break;
		default:		/* 未知的错误 */
			cloudErrRel = cloudErrHandle(errNo)
			if (cloudErrRel.result == false)
			{
				showStr = cloudErrRel.tip;
				break;
			}

			if (typeof callBack == "function")
			{
				_cloudExptStopHandle();
				callBack(errNo);
				return false;
			}
			else
			{
				showStr = errStr.invRequestFail;
				break;
			}
		}

		_cloudExptStopHandle();
		showAlert(showStr);
		return false;
	};

	/* 强制停止正在进行的查询动作 */
	this.cloudAccountQueryStop = function(){
		cloudActionQueryStoped = true;
		cloudActionStatusQuering = false;
		clearTimeout(cloudActionQueryStatusHd);
		clearTimeout(cloudActionQueryStatusWaitHd);
		_cloudExptStopHandle();
	};

	this._cloudStatusDataOrg = function(secName){
		var data = {};
		var uciCS= cloudClientStatus;

		data[uciCS.fileName] = {};
		data[uciCS.fileName][KEY_NAME] = secName;

		return data;
	};

	this._setCloudCloseLoadingHandle = function(handle)
	{
		cloudCloseLoadingHandle = handle;
	};

	/* 查询获取TP-LINK ID的状态的结果 */
	this._cloudAccountStatus = function(secName, callBack, timeoutCallBack){
		cloudActionStatusQuering = true;
		$.queryP(_cloudStatusDataOrg(secName), function(result){
			if (_cloudGetActnErrHandle(result[ERR_CODE]))
			{
				var uciCS= cloudClientStatus;
				var status = parseInt(result[uciCS.fileName][secName][uciCS.optName.actionStatus]);
				var statusCC = uciCS.optValue.queryStatus;

				switch(status)
				{
				case statusCC.idle:
				case statusCC.max:
					_cloudGetActnErrHandle(EINVSENDREQMSGFAILED);
					break;
				case statusCC.timeout:
					if (typeof timeoutCallBack == "function")
					{
						timeoutCallBack();
					}
					else
					{
						_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
					}
					break;
				case statusCC.prepare:
				case statusCC.trying:
					cloudActionQueryStatusHd = $.setTimeout(function(){
						_cloudAccountStatus(secName, callBack, timeoutCallBack);	/* 此处表示服务器有响应，交由具体的函数进行处理 */
					}, CLOUD_STATUS_QUERY_TIMEOUT);
					return;
				case statusCC.failed:		/* 此处成功和失败是相同的处理，区别在于具体的错误码不同，需要具体的调用者具体分析 */
				case statusCC.success:
					callBack(result);
					break;
				default:
					_cloudGetActnErrHandle(undefined);
					break;
				}

				closeLoading(cloudCloseLoadingHandle);
				_setCloudCloseLoadingHandle(null);
				cloudActionStatusQuering = false;
				clearTimeout(cloudActionQueryStatusWaitHd);
			}
		});
	};

	/* 开始执行查询的状态 */
	this._cloudActionQueryStatus = function(secName, callBack, forced, timeoutCallBack, queryStatusTimeout){
		/* 查询动作被手动关闭, 则直接退出 */
		if (true == cloudActionQueryStoped)
		{
			return;
		}

		if (true == cloudActionStatusQuering && false == forced)	/* 之前的动作正在执行 */
		{
			_cloudGetActnErrHandle(EINVLASTOPTIONISNOTFINISHED);
		}
		else
		{
			cloudActionStatusQuering = false;
			clearTimeout(cloudActionQueryStatusHd);
			clearTimeout(cloudActionQueryStatusWaitHd);

			/* 设置超时处理 */
			cloudActionQueryStatusWaitHd = $.setTimeout(function(){
				cloudActionStatusQuering = false;
				clearTimeout(cloudActionQueryStatusHd);
				if (typeof timeoutCallBack == "function")
				{
					timeoutCallBack();
				}
				else
				{
					_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
				}
			}, CLOUD_STATUS_QUERY_TIMEOUT_WAIT);

			/* 开始查询 */
			_cloudAccountStatus(secName, callBack, function(){
				clearTimeout(cloudActionQueryStatusWaitHd);
				if (typeof queryStatusTimeout == "function")
				{
					queryStatusTimeout();
				}
				else
				{
					_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
				}
			});
		}
	};

	/* 获取TP-LINK ID的状态 */
	this.cloudAccountState = function(account, callBack){
		var data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		data[uciCC.fileName][uciCC.actionName.getAccountStat] = {};
		data[uciCC.fileName][uciCC.actionName.getAccountStat][uciCC.optName.username] = account;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS= cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getAccountStat, function(result){
					if (_cloudQueryErrHandle(result[uciCS.fileName][uciCS.secName.getAccountStat][uciCS.optName.errCode]))
					{
						var dataObj = {};

						dataObj[uciCC.fileName] = {};
						dataObj[uciCC.fileName][KEY_NAME] = uciCC.secName.deviceStatus;
						$.action(dataObj, function(result){
							if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
							{
								callBack(uciCC.optValue.regestStatus == result[uciCC.fileName][uciCC.secName.deviceStatus]);
							}
						}, true);
					}
				}, true);
			}
		}, true);
	};

	/* 检查重置(找回)密码的验证码是否正确 */
	this.cloudAccountRstPwdCheckCAPTCHA = function(account, CAPTCHA, callBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.checkResetPwdVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.checkResetPwdVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.checkResetPwdVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 获取重置(找回)密码的验证码 */
	this.cloudAccountRstPwdAC = function(account, accountType, callBack, closeCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.getResetPwdVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;
		_setCloudCloseLoadingHandle(closeCallBack);

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getResetPwdVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getResetPwdVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 重置（找回）TP-LINK ID的密码 */
	this.cloudAccountRstPwd = function(account, pwd, CAPTCHA, accountType, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.resetPassword] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		secObj[uciCC.optName.password] = pwd;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.resetPassword, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.resetPassword][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 登录TP-LINK ID */
	this.cloudAccountBind = function(account, pwd, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.bind] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.password] = pwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.bind, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.bind][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 获取创建TP-LINK ID的验证码 */
	this.cloudAccountGetRegistAC = function(account, accountType, callBack, closeCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.getRegVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;
		_setCloudCloseLoadingHandle(closeCallBack);

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getRegVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getRegVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 创建TP-LINK ID */
	this.cloudAccountRegist = function(account, accountType, pwd, CAPTCHA, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.register] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		secObj[uciCC.optName.password] = pwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.register, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.register][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 解绑TP-LINK ID */
	this.cloudAccountUnind = function(callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.unbind] = {};
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.unbind, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.unbind][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 修改TP-LINK ID密码 */
	this.cloudAccountModifyPwd = function(oldpwd, newPwd, callBack, timeoutCallBack, queryStatusTimeout){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.modifyAccountPwd] = {};
		secObj[uciCC.optName.oldPassword] = oldpwd;
		secObj[uciCC.optName.newPassword] = newPwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.modifyAccountPwd, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.modifyAccountPwd][uciCS.optName.errCode]);
				}, true, timeoutCallBack, queryStatusTimeout);
			}
			else
			{
				hsLoading(false);
			}
		}, true);
	};

	/* 请求未安装插件信息 */
	this.getAppsUninstalledInfo = function (start, end, callBack, timeoutHandle, queryStatusTimeout){
		var secObj, data = {};

		data[uciAppInfo.fileName] = {};
		secObj = data[uciAppInfo.fileName][uciAppInfo.actionName.getUninstalledInfo] = {};
		secObj[uciAppInfo.dynOptName.start] = start;
		secObj[uciAppInfo.dynOptName.end] = end;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getNotInstalledApps, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getNotInstalledApps][uciCS.optName.errCode]);
				}, true, timeoutHandle, queryStatusTimeout);
			}
		}, true);
	};

	/* 请求可更新插件信息 */
	this.getAppsCanUpdateInfo = function (start, end, callBack, timeoutHandle, queryStatusTimeout){
		var secObj, data = {};

		data[uciAppInfo.fileName] = {};
		secObj = data[uciAppInfo.fileName][uciAppInfo.actionName.getUpdateInfo] = {};
		secObj[uciAppInfo.dynOptName.start] = start;
		secObj[uciAppInfo.dynOptName.end] = end;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getCanUpdateApps, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getCanUpdateApps][uciCS.optName.errCode]);
				}, true, timeoutHandle, queryStatusTimeout);
			}
		}, true);
	};

	/* 请在此处继续添加其他的处理 */
}

/* cloud push 函数 */
function CloudUpgradePush()
{
	this.pageCloudPush = true;	/* 登陆页面期间只弹出一处升级提示 */
	this.gOnlineUpgradeNote = "";
	this.upgradeErrCBCloudPush = null;
	this.gOnlineUpgradeFail = false;
	this.errHandleCloudPush = function(errNo)
	{
		switch (errNo)
		{
		case ENONE:
			return true;
		case EFWNOTSUPPORTED:
		case EFILETOOBIG:
		case EFWEXCEPTION:
			gOnlineUpgradeNote = errStr.fwFmtErr;
			break;
		case EFWNOTINFLANDBL:
		case EFWNEWEST:
			gOnlineUpgradeNote = errStr.fwNotSupported;
			break;
		case EINVMEMORYOUT:
		case EINVDOWNLOADFWFAILED:
		case EINVSENDREQMSGFAILED:
		case EINVREQUESTTIMEOUT:
		case EINVCONNECTTINGCLOUDSERVER:
		case EINVLASTOPTIONISNOTFINISHED:
		case ESYSBUSY:
			gOnlineUpgradeNote = errStr.fwDownLoadFailed;
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			gOnlineUpgradeNote = label.cloudDeviceInfoExpt;		/* 设备非法 */
			break;
		case EINVFMT:
		case EFWRSAFAIL:
		case EFWHWIDNOTMATCH:
		case EFWZONECODENOTMATCH:
		case EFWVENDORIDNOTMATCH:
		case EINVUPGRADEFWFAILED:
		default:
			gOnlineUpgradeNote = errStr.fwUpgradeFailed;
			break;
		}

		$.setTimeout(upgradeFailHdCloudPush, 10);
		return false;
	};

	this.setUpgradeErrCBCloudPush = function(handle){
		this.upgradeErrCBCloudPush = handle;
	};

	this.upgradeFailHdCloudPush = function()
	{
		if (typeof this.upgradeErrCBCloudPush == "function")
		{
			this.upgradeErrCBCloudPush();
			this.upgradeErrCBCloudPush = null;
		}
	};

	/* 检查是否正在升级 */
	this.checkOnlineUpgrading = function(unUpgradingHd){
		var statusFile = cloudClientStatus.fileName;
		var downloadProg = {};

		downloadProg[statusFile] = {};
		downloadProg[statusFile][KEY_NAME] = cloudClientStatus.secName.clientInfo;

		if (true == $.local)
		{
			unUpgradingHd();
			return;
		}

		$.query(downloadProg, function(result){
			if (ENONE == result[ERR_CODE])
			{
				var cloudInfo = result[statusFile][cloudClientStatus.secName.clientInfo];
				var fwDownloadStatus = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadStatus]);

				if (uciCloudConfig.optValue.cloudDownloading == fwDownloadStatus)
				{
					onlineUpgradeProgress();
				}
				else
				{
					unUpgradingHd();
				}
			}
			else
			{
				unUpgradingHd();
			}
		});
	};

	this.onlineUpgradeProgress = function(){
		var statusFile = cloudClientStatus.fileName;
		showProgBarP(
			statusStr.fwDownloading,
			function(callback){
				var downloadProg = {};
				var percent = 0;
				var rel = {};

				downloadProg[statusFile] = {};
				downloadProg[statusFile][KEY_NAME] = cloudClientStatus.secName.clientInfo;
				$.queryP(downloadProg, function(result){
					var code = result[ERR_CODE];
					if (true == errHandleCloudPush(code))
					{
						var cloudInfo = result[statusFile][cloudClientStatus.secName.clientInfo];
						var fwDownloadStatus = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadStatus]);

						if (uciCloudConfig.optValue.cloudDownloading == fwDownloadStatus ||
							uciCloudConfig.optValue.cloudComplete == fwDownloadStatus)
						{
							rel["count"] = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadProgress]);
							rel[ERR_CODE] = ENONE;
						}
						else if(uciCloudConfig.optValue.cloudOutline == fwDownloadStatus)
						{
							rel["count"] = ERR_PERCENT;
							rel[ERR_CODE] = ENONE;
						}
						else
						{
							rel["count"] = 0;
							rel[ERR_CODE] = ENONE;
						}
					}
					else
					{
						rel["count"] = ERR_PERCENT;
						rel[ERR_CODE] = ENONE;
					}

					callback(rel);
				}, true);
			},
			true,
			function(success){
				closeProgBar();
				if (true == success)
				{
					showProgBar(SYSUPGRADE_SECONDS, label.upgrading, function(){
					lanDetecting(function(){
						window.location.reload();
						});
					}, false, statusStr.upgradeOk, statusStr.upgradeTip);
				}
				else
				{
					gOnlineUpgradeNote = statusStr.fwDownLoadErr;
					upgradeFailHdCloudPush();
				}
			}
		);
	};

	this.checkFWVerSuccessCloudPush = function()
	{
		var uciFile = uciCloudConfig.fileName;
		var data = {};

		data[uciFile] = {};
		data[uciFile][uciCloudConfig.actionName.downloadFw] = null;

		$.action(data, function(dataObj){
			if (true == errHandleCloudPush(dataObj[ERR_CODE]))
			{
				onlineUpgradeProgress();
			}
		});
	}

	this.onlineUpgradeCheck = function(checkErrHd, checkFwFailHd, checkFwSuccessHd)
	{
		var uciFile = uciCloudConfig.fileName;
		var statusFile = cloudClientStatus.fileName;
		var data = {};

		/* 查询检查升级信息的结果 */
		function checkFWVer()
		{
			var checkFwVerFail = 0;
			var checkFwVerOK = 4;
			var checkFwVerTimeout = 5;
			var data = {};

			data[statusFile] = {};
			data[statusFile][KEY_NAME] = cloudClientStatus.secName.checkFwVer;
			$.queryP(data, function(result){
				if (true == checkErrHd(result[ERR_CODE]) && false == $.local)
				{
					var actionStatus = result[statusFile][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.actionStatus];
					switch(parseInt(actionStatus))
					{
					case checkFwVerFail:
					case checkFwVerTimeout:
						typeof checkFwFailHd == "function" && checkFwFailHd(result[statusFile][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.errCode]);
						break;
					case checkFwVerOK:
						typeof checkFwSuccessHd == "function" && checkFwSuccessHd();
						break;
					default:
						$.setTimeout(checkFWVer, 500);
						break;
					}
				}
				else
				{
					typeof checkFwFailHd == "function" && checkFwFailHd();
				}
			});
		}

		data[uciFile] = {};
		data[uciFile][uciCloudConfig.actionName.checkFwVersion] = null;

		/* 检查升级信息 */
		$.action(data, function(result){
			if (true == checkErrHd(result[ERR_CODE]))
			{
				checkFWVer();
			}
		});
	};

	this.onlineUpgrade = function(upgradeErrCallBack, checkFwSuccessHd)
	{
		this.upgradeErrCBCloudPush = upgradeErrCallBack;
		this.gOnlineUpgradeNote = "";
		this.onlineUpgradeCheck(errHandleCloudPush, function(){
				gOnlineUpgradeNote = statusStr.fwDownLoadErr;
				upgradeFailHdCloudPush();
			}, function(){
				typeof checkFwSuccessHd == "function" && checkFwSuccessHd();
				checkFWVerSuccessCloudPush();
			}
		);
	};
}

function Phone()
{
	this.OS = {
		windows:		false,
		windowsPhone:	false,
		unixPC:			false,
		iPad:			false,
		iPhone:			false,
		iMacPC:			false,
		iPod:			false,
		android:		false,
		nokia:			false,
		player:			false,
		Android_UC:		false,
		portable:		false,
		curOS:			["windows", 0, 0],

		/* true is handled device; false is large device which is not for handler */
		checkDeviceMode:function ()
		{
			var pl = navigator.platform;
			var ua = navigator.userAgent;

			if (undefined != pl)
			{
				/* windows or windows phone */
				if (pl.indexOf("Win") >= 0)
				{
					if (ua.indexOf("Windows Phone") >= 0)
					{
						this.windowsPhone = true;
						this.windows = true;
						this.portable = true;
						this.curOS[0] = "windowsPhone";
						this.curOS[1] = 3;
					}
					else
					{
						this.windows = true;
						this.portable = false;
						this.curOS[0] = "windows";
						this.curOS[1] = 0;

						if (true == /Windows NT ([\d\.]+)/i.test(navigator.userAgent))
						{
							this.curOS[2] = RegExp["$1"];
						}
					}

					return;
				}

				/* nokia */
				if (ua.indexOf("NOKIA") >= 0)
				{
					this.nokia = true;
					this.portable = true;
					return;
				}

				/* android */
				if (ua.indexOf("Android") >= 0)
				{
					this.android = true;
					this.portable = true;
					this.curOS[0] = "android";
					this.curOS[1] = 4;
					return;
				}

				/* iPad */
				if (pl.indexOf("iPad") >= 0)
				{
					this.iPad = true;
					this.portable = true;
					this.curOS[0] = "iOS";
					this.curOS[1] = 1;
					return;
				}

				/* iPhone */
				if (pl.indexOf("iPhone") >= 0)
				{
					this.iPhone = true;
					this.portable = true;
					this.curOS[0] = "iOS";
					this.curOS[1] = 1;
					return;
				}

				/* iPod */
				if (pl.indexOf("iPod") >= 0)
				{
					this.iPod = true;
					this.portable = true;
					this.curOS[0] = "iOS";
					this.curOS[1] = 1;
					return;
				}

				/* Wii or PLASTATION which is under version three */
				if ((ua.indexOf("Wii") >= 0) || (ua.indexOf("PLASTATION") >= 0))
				{
					this.player = true;
					this.portable = true;
					return;
				}

				/* MacBook of apple */
				if (pl.indexOf("Mac") >= 0)
				{
					this.iMacPC = true;
					this.portable = false;
					this.curOS[0] = "iOS";
					this.curOS[1] = 1;
					return;
				}

				/* unix include Linux */
				if ((pl.indexOf("X11") >= 0) || ((pl.indexOf("Linux") >= 0) && (pl.indexOf("arm") < 0)))
				{
					this.unixPC = true;
					this.portable = false;
					this.curOS[0] = "linux";
					this.curOS[1] = 2;
					return;
				}

				return;
			}
			else if (ua.indexOf("Android") >= 0)
			{
				this.android = true;
				this.portable = true;
				this.curOS[0] = "android";
				this.curOS[1] = 4;
				return;
			}
			else
			{
				if (document.body.clientWidth >= 1024 || document.body.clientHeight >= 1024)
				{
					this.portable = false;
				}
				else
				{
					this.portable = true;
				}

				return;
			}
		}
	};

	this.phoneSet = {
		bContinuePCSet:false,
		bPhoneWizardSet:false
	};

	OS.checkDeviceMode();
}

function ChsInput()
{
	this.initCheckInput = function(chNameOrDom, callBack){
		var chInputs, len;

		function clickHd()
		{
			var checked, disabled;

			disabled = this.getAttribute("disabled");
			if (null != disabled && ("true" == disabled.toString()
				|| "disabled" == disabled.toString()))
			{
				return;
			}

			if ("true" == this.getAttribute("checked"))
			{
				$(this).addClass("chObj");
				$(this).removeClass("chObjCheck");
				this.setAttribute("checked", "false");
				checked = false;
			}
			else
			{
				$(this).addClass("chObjCheck");
				this.setAttribute("checked", "true");
				checked = true;
			}

			typeof callBack == "function" && callBack(checked, parseInt(this.getAttribute("value"), 10));
		}

		if (typeof chNameOrDom == "object")
		{
			chNameOrDom.className = "chObj";
			if ("true" == chNameOrDom.getAttribute("checked"))
			{
				chNameOrDom.className += " chObjCheck";
			}

			chNameOrDom.onclick = clickHd;
		}
		else
		{
			chInputs = $("i[name=" + chNameOrDom + "]");
			len = chInputs.length;

			for(var i = 0; i < len; i++)
			{
				chInputs[i].className = "chObj";
				if ("true" == chInputs[i].getAttribute("checked"))
				{
					chInputs[i].className += " chObjCheck";
				}

				chInputs[i].onclick = clickHd;
			}
		}
	};

	this.getCheckboxChs = function(inputName){
		var rdInputs = $("i[name=" + inputName + "]");
		var len = rdInputs.length;
		var chsArr = [];

		for	(var i = 0; i < len; i++)
		{
			if (true == rdInputs.eq(i).hasClass("chObjCheck"))
			{
				chsArr.push(rdInputs.eq(i).attr("value"));
			}
		}

		return chsArr;
	};

	/* 设置checkbox的选中状态 */
	this.changeCheckInput = function(idOrDom, checked, callBack)
	{
		var checkbox;

		if (typeof idOrDom == "string")
		{
			checkbox = id(idOrDom);
		}
		else
		{
			checkbox = idOrDom;
		}

		if (true === checked || "true" == checked)
		{
			$(checkbox).addClass("chObjCheck");
			checkbox.setAttribute("checked", "true");
		}
		else
		{
			$(checkbox).addClass("chObj");
			$(checkbox).removeClass("chObjCheck");
			checkbox.setAttribute("checked", "false");
		}

		typeof callBack == "function" && callBack(checked);
	};

	this.initRadioInput = function(rdName, callBack){
		var rdInputs = $("i[name=" + rdName + "]");
		var len = rdInputs.length;

		function clickFun()
		{
			for(var j = 0; j < len; j++)
			{
				rdInputs[j].className = "rdObj";
				rdInputs[j].setAttribute("checked", "false");
			}
		}

		for(var i = 0; i < len; i++)
		{
			rdInputs[i].className = "rdObj";
			if ("true" == rdInputs[i].getAttribute("checked"))
			{
				clickFun();
				rdInputs[i].className += " rdObjCheck";
				rdInputs[i].setAttribute("checked", "true");
			}

			rdInputs[i].onclick = function(){
				clickFun();
				this.className += " rdObjCheck";
				this.setAttribute("checked", "true");
				typeof callBack == "function" && callBack();
			};
		}
	};

	this.changeRadioInput = function(idOrDom, checked, callBack){
		var radiobox;

		if (typeof idOrDom == "string")
		{
			radiobox = id(idOrDom);
		}
		else
		{
			radiobox = idOrDom;
		}

		if (true === checked || "true" == checked)
		{
			radiobox.className += " rdObjCheck";
			radiobox.setAttribute("checked", "true");
		}
		else
		{
			radiobox.className = "rdObj";
			radiobox.setAttribute("checked", "false");
		}

		typeof callBack == "function" && callBack(checked);
	};

	this.getRadioChs = function(inputName){
		var chsNum = "";
		var rdInputs = $("i[name=" + inputName + "]");
		var len = rdInputs.length;

		for	(var i = 0; i < len; i++)
		{
			if (true == rdInputs.eq(i).hasClass("rdObjCheck"))
			{
				chsNum = rdInputs.eq(i).attr("value");
				break;
			}
		}

		return chsNum;
	};
}

function Plugin(options)
{
	if (typeof PLUGIN_STREAM_MAIN == "undefined")
	{
		window.PLUGIN_STREAM_MAIN = 1;
		window.PLUGIN_STREAM_MINOR = 0;
		window.PLUGIN_STREAM_THIRD = 2;
	}

	if (typeof DEFAULT_VIDEO_CONNECTION_TYPE == "undefined")
	{
		window.HTTP_TS = 0;
		window.RTSP_MULTICAST = 1;
		window.DEFAULT_VIDEO_CONNECTION_TYPE = 2;
	}

	this._ops = {
		id:"",				/* 包含插件的标签id */
		pluginId:"1223",	/* 插件的classid */
		className:"",		/* 插件样式 */
		iePluId:"",
		othrPluId:"pluginObj",
		ip:$.domainIp,
		//port:$.vhttpdPort,
		staticIp:$.staticIp,
		pppoeIp:$.pppoeIp,
		vhttpdInnerPort:$.vhttpdInnerPort,
		vhttpdExtPort:$.vhttpdExtPort,
		rtspInnerPort:$.rtspInnerPort,
		rtspExtPort:$.rtspExtPort,
		clientId:0,
		//rtspServerPort:$.rtspPort,
		streamtype:2,		/* 指定视频编码方式 0 MJPEG, 1=MJPEG_MIXED, 2=H264, 3=H264_MIXED */
        connectiontype:HTTP_TS, /* Default is HTTP TS */
		streamresolution:PLUGIN_STREAM_MAIN,	/* 默认是主码流, 1为主码流，0为子码流 */
		saveRoad:"",		/* 保存路径 */
		readyHd:null,		/* 视频能够完全播放后执行的回调函数，传输给回调函数的参数包括：
							   0为视频停止播放；
							   1为视频开始播放。
							*/

		netChangeHd:null,	/* 视频网络状况发生变化后执行的回调函数，传输给回调函数的参数包括：
							   0为正常接收视频数据；
							   1为视频连接超时，网络连接有问题；
							   2为用户名和密码有误。
							*/
		downloadReadyHd:null
	};

	this.resPluObj = null;

	if (typeof Plugin.prototype.init != "function")
	{
		window.PLUGIN_STATE_FULL = 2;
		window.PLUGIN_STATE_ON = 1;
		window.PLUGIN_STATE_OFF = 0;
		window.PLUGIN_STATE_MINUS = -1;
		window.PLUGIN_AUTH_ERROR = 2;
		window.AUTO = "auto";

		Plugin.installObj = {url:"", exist:1, EXIST:1, NEXIST:0, bUpInfoShow:false, plFwVersion:"0.0.0.0"};

		Plugin.prototype.init = function(options)
		{
			try
			{
				this._optionsInit(options);
				this._crtObjPlu();
			}
			catch(ex){
				log(ex);
			}
		};

		Plugin.prototype._optionsInit = function(options){
			var item;

			for(var prop in options)
			{
				item = options[prop];

				if (typeof this._ops[prop] == "undefined")
				{
					continue;
				}

				if (typeof item == "object" && !(item instanceof Array) && this._ops[prop] != null)
				{
					for (var p in item)
					{
						this._ops[prop][p] = item[p];
					}
				}
				else
				{
					this._ops[prop] = item;
				}
			}
		};

		Plugin.prototype._detectBrowser = function() {
			var userAgent = navigator.userAgent,
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
			var ua = userAgent.toLowerCase();
			var match = rMsie.exec(ua);

			if (match != null)
			{
				return "IE";
			}
		};

		/* 插件区 */
		Plugin.prototype._crtObjPlu = function() {
			var resPluObj, objThis = this;
			var wrapDiv = document.getElementById(this._ops.id);

			try
			{
				//clear existed objects
				var objects = wrapDiv.getElementsByTagName("object");
				var len = objects.length;
				for (var i = 0; i < len; i++)
				{
					wrapDiv.removeChild(objects[i]);
				}

				resPluObj = this.resPluObj = document.createElement("object");
				resPluObj.className = this._ops.className;

				try
				{
					if ("IE" == this._detectBrowser())
					{
						resPluObj.id = this._ops.iePluId;
						resPluObj.classid = "CLSID:15B54F54-CD6C-4395-A697-FAE11E3562A6";
					}
					else
					{
						resPluObj.id = this._ops.othrPluId;
						resPluObj.type = "application/x-tp-camera-h264";
					}
				}
				catch(ex)
				{}

				wrapDiv.appendChild(resPluObj);

				/* 检查插件是否已安装 */
				if (false == this.checkInstalled())
				{
					if(this._ops.id != "localStoragePlugin")
					{
						objThis.showInstalledTip();
					}

					return;
				}

				resPluObj.ip = this._ops.ip;
				//resPluObj.port = this._ops.port;
				resPluObj.staticIp = this._ops.staticIp;
				resPluObj.pppoeIp = this._ops.pppoeIp;
				resPluObj.vhttpdInnerPort = this._ops.vhttpdInnerPort;
				resPluObj.vhttpdExtPort = this._ops.vhttpdExtPort;
				resPluObj.rtspInnerPort = this._ops.rtspInnerPort;
				resPluObj.rtspExtPort = this._ops.rtspExtPort;
				resPluObj.streamtype = this._ops.streamtype;
				resPluObj.streamresolution = this._ops.streamresolution;
				resPluObj.connectiontype = this._ops.connectiontype;
				//resPluObj.rtspServerPort = this._ops.rtspServerPort;

				/* 注册视频播放准备完毕的回调函数，一旦插件完成准备工作开始播放视频，既调用这个回调函数 */
				if (typeof this._ops.readyHd == "function")
				{
					resPluObj.videoReadyCallback(this._ops.readyHd);
				}

				/* 网络状态改变的回调函数。网络连接出错，或者从出错状态切换回正常播放时被回调。 */
				if (typeof this._ops.netChangeHd == "function")
				{
					resPluObj.videoConnectCallback(this._ops.netChangeHd);
				}

				if (typeof this._ops.downloadReadyHd == "function")
				{
					resPluObj.windowReadyCallback(this._ops.downloadReadyHd);
				}

				/* 此处由于后台暂时没有实现，所以暂时不进行修改
				if (true == $.local)
				{
					resPluObj.username = "admin";
					resPluObj.password = "YWRtaW4=";
				}
				else
				{*/
					var tmpUsername = $.username ? $.username : "";
					tmpUsername = tmpUsername.replace(/%/g, "%25").replace(/"/g, "%22").replace(/,/g, "%2c");
					resPluObj.username = tmpUsername;
					resPluObj.password = $.pwd;
					resPluObj.md5password = $.pwdMD5;
					$.setPluginAuthHandle(function(username, pwd){
						objThis.setAuthData(username, pwd);
					});
				//}

				try
				{
					if ("close" != sessionLS.getItem(PLGINFOCLOSE) &&
						false == Plugin.installObj.bUpInfoShow)
					{
						/* 检查插件是否有更新 */
						this.checkPluginUpgrade();
					}
				}
				catch(ex)
				{
					log(ex);
				}
			}
			catch(ex){
				log(ex);
			}
		};

		/* 保存存储路径 */
		Plugin.prototype.saveStoragePath = function(callBack){
			try
			{
				/* IE保护模式下不允许进行抓图 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				this.resPluObj.saveStoragePath();
				callBack();
			}
			catch(ex)
			{
				log(ex);
			}
		}

		/* 显示插件的升级信息 */
		Plugin.prototype.showPluginUpgradeInfo = function(){
			var div, i, lbl, browserInfo;
			var objThis = this;

			if (true == Plugin.installObj.bUpInfoShow)
			{
				return;
			}

			Plugin.installObj.bUpInfoShow = true;

			div = el("div");
			div.className = "pluginUpInfoCon";

			i = el("i");
			i.onclick = function(){
				document.body.removeChild(document.body.childNodes[0]);

				if (true == isIESix)
				{
					document.body.style.height = "auto";
				}

				sessionLS.setItem(PLGINFOCLOSE, "close");
				basicPHAutoFit();
			};
			div.appendChild(i);

			lbl = el("label");
			lbl.innerHTML = label.pluginUpInfo1;
			div.appendChild(lbl);

			lbl = el("label");
			lbl.innerHTML = label.pluginUpInfo2;
			lbl.className = "pluginInfoDl";
			lbl.onclick = function(){
				if (Plugin.installObj.exist == Plugin.installObj.EXIST)
				{
					location.href = $.domainUrl + $.orgURL(Plugin.installObj.url);
				}
				else
				{
					browserInfo = objThis.getBrowserInfo();
					window.open(Plugin.installObj.url + "?browserType=" + browserInfo["browserType"][0] +
																	"&browserVersion=" + browserInfo["browserVesion"] +
																	"&browserBit=" + browserInfo["browserBit"][0] +
																	"&browserSys=" + browserInfo["broswerSys"][0] +
																	"&osVersion=" + browserInfo["osVersion"]);
				}
			};
			div.appendChild(lbl);

			lbl = el("label");
			lbl.innerHTML = label.pluginUpInfo3;
			div.appendChild(lbl);

			document.body.insertBefore(div, document.body.childNodes[0]);
			basicPHAutoFit();
		};

		/* 检查插件是否需要升级 */
		Plugin.prototype.checkPluginUpgrade = function(){
			var objThis = this;

			this.getInstalledUrl(this.getBrowserInfo(), function(){
				if (true == objThis.checkNewPlugin(Plugin.installObj.plFwVersion))
				{
					/* 显示插件的升级信息 */
					objThis.showPluginUpgradeInfo();
				}
			});
		};

		/* 检查插件是否有更新的版本 */
		Plugin.prototype.checkNewPlugin = function(firmwarePlVersion){
			try
			{
				var isPlVArr, fwPlVArr;
				var installPlVersion = this.getPluginVersion();

				if (undefined == installPlVersion ||
					undefined == firmwarePlVersion ||
					"0.0.0.0" == firmwarePlVersion)
				{
					return false;
				}

				isPlVArr = installPlVersion.split(".");
				fwPlVArr = firmwarePlVersion.split(".");

				for (var i = 0, len = isPlVArr.length; i < len; i++)
				{
					if (null == isPlVArr[i] || null == fwPlVArr[i])
					{
						break;
					}

					/* 固件中的插件版本号比较高 */
					if (parseInt(isPlVArr[i], 10) < parseInt(fwPlVArr[i], 10))
					{
						return true;
					}
					else if (parseInt(isPlVArr[i], 10) > parseInt(fwPlVArr[i], 10))
					{
						return false;
					}
				}
			}
			catch(ex)
			{
				log(ex);
			}

			return false;
		};

		/* 获取插件的版本信息 */
		Plugin.prototype.getPluginVersion = function(){
			try
			{
				return this.resPluObj.pluginVersion;
			}
			catch(ex)
			{
				log(ex);
			}
		};

		/* 检查是否安装插件 */
		Plugin.prototype.checkInstalled = function(callBack){
			try
			{
				var plvdoType = (typeof this.resPluObj.PlayVideo).toLowerCase();

				if ("unknown" != plvdoType && "function" != plvdoType)
				{
					typeof callBack == "function" && callBack();
					return false;
				}
			}
			catch(ex){
				log(ex);
			}

			return true;
		};

		Plugin.prototype.getBrowserInfo = function(){
			var browserType;
			var browserVesion;
			var browserBit;

			try
			{
				if (navigator.platform.indexOf("64") >= 0)
				{
					browserBit = ["64", 1];
				}
				else
				{
					browserBit = ["32", 0];
				}

				return {
					browserType:[explorerTypeArr[0], explorerTypeArr[1]],
					browserVesion:explorerTypeArr[2],
					browserBit:browserBit,
					osVersion:OS.curOS[2],
					broswerSys:[OS.curOS[0], OS.curOS[1]]
				};
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取插件下载或更新的url */
		Plugin.prototype.getInstalledUrl = function(browserInfo, callBack){
			var data, OPT_NAME, getPlgObj;

			if (Plugin.installObj.url.length != 0)
			{
				typeof callBack == "function" && callBack();
				return;
			}

			OPT_NAME = uciSystem.optName;
			data = {};
			data[uciSystem.fileName] = {};
			data[uciSystem.fileName][uciSystem.actionName.getPluginUrl] = getPlgObj = {};
			getPlgObj[OPT_NAME.browserType] = browserInfo["browserType"][1].toString();
			getPlgObj[OPT_NAME.browserVersion] = browserInfo["browserVesion"].toString();
			getPlgObj[OPT_NAME.browserBits] = browserInfo["browserBit"][1].toString();
			getPlgObj[OPT_NAME.browserOS] = browserInfo["broswerSys"][1].toString();
			getPlgObj[OPT_NAME.osVersion] = browserInfo["osVersion"].toString();
			$.action(data, function(result){
				if (ENONE == result[ERR_CODE])
				{
					Plugin.installObj.exist = result[OPT_NAME.exist] || "";
					Plugin.installObj.url = result[OPT_NAME.pluginUrl] || "";
					Plugin.installObj.plFwVersion = result[OPT_NAME.pluginVersion] || "0.0.0.0";

					if (Plugin.installObj.url.indexOf("http://") != 0 &&
						Plugin.installObj.exist != Plugin.installObj.EXIST)
					{
						Plugin.installObj.url = "http://" + Plugin.installObj.url;
					}
				}

				typeof callBack == "function" && callBack();
			});
		};

		/* 提示用户安装插件 */
		Plugin.prototype.showInstalledTip = function(){
			var resPluObj = this.resPluObj;
			var parentNode = id(this._ops.id);
			var link = $.find("label.vedioInstallTip")[0];
			var backDiv = $.find("div.vedioInstallBackDiv")[0];
			var offsets, objectH, objectW, data, getPlgObj;
			var browserInfo;

			function installTipInstruct()
			{
				objectH = resPluObj.offsetHeight;
				objectW = resPluObj.offsetWidth;
				offsets = getoffset(resPluObj, parentNode);
				link.style.top = parseInt((objectH - link.offsetHeight)/2) + "px";
				link.style.left = offsets.left + parseInt((objectW - link.offsetWidth)/2) + "px";
				backDiv.style.height = objectH + "px";
				backDiv.style.width = objectW + "px";
				backDiv.style.left = offsets.left + "px";
				backDiv.style.top = offsets.top + "px";
				link.style.visibility = "visible";
				if (Plugin.installObj.exist != Plugin.installObj.EXIST)
				{
					link.innerHTML = "暂不支持此浏览器，请使用IE或32位火狐浏览器";
					link.onclick = null;
					link.style.textDecoration = "none";
					link.style.cursor = "default";
				}
			}

			try
			{
				if (link == undefined)
				{
					browserInfo = this.getBrowserInfo();
					backDiv = el("div");
					backDiv.className = "vedioInstallBackDiv";
					parentNode.appendChild(backDiv);

					link = el("label");
					link.className = "vedioInstallTip";
					link.onclick = function(){
						if (Plugin.installObj.exist == Plugin.installObj.EXIST)
						{
							location.href = $.domainUrl + $.orgURL(Plugin.installObj.url);
						}
						else
						{
							window.open(Plugin.installObj.url + "?browserType=" + browserInfo["browserType"][0] +
																			"&browserVersion=" + browserInfo["browserVesion"] +
																			"&browserBit=" + browserInfo["browserBit"][0] +
																			"&browserSys=" + browserInfo["broswerSys"][0] +
																			"&osVersion=" + browserInfo["osVersion"]);
						}
					};
					link.innerHTML = label.pluginStallTip;
					link.style.visibility = "hidden";

					parentNode.appendChild(link);
					parentNode.style.position = "relative";

					/* for IE 6.0~7.0 */
					try
					{
						parentNode.style.zoom = 1;
					}
					catch(ex)
					{}

					if (Plugin.installObj.url.length == 0)
					{
						this.getInstalledUrl(browserInfo, installTipInstruct);
					}
					else
					{
						installTipInstruct();
					}
				}
				else
				{
					installTipInstruct();
				}
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取视频播放的码流分辨率、高度、宽度 */
		Plugin.prototype.getResolution = function(){
			var vHeight = this.resPluObj.vHeight;
			var vWidth = this.resPluObj.vWidth;

			try
			{
				return {vHeight:vHeight, vWidth:vWidth, resolution:vWidth/vHeight};
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置用户名和密码 */
		Plugin.prototype.setAuthData = function(userName, pwd){
			try
			{
				var tmpUsername = userName ? userName : "";
				tmpUsername = tmpUsername.replace(/%/g, "%25").replace(/"/g, "%22").replace(/,/g, "%2c");
				this.resPluObj.username = tmpUsername;
				this.resPluObj.password = pwd;
				this.resPluObj.md5password = $.pwdMD5;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 重新加载插件 */
		Plugin.prototype.reload = function(){
			try
			{

			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置视频播放的码流  */
		Plugin.prototype.setStreamCode = function(codeStream){
			try
			{
				this.resPluObj.streamresolution = codeStream;
			}
			catch(ex){
				log(ex);
			}
		};

        Plugin.prototype.setConnectionType = function(connectionType){
            try
            {
                this.resPluObj.connectiontype = connectionType;
            }
            catch(ex){
                log(ex);
            }
        }

		/* 开始监控 */
		Plugin.prototype.playVideo = function(){
			try
			{
				this.resPluObj.PlayVideo();
			}catch(ex){
				log(ex);
			}
		};

		/* 停止监控 */
		Plugin.prototype.stopVideo = function(){
			try
			{
				this.resPluObj.StopVideo();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 停止语音对讲 */
		Plugin.prototype.stopSpeaker = function(){
			try
			{
				this.resPluObj.StopSpeaker();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 语音对讲 */
		Plugin.prototype.voiceIntercom = function(callBack){
			try
			{
				if (typeof callBack == "function")
				{
					this.resPluObj.speakerEventCallback(callBack);
				}

				this.resPluObj.StartSpeaker();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 截图 */
		Plugin.prototype.catchPic = function(callBack){
			try
			{
				/* IE保护模式下不允许进行抓图 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				if (typeof callBack == "function")
				{
					this.resPluObj.snapshotcallback(callBack);
				}

				this.resPluObj.Snapshot("snapshot");
			}
			catch(ex){
				log(ex);
			}
		};

		/* 选择存储路径 */
		Plugin.prototype.selectStorageFolder = function(){
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.setStoragePath();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取存储路径 */
		Plugin.prototype.getStorageFolder = function(){
			try
			{
				return this.resPluObj.storageDir;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取当前视频播放时间 */
		Plugin.prototype.getPlayTime = function(){
			try
			{
				return this.resPluObj.GetCameraTime();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 录像 */
		Plugin.prototype.saveVideo = function(state, callBack, savingCallBack) {
			var res;

			try
			{
				if (PLUGIN_STATE_ON == state)
				{
					/* IE保护模式下不允许进行录像 */
					if (this.resPluObj.bIEProtectedMode == true)
					{
						showAlert(errStr.bIEProtectedModeTip);
						return false;
					}

					/* 注册录像的执行过程的回调函数 */
					if (typeof savingCallBack == "function")
					{
						this.resPluObj.recordcbinvoke(savingCallBack);
					}

					res = this.resPluObj.Record(); /* 开始录像 */
				}
				else if (PLUGIN_STATE_OFF == state)
				{
					res = this.resPluObj.StopRecord(); /* 停止录像 */
				}

				typeof callBack == "function" && callBack(res);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 打开存储录像和抓图的文件夹 */
		/* 返回值0表成功；返回值-1表示ini文件不存在、或者无权限读、或者用户选择的保存路径不存在 */
		Plugin.prototype.openStorageFolder = function()
		{
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.openStoragePath();
			}
			catch(ex){
				log(ex);
			}
		};

		Plugin.prototype.openFileStorageFolder = function(path)
		{
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.openFileStoragePath(path);
			}
			catch(ex){
				log(ex);
			}
		};

		Plugin.prototype.getFileStorageFolder = function()
		{
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.downloadFileStoragePath;
			}
			catch(ex){
				log(ex);
			}
		};

		/*获取截图路径*/
		Plugin.prototype.getPicFileStoragePath = function()
		{
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.picFileStoragePath;
			}
			catch(ex){
				log(ex);
			}
		};

		/*获取截取录像路径*/
		Plugin.prototype.getVideoFileStoragePath = function()
		{
			try
			{
				/* IE保护模式下不允许浏览存储路径 */
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return;
				}

				return this.resPluObj.videoFileStoragePath;
			}
			catch(ex){
				log(ex);
			}
		};

		Plugin.prototype.fluncySelect = function(value){
			try
			{
				this.resPluObj.SetFluncy(value);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 音量设置 */
		Plugin.prototype.setAudioVolume = function(value) {
			try
			{
				this.resPluObj.SetAudioVolume(value);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 音量获取 */
		Plugin.prototype.getAudioVolume = function() {
			try
			{
				var volume = this.resPluObj.audioVolume;
				return volume;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 全屏 */
		Plugin.prototype.fullScreen = function() {
			try
			{
				this.resPluObj.SetFullScreen();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置视频播放插件的大小 */
		Plugin.prototype.setSize = function(styles){
			try
			{
				setStyle(this.resPluObj, styles);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 显示OSD信息 */
		/* 0 <= index <=3 */
		Plugin.prototype.setOSD = function(index, textObj, setObj){
			var clorList = {white:0xffffff, black:0x000000, red:0xe70000, green:0x00ff18, blue:0x00c0ff};
			var showValue = textObj.enabled == "on" ? PLUGIN_STATE_ON : PLUGIN_STATE_OFF;
			var showColor = AUTO == setObj.color_type ? 0xffffff : clorList[setObj.color];
			var showSize = parseInt($.resolutionWidth * 64 / 2048, 10) || 48;

			try
			{
				if (AUTO != setObj.size)
				{
					showSize = parseInt(setObj.size.split("*")[0]);
				}

				if (index == undefined || typeof textObj.text == undefined || textObj.text == undefined)
				{
					this.resPluObj.ShowTime(showValue, textObj.x_coor, textObj.y_coor, showColor, showSize);
				}
				else
				{
					this.resPluObj.ShowOSD(index, showValue, textObj.x_coor, textObj.y_coor, showColor, showSize, textObj.text);
				}
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获得osd的位置坐标 */
		Plugin.prototype.getOsdPosition = function(index) {
			var posObj = {};
			var posArr = [0, 0];

			try
			{
				if (undefined == index || index < 0 || typeof index == "undefined")
				{
					this.resPluObj.getOSDTimePos(posArr);
					posObj.x = posArr[0] < 0 ? 0 : posArr[0];
					posObj.y = posArr[1] < 0 ? 0 : posArr[1];
				}
				else
				{
					this.resPluObj.getOSDTitlePos(index, posArr);
					posObj.x = posArr[0] < 0 ? 0 : posArr[0];
					posObj.y = posArr[1] < 0 ? 0 : posArr[1];
				}
			}
			catch(ex){
				log(ex);
			}

			return posObj;
		};

		/* 设置ROI的状态 */
		Plugin.prototype.setRoiStatus = function(state) {
			try
			{
				this.resPluObj.bROIOn = state; /*state > 0:开启;state < 0:关闭;state = 0:重置*/
			}
			catch(ex){
				log(ex);
			}
		};

		/* 显示ROI信息 */
		Plugin.prototype.showRoiInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addROIRect(positionInfo.x, positionInfo.y, positionInfo.width, positionInfo.height);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取ROI信息 */
		Plugin.prototype.getRoiInfo = function(index) {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getROIRectPos(index, posArr);
				positionInfo.x = posArr[0];
				positionInfo.y = posArr[1];
				positionInfo.width = posArr[2];
				positionInfo.height = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};

		/* 删除ROI信息 */
		Plugin.prototype.delRoiInfo = function(state) {
			try
			{
				this.resPluObj.delROIArr(state); /* 正数则删除当前选中的矩形，负数则清空 */
			}
			catch(ex){
				log(ex);
			}
		};

		/* 区域覆盖-开启1或关闭0 */
		Plugin.prototype.setRegionCoverStatus = function(state) {
			try
			{
				this.resPluObj.bRegionCoverOn = state;
			}
			catch(ex){
				log(ex);
			}
		};
		/* 显示区域覆盖的位置 */
		Plugin.prototype.showRegionCoverInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addRegionCoverRect(positionInfo.x, positionInfo.y, positionInfo.width, positionInfo.height);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取覆盖区域的信息 */
		Plugin.prototype.getRegionCoverInfo = function(index) {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getRegionCoverPos(index, posArr);
				positionInfo.x = posArr[0];
				positionInfo.y = posArr[1];
				positionInfo.width = posArr[2];
				positionInfo.height = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 获取覆盖区域的个数 */
		Plugin.prototype.getRegionCoverLen = function(){
			try
			{
				return this.resPluObj.RegionCoverArrLen;
			}
			catch(ex){
				log(ex);
			}
		};
		/* -1/1正数则删除当前选中的矩形，负数则清空 */
		Plugin.prototype.delRegionCoverInfo = function(state) {
			try
			{
				this.resPluObj.delRegionCoverArr(state);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 越界侦测-开启：1；关闭：0：*/
		Plugin.prototype.setLineCrossingState = function(state) {
			try
			{
				this.resPluObj.BorderDetection = state;
			}
			catch(ex){
				log(ex);
			}
		};
		Plugin.prototype.changeDetectDirect = function (index, direction) {
			try
			{
				this.resPluObj.ChangeDetectDirect(index, direction);
			}
			catch(ex){
				log(ex);
			}
		}
		/* 显示越界侦测信息 */
		Plugin.prototype.showLineCrossingInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addBorderDetection(parseInt(positionInfo.pt1_x), parseInt(positionInfo.pt1_y), parseInt(positionInfo.pt2_x), parseInt(positionInfo.pt2_y),positionInfo.direction);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取越界侦测信息 */
		Plugin.prototype.getLineCrossingInfo = function(index) {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getBorderDetectionPos(index, posArr);
				positionInfo.pt1_x = posArr[0];
				positionInfo.pt1_y = posArr[1];
				positionInfo.pt2_x = posArr[2];
				positionInfo.pt2_y = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 删除越界侦测检测区域 */
		Plugin.prototype.delLineCrossingInfo = function(state) {
			try
			{
				this.resPluObj.delBorderDetectionArr(state); /* 正数：删除选中区域；负数：全部删除 */
			}
			catch(ex){
				log(ex);
			}
		};

		/* 过线计数-开启：1；关闭：0：*/
		Plugin.prototype.setOverLineDetState = function(state) {
			try
			{
				this.resPluObj.OverLineDetectionOn = state;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 显示过线计数信息 */
		Plugin.prototype.showOverLineDetInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addOverLineDetection(parseInt(positionInfo.pt1_x), parseInt(positionInfo.pt1_y), parseInt(positionInfo.pt2_x), parseInt(positionInfo.pt2_y),positionInfo.direction);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取过线计数信息 */
		Plugin.prototype.getOverLineDetInfo = function(index) {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getOverLineDetectionPos(index, posArr);
				positionInfo.pt1_x = posArr[0];
				positionInfo.pt1_y = posArr[1];
				positionInfo.pt2_x = posArr[2];
				positionInfo.pt2_y = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 删除过线计数区域 */
		Plugin.prototype.delOverLineDetInfo = function(state) {
			try
			{
				this.resPluObj.delOverLineDetectionArr(state); /* 正数：删除选中区域；负数：全部删除 */
			}
			catch(ex){
				log(ex);
			}
		};

		/* 智能检测区域-开启：1；关闭：0：*/
		Plugin.prototype.setIntelligentState = function(state){
			try
			{
				this.resPluObj.RegionInvasion = state;
			}
			catch(ex){
				log(ex);
			}
		};
		/* 显示智能检测区域信息 */
		Plugin.prototype.showIntelligentRegion = function(positionInfo){

			try
			{
				this.resPluObj.addRegionInvasion(parseInt(positionInfo.pt1_x), parseInt(positionInfo.pt1_y), parseInt(positionInfo.pt2_x), parseInt(positionInfo.pt2_y),parseInt(positionInfo.pt3_x), parseInt(positionInfo.pt3_y), parseInt(positionInfo.pt4_x), parseInt(positionInfo.pt4_y));
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取智能检测区域信息 */
		Plugin.prototype.getIntelligentRegion = function(index){
			var positionInfo = {};
			var posArr = [0, 0, 0, 0, 0, 0, 0, 0];

			try
			{
				this.resPluObj.getRegionInvasionPos(index, posArr);
				positionInfo.pt1_x = posArr[0];
				positionInfo.pt1_y = posArr[1];
				positionInfo.pt2_x = posArr[2];
				positionInfo.pt2_y = posArr[3];
				positionInfo.pt3_x = posArr[4];
				positionInfo.pt3_y = posArr[5];
				positionInfo.pt4_x = posArr[6];
				positionInfo.pt4_y = posArr[7];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 删除智能检测区域 */
		Plugin.prototype.delIntelligentRegion = function(state) {
			try
			{
				this.resPluObj.delRegionInvasionArr(state); /* 正数：删除选中区域；负数：全部删除 */
			}
			catch(ex){
				log(ex);
			}
		};

		/* 选中的入侵区域执行相关回调 */
		Plugin.prototype.intelligentCallback = function(callBack){
			try
			{
				if (typeof callBack == "function")
				{
					this.resPluObj.IntelligentCallback (callBack);
				}
			}
			catch(ex){
				log(ex);
			}
		};

		/* index代表即将处于选中状态的四边形序号，从0起到3 （-1代表即将新绘制区域）*/
		/* state = 0 代表参数合法， state = 1 代表参数非法*/
		Plugin.prototype.showHighlight = function(index, state) {
			try
			{
				this.resPluObj.setHighlightRect(index, state);
			}
			catch(ex){
				log(ex);
			}
		};

		/*state = 0 代表采用原来逻辑， state = 1 代表采用新的逻辑*/
		Plugin.prototype.setOSDSpecialStatus = function(state) {
			try
			{
				this.resPluObj.setIllegalStatus(state);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 动态检测-开启：2；关闭：0；1：旧版本开启参数 */
		Plugin.prototype.setMoveDetState = function(state) {
			try
			{
				this.resPluObj.MotionDetection(state);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置区域个数 */
		Plugin.prototype.setRectArrLen = function(num) {
			try
			{
				this.resPluObj.SetRectArrLen(parseInt(num));
			}
			catch(ex){
				log(ex);
			}
		};
		/* 显示动态检测信息 */
		Plugin.prototype.showMoveDetInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addMDRect(positionInfo.x, positionInfo.y, positionInfo.width, positionInfo.height);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取动态检测的信息 */
		Plugin.prototype.getMoveDetInfo = function(index) {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getMDPos(index, posArr);
				positionInfo.x = posArr[0];
				positionInfo.y = posArr[1];
				positionInfo.width = posArr[2];
				positionInfo.height = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 删除动态检测区域 */
		Plugin.prototype.delMoveDetInfo = function(state) {
			try
			{
				this.resPluObj.delMDRect(state); /* 正数：删除选中区域；负数：全部删除 */
			}
			catch(ex){
				log(ex);
			}
		};

		/* 视频遮挡 */
		Plugin.prototype.setVideoCludeState = function(state) {
			try
			{
				this.resPluObj.MDOccludeOn = state; /*1:开启；0:关闭（清空全部信息） */
			}
			catch(ex){
				log(ex);
			}
		};
		/* 显示视频遮挡区域 */
		Plugin.prototype.showVideoCludeInfo = function(positionInfo) {
			try
			{
				this.resPluObj.addMDOccludeRect(positionInfo.x, positionInfo.y, positionInfo.width, positionInfo.height);
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取视频遮挡信息 */
		Plugin.prototype.getVideoCludeInfo = function() {
			var positionInfo = {};
			var posArr = [0, 0, 0, 0];

			try
			{
				this.resPluObj.getMDOccludePos(posArr);
				positionInfo.x = posArr[0];
				positionInfo.y = posArr[1];
				positionInfo.width = posArr[2];
				positionInfo.height = posArr[3];
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};
		/* 删除视频遮挡区域 */
		Plugin.prototype.delVideoCludeInfo = function() {
			try
			{
				this.resPluObj.delMDOccludeRect();/*正数：删除选中区域；负数：全部删除*/
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取视频遮挡区域的长度 */
		Plugin.prototype.getVideoCludeLen = function(state) {
			try
			{
				return this.resPluObj.MDArrLen;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 电子放大-开启或关闭 */
		Plugin.prototype.stopDigitalZoomState = function(state) {
			try
			{
				this.resPluObj.bDigitalZoomOn = state; /* 1:开启;0:关闭 */
			}
			catch(ex){
				log(ex);
			}
		};
		/* 获取电子放大区域的信息 */
		Plugin.prototype.getDigitalZoomInfo = function() {
			var positionInfo = {};

			try
			{
				this.resPluObj.digitalZoomCallback(function(x, y, width, height){
					positionInfo.x = x;
					positionInfo.y = y;
					positionInfo.width = width;
					positionInfo.height = height;
				});
			}
			catch(ex){
				log(ex);
			}

			return positionInfo;
		};

		/* 电子放大相关回调 */
		Plugin.prototype.elecZoomCallback = function(callBack){
			try
			{
				if (typeof callBack == "function")
				{
					this.resPluObj.digitalZoomCallback(callBack);
				}
			}
			catch(ex){
				log(ex);
			}
		};

		/* 开始回放 */
		Plugin.prototype.playback = function() {
			try
			{
				return this.resPluObj.playback();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 停止回放 */
		Plugin.prototype.stopPlayback = function() {
			try
			{
				return this.resPluObj.stopPlayback();
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置回放窗口和通道的对应关系 setPlaybackChn*/
		Plugin.prototype.setPlaybackChn = function(winIndex, chanId) {
			try
			{
				return this.resPluObj.setPlaybackChn(winIndex, chanId);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置回放所需的参数，start_time, type */
		Plugin.prototype.setPlayBackInfo = function(opt) {
			try {
				if (undefined != opt[uciPlayBack.optName.userId])
				{
					this.resPluObj.clientId = opt[uciPlayBack.optName.userId];
				}
				if (undefined != opt[uciPlayBack.optName.seconds])
				{
					this.resPluObj.startTime = opt[uciPlayBack.optName.seconds];
				}
				if (undefined != opt[uciPlayBack.optName.type])
				{
					this.resPluObj.playbackType = opt[uciPlayBack.optName.type];
				}
				if (undefined != opt[uciPlayBack.optName.scale])
				{
					this.resPluObj.playbackScale = opt[uciPlayBack.optName.scale];
				}
			}
			catch(ex) {
				log(ex);
			}
		}

		/* 设置回放开始时间以及速率 */
		Plugin.prototype.setPlaybackSeekScale = function(scaleVal, startTimeVal) {
			try {
				if (undefined == scaleVal)
				{
					scaleVal = "1/1";
				}
				if (undefined == startTimeVal)
				{
					startTimeVal = 0;
				}
				return this.resPluObj.setPlaybackSeekScale(scaleVal, startTimeVal);
			}
			catch(ex) {
				log(ex);
			}
		}

		/* 暂停回放 */
		Plugin.prototype.pausePlayback = function(pauseFlag) {
			try {
				return this.resPluObj.pausePlayback(pauseFlag);
			}
			catch (ex){
				log(ex);
			}
		}

		/* 建立sock连接后执行回调函数 */
		Plugin.prototype.setVideoConnectCallback = function(callBack) {
			try
			{
				return this.resPluObj.setVideoConnectCallback(callBack);
			}
			catch(ex){
				log(ex);
			}
		};

		/* 重设userid */
		Plugin.prototype.setClientId = function(client){
			try
			{
				this.resPluObj.clientId = client;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置无通道接入的显示 */
		Plugin.prototype.setNoChn = function(){
			try
			{
				this.resPluObj.availableChnNum = 0;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 设置星期的显示 */
		Plugin.prototype.bShowWeek = function(state){
			try
			{
				this.resPluObj.bShowWeek = state;
			}
			catch(ex){
				log(ex);
			}
		};

		/* 获取回放的时间 */
		Plugin.prototype.getReplayTime = function(winIndex){
			return this.resPluObj.getUTCTime(winIndex);
		};

		/* 设置回放速度 */
		Plugin.prototype.setPlaybackScale = function(scale) {
			try {
				this.resPluObj.setPlaybackScale(scale);
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.PlaySingleFrame = function() {
			try {
				return this.resPluObj.playSingleFrame();
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.downloadVideo = function(startTime, endTime, idStr, totalSize) {
			try {
				return this.resPluObj.downloadVideo(startTime, endTime, idStr, totalSize);
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.downloadPicture = function(time, idStr, totalSize) {
			try {
				return this.resPluObj.downloadPicture(time, idStr, totalSize);
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.setDownloadCallback = function(callback) {
			try {
				return this.resPluObj.setDownloadCallback(callback);
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.stopDownloading = function() {
			try {
				return this.resPluObj.stopDownloading();
			}
			catch(ex) {
				log(ex);
			}
		}

		Plugin.prototype.isIEProtected = function () {
			try {
				if (this.resPluObj.bIEProtectedMode == true)
				{
					showAlert(errStr.bIEProtectedModeTip);
					return true;
				}
			}
			catch(ex) {
				log(ex);
			}
			return false;
		};

		Plugin.prototype.setOSDStatus = function(state) {
			try
			{
				this.resPluObj.setOSDStatus(state);  /*state = 0代表禁用，state = 1代表启用，其他值视为异常值*/
			}
			catch(ex){
				log(ex);
			}
		};
	}

	this.init(options);
}

function timePicker()
{
	this.timePickerCb = null;
	this.timeConId = "timePickerCon";
	this.gTimeEditInputId = null;
	this.timeTagerObj = null;
	this.scrollBinded = false;

	this.timePickerInit = function(idStr, callBack)
	{
		timeTagerObj = id(idStr);
		timeTagerObj.callBack = callBack;

		timeTagerObj.onclick = function(event){
			event = event || window.event;
			this.blur();
			timeTagerObj = this;
			timePickerCb = this.callBack;
			showTimePickerCon();
			stopProp(event);
		};

		timeTagerObj.onkeydown = function(event){
			event = event || window.event;
			eventPreventDefault(event);
		};
	};

	this.midifyTimeStr = function(value)
	{
		if (value < 10)
		{
			value = "0" + value;
		}
		return value;
	};

	this.timeInputClickHd = function()
	{
		gTimeEditInputId = this.id;
		id(gTimeEditInputId).style.borderColor = "#5A92FF";
	};

	this.getWheelDelta = function(event){
		event = event || window.event;
		if (event.wheelDelta)
		{
			return window.opera&&window.opera.version < 9.5?-event.wheelDelta:event.wheelDelta;
		}
		else
		{
			return -event.detail*40;
		}
	};

	this.scrollWheelHd = function(event)
	{
		if(gTimeEditInputId == null)
		{
			return;
		}

		var targerObj = id(gTimeEditInputId);
		var tmpValue = parseInt(targerObj.value, 10);
		var direct = (this.getWheelDelta(event) > 0) ? 0 : 1;

		switch (gTimeEditInputId)
		{
			case "timeHour":
				if(direct == 0)
				{
					if (tmpValue == 23)
					{
						targerObj.value = "00";
					}
					else
					{
						tmpValue++;
						targerObj.value = midifyTimeStr(tmpValue);
					}
				}
				else
				{
					if (tmpValue == 0)
					{
						targerObj.value = "23";
					}
					else
					{
						tmpValue--;
						targerObj.value = midifyTimeStr(tmpValue);
					}
				}
				break;
			case "timeMinute":
			case "timeSecond":
				if(direct == 0)
				{
					if (tmpValue == 59)
					{
						targerObj.value = "00";
					}
					else
					{
						tmpValue++;
						targerObj.value = midifyTimeStr(tmpValue);
					}
				}
				else
				{
					if (tmpValue == 0)
					{
						targerObj.value = "59";
					}
					else
					{
						tmpValue--;
						targerObj.value = midifyTimeStr(tmpValue);
					}
				}
				break;
			default:
				break;
		}

		clearSelection();
	}

	this.bindScrollWheel = function()
	{
		if (document.attachEvent)
		{
			document.body.attachEvent("onmousewheel", function(event){
				event = event || window.event;scrollWheelHd(event)});
		}
		else
		{
			document.body.addEventListener("mousewheel",
				function(event){event = event || window.event;scrollWheelHd(event)}, false);
			document.body.addEventListener("DOMMouseScroll",
				function(event){event = event || window.event;scrollWheelHd(event)}, false);
		}
	}

	this.createTimePickerCon = function()
	{
		var Con = document.createElement("div");
		var timeEditCon = document.createElement("div");
		var timeFuncCon = document.createElement("div");
		var timeInput, timeLabel, timeBtn;

		Con.id = "timePickerCon";
		Con.className = "timePickerCon";
		Con.onclick = function(event){
			event = event || window.event;
			stopProp(event);
		};

		timeEditCon.className = "timeEdit";
		Con.appendChild(timeEditCon);

		timeInput = document.createElement("input");
		timeInput.id = "timeHour";
		timeInput.className = "timeHour";
		timeInput.maxLength = "2";
		timeInput.onclick = timeInputClickHd;
		timeInput.onblur = function(){
			gTimeEditInputId = null;
			id("timeHour").style.borderColor = "#CED7E0";
			var tmp = this.value;
			if ((tmp.length == 0) || (checkNum(tmp) == false))
			{
				this.value = "00";
			}
			if (parseInt(tmp, 10) > 23)
			{
				this.value = "23";
			}
		};
		timeInput.onfocus = function(){
			if(!scrollBinded)
			{
				bindScrollWheel();
				scrollBinded = true;
			}
		};

		timeEditCon.appendChild(timeInput);

		timeLabel = document.createElement("label");
		timeLabel.innerHTML = label.hour;
		timeEditCon.appendChild(timeLabel);

		timeInput = document.createElement("input");
		timeInput.id = "timeMinute";
		timeInput.maxLength = "2";
		timeInput.onclick = timeInputClickHd;
		timeInput.onblur = function(){
			gTimeEditInputId = null;
			id("timeMinute").style.borderColor = "#CED7E0";
			var tmp = this.value;
			if ((tmp.length == 0) || (checkNum(tmp) == false))
			{
				this.value = "00";
			}
			if (parseInt(tmp, 10) > 59)
			{
				this.value = "59";
			}
		};
		timeInput.onfocus = function(){
			if(!scrollBinded)
			{
				bindScrollWheel();
				scrollBinded = true;
			}
		};
		timeEditCon.appendChild(timeInput);

		timeLabel = document.createElement("label");
		timeLabel.innerHTML = label.minute;
		timeEditCon.appendChild(timeLabel);

		timeInput = document.createElement("input");
		timeInput.id = "timeSecond";
		timeInput.maxLength = "2";
		timeInput.onclick = timeInputClickHd;
		timeInput.onblur = function(){
			gTimeEditInputId = null;
			id("timeSecond").style.borderColor = "#CED7E0";
			var tmp = this.value;
			if ((tmp.length == 0) || (checkNum(tmp) == false))
			{
				this.value = "00";
			}
			if (parseInt(tmp, 10) > 59)
			{
				this.value = "59";
			}
		};
		timeInput.onfocus = function(){
			if(!scrollBinded)
			{
				bindScrollWheel();
				scrollBinded = true;
			}
		};
		timeEditCon.appendChild(timeInput);

		timeLabel = document.createElement("label");
		timeLabel.innerHTML = label.second;
		timeEditCon.appendChild(timeLabel);

		timeFuncCon.className = "timeFunc";
		Con.appendChild(timeFuncCon);

		timeBtn = document.createElement("input");
		timeBtn.type = "button";
		timeBtn.value = btn.confirmOk;
		timeBtn.onclick = function()
		{
			var hourValue = id("timeHour").value.length == 1 ? "0" + id("timeHour").value : id("timeHour").value;
			var minuteValue = id("timeMinute").value.length == 1 ? "0" + id("timeMinute").value : id("timeMinute").value;
			var secondValue = id("timeSecond").value.length == 1 ? "0" + id("timeSecond").value : id("timeSecond").value;
			var timeStr = hourValue + " : " + minuteValue + " : " + secondValue;
			if (typeof timePickerCb != "function")
			{
				timeTagerObj.value = timeStr;
			}
			else
			{
				timePickerCb(timeStr);
			}
			hiddenTimePickerCon();
		};
		timeFuncCon.appendChild(timeBtn);
		document.body.appendChild(Con);
		attachEvnt(document.body, "click", function(){
			var Con = id(timeConId);
			if (typeof Con == "undefined")
			{
				return;
			}

			hiddenTimePickerCon();
		});
	};

	this.showTimePickerCon = function()
	{
		var Con = id(timeConId);
		if (Con == undefined)
		{
			createTimePickerCon();
			Con = id(timeConId);
		}

		setTimeValue();

		var rect = getoffset(timeTagerObj);
		Con.style.left = rect.left + 'px';
		Con.style.top =  rect.top + timeTagerObj.offsetHeight + 4 + 'px';

		Con.style.display = "block";
	};

	this.hiddenTimePickerCon = function()
	{
		var Con = id(this.timeConId);
		if (Con != undefined)
		{
			Con.style.display = "none";
		}
	};

	this.setTimeValue = function()
	{
		var timeValue = timeTagerObj.value;
		var timeHMS, hour, minute, second;
		var timeTmp = new Date();

		if (/^(\d{1,2}\s:\s){2}\d{1,2}$/.test(timeValue) == true)
		{
			timeHMS = timeValue.split(" : ");
			hour = parseInt(timeHMS[0], 10);
			minute = parseInt(timeHMS[1], 10);
			second = parseInt(timeHMS[2], 10);

			if ((hour > 23) || (minute > 59) || (second > 59))
			{
				hour = timeTmp.getHours();
				minute = timeTmp.getMinutes();
				second = timeTmp.getSeconds();
			}
		}
		else
		{
			hour = timeTmp.getHours();
			minute = timeTmp.getMinutes();
			second = timeTmp.getSeconds();
		}

		/* 把时间输入框中的时间初始化至时间选择表 */
		id("timeHour").value = midifyTimeStr(hour);
		id("timeMinute").value = midifyTimeStr(minute);
		id("timeSecond").value = midifyTimeStr(second);
	};
}

function ReplayTimeCon(options)
{
	var HOURS = 24;
	var SECPHOUR = 3600;
	var SECONDS = 86400;
	var SEPATIME = 1800;

	this._useVal = {
		scale:1,
		sepNum:48,
		totalWidth:0,
		scrollLeft:0
	};

	var totalArea = null;
	var _this = null;
	var scrollBarMove;

	ReplayTimeCon.prototype.init = function(){
		try
		{
			totalArea = id(options.totalId);
			totalArea.innerHTML = "";

			this._optionsInit();
			this.initTimeShaft();
			this.initChannel();
			this.initCutAreaAndShow();

			if (HOURS != options.showFullTime)
			{
				this.initRowScroll();
			}

			typeof options.callBack == "function" && options.callBack();
		}
		catch(ex){
			log(ex);
		};
	};

	ReplayTimeCon.prototype._optionsInit = function(){
		this._useVal.scale = HOURS / options.showFullTime;
		this._useVal.sepNum = this._useVal.scale * options.srcSepNum;
		this._useVal.totalWidth = options.chanWidth * this._useVal.scale;
		_this = this;
	};

	ReplayTimeCon.prototype.initTimeShaft = function(){
		var timeArea, timeShaft, trueShaft, timeLine, timeValue;
		var reduceLeft = 20;

		totalArea.style.width = options.chanWidth + options.chanNameWidth + reduceLeft + "px";

		timeArea = document.createElement("div");
		timeArea.className = "timeArea";
		timeArea.id = "timeArea";
		timeArea.style.marginLeft = options.chanNameWidth - reduceLeft + "px";
		totalArea.appendChild(timeArea);

		timeShaft = document.createElement("div");
		timeShaft.className = "timeShaft";
		timeShaft.id = "timeShaft";
		timeArea.style.width = options.chanWidth + "px";
		timeArea.appendChild(timeShaft);

		trueShaft = document.createElement("div");
		trueShaft.className = "trueShaft";
		trueShaft.id = "trueShaft";
		trueShaft.style.width = this._useVal.totalWidth + "px";
		timeShaft.appendChild(trueShaft);

		for (var i = 0; i <= this._useVal.sepNum; i++)
		{
			timeLine = document.createElement("span");
			timeLine.className = "timeLine";
			timeLine.style.left = (i * this._useVal.totalWidth / this._useVal.sepNum) + "px";
			trueShaft.appendChild(timeLine);

			timeValue = document.createElement("span");
			timeValue.className = "timeValue";
			timeValue.style.left = parseInt(timeLine.style.left) - reduceLeft + "px";
			timeValue.innerHTML = minToHour(i * SEPATIME / this._useVal.scale);
			trueShaft.appendChild(timeValue);

			if (0 == timeValue.innerHTML.length || (i % 2) == 1)
			{
				timeValue.style.display = "none";
				timeLine.className += " lowSolid";
			}
		}
	}

	ReplayTimeCon.prototype.initChannel = function(){
		var channelArea, channelObj, channelName;
		var chanSize = options.channelList.length;
		var mouseupTime = id("mouseupTime");

		if (undefined == mouseupTime)
		{
			mouseupTime = document.createElement("span");
			mouseupTime.id = "mouseupTime";
			mouseupTime.className = "mouseupTime";
			document.body.appendChild(mouseupTime);
		}

		channelArea = document.createElement("div");
		channelArea.className = "channelArea";
		channelArea.id = "channelArea";
		totalArea.appendChild(channelArea);

		channelName = document.createElement("div");
		channelName.className = "channelName";
		channelName.style.width = options.chanNameWidth + "px";
		channelArea.appendChild(channelName);

		channelObj = document.createElement("div");
		channelObj.className ="channel";
		channelObj.id = "channel";
		channelObj.style.width = options.chanWidth + "px";
		channelArea.appendChild(channelObj);

		for (var i = 0; i < chanSize; i++)
		{
			initSigChannel(options.channelList[i]);
		}

		function initSigChannel(opt)
		{
			var channelLine, channelVideo, videoObj;
			var list = opt.videoList;
			var listLen = list.length;
			var videoWidth = 0, videoLeft = 0, lastLeft = -1,
				intLeft = 0, intWidth = 0, nxtLeft = 0;

			chanName = document.createElement("label");
			chanName.className = "chanName";
			chanName.id = "chanName" + parseInt(opt.channelId);
			chanName.innerHTML = label.channel + parseInt(opt.channelId);
			channelName.appendChild(chanName);

			channelLine = document.createElement("div");
			channelLine.className = "channelLine";
			channelLine.id = "channelLine" + parseInt(opt.channelId);
			channelLine.style.width = options.chanWidth + "px";
			channelObj.appendChild(channelLine);

			channelVideo = document.createElement("div");
			channelVideo.className = "channelVideo";
			channelVideo.style.width = _this._useVal.totalWidth + "px";
			channelLine.appendChild(channelVideo);

			for (var i = 0; i < listLen; i++)
			{
				videoObj = document.createElement("span");
				videoObj.className = "videoObj";

				videoLeft = _this._useVal.totalWidth * list[i].startTime / SECONDS;
				videoWidth = _this._useVal.totalWidth * (list[i].endTime - list[i].startTime) / SECONDS;
				videoObj.setAttribute("value", list[i].endTime);
				intLeft = Math.round(videoLeft);
				intWidth = Math.round(videoWidth);

				if (intLeft == lastLeft)
				{
					intLeft += 1;
				}

				if (i < listLen - 1 && list[i].endTime == list[i+1].startTime)
				{
					nxtLeft = Math.round(_this._useVal.totalWidth * list[i + 1].startTime / SECONDS);
					intWidth = nxtLeft - intLeft;
				}

				videoObj.style.width = intWidth < 1 ? "1px" : intWidth + "px";
				videoObj.style.left = intLeft + "px";
				lastLeft = intLeft;

				/* 兼容性处理
				 * 回放页面search_video查询某天的视频时，使用vedio_type表示类型
				 * 而使用get_video_list查询某类视频时，使用的video_type表示类型
				 * 这里对这两种字段做兼容处理
				 * */
				if (list[i].vedio_type == undefined)
				{
					if (1 == parseInt(list[i].video_type))
					{
						videoObj.className += " timingVideo";
					}
					else
					{
						videoObj.className += " moveDetVideo";
					}
				}
				else
				{
					if (1 == parseInt(list[i].vedio_type))
					{
						videoObj.className += " timingVideo";
					}
					else
					{
						videoObj.className += " moveDetVideo";
					}
				}

				channelVideo.appendChild(videoObj);
			}

			channelVideo.onmouseover = function(event)
			{
				event = event || window.event;
				var pos = getMousePos(event);
				var offLft = $("#channel").offset().left;
				var showLft = pos.x - offLft;
				var mgnLft = parseInt($(".channelVideo").css("left")) || 0;
				var tLft = showLft - mgnLft;
				var msupTime = SECONDS * tLft / (options.chanWidth * HOURS / options.showFullTime);

				mouseupTime.innerHTML = minToHour(msupTime, true);
				mouseupTime.style.visibility = "visible";
				mouseupTime.style.top = (pos.y - 24) + "px";
				mouseupTime.style.left = (pos.x - 30) + "px";
			};

			channelVideo.onmousemove = function(event)
			{
				event = event || window.event;
				var pos = getMousePos(event);
				var offLft = $("#channel").offset().left;
				var showLft = pos.x - offLft;
				var mgnLft = parseInt($(".channelVideo").css("left")) || 0;
				var tLft = showLft - mgnLft;
				var msupTime = SECONDS * tLft / (options.chanWidth * HOURS / options.showFullTime);

				mouseupTime.innerHTML = minToHour(msupTime, true);
				mouseupTime.style.top = (pos.y - 24) + "px";
				mouseupTime.style.left = (pos.x - 30) + "px";
			};

			channelVideo.onmouseout = function(event)
			{
				mouseupTime.style.visibility = "hidden";
				mouseupTime.style.top = "0px";
				mouseupTime.style.left = "0px";
			};

		}

		listScroll = new NiceScroll("channelArea");
		listScroll.scrollTipOpacity(1);
		listScroll.scrollTipSet({background:"#898989", minHeight:"15px"});
		listScroll.scrollBarSet({zIndex:8, mLeft:0, mTop:0});
		listScroll.init();
	};

	ReplayTimeCon.prototype.initCutAreaAndShow = function(){
		var cutArea, cutObj, cutStartObj, cutStartTime,
			cutEndObj, cutEndTime, cutCover, trueCover, runLine, replayTime;
		var areaHei =id("channel").offsetHeight;
		var scrollBar = id("scrollBar");

		cutArea = document.createElement("div");
		cutArea.className = "cutArea";
		cutArea.id = "cutArea";
		cutArea.style.left = options.chanNameWidth + "px";
		cutArea.style.width = options.chanWidth + "px";
		totalArea.appendChild(cutArea);

		cutObj = document.createElement("div");
		cutObj.className = "cutObj";
		cutObj.id = "cutObj";
		cutObj.style.width = _this._useVal.totalWidth + "px";
		cutArea.appendChild(cutObj);

		cutStartObj = document.createElement("div");
		cutStartObj.className = "cutStart cutPoint";
		cutStartObj.id = "cutStartObj";
		cutStartObj.style.left = this._useVal.totalWidth * options.cutStartTime / SECONDS + "px";
		cutStartObj.style.height = areaHei - 6 + "px";
		cutObj.appendChild(cutStartObj);

		cutStartTime = document.createElement("span");
		cutStartTime.className = "cutTime";
		cutStartTime.innerHTML = minToHour(options.cutStartTime, true);
		cutStartObj.appendChild(cutStartTime);

		cutEndObj = document.createElement("div");
		cutEndObj.className = "cutEnd cutPoint";
		cutEndObj.style.left = this._useVal.totalWidth * options.cutEndTime / SECONDS + "px";
		cutEndObj.style.height = areaHei - 6 + "px";
		cutObj.appendChild(cutEndObj);

		cutEndTime = document.createElement("span");
		cutEndTime.className = "cutTime";
		cutEndTime.innerHTML = minToHour(options.cutEndTime, true);
		cutEndObj.appendChild(cutEndTime);

		cutCover = document.createElement("div");
		cutCover.className = "cutCover";
		cutCover.id = "cutCover";
		cutCover.style.width = this._useVal.totalWidth + "px";
		/*cutCover.style.height = areaHei + "px";*/
		id("channel").appendChild(cutCover);

		trueCover = document.createElement("div");
		trueCover.className = "trueCover";
		trueCover.id = "trueCover";
		trueCover.style.left = this._useVal.totalWidth * options.cutStartTime / SECONDS + "px";
		trueCover.style.width = this._useVal.totalWidth * (options.cutEndTime - options.cutStartTime) / SECONDS + "px";
		/*trueCover.style.height = areaHei + "px";*/
		cutCover.appendChild(trueCover);

		runLine = document.createElement("span");
		runLine.className = "runLine";
		runLine.id = "runLine";
		runLine.style.left = this._useVal.totalWidth * options.runningTime / SECONDS + "px";
		cutCover.appendChild(runLine);

		replayTime = document.createElement("span");
		replayTime.className = "playingTime";
		replayTime.id = "playingTime";
		replayTime.style.left = (parseInt(runLine.style.left) - _this._useVal.scrollLeft + 20) + "px";
		replayTime.innerHTML = minToHour(options.runningTime, true);
		totalArea.appendChild(replayTime);

		runLine.onmousedown = function(event){
			event = event || window.event;
			var curPoint = getMousePos(event);
			var curLeft = parseInt(this.style.left);

			document.onmousemove = function(event){
				var newPoint = getMousePos(event);
				var newLeft = newPoint.x - curPoint.x + curLeft;

				if (newLeft <= 0)
				{
					newLeft = 0;
				}

				if (newLeft >= cutObj.offsetWidth)
				{
					newLeft = cutObj.offsetWidth;
				}

				runLine.style.left = newLeft + "px";
				options.runningTime = newLeft * SECONDS / _this._useVal.totalWidth;
				replayTime.style.left = (newLeft - _this._useVal.scrollLeft + 20) + "px";
				replayTime.innerHTML = minToHour(options.runningTime, true);
			};
			document.onmouseup = function(event) {
				document.onmousemove = null;
				document.onmouseup = null;
				typeof options.setRunTime == "function" && options.setRunTime();
			};
			stopProp(event);
		};

		cutStartObj.onmousedown = function(event){
			event = event || window.event;
			var curPoint = getMousePos(event);
			var curLeft = parseInt(this.style.left);
			var curWidth = trueCover.offsetWidth;

			document.onmousemove = function(event) {
				var newPoint = getMousePos(event);
				var newLeft = newPoint.x - curPoint.x + curLeft;

				if (newLeft <= 0)
				{
					newLeft = 0;
				}
				if (newLeft >= parseInt(cutEndObj.style.left))
				{
					newLeft = parseInt(cutEndObj.style.left);
				}
				options.cutStartTime = newLeft * SECONDS / _this._useVal.totalWidth;
				cutStartTime.innerHTML = minToHour(options.cutStartTime, true);
				cutStartObj.style.left = newLeft + "px";
				trueCover.style.left = newLeft + "px";
				trueCover.style.width = _this._useVal.totalWidth * (options.cutEndTime - options.cutStartTime) / SECONDS + "px";
			};

			document.onmouseup = function(event) {
				document.onmousemove = null;
			};
			eventPreventDefault(event);
		};

		cutEndObj.onmousedown = function(event){
			event = event || window.event;
			var curPoint = getMousePos(event);
			var curLeft = parseInt(this.style.left);
			var curWidth = trueCover.offsetWidth;

			document.onmousemove = function(event) {
				var newPoint = getMousePos(event);
				var newLeft = newPoint.x - curPoint.x + curLeft;

				if (newLeft >= _this._useVal.totalWidth)
				{
					newLeft = _this._useVal.totalWidth;
				}
				if (newLeft <= parseInt(cutStartObj.style.left))
				{
					newLeft = parseInt(cutStartObj.style.left);
				}
				options.cutEndTime = newLeft * SECONDS / _this._useVal.totalWidth;
				cutEndTime.innerHTML = minToHour(options.cutEndTime, true);
				cutEndObj.style.left = newLeft + "px";
				trueCover.style.width = _this._useVal.totalWidth * (options.cutEndTime - options.cutStartTime) / SECONDS + "px";
			};

			document.onmouseup = function(event) {
				document.onmousemove = null;
			};
			eventPreventDefault(event);
		};
	};

	ReplayTimeCon.prototype.initRowScroll = function(){
		var scrollArea, scrollBar, leftBar, rightBar;

		scrollArea = document.createElement("div");
		scrollArea.className = "scrollArea";
		scrollArea.style.paddingLeft = options.chanNameWidth + "px";
		scrollArea.style.width = options.chanWidth + "px";
		totalArea.appendChild(scrollArea);

		leftBar = document.createElement("div");
		leftBar.className = "leftBar";
		leftBar.id = "leftBar";
		scrollArea.appendChild(leftBar);

		scrollBar = document.createElement("span");
		scrollBar.className = "scrollBar";
		scrollBar.id = "scrollBar";
		scrollBar.style.width = options.chanWidth / this._useVal.scale + "px";
		scrollArea.appendChild(scrollBar);

		rightBar = document.createElement("div");
		rightBar.className = "rightBar";
		rightBar.id = "rightBar";
		scrollArea.appendChild(rightBar);

		leftBar.onclick = function(){
			var curLeft = parseInt($("#scrollBar").css("marginLeft"));
			var curLeft1 = parseFloat($("#scrollBar").css("marginLeft"));
			var runLine = id("runLine");
			var replayTime = id("playingTime");
			var curWidth = scrollBar.offsetWidth;
			var scaleScr = (_this._useVal.totalWidth - options.chanWidth) / (options.chanWidth - curWidth);

			var newLeft = -(options.chanWidth - curWidth) / 10 + curLeft1;
			var runLeft = parseInt(runLine.style.left);

			if (newLeft <= 0)
			{
				newLeft = 0;
			}
			if (newLeft >= options.chanWidth - curWidth)
			{
				newLeft = options.chanWidth - curWidth;
			}
			scrollBar.style.marginLeft = newLeft + "px";
			_this._useVal.scrollLeft = newLeft * scaleScr;
			$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":-(newLeft * scaleScr) + "px"});
			replayTime.style.left = (runLeft - _this._useVal.scrollLeft + 20) + "px";

			this.onmousedown =function(){
				$("#leftBar").css('background-image','url(../web-static/images/leftBar_pressed.png)');

				document.onmouseup = function() {
					$("#leftBar").css('background-image','url(../web-static/images/leftBar_normal.png)');
				};
			};
		};

		scrollBar.onmousedown = function(event){
			event = event || window.event;
			var curPoint = getMousePos(event);
			var curLeft = parseInt($("#scrollBar").css("marginLeft"));
			var runLine = id("runLine");
			var replayTime = id("playingTime");
			var curWidth = this.offsetWidth;
			var scaleScr = (_this._useVal.totalWidth - options.chanWidth) / (options.chanWidth - curWidth);
			var cutLeft = id("cutCover").offsetWidth;

			document.onmousemove = function(event) {
				scrollBarMove = true;
				var newPoint = getMousePos(event);
				var newLeft = newPoint.x - curPoint.x + curLeft;
				var runLeft = parseInt(runLine.style.left);

				if (newLeft <= 0)
				{
					newLeft = 0;
				}
				if (newLeft >= options.chanWidth - curWidth)
				{
					newLeft = options.chanWidth - curWidth;
				}
				scrollBar.style.marginLeft = newLeft + "px";
				_this._useVal.scrollLeft = newLeft * scaleScr;
				$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":-(newLeft * scaleScr) + "px"});
				replayTime.style.left = (runLeft - _this._useVal.scrollLeft + 20) + "px";
			};

			document.onmouseup = function(event) {
				scrollBarMove = false;
				document.onmousemove = null;
			};
			eventPreventDefault(event);
		};

		rightBar.onclick = function(){
			var curLeft = parseInt($("#scrollBar").css("marginLeft"));
			var curLeft1 = parseFloat($("#scrollBar").css("marginLeft"));
			var runLine = id("runLine");
			var replayTime = id("playingTime");
			var curWidth = scrollBar.offsetWidth;
			var scaleScr = (_this._useVal.totalWidth - options.chanWidth) / (options.chanWidth - curWidth);

			var newLeft = (options.chanWidth - curWidth) / 10 + curLeft1;
			var runLeft = parseInt(runLine.style.left);

			if (newLeft <= 0)
			{
				newLeft = 0;
			}
			if (newLeft >= options.chanWidth - curWidth)
			{
				newLeft = options.chanWidth - curWidth;
			}
			scrollBar.style.marginLeft = newLeft + "px";
			_this._useVal.scrollLeft = newLeft * scaleScr;
			$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":-(newLeft * scaleScr) + "px"});
			replayTime.style.left = (runLeft - _this._useVal.scrollLeft + 20) + "px";

			this.onmousedown =function(){
				$("#rightBar").css('background-image','url(../web-static/images/rightBar_pressed.png)');

				document.onmouseup = function() {
					$("#rightBar").css('background-image','url(../web-static/images/rightBar_normal.png)');
				};
			};
		};

		timeArea.onmousedown = function(event){
			event = event || window.event;
			timeArea.onselectstart = timeArea.ondrag = function(){return false;};
			timeArea.style.cursor = "pointer";
			var curPoint = getMousePos(event);
			var runLine = id("runLine");
			var replayTime = id("playingTime");
			var curWidth = scrollBar.offsetWidth;
			var scaleScr = (_this._useVal.totalWidth - options.chanWidth) / (options.chanWidth - curWidth);
			var scaleScrR = 1 / scaleScr;
			var curLeft = -(parseInt($("#scrollBar").css("marginLeft"))*scaleScr);
			var cutLeft = id("cutCover").offsetWidth;

			document.onmousemove = function(event) {
				scrollBarMove = true;
				var newPoint = getMousePos(event);
				var newLeft = newPoint.x - curPoint.x + curLeft;
				var runLeft = parseInt(runLine.style.left);

				if ((newLeft * scaleScrR) >= 0)
				{
					newLeft = 0;
				}
				if ((newLeft * scaleScrR) <= curWidth - options.chanWidth)
				{
					newLeft = (curWidth - options.chanWidth)*scaleScr;
				}
				scrollBar.style.marginLeft = -(newLeft * scaleScrR) + "px";
				_this._useVal.scrollLeft = newLeft;
				$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":newLeft + "px"});
				replayTime.style.left = (runLeft + _this._useVal.scrollLeft + 20) + "px";
			};

			timeArea.onmouseup = function(event) {
				timeArea.style.cursor = "default";
			}

			document.onmouseup = function(event) {
				scrollBarMove = false;
				document.onmousemove = null;
			};
			eventPreventDefault(event);
		};
	};

	ReplayTimeCon.prototype.timeRun = function(){
		if(scrollBarMove){
			return;
		}
		var runLine = id("runLine");
		var curPosLeft = this._useVal.totalWidth * options.runningTime / SECONDS;
		var scrollBar , curWidth, scaleScr;
		var replayTime = id("playingTime");

		if (null == runLine)
		{
			return;
		}

		/* options.runningTime += 1; */
		runLine.style.left = curPosLeft + "px";
		replayTime.innerHTML = minToHour(options.runningTime, true);

		if (HOURS != options.showFullTime)
		{
			scrollBar = id("scrollBar");
			curWidth = scrollBar.offsetWidth;
			scaleScr = (this._useVal.totalWidth - options.chanWidth) / (options.chanWidth - curWidth);

			/* 向左移动1/3的长度 */
			if (curPosLeft >= this._useVal.scrollLeft + options.chanWidth - options.chanWidth / 100)
			{
				this._useVal.scrollLeft = curPosLeft - options.chanWidth;
				this._useVal.scrollLeft += (options.chanWidth / 3);

				if (this._useVal.scrollLeft >= this._useVal.totalWidth - options.chanWidth)
				{
					this._useVal.scrollLeft = this._useVal.totalWidth - options.chanWidth;
				}
				$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":-(this._useVal.scrollLeft) + "px"});

				scrollBar.style.marginLeft = this._useVal.scrollLeft / scaleScr + "px";
			}
			else if (curPosLeft < this._useVal.scrollLeft)
			{
				this._useVal.scrollLeft = curPosLeft - options.chanWidth / 2;

				if (this._useVal.scrollLeft < 0)
				{
					this._useVal.scrollLeft = 0;
				}
				$("div.channelVideo, #trueShaft, #cutObj, #cutCover").css({"left":-(this._useVal.scrollLeft) + "px"});

				scrollBar.style.marginLeft = this._useVal.scrollLeft / scaleScr + "px";
			}
		}
		replayTime.style.left = (curPosLeft - _this._useVal.scrollLeft + 20) + "px";
	};

	/* 跳过没有视频的时间段 */
	ReplayTimeCon.prototype.jumpNoArea = function(playType, playChan){
		var nearTime = 86400, minTime = 86400;
		var VideoNormal = "001", VideoMove = "002",
			VideoBoth = "003", VideoNone = "000";
		var lineObj = {}, sTime = 0, videoType;
		var playChnLen = playChan.length;
		var hasChan = false;

		for (var i = 0, len = options.channelList.length; i < len; i++)
		{
			for (var j = 0, size = options.channelList[i].videoList.length; j < size; j++)
			{
				hasChan = false;
				for (var k = 0; k < playChnLen; k++)
				{
					if (parseInt(playChan[k]) == parseInt(options.channelList[i].channelId) -1)
					{
						hasChan = true;
						break;
					}
				}

				if (false == hasChan)
				{
					break;
				}

				lineObj = options.channelList[i].videoList[j];
				videoType = lineObj[uciPlayBack.optName.videoType];
				sTime = lineObj.startTime;

				if (VideoNormal == playType && VideoMove == videoType)
				{
					continue;
				}
				else if (VideoMove == playType && VideoNormal == videoType)
				{
					continue;
				}

				if (options.runningTime >= sTime && options.runningTime <= lineObj.endTime)
				{
					return;
				}

				if (sTime - options.runningTime >= 0 && sTime - options.runningTime < minTime)
				{
					nearTime = sTime;
					minTime = sTime - options.runningTime;
				}
			}
		}

		options.runningTime = nearTime;
	};

	ReplayTimeCon.prototype.getScrollScale = function(){

	};

	this.init();
}

function TimeChannel()
{
	/* 在一天中的秒数 */
	this.hourToSec = function(totalSeconds){
		var timeRes = tranTime(totalSeconds);

		return 3600 * parseInt(timeRes.hour) +
			60 * parseInt(timeRes.min) + parseInt(timeRes.sec);
	};

	/* 一天中某个时间秒数转换为特定的时间格式 */
	this.minToHour = function(totalSec, hsSec) {
		if (totalSec < 0)
		{
			totalSec = 0;
		}

		if (totalSec > 86400)
		{
			totalSec = totalSec % 86400;
		}

		var hours = 0, mins = 0, secs = 0;

		hours = parseInt(totalSec / 3600);
		hours = hours < 10 ? "0" + hours : hours;
		mins = parseInt(parseInt(totalSec) % 3600 / 60);
		mins = mins < 10 ? "0" + mins:mins;
		secs = parseInt(totalSec)  % 60;
		secs = secs < 10 ? "0" + secs : secs;

		if (true == hsSec)
		{
			return hours + ":" + mins + ":" + secs;
		}

		if (0 == secs)
		{
			return hours + ":" + mins;
		}
		else
		{
			return "";
		}
	};

	this.addZero = function(num){
		return num >= 10 ? num : "0" + num;
	};

	/* 秒数转换为指定的时间格式 */
	this.tranTime = function(timeSec, disLet) {
		var weekArr = [label.Sun, label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta];
		var srcTime = new Date();
		var oTime = {};

		if (undefined == disLet || "undefined" == disLet)
		{
			disLet = "-";
		}

		srcTime.setTime(timeSec * 1000);
		oTime.year = srcTime.getFullYear();
		oTime.month = addZero(srcTime.getMonth() + 1);
		oTime.day = addZero(srcTime.getDate());
		oTime.hour = addZero(srcTime.getHours());
		oTime.min = addZero(srcTime.getMinutes());
		oTime.sec = addZero(srcTime.getSeconds());
		oTime.weekDay = weekArr[srcTime.getDay()];
		oTime.timeStr = oTime.year + disLet + oTime.month + disLet + oTime.day + " " + oTime.hour + ":" + oTime.min + ":" + oTime.sec;

		return oTime;
	};
}

function PlanSet(dateConId, options)
{
	this.table;
	this.weekList;
	this.hourList;
	this.dateCon = id(dateConId);
	this.weekIsMouseDown = false;
	this.selDate = [0, 0, 0, 0, 0, 0, 0];
	this.dateArray = [0, 0, 0, 0, 0, 0, 0];
	this.cellHeight = 22;
	this.cellWidth = 22;
	this.cellSeColor = "#325fe0";
	this.timingCellCor = "#325fe0";
	this.motionDetectCellCor = "#1e9f7f";
	this.cellPadding = 1;

	this.tableDiv;
	this.PlanEdit;
	this.chanCpy;

	this.cellStruct = new Array();
	this.eachCellPix = 24;
	this.maxPix = this.eachCellPix * 24;
	this.eachPixMinu = 60 / this.eachCellPix;

	this.timeValArr = new Array();
	this.MAX_INTERVAL = 6;

	this.TYPE_NULL = 0;
	this.TYPE_TIME = 1;
	this.TYPE_MOVE = 2;
	this.curType = this.TYPE_NULL;
	this.typeClass = ["blank", "timing", "movedet"];

	this.timeoutFD;

	if (PlanSet.prototype._init == undefined)
	{
		PlanSet.prototype.hourStr = label.lHour;
		PlanSet.prototype.weekDayNum = 7;
		PlanSet.prototype.lineStr = "-";
		PlanSet.prototype.selTag = "selTag";
		PlanSet.prototype.cellBorderWidth = 1;
		PlanSet.prototype.iCellIndex = 0;
		PlanSet.prototype.weekArray = [label.Mon, label.Tue, label.Wen,
			label.Thu, label.Fri, label.Sta, label.Sun];

		/* Date的初始化 */
		PlanSet.prototype._init = function(options)
		{
			this._initOptions();
			this._dateConInit();

			this._cruiseInit();

			this._hourListInit();
			this._weekListInit();
			this._dateTableInit();

			this._timeValArrayInit();
			this._cellStructInit();
		};

		PlanSet.prototype._cruiseInit = function()
		{
			var cruiseDiv = document.createElement("div");
			var cruise = document.createElement("i");
			cruiseDiv.className = "cruiseDiv";
			this.dateCon.appendChild(cruiseDiv);

			cruise.className = "iCruise displayNone";
			cruiseDiv.appendChild(cruise);
			this.cruise = cruise;
		}

		PlanSet.prototype._timeValArrayInit = function()
		{
			var tvAr = this.timeValArr;
			for (var r = 0; r < this.weekArray.length; r++)
			{
				tvAr[this.weekArray[r]] = new Array();
			}
		}
		/* cell属性结构体初始化 */
		PlanSet.prototype._cellStructInit = function()
		{
			var cellStruct = this.cellStruct;
			for (var r = 0; r < this.weekArray.length; r++)
			{
				cellStruct[this.weekArray[r]] = new Array();
				for (var c = 0; c < this.maxPix; c++)
				{
					cellStruct[this.weekArray[r]][c] = 0;
				}
			}
		}

		// strTimVal ["aabb-ccdd:type", "eeff-hhii:type"]
		PlanSet.prototype.setTimeVal = function(day, strTimVal)
		{
			var curTV;
			var tvArr;
			var objThis = this;

			if (!(strTimVal instanceof Array))
			{
				strTimVal = strTimVal.match(/\d{4}-\d{4}:\d/g);
			}
			if (typeof day == "number")
			{
				day = this.weekArray[day];
			}

			for (var i = 0; i < strTimVal.length; i++)
			{
				curTV = strTimVal[i];
				this._addToTVArr(day, curTV);
				this._setCellStruct(day, curTV);
			}
			this.reRender(day);
		}

		PlanSet.prototype._addToTVArr = function(day, TV)
		{
			var cur = this.timeValArr[day];
			var orgArr = new Array();
			var	tvArr = TV.split(/[-,:]/, 3);
			var bt = parseInt(tvArr[0], 10);
			var et = parseInt(tvArr[1], 10);
			var type = parseInt(tvArr[2], 10);
			var t1, t2, ty, curAr;
			var flag = false;
			var irt, tmp, len = cur.length;

			for (var idx = 0; idx < len; idx++)
			{
				orgArr.push(cur[idx]);
			}

			for (var idx = 0; idx < cur.length; idx++)
			{
				curAr = cur[idx].split(/[-,:]/, 3);
				t1 = parseInt(curAr[0], 10);
				t2 = parseInt(curAr[1], 10);
				ty = parseInt(curAr[2], 10);

				if (bt > t2) //* 比当前区间大，且不重合 *
				{
					continue;
				}
				if (et < t1) //* 比当前区间小，且不重合 *
				{
					flag = true;
					irt = TV;
					for (var i = idx; i < cur.length; i++)
					{
						tmp = cur[i];
						cur[i] = irt;
						irt = tmp;
					}
					cur.push(irt);
					break;
				}

				flag = true;
				//* 与当前区间重合 */
				this._mergeInterval(TV, cur, idx);
				break;
			}

			if (flag == false)
			{
				flag = true;
				cur.push(TV);
			}

			/* 去除type为0的区间段 */
			for (var idx = 0; idx < cur.length; idx++)
			{
				tmp = parseInt(cur[idx].split(/[-,:]/, 3)[2], 10);
				if (tmp == 0)
				{
					this._removeAt(cur, idx);
					idx--;
				}
			}

			return flag;
		}

		PlanSet.prototype._setCellStruct = function(day, curTV)
		{
			var tvArr = curTV.split(/[-,:]/, 3);
			var bt = tvArr[0];
			var et = tvArr[1];
			var type = parseInt(tvArr[2], 10);
			var startPix, endPix;
			var cs = this.cellStruct;

			if (typeof day == "number")
			{
				day = this.weekArray[day];
			}

			startPix = this.timToPix(bt, "begin");
			endPix = this.timToPix(et, "end");
			if ((parseInt(et, 10) - parseInt(bt, 10)) < this.eachPixMinu)
			{
				endPix = startPix;
			}
			for (var curPix = startPix; curPix <= endPix; curPix++)
			{
				cs[day][curPix] = type;
			}

			return [startPix, endPix];
		}

		PlanSet.prototype.reRender = function(day, hour)
		{
			var cs = this.cellStruct;
			var tr, td, idx, spix, epix;
			var child, iCell, wid;

			if (hour == undefined)
			{
				hour = new Array();
				for (var i = 0; i < 24; i++)
				{
					hour.push(i);
				}
			}
			if (typeof day == "number")
			{
				idx = day;
				day = this.weekArray[day];
			}
			else
			{
				for (idx = 0; idx < this.weekArray.length; idx++)
				{
					if (this.weekArray[idx] == day)
					{
						break;
					}
				}
			}

			tr = this.tableDiv.childNodes[idx];

			for (var h = 0; h < hour.length; h++)
			{
				td = tr.childNodes[h];
				child = td.childNodes;

				while (child.length)
				{
					td.removeChild(child[0]);
				}

				spix = h * this.eachCellPix;
				epix = spix + this.eachCellPix - 1;

				for (var i = spix; i <= epix; i++)
				{
					wid = 1;
					while (i + 1 <= epix && cs[day][i + 1] == cs[day][i])
					{
						i++;
						wid++;
					}
					iCell = document.createElement("div");
					iCell.className = this.typeClass[cs[day][i]];
					iCell.style.width = wid + "px";
					td.appendChild(iCell);
				}
			}
		}

		PlanSet.prototype._getStringWithoutType = function(t1, t2)
		{
			t1 = t1.toString();
			t2 = t2.toString();
			while (t1.length < 4)
			{
				t1 = "0" + t1;
			}
			while (t2.length < 4)
			{
				t2 = "0" + t2;
			}

			return t1 + "-" + t2;
		}

		PlanSet.prototype._getString = function(t1, t2, type)
		{
			t1 = t1.toString();
			t2 = t2.toString();
			while (t1.length < 4)
			{
				t1 = "0" + t1;
			}
			while (t2.length < 4)
			{
				t2 = "0" + t2;
			}
			type = type.toString();
			return t1 + "-" + t2 + ":" + type;
		}

		PlanSet.prototype._insertAt = function(arr, idx, val)
		{
			var len = arr.length;
			var irv, tmp;
			if (idx >= len)
			{
				arr.push(val);
			}
			else
			{
				irv = val;
				for (var i = idx; i < len; i++)
				{
					tmp = arr[i];
					arr[i] = irv;
					irv = tmp;
				}
				arr.push(irv);
			}
		}
		PlanSet.prototype._removeAt = function(arr, idx)
		{
			var len = arr.length;
			var irv, tmp;
			if (idx >= len)
			{
				return;
			}

			for (var i = idx; i < len - 1; i++)
			{
				arr[i] = arr[i + 1];
			}
			arr.pop();
		}

		/* 将区间TV与orgArr中已有的区间从idx下标开始合并 */
		PlanSet.prototype._mergeInterval = function(TV, orgArr, idx)
		{
			var	tvArr = TV.split(/[-,:]/, 3);
			var bt = parseInt(tvArr[0], 10);
			var et = parseInt(tvArr[1], 10);
			var type = parseInt(tvArr[2], 10);
			var	curAr = orgArr[idx].split(/[-,:]/, 3);
			var t1 = parseInt(curAr[0], 10);
			var t2 = parseInt(curAr[1], 10);
			var ty = parseInt(curAr[2], 10);
			var tmp, cur, nxt, nxtT1;

			if (t2 > et)
			{
				if (t1 < bt)
				{
					if (ty != type)
					{
						tmp = this._getString(t1, bt, ty);
						orgArr[idx] = tmp;
						tmp = this._getString(bt, et, type);
						this._insertAt(orgArr, idx + 1, tmp);
						tmp = this._getString(et, t2, ty);
						this._insertAt(orgArr, idx + 2, tmp);
					}
				}
				else if (t1 == bt)
				{
					if (ty != type)
					{
						tmp = this._getString(bt, et, type);
						orgArr[idx] = tmp;
						tmp = this._getString(et, t2, ty);
						this._insertAt(orgArr, idx + 1, tmp);
					}
				}
				else
				{
					if (ty == type)
					{
						tmp = this._getString(bt, t2, ty);
						orgArr[idx] = tmp;
					}
					else
					{
						tmp = this._getString(bt, et, type);
						orgArr[idx] = tmp;
						tmp = this._getString(et, t2, ty);
						this._insertAt(orgArr, idx + 1, tmp);
					}
				}
			}
			else if (t2 == et)
			{
				cur = idx;
				if (t1 < bt && ty != type)
				{
					tmp = this._getString(t1, bt, ty);
					orgArr[idx] = tmp;
					tmp = this._getString(bt, et, type);
					this._insertAt(orgArr, idx + 1, tmp);
					cur++;
				}

				if ((t1 == bt && ty != type) || (t1 > bt))
				{
					tmp = this._getString(bt, et, type);
					orgArr[idx] = tmp;
				}
			}
			else if (t2 < et)
			{
				cur = idx;
				if (bt <= t1)
				{
					tmp = this._getString(bt, et, type);
					orgArr[idx] = tmp;
				}
				if (bt > t1 && ty != type)
				{
					tmp = this._getString(t1, bt, ty);
					orgArr[idx] = tmp;

					tmp = this._getString(bt, et, type);
					this._insertAt(orgArr, idx + 1, tmp);
					cur++;
				}
				else if (bt > t1)
				{
					tmp = this._getString(t1, et, ty);
					orgArr[idx] = tmp;
				}
			}

			if (cur != undefined && cur < orgArr.length - 1)
			{
				nxt = orgArr[cur + 1];
				nxtT1 = parseInt(nxt.split(/[-,:]/, 3)[0], 10);
			}
			if (nxt != undefined && et >= nxtT1)
			{
				tmp = orgArr[cur];
				this._removeAt(orgArr, cur);
				this._mergeInterval(tmp, orgArr, cur);
			}
		}

		PlanSet.prototype.timToPix = function(tim, beginOrEnd)
		{
			var t = tim.match(/\d\d/g);
			var h = parseInt(t[0], 10);
			var m = parseInt(t[1], 10);

			var resPix = h * this.eachCellPix;
			resPix--;

			if ((m == 0 && beginOrEnd == "begin" && resPix + 1 < this.maxPix) || (m < this.eachPixMinu && beginOrEnd == "begin" && resPix + 1 < this.maxPix))
			{
				resPix++;
			}
			else
			{
				resPix += Math.floor(m / this.eachPixMinu);
			}

			return resPix;
		}

		PlanSet.prototype.setDayToType = function(day, type)
		{
			var str;
			if (type == undefined)
			{
				type = this.TYPE_NULL;
			}
			str = this._getString("0000", "2400", type);

			if (typeof day == "number")
			{
				day = this.weekArray[day];
			}

			this.setTimeVal(day, [str]);
		}

		PlanSet.prototype.setHourToType = function(hour, type)
		{
			var str, st, et, r, c, tdInfo;
			if (hour == undefined || hour > 23)
			{
				return;
			}
			if (type == undefined)
			{
				type = this.TYPE_NULL;
			}
			st = hour + "00";
			et = (hour + 1) + "00";
			str = this._getString(st, et, type);
			c = hour;

			for (r = 0; r < this.weekArray.length; r++)
			{
				if (this._isCellFullOfCurType(r, c))
				{
					tdInfo = this.getTdInfo(r, c);
					if (tdInfo.leftCellType == this.curType &&
						tdInfo.rightCellType == this.curType &&
						this.timeValArr[this.weekArray[r]].length >= this.MAX_INTERVAL)
					{
						continue;
					}
					this.setTimeVal(this.weekArray[r], [str]);
				}
				else if (this.legalClick(r, hour) == true)
				{
					this.setTimeVal(this.weekArray[r], [str]);
				}
			}
		}

		/* 重新设置显示的时间 */
		PlanSet.prototype.reset = function()
		{
			var r, c;
			var str = this._getString("0000", "2400", this.TYPE_NULL);
			for (r = 0; r < this.weekArray.length; r++)
			{
				this.setTimeVal(this.weekArray[r], [str]);
			}
		};

		/* 初始化options */
		PlanSet.prototype._initOptions = function()
		{
			for (var propty in options)
			{
				if (typeof this[propty] != "undefined")
				{
					this[propty] = options[propty];
				}
			}
		};

		/* 获取已选择的时间 */
		PlanSet.prototype.getTimeVal = function(day)
		{
			if (day != undefined && typeof day == "number")
			{
				day = this.weekArray[day];
			}
			if (day != undefined)
			{
				return this.timeValArr[day];
			}
			return this.timeValArr;
		};

		PlanSet.prototype._dateConInit = function()
		{
			this.dateCon.style.overflow = "hidden";
		};

		PlanSet.prototype._isCellFullOfCurType = function(r, c, t)
		{
			var day = this.weekArray[r];
			var cs = this.cellStruct;
			var spix = c * this.eachCellPix;
			var	epix = spix + this.eachCellPix - 1;
			var isFull = true;
			var type = t || this.curType;

			for (var i = spix; i <= epix; i++)
			{
				if (cs[day][i] != type)
				{
					isFull = false;
					break;
				}
			}
			return isFull;
		}

		PlanSet.prototype._isRowFullOfCurType = function(r)
		{
			var day = this.weekArray[r];
			var cs = this.cellStruct;
			var c;
			for (c = 0; c < this.maxPix; c++)
			{
				if (cs[day][c] != this.curType)
				{
					return false;
				}
			}
			return true;
		}

		PlanSet.prototype._isColFullOfCurType = function(c)
		{
			var r;
			for (r = 0; r < this.weekArray.length; r++)
			{
				if (!this._isCellFullOfCurType(r, c))
				{
					return false;
				}
			}
			return true;
		}

		/* 时刻列表初始化 */
		PlanSet.prototype._hourListInit = function()
		{
			var hourList = document.createElement("div");
			var li, text, iCell, thisObj = this, span;

			hourList.className = "psHourList";

			for(var i = 0; i <= 24; i++)
			{
				li = document.createElement("div");
				li.className = "psHourLi";

				iCell = document.createElement("span");
				iCell.innerHTML = i;
				li.appendChild(iCell);
				iCell.onclick = (function(index){
					return function(){
						if (thisObj._isColFullOfCurType(index))
						{
							thisObj.setHourToType(index, thisObj.TYPE_NULL);
						}
						else
						{
							thisObj.setHourToType(index, thisObj.curType);
						}
					};
				})(i);

				hourList.appendChild(li);
			}

			this.dateCon.appendChild(hourList);
			this.hourList = hourList;
		};

		/* 星期列表初始化 */
		PlanSet.prototype._weekListInit = function()
		{
			var weekList = document.createElement("ul");
			var li, thisObj = this;

			//weekList.className = "weekList";
			weekList.className = "psWeekList";

			for(var i = 0, len = this.weekDayNum; i < len; i++)
			{
				li = document.createElement("li");
				if (i == 0)
				{
					li.className = "firWeekLi";
				}
				li.innerHTML = this.weekArray[i];
				li.onclick = (function(index){
					return function(){
						if (thisObj._isRowFullOfCurType(index))
						{
							thisObj.setDayToType(index, thisObj.TYPE_NULL);
						}
						else
						{
							thisObj.setDayToType(index, thisObj.curType);
						}
					};
				})(i);
				weekList.appendChild(li);
			}

			this.dateCon.appendChild(weekList);
			this.weekList = weekList;
		};

		PlanSet.prototype.clickTd = function(event, r, c, isClick)
		{
			var day = this.weekArray[r];
			var bt, et, ty, timeStr;
			var tr = this.tableDiv.childNodes[r];
			var td = tr.childNodes[c];
			var tdInfo;

			event = event ? event : window.event;

			if (isClick != "click" && this._hover(event, td))
			{
				return;
			}

			bt = c + "00";
			et = (c + 1) + "00";

			if (this._isCellFullOfCurType(r, c))
			{
				tdInfo = this.getTdInfo(r, c);
				if (tdInfo.leftCellType == this.curType &&
					tdInfo.rightCellType == this.curType &&
					this.timeValArr[day].length >= this.MAX_INTERVAL)
				{
					return false;
				}
				timeStr = this._getString(bt, et, this.TYPE_NULL);
				this.setTimeVal(day, [timeStr]);
			}
			else
			{
				if (this.legalClick(r, c) == true)
				{
					timeStr = this._getString(bt, et, this.curType);
					this.setTimeVal(day, [timeStr]);
				}
			}
		};

		PlanSet.prototype.legalClick = function(r, c)
		{
			var day = this.weekArray[r];
			var lt, rt, veryLt, veryRt;
			var cs = this.cellStruct;
			var spix = c * this.eachCellPix;
			var	epix = spix + this.eachCellPix - 1;
			var tdInfo = this.getTdInfo(r, c);
			lt = tdInfo.leftCellType;
			rt = tdInfo.rightCellType;
			veryLt = tdInfo.firValidPix > 0 ? cs[day][tdInfo.firValidPix - 1] : this.TYPE_NULL;
			veryRt = tdInfo.lastValidPix < this.maxPix - 1 ? cs[day][tdInfo.lastValidPix + 1] : this.TYPE_NULL;

			if (
				lt == this.curType ||
				rt == this.curType ||
				tdInfo.seg > 1 ||
				this.timeValArr[day].length < (this.MAX_INTERVAL - 1) ||
				(
					this.timeValArr[day].length < this.MAX_INTERVAL &&
					!(lt != this.TYPE_NULL &&
						lt == rt &&
						this._isCellFullOfCurType(r, c, lt)
					)
				) ||
				(
					tdInfo.seg == 1 &&
					veryLt != tdInfo["tyArr"][0] &&
					veryRt != tdInfo["tyArr"][0]
				)
			)
			{
				return true;
			}
			return false;
		}

		PlanSet.prototype.getTdInfo = function(r, c)
		{
			var day = this.weekArray[r];
			var cs = this.cellStruct;
			var spix = c * this.eachCellPix;
			var	epix = spix + this.eachCellPix - 1;
			var seg = 0;
			var tyArr = [];
			var res = {};
			var fvp = -1;
			var lvp = this.maxPix;

			for (var i = spix; i <= epix; i++)
			{
				if (cs[day][i] != this.TYPE_NULL)
				{
					seg++;
					tyArr.push(cs[day][i]);
					fvp = (fvp == -1) ? i : fvp;
					while (i + 1 <= epix && cs[day][i + 1] == cs[day][i])
					{
						i++;
					}
					lvp = i;
				}
			}

			res["seg"] = seg;
			res["tyArr"] = tyArr;
			res["firValidPix"] = fvp;
			res["lastValidPix"] = lvp;
			res["leftCellType"] = (spix > 0 ? cs[day][spix - 1] : this.TYPE_NULL);
			res["rightCellType"] = ((epix + 1) < this.maxPix ? cs[day][epix + 1] : this.TYPE_NULL);

			return res;
		}

		PlanSet.prototype.applyPeRes = function(res)
		{
			var i, cpyDay, timeStr;
			var objThis = res["planSetObj"];
			cpyDay = res["cpyDay"] != undefined ? res["cpyDay"] : 0;
			timeStr = res["timeStr"] != undefined ? res["timeStr"] : [];
			for (i = 0; i < objThis.weekArray.length; i++)
			{
				if (cpyDay & (1 << i))
				{
					objThis.setDayToType(i, objThis.TYPE_NULL);
					objThis.setTimeVal(i, timeStr);
				}
			}
		};

		PlanSet.prototype.editTimeVal = function(r, idstr)
		{
			var options;
			options = {
				"timeVal": this.getTimeVal(r),
				"dayName": this.weekArray[r],
				"dayNum": r,
				"okCbk": this.applyPeRes,
				"planSetObj": this
			};
			if (idstr == undefined)
			{
				idstr = "editDiv";
			}
			if (this.chanCpy != undefined && this.chanCpy._hidePC != undefined)
			{
				this.chanCpy._hidePC();
			}
			if (this.PlanEdit != undefined)
			{
				this.PlanEdit._showPE();
				this.PlanEdit._applyOptions(options);
			}
			else
			{
				this.PlanEdit = new PlanEdit(idstr, options);
			}
		};

		PlanSet.prototype.setChanCpy = function(obj)
		{
			this.chanCpy = obj;
		}

		PlanSet.prototype.showEditBtn = function(event, r)
		{
			var i;
			var tr = this.tableDiv.childNodes[r];
			var editBtn = tr.childNodes[24];

			event = event ? event : window.event;

			if (this._hover(event, tr))
			{
				return;
			}

			$(editBtn).removeClass("displayNone");

			for (i = 0; i < this.weekArray.length; i++)
			{
				if (i != r)
				{
					this.hideEditBtn(event, i);
				}
			}
		};

		PlanSet.prototype.hideEditBtn = function(event, r)
		{
			event = event ? event : window.event;
			var tr = this.tableDiv.childNodes[r];
			var editBtn = tr.childNodes[24];

			if (this._hover(event, tr))
			{
				return;
			}

			$(editBtn).addClass("displayNone");
		};

		/* 生成时间cell */
		PlanSet.prototype._dateCellCreate = function()
		{
			var dayMask, tr, td, iCell, index, editBtn, editDiv;
			var tbDiv = this.tableDiv;
			var objThis = this;
			var timeVal;
			var relateTar;
			var hour = new Array();
			for (var i = 0; i < 24; i++)
			{
				hour.push(i);
			}

			$.each(this.weekArray, function(j, value){
				tr = document.createElement("div");
				tr.className = "trDiv";
				if (j == 0)
				{
					tr.className += " firTr";
				}
				tbDiv.appendChild(tr);

				tr.onmouseover = function (event)
				{
					if (objThis.weekIsMouseDown == false)
					{
						event = event ? event : window.event;
						objThis.showEditBtn(event, j);
					}
				}
				tr.onmouseout = function (event)
				{
					if (objThis.weekIsMouseDown == false)
					{
						event = event ? event : window.event;
						objThis.hideEditBtn(event, j);
					}
				}

				$.each(hour, function(i, val){
					td = document.createElement("div");
					td.className = "tdDiv";
					tr.appendChild(td);

					if (i == 0)
					{
						td.className = td.className + " firTd";
					}
					else if (i == 23)
					{
						td.className = td.className + " lastTd";
					}

					iCell = document.createElement("div");
					td.appendChild(iCell);

					td.onmouseover = function (event){
						event = event ? event : window.event;

						if (objThis.weekIsMouseDown == true)
						{
							objThis.clickTd(event, j, i);
						}
					};

					td.onmousedown = function (event){
						event = event ? event : window.event;
						objThis.clickTd(event, j, i, "click");
					};
				});

				editBtn = document.createElement("div");
				editBtn.className="editBtn displayNone";
				editBtn.onclick = function(event){
					event = event ? event : window.event;
					stopProp(event);
					$(objThis.cruise).addClass("displayNone");
					objThis.editTimeVal(j);
				};
				tr.appendChild(editBtn);
			});

			editDiv = document.createElement("div");
			editDiv.id = "editDiv";
			tbDiv.appendChild(editDiv);
		};

		PlanSet.prototype.getAbsoluteLeft = function(obj)
		{
			var curObj = obj;
			var objLeft = curObj.offsetLeft;

			while (curObj.offsetParent != null)
			{
				curObj = curObj.offsetParent;
				objLeft += curObj.offsetLeft;
			}

			return objLeft;
		};

		/* 添加处理函数 */
		PlanSet.prototype._dateCellBind = function()
		{
			var objThis = this;
			this.tableDiv.onmousedown = function (event){
				objThis.weekIsMouseDown = true;
				document.onmouseup = function (event){
					objThis.weekIsMouseDown = false;
					$(objThis.cruise).addClass("displayNone");
				}
			};

			this.tableDiv.onmouseup = function (event){
				objThis.weekIsMouseDown = false;
				$(objThis.cruise).addClass("displayNone");
			};

			this.tableDiv.onmousemove = function (event)
			{
				var pos, curX;
				var max = 608;

				if (objThis.tableLeft == 0)
				{
					objThis.tableLeft = objThis.getAbsoluteLeft(objThis.tableDiv);
				}
				if (objThis.weekIsMouseDown == true)
				{
					$(objThis.cruise).removeClass("displayNone");
					pos = getMousePos(event);

					curX = (pos.x - objThis.tableLeft + 9);
					if (curX < 0)
					{
						curX = 0;
					}
					if (curX > max)
					{
						curX = max;
					}
					objThis.cruise.style.left = curX + "px";
				}
			}
		};

		/* 生成时间表 */
		PlanSet.prototype._dateTableCreate = function()
		{
			this.tableDiv = document.createElement("div");
			this.tableDiv.className = "tableDiv";
			this.dateCon.appendChild(this.tableDiv);

			this.tableLeft = this.getAbsoluteLeft(this.tableDiv);
		};

		/* 初始化具体的时间表格 */
		PlanSet.prototype._dateTableInit = function()
		{
			this._dateTableCreate();
			this._dateCellCreate();
			this._dateCellBind();
		};

		/* 判断元素p是否为元素c的父元素 */
		PlanSet.prototype._contain = function(p, c)
		{
			if (p.contains)
			{
				return p != c && p.contains(c);
			}
			else
			{
				return (!!(p.compareDocumentPosition(c) & 16));
			}
		};

		/* 判断鼠标是否在target对象内部移动 */
		PlanSet.prototype._hover = function(event, target)
		{
			var objThis = this;
			var relateTar;
			var relRect;

			try
			{
				event = event ? event : window.event;

				if (event.type == "mouseover")
				{
					relateTar = event.fromElement || event.relatedTarget;
				}
				else
				{
					relateTar = event.toElement || event.relatedTarget;
				}

				relRect = relateTar.getBoundingClientRect();

				if (relRect.bottom == 0)
				{
					return true;
				}

				return (target === relateTar) || (this._contain(target, relateTar));
			}
			catch(ex)
			{
				return true;
			}
		};
	}

	this._init(options);
}

function PlanEdit(idstr, options)
{
	/* dom */
	this.peTopDiv;
	this.peCon;
	this.peConTips;
	this.peConDetail;
	this.peConCpy;
	this.peConBtn;
	this.peConTipsTitle;
	this.peConTipsDay;

	/* 常量 */
	this.DEF_TIME_STR = "0000-0000:1";
	this.TYPE_NULL = 0;
	this.TYPE_TIME = 1;
	this.TYPE_MOVE = 2;
	this.ST = "st";
	this.ET = "et";

	/* opt */
	this.dayName;
	this.dayNum;
	this.timeVal;
	this.maxTimVal = 6;
	this.okCbk;
	this.planSetObj;
	this.weekArray = [label.Mon, label.Tue, label.Wen,
		label.Thu, label.Fri, label.Sta, label.Sun];

	/* date struct */
	this.timDivArr = new Array();
	this.labelDomArr = new Array();
	this.stDomArr = new Array();
	this.etDomArr = new Array();
	this.stTipArr = new Array();
	this.etTipArr = new Array();
	this.tySelDomArr = new Array();
	this.vadChkDomArr = new Array();
	this.cpyCandidateArr = new Array();
	this.cpyDisINodeArr = new Array();
	this.cpyCandidateLabelArr = new Array();

	var peObj = this;

	if (PlanEdit.prototype.init == undefined)
	{
		PlanEdit.prototype.init = function(options)
		{
			this._initPECon();
			this._applyOptions(options);
		}

		PlanEdit.prototype.validCheckMouseout = function(idx)
		{
			idx--;
			if ($(peObj.vadChkDomArr[idx]).hasClass("peCboxHover"))
			{
				$(peObj.vadChkDomArr[idx]).addClass("peCboxUnchecked");
				$(peObj.vadChkDomArr[idx]).removeClass("peCboxHover");
			}
		}

		PlanEdit.prototype._initPECon = function()
		{
			var scrollTop, tid;
			var col, tmpDom, rowDiv, cName, candi, tmpDom2, disINode;
			var objThis = this;
			var titleArr = ["序号", "开始时间", "结束时间", "类型", "设定"];
			if (idstr == undefined || id(idstr) == undefined)
			{
				return;
			}
			this.peTopDiv = id(idstr);
			this.peCon = document.createElement("div");
			$(this.peCon).addClass("peCon");
			this.peCon.id = "peCon";
			this.peTopDiv.appendChild(this.peCon);

			this.peConTips = document.createElement("div");
			this.peConTips.className = "peConTips";
			this.peCon.appendChild(this.peConTips);

			this.peConTipsDay = document.createElement("label");
			this.peConTipsDay.className = "peDayName";
			this.peConTips.appendChild(this.peConTipsDay);

			this.peConTipsTitle = document.createElement("label");
			this.peConTipsTitle.innerHTML = btn.edit;
			this.peConTipsTitle.className = "peTitle";
			this.peConTips.appendChild(this.peConTipsTitle);

			this.peConDetail = document.createElement("div");
			this.peConDetail.className = "peConDetail";
			this.peCon.appendChild(this.peConDetail);

			rowDiv = document.createElement("div");
			rowDiv.className = "titleRow";
			this.peConDetail.appendChild(rowDiv);
			for (var i = 1; i <= 5; i++)
			{
				cName = "peCol" + i;
				col = document.createElement("div");
				$(col).addClass("peCol");
				$(col).addClass(cName);
				col.innerHTML = titleArr[i - 1];
				rowDiv.appendChild(col);
			}
			for (var i = 0; i < this.maxTimVal; i++)
			{
				this._createRow(i);
			}

			// 点击输入框/离开输入框时隐藏/显示提示语
			$.each(this.stDomArr, function(idx, val){
				val.onblur = function(){
					peObj._onBlur(idx, objThis.ST);
				};
				val.onfocus = function(){
					peObj._onFocus(idx, objThis.ST);
				};
			});
			$.each(this.etDomArr, function(idx, val){
				val.onblur = function(){
					peObj._onBlur(idx, objThis.ET);
				};
				val.onfocus = function(){
					peObj._onFocus(idx, objThis.ET);
				};
			});

			// 点击提示语时自动聚焦对应的输入框
			$.each(this.stTipArr, function(idx, val){
				val.onclick = function()
				{
					$(peObj.stDomArr[idx]).focus();
				}
			});
			$.each(this.etTipArr, function(idx, val){
				val.onclick = function()
				{
					peObj.etDomArr[idx].focus();
				}
			});
			initCheckInput("validCheck", this.validCheckCbk);

			this.peConCpy = document.createElement("div");
			this.peConCpy.className = "peConCpy";
			this.peCon.appendChild(this.peConCpy);


			tmpDom = document.createElement("label");
			tmpDom.innerHTML = label.cpyPlanTo;
			tmpDom.className = "peTitle";
			this.peConCpy.appendChild(tmpDom);

			tid = "selAll";
			tmpDom = document.createElement("i");
			tmpDom.id = tid;
			tmpDom.setAttribute("name", "selAll");
			this.peConCpy.appendChild(tmpDom);
			initCheckInput("selAll", this.selAllCbk);

			tmpDom = document.createElement("label");
			tmpDom.className = "peLabel";
			tmpDom.innerHTML = label.chooseAll;
			this.peConCpy.appendChild(tmpDom);

			tmpDom = document.createElement("div");
			tmpDom.className = "cpyCandidateDiv";
			this.peConCpy.appendChild(tmpDom);
			$.each(this.weekArray, function(idx, value){
				candi = document.createElement("i");
				candi.id = "weekDay" + idx;
				candi.setAttribute("name", "candidates");
				tmpDom.appendChild(candi);
				objThis.cpyCandidateArr.push(candi);

				disINode = document.createElement("i");
				disINode.className = "invalidCbox";
				tmpDom.appendChild(disINode);
				objThis.cpyDisINodeArr.push(disINode);

				tmpDom2 = document.createElement("label");
				tmpDom2.className = "peLabel";
				tmpDom2.innerHTML = value;
				tmpDom.appendChild(tmpDom2);
				objThis.cpyCandidateLabelArr.push(tmpDom2);
			});
			initCheckInput("candidates", this.selCandiCbk);

			this.peConBtn = document.createElement("div");
			this.peConBtn.className = "peConBtn";
			this.peCon.appendChild(this.peConBtn);

			tmpDom = document.createElement("input");
			tmpDom.className = "subBtnB btnA";
			tmpDom.id = "peCancel";
			tmpDom.type = "button";
			tmpDom.value = btn.cancel;
			this.peConBtn.appendChild(tmpDom);
			tmpDom.onclick = function(event)
			{
				event = event ? event : window.event;
				stopProp(event);
				objThis._hidePE();
			};

			tmpDom = document.createElement("input");
			tmpDom.className = "subBtn btnA";
			tmpDom.id = "peSave";
			tmpDom.type = "button";
			tmpDom.value = btn.ok;
			this.peConBtn.appendChild(tmpDom);
			tmpDom.onclick = function(event)
			{
				var res;
				event = event ? event : window.event;
				stopProp(event);

				if (true == objThis.checkSettings())
				{
					res = objThis.getSettings();
					objThis.okCbk(res);
					objThis._hidePE();
				}
			};

			this.peCon.onclick = function(event)
			{
				event = event ? event : window.event;
				stopProp(event);
			};

			attachEvnt(document.body, "click", function(){
				//objThis._hidePE();
			});
		}

		PlanEdit.prototype._createRow = function(idx){
			var tDivArr = this.timDivArr;
			var col, tmpDom, subDom, rowDiv, tid;
			var stStr = "st", etStr = "et";
			var tyOpt = [{str:"定时", value:this.TYPE_TIME},
				{str:"事件", value:this.TYPE_MOVE}];
			idx++;
			rowDiv = document.createElement("div");
			rowDiv.className = "peRowDiv";
			tDivArr.push(rowDiv);
			this.peConDetail.appendChild(rowDiv);

			col = document.createElement("div");
			col.className = "peCol peCol1";
			rowDiv.appendChild(col);
			tmpDom = document.createElement("label");
			tmpDom.innerHTML = idx;
			tmpDom.className = "peRowNo";
			tmpDom.id = "peRowNo" + idx;
			col.appendChild(tmpDom);
			this.labelDomArr.push(tmpDom);

			col = document.createElement("div");
			col.className = "peCol peCol2";
			rowDiv.appendChild(col);
			tmpDom = document.createElement("input");
			tmpDom.className = "text peTextA";
			tmpDom.id = "startTime" + idx;
			tmpDom.setAttribute("maxLength", 5);
			col.appendChild(tmpDom);
			this.stDomArr.push(tmpDom);

			// st tip
			tmpDom = document.createElement("label");
			tmpDom.className = "peEditTip";
			tmpDom.id = "peStEditTip" + idx;
			tmpDom.value = "00:00";
			col.appendChild(tmpDom);
			this.stTipArr.push(tmpDom);

			col = document.createElement("div");
			col.className = "peCol peCol3";
			rowDiv.appendChild(col);
			tmpDom = document.createElement("input");
			tmpDom.className = "text peTextA";
			tmpDom.id = "endTime" + idx;
			tmpDom.setAttribute("maxLength", 5);
			col.appendChild(tmpDom);
			this.etDomArr.push(tmpDom);

			// et tip
			tmpDom = document.createElement("label");
			tmpDom.className = "peEditTip";
			tmpDom.id = "peEtEditTip" + idx;
			tmpDom.value = "00:00";
			col.appendChild(tmpDom);
			this.etTipArr.push(tmpDom);

			col = document.createElement("div");
			col.className = "peCol peCol4";
			rowDiv.appendChild(col);

			tid = "type" + idx;
			tmpDom = document.createElement("span");
			tmpDom.className = "select";
			tmpDom.id = tid;
			col.appendChild(tmpDom);
			this.tySelDomArr.push(id(tid));
			subDom = document.createElement("span");
			subDom.className = "value hsValueA peSelect";
			tmpDom.appendChild(subDom);
			subDom = document.createElement("i");
			subDom.className = "arrow";
			tmpDom.appendChild(subDom);
			selectInit(tid, tyOpt, this.TYPE_MOVE);

			tid = "check" + idx;
			col = document.createElement("div");
			col.className = "peCol peCol5";
			rowDiv.appendChild(col);
			tmpDom = document.createElement("i");
			tmpDom.id = tid;
			tmpDom.setAttribute("value", idx);
			tmpDom.setAttribute("name", "validCheck");
			col.appendChild(tmpDom);
			tmpDom.onmouseover = function(event){
				peObj.validCheckHover(idx);
			};
			tmpDom.onmouseout = function(event){
				peObj.validCheckMouseout(idx);
			};
			this.vadChkDomArr.push(id(tid));
		}

		PlanEdit.prototype._setRow = function(idx, timeStr)
		{
			var stStr, etStr, type;
			var	tvArr, enable;
			if (timeStr == undefined)
			{
				timeStr = this.DEF_TIME_STR;
			}

			tvArr = timeStr.split(/[-,:]/, 3);
			stStr = tvArr[0].substring(0, 2) + ":" + tvArr[0].substring(2);
			etStr = tvArr[1].substring(0, 2) + ":" + tvArr[1].substring(2);
			type = tvArr[2];

			this.labelDomArr[idx].innerHTML = (idx + 1);
			this.stDomArr[idx].value = stStr;
			this.etDomArr[idx].value = etStr;
			this.tySelDomArr[idx].resetSel(type);
			enable = (timeStr == this.DEF_TIME_STR ? false : true);
			changeCheckInput(this.vadChkDomArr[idx], enable);

			if (enable == true)
			{
				$(this.vadChkDomArr[idx]).addClass("peCboxChecked");
				$(this.vadChkDomArr[idx]).removeClass("peCboxUnchecked");
			}
			else
			{
				$(this.vadChkDomArr[idx]).addClass("peCboxUnchecked");
				$(this.vadChkDomArr[idx]).removeClass("peCboxChecked");
			}
		}
		PlanEdit.prototype.selAllCbk = function(checked, value)
		{
			for (var i = 0; i < peObj.weekArray.length; i++)
			{
				if (i != peObj.dayNum)
				{
					changeCheckInput(peObj.cpyCandidateArr[i], checked);
				}
			}
		}
		PlanEdit.prototype.validCheckCbk = function(checked, idx)
		{
			idx--;
			if (checked == true)
			{
				$(peObj.vadChkDomArr[idx]).addClass("peCboxChecked");
				$(peObj.vadChkDomArr[idx]).removeClass("peCboxUnchecked");
				$(peObj.vadChkDomArr[idx]).removeClass("peCboxHover");
			}
			else
			{
				$(peObj.vadChkDomArr[idx]).addClass("peCboxUnchecked");
				$(peObj.vadChkDomArr[idx]).removeClass("peCboxChecked");
			}
		}

		PlanEdit.prototype.validCheckHover = function(idx)
		{
			idx--;
			if ($(peObj.vadChkDomArr[idx]).hasClass("peCboxUnchecked"))
			{
				$(peObj.vadChkDomArr[idx]).removeClass("peCboxUnchecked");
				$(peObj.vadChkDomArr[idx]).addClass("peCboxHover");
			}
		}
		PlanEdit.prototype.selCandiCbk = function(checked, value)
		{
			if (checked == false)
			{
				changeCheckInput("selAll", false);
			}
			else
			{
				var selFlag = true;
				var tmp;
				for (var i = 0; i < peObj.weekArray.length; i++)
				{
					tmp = peObj.cpyCandidateArr[i];
					if (i != peObj.dayNum && tmp != undefined && tmp.getAttribute("checked") == "false")
					{
						selFlag = false;
						break;
					}
				}
				if (selFlag)
				{
					changeCheckInput("selAll", "true");
				}
			}
		}

		PlanEdit.prototype._applyOptions = function(opt){
			var v, i;
			this._cpyOptions(opt);
			this.peConTipsDay.innerHTML = this.dayName;
			peObj = this;

			/*if (!($("#peCon").hasClass("displayNone")))
			{
				this.peTopDiv.style.height = "140px";
			}*/

			for (i = 0 ; i < this.maxTimVal; i++)
			{
				v = this.timeVal[i];
				this._setRow(i, v);
			}

			for (i = 0; i < peObj.weekArray.length; i++)
			{
				changeCheckInput(peObj.cpyCandidateArr[i], false);

				if (i == this.dayNum)
				{
					$(this.cpyDisINodeArr[i]).removeClass("displayNone");
					$(this.cpyDisINodeArr[i]).addClass("invalidCbox");
					this.cpyCandidateArr[i].style.display = "none";
					this.cpyCandidateLabelArr[i].className = "peInvalidNameLabel";
				}
				else
				{
					$(this.cpyDisINodeArr[i]).addClass("displayNone");
					this.cpyCandidateArr[i].style.display = "inline-block";
					this.cpyCandidateLabelArr[i].className = "peLabel";
				}
			}
			changeCheckInput("selAll", false);
		}

		PlanEdit.prototype._hidePE = function(){
			closeNoteAll();
			$("#peCon").addClass("displayNone");
			$(".peEditTip").addClass("displayNone");
			//this.peTopDiv.style.height = "0px";
		}

		PlanEdit.prototype._showPE = function(){
			closeNoteAll();
			$("#peCon").removeClass("displayNone");
			$(".peTextA").removeClass("errInput");
			//this.peTopDiv.style.height = "140px";
		}

		PlanEdit.prototype._cpyOptions = function(opt)
		{
			for (var propty in opt)
			{
				if (typeof this[propty] != undefined)
				{
					this[propty] = opt[propty];
				}
			}
		}

		// 时间编辑框失去焦点时
		PlanEdit.prototype._onBlur = function(idx, stOrEt)
		{
			var editDom, tipDom;
			$(".peTextA").removeClass("errInput");

			if (idx >= this.maxTimVal)
			{
				return;
			}
			if (stOrEt == this.ST)
			{
				editDom = this.stDomArr[idx];
				tipDom = this.stTipArr[idx];
			}
			else if (stOrEt == this.ET)
			{
				editDom = this.etDomArr[idx];
				tipDom = this.etTipArr[idx];
			}
			else
			{
				return;
			}

			if (editDom && editDom.value == "")
			{
				tipDom && $(tipDom).removeClass("displayNone");
				tipDom.innerHTML = "00:00";
			}
			else
			{
				tipDom && $(tipDom).addClass("displayNone");
			}
		}

		// 时间编辑框获得焦点
		PlanEdit.prototype._onFocus = function(idx, stOrEt)
		{
			var editDom, tipDom;

			if (idx >= this.maxTimVal)
			{
				return;
			}

			if (stOrEt == this.ST)
			{
				editDom = this.stDomArr[idx];
				tipDom = this.stTipArr[idx];
			}
			else if (stOrEt == this.ET)
			{
				editDom = this.etDomArr[idx];
				tipDom = this.etTipArr[idx];
			}
			else
			{
				return;
			}

			tipDom && $(tipDom).addClass("displayNone");
		}

		PlanEdit.prototype._checkTime = function()
		{
			var reg = /\d\d:\d\d/;
			var stVal, etVal, i; // val match dd:dd
			var t;
			var st, et;
			var flag = true;
			var errArr = new Array();
			var stFlag, etFlag;
			var errAttribute = "strError";
			var errMsg;

			closeNoteAll();
			$(".peTextA").removeClass("errInput");

			for (i = 0; i < peObj.maxTimVal; i++)
			{
				stFlag = etFlag = true;
				stVal = (peObj.stDomArr)[i].value;
				etVal = (peObj.etDomArr)[i].value;

				/* 开始时间格式错误 */
				if (!(stVal.length == 5 && stVal.match(reg)))
				{
					flag = stFlag = false;
					errMsg = stVal.length == 0 ? errStr.ePlanNull : errStr.ePlanTimeFormatErr;
					peObj.stDomArr[i].setAttribute(errAttribute, errMsg);
					errArr.push((peObj.stDomArr)[i]);
				}

				/* 结束时间格式错误 */
				if (!(etVal.length == 5 && etVal.match(reg)))
				{
					flag = etFlag = false;
					errMsg = etVal.length == 0 ? errStr.ePlanNull : errStr.ePlanTimeFormatErr;
					peObj.etDomArr[i].setAttribute(errAttribute, errMsg);
					errArr.push((peObj.etDomArr)[i]);
				}

				/* 时间有误 */
				if (stFlag)
				{
					t = stVal.match(/\d\d/g);
					if (t[0] > 24 || t[1] >= 60 || (t[0] == 24) && t[1] > 0)
					{
						flag = stFlag = false;
						peObj.stDomArr[i].setAttribute(errAttribute, errStr.ePlanTimeRangErr);
						errArr.push((peObj.stDomArr)[i]);
					}
					st = parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
				}

				if (etFlag)
				{
					t = etVal.match(/\d\d/g);
					if (t[0] > 24 || t[1] >= 60 || (t[0] == 24) && t[1] > 0)
					{
						flag = etFlag = false;
						peObj.etDomArr[i].setAttribute(errAttribute, errStr.ePlanTimeRangErr);
						errArr.push((peObj.etDomArr)[i]);
					}
					et = parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
				}
			}

			$.each(errArr, function(idx, val){
				if (idx == 0) // 只提示第一个错误
				{
					$(val).addClass("errInput");
					showToast("other", {noteStr:val.getAttribute(errAttribute)});
					$.setTimeout(closeToast, 1000);
				}
				else
				{
					$(val).addClass("errInput");
				}
			});
			return flag;
		}

		PlanEdit.prototype.checkSettings = function()
		{
			var i, j;
			var st1, et1, t1;
			var st2, et2, t2;
			var tmp;
			var errArr = new Array();
			closeNoteAll();
			$(".peTextA").removeClass("errInput");

			// 检查时间格式
			if (this._checkTime() == false)
			{
				return false;
			}

			// 检查起始时间比结束时间大、检查是否时间段是否交叉
			for (i = 0; i < this.maxTimVal; i++)
			{
				tmp = this.stDomArr[i].value.split(":", 2);
				st1 = 60 * parseInt(tmp[0], 10) + parseInt(tmp[1], 10);
				tmp = this.etDomArr[i].value.split(":", 2);
				et1 = 60 * parseInt(tmp[0], 10) + parseInt(tmp[1], 10);
				t1 = this.tySelDomArr[i].value;
				if (st1 == et1 || this.vadChkDomArr[i].getAttribute("checked") == "false")
				{
					continue;
				}

				if (st1 > et1)
				{
					errArr.push(this.stDomArr[i].getAttribute("id"));
					errArr.push(this.etDomArr[i].getAttribute("id"));
					$.each(errArr, function(idx, val){
						$("#" + val).addClass("errInput");
						showToast("other", {noteStr:errStr.ePlanTimeMinErr});
						$.setTimeout(closeToast, 1000);
					});
					return false;
				}

				for (j = i + 1; j < this.maxTimVal; j++)
				{
					t2 = this.tySelDomArr[j].value;

					if (t1 == t2)
					{
						continue;
					}

					tmp = this.stDomArr[j].value.split(":", 2);
					st2 = 60 * parseInt(tmp[0], 10) + parseInt(tmp[1], 10);
					tmp = this.etDomArr[j].value.split(":", 2);
					et2 = 60 * parseInt(tmp[0], 10) + parseInt(tmp[1], 10);

					if (st2 == et2 || this.vadChkDomArr[j].getAttribute("checked") == "false")
					{
						continue;
					}

					if (st2 > et2)
					{
						errArr.push(this.stDomArr[j].getAttribute("id"));
						errArr.push(this.etDomArr[j].getAttribute("id"));
						$.each(errArr, function(idx, val){
							$("#" + val).addClass("errInput");
							showToast("other", {noteStr:errStr.ePlanTimeMinErr});
							$.setTimeout(closeToast, 1000);
						});
						return false;
					}

					if ((st1 < et2 && st1 >= st2) ||
						(st2 < et1 && st2 >= st1))
					{
						errArr.push(this.stDomArr[i].getAttribute("id"));
						errArr.push(this.etDomArr[i].getAttribute("id"));
						errArr.push(this.stDomArr[j].getAttribute("id"));
						errArr.push(this.etDomArr[j].getAttribute("id"));
						$.each(errArr, function(idx, val){
							$("#" + val).addClass("errInput");
							showToast("other", {noteStr:errStr.ePlanTimeCoverErr});
							$.setTimeout(closeToast, 1000);
						});
						return false;
					}
				}
			}
			return true;
		}

		PlanEdit.prototype.getSettings = function()
		{
			var i, j;
			var st1, et1, t1;
			var cpyDay = 0;
			var tmp, tmp2;
			var res = {};
			res["timeStr"] = [];
			res["dayNum"] = this.dayNum;
			res["dayName"] = this.dayName;
			res["planSetObj"] = this.planSetObj;
			var str;
			for (i = 0; i < this.maxTimVal; i++)
			{
				tmp = this.stDomArr[i].value.split(":", 2);
				st1 = 60 * parseInt(tmp[0], 10) + parseInt(tmp[1], 10);
				tmp2 = this.etDomArr[i].value.split(":", 2);
				et1 = 60 * parseInt(tmp2[0], 10) + parseInt(tmp2[1], 10);
				t1 = this.tySelDomArr[i].value;

				if (st1 == et1 || this.vadChkDomArr[i].getAttribute("checked") == "false")
				{
					continue;
				}

				str = tmp[0] + tmp[1] + "-" + tmp2[0] + tmp2[1] + ":" + this.tySelDomArr[i].value;
				res["timeStr"].push(str);
			}

			cpyDay |= (1 << this.dayNum);
			for (i = 0; i < this.weekArray.length; i++)
			{
				if (this.cpyCandidateArr[i].getAttribute("checked") == "true")
				{
					cpyDay |= (1 << i);
				}
			}
			res["cpyDay"] = cpyDay;
			return res;
		}
	}
	this.init(options);
}

function PlanCpy(idstr, options)
{
	// dom
	this.pcTopDiv;
	this.planCpyCon;
	this.pcTitleDiv;
	this.pcDetailDiv;
	this.pcBtnDiv;

	// option
	this.okCbk;
	this.curChanId = 1;
	this.cameraInfo;
	this.maxChannel = gChannelMaxNum;	/* 统一使用gChannelMaxNum获取最大支持的通道数量 */

	this.validLen = 4;
	this.defIpcName = "未设置名称";

	// struct
	this.chanCheckArr = new Array();
	this.dotBgArr = new Array();
	this.chanNoArr = new Array();
	this.labelArr = new Array();
	this.chanNoNames = ["通道一", "通道二", "通道三", "通道四", "通道五", "通道六", "通道七", "通道八", "通道九", "通道十", "通道十一", "通道十二", "通道十三", "通道十四", "通道十五", "通道十六"];
	this.validChanList = {};


	var listScroll;
	this.scrollBg = "#2e2e2e";
	this.scrollZIndex = 1001;
	this.scrollMLeft = 3;
	this.scrollMTop = 3;

	this.pcDetailDivId = "pcDetailDiv";

	var pcObj = this;

	if (PlanCpy.prototype.init == undefined)
	{
		PlanCpy.prototype.init = function(options){
			this._initPcCon();
			this._eventBind();
			this.applyOptions(options);
			this.scrollInit();
		}

		PlanCpy.prototype._initPcCon = function(){
			var pcTopDiv;
			var tmpDom, tid, i, leftUl, rightUl, row;
			var objThis = this;
			var leftH = rightH = totalH = 0;

			if (idstr == undefined || id(idstr) == undefined)
			{
				return;
			}

			this.pcTopDiv = id(idstr);
			this.planCpyCon = document.createElement("div");
			this.planCpyCon.className = "planCpyCon";
			this.pcTopDiv.appendChild(this.planCpyCon);

			this.pcTitleDiv = document.createElement("div");
			this.planCpyCon.appendChild(this.pcTitleDiv);
			tmpDom = document.createElement("label");
			tmpDom.className = "pcTitle";
			tmpDom.innerHTML = btn.cpyChannel;
			this.pcTitleDiv.appendChild(tmpDom);

			tid = "pcSelAll";
			tmpDom = document.createElement("i");
			tmpDom.id = tid;
			tmpDom.setAttribute("name", "pcSelAll");
			this.pcTitleDiv.appendChild(tmpDom);
			initCheckInput("pcSelAll", this.selAllCbk);
			tmpDom = document.createElement("label");
			tmpDom.className = "peLabel";
			tmpDom.innerHTML = label.chooseAll;
			this.pcTitleDiv.appendChild(tmpDom);

			this.pcDetailDiv = document.createElement("div");
			this.pcDetailDiv.className = "pcDetailDiv";
			this.pcDetailDiv.id = this.pcDetailDivId;
			this.planCpyCon.appendChild(this.pcDetailDiv);
			leftUl = document.createElement("ul");
			leftUl.className = "leftUl";
			this.pcDetailDiv.appendChild(leftUl);
			rightUl = document.createElement("ul");
			rightUl.className = "rightUl";
			this.pcDetailDiv.appendChild(rightUl);

			for (i = 1; i <= this.maxChannel; i++)
			{
				row = document.createElement("li");
				row.className = "liRow";
				tmpDom = document.createElement("i");
				tmpDom.setAttribute("name", "channelCheck");
				tmpDom.id = "chan" + i;
				if (i == this.curChanId || i > this.validLen)
				{
					tmpDom.style.display = "none";
				}
				row.appendChild(tmpDom);
				this.chanCheckArr.push(tmpDom);

				tmpDom = document.createElement("i");
				row.appendChild(tmpDom);
				this.dotBgArr.push(tmpDom);

				tmpDom = document.createElement("label");
				tmpDom.innerHTML = this.chanNoNames[i - 1];
				row.appendChild(tmpDom);
				this.chanNoArr.push(tmpDom);

				tmpDom = document.createElement("label");
				tmpDom.innerHTML = this.defIpcName;
				row.appendChild(tmpDom);
				this.labelArr.push(tmpDom);

				if (i == this.curChanId)
				{
					this.dotBgArr[i - 1].className = "dotBg";
					this.chanNoArr[i - 1].className = "pcLabel curNoLabel";
					this.labelArr[i - 1].className = "pcLabel curNameLabel";
				}
				else if (i > this.validLen)
				{
					this.dotBgArr[i - 1].className = "invalidCbox";
					this.chanNoArr[i - 1].className = "pcLabel invalidNoLabel";
					this.labelArr[i - 1].className = "pcLabel invalidNameLabel";
				}
				else
				{
					$(this.dotBgArr[i - 1]).addClass("displayNone");
					this.chanNoArr[i - 1].className = "pcLabel validNoLabel";
					this.labelArr[i - 1].className = "pcLabel validNameLabel";
				}

				if (i <= (this.maxChannel >> 1))
				{
					leftUl.appendChild(row);
					leftH += 40;
				}
				else
				{
					rightUl.appendChild(row);
					rightH += 40;
				}
			}
			totalH = leftH > rightH ? leftH : rightH;
			this.pcDetailDiv.style.height = totalH + "px";

			initCheckInput("channelCheck", this.selChannel);

			this.pcBtnDiv = document.createElement("div");
			this.pcBtnDiv.className = "pcBtnDiv";
			this.planCpyCon.appendChild(this.pcBtnDiv);
			tmpDom = document.createElement("input");
			tmpDom.className = "subBtn btnA";
			tmpDom.id = "pcCancel";
			tmpDom.type = "button";
			tmpDom.value = btn.cancel;
			this.pcBtnDiv.appendChild(tmpDom);

			tmpDom = document.createElement("input");
			tmpDom.className = "subBtn btnA";
			tmpDom.id = "pcSave";
			tmpDom.type = "button";
			tmpDom.value = btn.ok;
			this.pcBtnDiv.appendChild(tmpDom);
		}

		PlanCpy.prototype._eventBind = function()
		{
			var objThis = this;
			id("pcCancel").onclick = function(event)
			{
				event = event ? event : window.event;
				stopProp(event);
				objThis._hidePC();
			};
			id("pcSave").onclick = function(event)
			{
				var res = 0;
				var tmp, i;
				event = event ? event : window.event;
				stopProp(event);

				for (i = 1; i <= objThis.maxChannel; i++)
				{
					tmp = objThis.chanCheckArr[i - 1];
					if (tmp != undefined && tmp.getAttribute("checked") == "true")
					{
						res |= (1 << i);
					}
				}
				if (objThis.okCbk)
				{
					objThis.okCbk(res);
				}
				objThis._hidePC();
			};

			this.planCpyCon.onclick = function(event)
			{
				event = event ? event : window.event;
				stopProp(event);
			};

			attachEvnt(document.body, "click", function(){
				//objThis._hidePC();
			});
		}

		PlanCpy.prototype.applyOptions = function(opt){
			/*opt:{
			 cameraInfo:camera,
			 curChanId:1,
			 okCbk:okCbk
			 }*/
			pcObj = this;
			if (opt == undefined)
			{
				return;
			}
			var i, curIpcInfo, curSecName, curIpcName, chanNum, item;
			var cameraInfo = opt["cameraInfo"];
			this.cpyOptions(opt);
			if (cameraInfo == undefined)
			{
				return;
			}
			this.validLen = cameraInfo.length;
			changeCheckInput("pcSelAll", "false");
			for (i = 0; i < this.chanCheckArr.length; i++)
			{
				changeCheckInput(this.chanCheckArr[i], "false");
			}

			for (i = 1; i <= this.maxChannel; i++)
			{
				$(this.dotBgArr[i - 1]).removeClass("displayNone");
				$(this.dotBgArr[i - 1]).addClass("invalidCbox");
				this.chanCheckArr[i - 1].style.display = "none";

				this.chanNoArr[i - 1].className = "pcLabel invalidNoLabel";
				this.labelArr[i - 1].className = "pcLabel invalidNameLabel";
				this.labelArr[i - 1].innerHTML = this.defIpcName;
			}

			pcObj.validChanList = {};
			for (i = 0; i < cameraInfo.length; i++)
			{
				item = cameraInfo[i];
				chanNum = parseInt(item[SEC_NAME].match(/\d+/), 10);
				if (item["name"] != undefined)
				{
					this.labelArr[chanNum - 1].innerHTML = htmlEscape(getStrInMax(item["name"], 10));
				}
				pcObj.validChanList[chanNum] = chanNum;

				if (chanNum == this.curChanId)
				{
					$(this.dotBgArr[chanNum - 1]).removeClass("displayNone");
					$(this.dotBgArr[chanNum - 1]).removeClass("invalidCbox");
					$(this.dotBgArr[chanNum - 1]).addClass("dotBg");
					this.chanCheckArr[chanNum - 1].style.display = "none";

					this.chanNoArr[chanNum - 1].className = "pcLabel curNoLabel";
					this.labelArr[chanNum - 1].className = "pcLabel curNameLabel";
				}
				else
				{
					$(this.dotBgArr[chanNum - 1]).addClass("displayNone");
					this.chanCheckArr[chanNum - 1].style.display = "inline-block";

					this.chanNoArr[chanNum - 1].className = "pcLabel validNoLabel";
					this.labelArr[chanNum - 1].className = "pcLabel validNameLabel";
				}
			}
		}

		PlanCpy.prototype.scrollInit = function()
		{
			listScroll = new NiceScroll(this.pcDetailDivId);
			listScroll.scrollTipOpacity(1);
			listScroll.scrollTipSet({background:this.scrollBg});
			listScroll.scrollBarSet({zIndex:this.scrollZIndex, mLeft:this.scrollMLeft, mTop:this.scrollMTop});
			listScroll.init();
		}

		PlanCpy.prototype.selAllCbk = function(checked, value){
			for (var i = 1; i <= pcObj.maxChannel; i++)
			{
				if (pcObj.validChanList[i] != undefined)
				{
					changeCheckInput(pcObj.chanCheckArr[i - 1], checked);
				}
				else
				{
					changeCheckInput(pcObj.chanCheckArr[i - 1], "false");
				}
			}
		}

		PlanCpy.prototype.selChannel = function(checked, value){
			if (checked == false)
			{
				changeCheckInput(id("pcSelAll"), "false");
			}
			else
			{
				var selFlag = true;
				var tmp;
				for (var prop in pcObj.validChanList)
				{
					tmp = pcObj.chanCheckArr[parseInt(pcObj.validChanList[prop], 10) - 1];
					if (prop != pcObj.curChanId && tmp != undefined && tmp.getAttribute("checked") == "false")
					{
						selFlag = false;
						break;
					}
				}
				if (selFlag)
				{
					changeCheckInput(id("pcSelAll"), "true");
				}
			}
		}

		PlanCpy.prototype.cpyOptions = function(opt){
			for (var propty in opt)
			{
				if (typeof this[propty] != undefined)
				{
					this[propty] = opt[propty];
				}
			}
		}

		PlanCpy.prototype._hidePC = function(){
			$(this.planCpyCon).addClass("displayNone");
		}

		PlanCpy.prototype._showPc = function(opt){
			$(this.planCpyCon).removeClass("displayNone");
			if (opt != undefined)
			{
				this.applyOptions(opt);
			}
		}
	}
	this.init(options);
}

function createChart(chartStyle, chartInfo)
{
	var chart =
	{
		/*用于配置图表的必选参数*/
		canvasId:undefined,//绘制的图表所在的canvas的ID
		chartStyle : chartStyle,//当前选中的图表类型 barChart || lineChart
		xyData:[],//用于绘制图形的XY轴数据

		/*可选，假设在同一张图上绘制折线图和柱形图，则折线图的点对应于柱形图顶部中心点*/
		fontSize:0.017,//填充的字体大小和canvas整体长度的比例，包括XY轴数据，柱形图和折线图上的信息
		graphName:undefined,//图表标题
		xValuePosition:"center",//假设绘制柱形图，X轴数据需要和柱形中轴线还是右边对齐 right || center

		xyColor:"#606060",//XY轴的颜色
		lineColor:"#006ACC",//折线图线条的颜色
		barColorFill:"#006ACC",//柱形图填充的颜色
		barColorStroke:"#006ACC",//柱形图边框颜色
		dotColor:"#006ACC",//折线图中数据点的颜色
		xyDataColor:"#909090",//XY轴上数值以及文字信息的颜色
		dataColor:"#E1E1E1",//数据点上数值的颜色
		chartBackColor:"transparent",//图表背景颜色

		chartPaddingLeft:0.044,//图表左边距和图表总宽度的比例
		chartPaddingRight:0.022,//图表右边距和图表总宽度的比例
		chartPaddingTop:0.07,//图表上边距和图表总高度的比例
		chartPaddingBottom:0.101,//图表下边距和图表总高度的比例
		barWidth:0.8,//柱形宽度和相邻柱形间距的比例，默认为0.8
		leftDis:0.5,//最左端柱形离Y轴距离和相邻柱形之间的距离的比例，默认为0.5
		smallPaddingWithY:0,//用于微调柱形和Y轴之间的距离的像素值
		smallPaddingBetween:0,//用于微调柱形之间的距离的像素值

		init:function(chartInfo)
		{
			for (var prop in chartInfo)
			{
				if (undefined != chartInfo[prop])
				{
					this[prop] = chartInfo[prop];
				}
			}

			/*支持动态生成的canvas*/
			var browser = navigator.appName;

			if ("Microsoft Internet Explorer" == browser)
			{
				var b_version = navigator.appVersion;
				var version = b_version.split(";");
				var trim_Version = version[1].replace(/[ ]/g,"");

				if (("MSIE6.0" == trim_Version) || ("MSIE7.0" == trim_Version) || ("MSIE8.0" == trim_Version))
				{
					var els = document.getElementsByTagName('canvas');
				    for (var i = 0; i < els.length; i++)
				    {
				        if (this.canvasId == els[i].id)
				        {
				        	this.can = window.G_vmlCanvasManager.initElement(els[i]);
				        }
				    }
				}
				else
			    {
			    	this.can = document.getElementById(this.canvasId);
			    }
			}
		    else
		    {
		    	this.can = document.getElementById(this.canvasId);
		    }

		    this.can.style.display = "block";
		    this.canctx = this.can.getContext("2d");

		    /*比例转化为像素值*/
			this.chartPaddingLeft = parseInt(this.chartPaddingLeft * this.can.width);
			this.chartPaddingRight = parseInt(this.chartPaddingRight * this.can.width);
			this.chartPaddingTop = parseInt(this.chartPaddingTop * this.can.height);
			this.chartPaddingBottom = parseInt(this.chartPaddingBottom * this.can.height);
			this.fontSize = parseInt(this.fontSize * this.can.width);

		    /*设置用于调节fillText中文字位置的字体宽度和高度以及字体颜色*/
		    this.fontWidth = this.fontSize;
		    this.fontHeight = this.fontSize * 1.2;
		    this.canctx.font = this.fontSize + "px 微软雅黑";

		    /*清除原有画布内容*/
			this.canctx.clearRect(0, 0, this.can.width, this.can.height);

			this.drawGraph(this.xyData, this.chartStyle, this.chartPaddingLeft, this.chartPaddingRight, this.chartPaddingTop, this.chartPaddingBottom, this.barWidth, this.leftDis, this.xValuePosition, this.can);
		},

		/*绘制XY轴以及坐标轴上的数值、图表的标题、图表的背景*/
		drawGraph:function(data, chartStyle, paddingLeft, paddingRight, paddingTop, paddingBottom, barWidth, leftDis, xValuePosition, can)
		{
			/*获取绘图需要的数据*/
			var perwidth = this.getXWidth(data, can.width, paddingLeft, paddingRight, barWidth, leftDis);//x 轴上两个数据点之间距离
			var floatExist = this.checkFloatExist(data);//搜索data中value值中是否有小数
			var yEmptyHeight = parseInt(0.07 * can.height);//用于放置Y轴备注信息的位置高度
			var yInfo = this.getYInfo(this.getMax(data), can.height, paddingBottom, paddingTop, yEmptyHeight, floatExist);
			var maxY = yInfo.maxY;//图表中Y轴所能表示的最大值
			var perY = yInfo.perY;//Y轴上每maxY所表示的像素值
			var tenTimes = yInfo.tenTimes;//Y轴显示的数据需要乘以十的倍数

			/*修改图表背景颜色*/
			if ("transparent" != this.chartBackColor)
			{
				can.style.background = this.chartBackColor;
			}

			this.drawCoordinate(data, paddingLeft, paddingRight, paddingTop, paddingBottom, barWidth, leftDis, xValuePosition, can, tenTimes, perwidth, yEmptyHeight, maxY, perY);

			/*绘制标题*/
			if (undefined != chartInfo["graphName"])
			{
				this.drawGraphName(perY, can, paddingTop, paddingLeft, paddingRight);
			}

			/*绘制柱形或折线*/
			if ("lineChart" == chartStyle)
			{
				this.drawLine(data, paddingLeft, paddingBottom, perwidth, perY, barWidth, leftDis, tenTimes);
			}
			else if ("barChart" == chartStyle)
			{
				this.drawBar(data, paddingLeft, paddingBottom, perwidth, perY, barWidth, leftDis, tenTimes);
			}
		},

		drawCoordinate:function(data, paddingLeft, paddingRight, paddingTop, paddingBottom, barWidth, leftDis, xValuePosition, can, tenTimes, perwidth, yEmptyHeight, maxY, perY)
		{
			var moveDis = 0;//根据不同的xValuePosition设置的文字偏移距离

			/*绘制XY轴*/
			this.canctx.beginPath();
			this.canctx.lineWidth = "1";
			this.canctx.strokeStyle = this.xyColor;
			this.canctx.moveTo(paddingLeft, paddingTop);
			this.canctx.lineTo(paddingLeft, can.height - paddingBottom);
			this.canctx.lineTo(can.width - paddingRight, can.height - paddingBottom);
			this.canctx.stroke();
			this.canctx.closePath();

			this.canctx.beginPath();
			this.canctx.fillStyle= this.xyDataColor;

			/*绘制X轴上的数据*/
			if ("right" == xValuePosition)
			{
				moveDis = perwidth * barWidth / 2;
			}

			for (var i = 0; i < data.length; i++)
			{
				var nameValue = data[i].name;
				var dataLengthByNumber = this.getTotalLength((!isNaN(nameValue))?nameValue.toString():nameValue);

				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth) + moveDis - this.fontWidth / 4 * dataLengthByNumber;
				var y = can.height - paddingBottom + this.fontHeight;
				this.canctx.fillText(data[i].name, x, y);
			}

			/*绘制Y轴上的数字*/
			for (var i = 1; i <= 10; i ++)
			{
				var valueOfY = maxY * i / 10;
				var dataLengthByNumber = this.getTotalLength(valueOfY.toString());

				var x = paddingLeft - this.fontWidth / 2 * dataLengthByNumber - 10;
				var y = this.getCoordY(paddingBottom, perY, valueOfY) + this.fontHeight / 2;
				this.canctx.fillText(valueOfY, x, y);
			}

			/*绘制坐标轴左下角的0*/
			if (0 == moveDis)
			{
				var x = paddingLeft - this.fontWidth / 2 * 1.2 - 2;
				var y = this.getCoordY(paddingBottom, perY, 0) + this.fontHeight / 2;
			}
			else
			{
				var x = paddingLeft - this.fontWidth / 2;
				var y = can.height - paddingBottom + this.fontHeight;
			}
			this.canctx.fillText(0, x, y);

			/*绘制Y轴上方表示10的倍数的值*/
			if (1 != tenTimes)
			{
				var content = "( ×" + tenTimes + " )";
				var dataLengthByNumber = this.getTotalLength(content);
				var x = paddingLeft - dataLengthByNumber * (this.fontWidth / 2) / 2;
				var y = paddingTop - this.fontHeight / 4;
				//var y = paddingTop + parseInt(yEmptyHeight / 2) + parseInt(this.fontHeight / 2);
				this.canctx.fillText(content, x, y);
			}
		},

		drawGraphName:function(perY, can, paddingTop, paddingLeft, paddingRight)
		{
			/*绘制标题*/
			var dataLengthByNumber = this.getTotalLength(this.graphName);
			var x = (can.width - paddingLeft - paddingRight) / 2 + paddingLeft - (this.fontWidth / 2) * (dataLengthByNumber / 2);
			var y = paddingTop / 2 + this.fontHeight / 2;
			this.canctx.fillStyle= this.xyDataColor;

			this.canctx.fillText(this.graphName, x, y);
		},

		/*折线图：根据数据在坐标轴中添加点和线*/
		drawLine:function(data, paddingLeft, paddingBottom, perwidth, perY, barWidth, leftDis, tenTimes)
		{
			var x = this.getCoordX(paddingLeft, perwidth, 0, leftDis, barWidth);
			var y = this.getCoordY(paddingBottom, perY, data[0].value / tenTimes);

			this.canctx.lineWidth = "2";
			this.canctx.strokeStyle = this.lineColor;
			this.canctx.beginPath();
			this.canctx.moveTo(x, y);

			for (var i = 1; i < data.length; i++)
			{
				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth);
				var y = this.getCoordY(paddingBottom, perY, data[i].value / tenTimes);
				this.canctx.lineTo(x, y);
			}
			this.canctx.stroke();

			/*画折线上的点*/
			this.canctx.fillStyle = this.dotColor;

			for (var i = 0; i < data.length; i++)
			{
				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth);
				var y = this.getCoordY(paddingBottom, perY, data[i].value / tenTimes);

				this.canctx.beginPath();
				this.canctx.arc(x, y, 3, 0, Math.PI*2, true);
				this.canctx.fill();
			}

			/*填充每一点对应的值*/
			this.canctx.fillStyle= this.dataColor;

			for (var i = 0; i < data.length; i++)
			{
				var dataLengthByNumber = this.getTotalLength(data[i].value.toString());
				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth) - (this.fontWidth / 2) * (dataLengthByNumber / 2);
				var y = this.getCoordY(paddingBottom, perY, data[i].value / tenTimes);

				this.canctx.fillText(data[i].value, x, y - this.fontWidth / 2);
			}
		},

		/*柱形图：根据数据在坐标轴中添加框*/
		drawBar:function(data, paddingLeft, paddingBottom, perwidth, perY, barWidth, leftDis, tenTimes)
		{
			/*此处绘制柱形图
			先绘制柱形*/
			this.canctx.lineWidth = "2";
			this.canctx.fillStyle = this.barColorFill;

			/*先绘制第一个柱形*/
			var x = this.getCoordX(paddingLeft, perwidth, 0, leftDis, barWidth) - perwidth * barWidth / 2;
			var y = this.getCoordY(paddingBottom, perY, data[0].value / tenTimes);
			this.canctx.beginPath();
			this.canctx.rect(x + this.smallPaddingWithY, y, perwidth * barWidth - this.smallPaddingBetween - this.smallPaddingWithY, data[0].value / tenTimes * perY);
			this.canctx.fill();
			var smallPadding = 0;

			/*绘制第2到n个柱形*/
			for (var i = 1; i < data.length; i++)
			{
				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth) - perwidth * barWidth / 2;
				var y = this.getCoordY(paddingBottom, perY, data[i].value / tenTimes);

				this.canctx.beginPath();
				this.canctx.rect(x + this.smallPaddingBetween, y, perwidth * barWidth - 2 * this.smallPaddingBetween, data[i].value / tenTimes * perY);
				this.canctx.fill();
			}

			/*再绘制柱形上的数值*/
			this.canctx.fillStyle = this.dataColor;
			for (var i = 0; i < data.length; i++)
			{
				var dataLengthByNumber = this.getTotalLength(data[i].value.toString());
				var x = this.getCoordX(paddingLeft, perwidth, i, leftDis, barWidth) - (this.fontWidth / 2) * (dataLengthByNumber / 2);
				var y = this.getCoordY(paddingBottom, perY, data[i].value / tenTimes);

				this.canctx.fillText(data[i].value, x, y - this.fontWidth / 4);
			}
		},

		/*获取value值占据的总宽度(像素)相对于单个数字宽度(像素)的倍数*/
		getTotalLength:function(value)
		{
			var totalLength = 0;

			for (var i = 0; i < value.length; i++)
			{
				if (/[\u4E00-\u9FA5]/g.test(value[i]))
				{
					totalLength += 2;
				}
				else
				{
					totalLength += 1;
				}
			}

			return totalLength;
		},

		/*搜索data中value值中是否有小数*/
		checkFloatExist:function(data)
		{
			for (var i = 0; i < data.length; i++)
			{
				if (data[i].value != parseInt(data[i].value))
				{
					return 1;
				}
			}

			return 0;
		},

		/*x 轴每一个数据占据的宽度*/
		getXWidth:function(data, width, paddingLeft, paddingRight, barWidth, leftDis)
		{
			return ((width - paddingLeft - paddingRight) / (data.length + leftDis - (1 - barWidth) / 2));
		},

		/*根据pindex获取X轴上相邻两个坐标点之间的距离，表示柱形图中轴线或者折线图的点的横坐标*/
		getCoordX:function(paddingLeft, perwidth, ptindex, leftDis, barWidth)
		{
			return paddingLeft + perwidth * (leftDis + barWidth / 2 + ptindex);
		},

		/*根据y的值获取对应的坐标*/
		getCoordY:function(paddingBottom, perY, yValue)
		{
			return (this.can.height - paddingBottom - perY * yValue);
		},

		/*返回Y轴上数值能够显示的最大值和Y轴单位数值占有的像素值*/
		getYInfo:function(maxYNumber, height, paddingBottom, paddingTop, yEmptyHeight, floatExist)
		{
			var tenTimes = 1;
			var maxY = undefined;

			while (maxYNumber > 100)
			{
				tenTimes *= 10;
				maxYNumber /= 10;
			}

			if (10 >= maxYNumber)
			{
				maxY = 10;
			}
			else if (10 < maxYNumber)
			{
				maxY = (parseInt(maxYNumber / 10) + 1) * 10;
			}

			return {perY:(height - paddingBottom - paddingTop - yEmptyHeight) / maxY, maxY:maxY, tenTimes:tenTimes};
		},

		/*返回最大值*/
		getMax:function(data)
		{
			var maxYNumber = data[0].value;
			var length = data.length;
			for (var i = 1; i < length; i++)
			{
				if (maxYNumber < data[i].value)
				{
					maxYNumber = data[i].value;
				}
			}
			return maxYNumber;
		}
	};

	chart.init(chartInfo);
}

(function(){
	Phone.call(window);
	Tool.call(window);
	PageFunc.call(window);
	Cover.call(window);
	Explorer.call(window);
	LocalStorageSD.call(window);
	HighSet.call(window);
	Basic.call(window);
	ShowTips.call(window);
	Select.call(window);
	LanDetect.call(window);
	ProgressBar.call(window);
	Help.call(window);
	BlockGrid.call(window);
	TimeControlSet.call(window);
	Slp.call(window);
	ChsInput.call(window);
	timePicker.call(window);
	CloudUpgradePush.call(window);
	CloudCommon.call(window);
	CloudAction.call(window);
	TimeChannel.call(window);
})();

