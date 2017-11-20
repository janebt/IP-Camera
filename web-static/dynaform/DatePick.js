;!function(win){

//全局配置，如果采用默认均不需要改动
var config =  {
    path: '', //laydate所在路径
    defSkin: 'default', //初始化皮肤
    format: 'YYYY-MM-DD', //日期格式
    min: '2000-01-01 00:00:00', //最小日期
    max: '2037-12-31 23:59:59', //最大日期
    isv: false
};

var Dates = {}, doc = document, creat = 'createElement', byid = 'getElementById', tags = 'getElementsByTagName';
var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];


//主接口
win.laydate = function(options){
    options = options || {};
    try{
        as.event = win.event ? win.event : laydate.caller.arguments[0];
    } catch(e){};
    Dates.run(options);
    return laydate;
};

laydate.v = '1.1';

//获取组件存放路径
Dates.getPath = (function(){
    var js = document.scripts, jsPath = js[js.length - 1].src;
    return config.path ? config.path : jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
}());

Dates.use = function(lib, id){
    var link = doc[creat]('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = Dates.getPath + lib + as[5];
    id && (link.id = id);
    doc[tags]('head')[0].appendChild(link);
    link = null;
};

Dates.trim = function(str){
    str = str || '';
    return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
};

//补齐数位
Dates.digit = function(num){
    return num < 10 ? '0' + (num|0) : num;
};

Dates.stopmp = function(e){
    e = e || win.event;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    return this;
};

Dates.each = function(arr, fn){
    var i = 0, len = arr.length;
    for(; i < len; i++){
        if(fn(i, arr[i]) === false){
            break
        }
    }
};

Dates.hasClass = function(elem, cls){
    elem = elem || {};
    return new RegExp('\\b' + cls +'\\b').test(elem.className);
};

Dates.addClass = function(elem, cls){
    elem = elem || {};
    Dates.hasClass(elem, cls) || (elem.className += ' ' + cls);
    elem.className = Dates.trim(elem.className);
    return this;
};

Dates.removeClass = function(elem, cls) {
    elem = elem || {};
    if (Dates.hasClass(elem, cls)) {
        var reg = new RegExp('\\b' + cls +'\\b');
        elem.className = elem.className.replace(reg, '');
    }
    return this;
};

//清除css属性
Dates.removeCssAttr = function(elem, attr){
    var s = elem.style;
    if(s.removeProperty){
        s.removeProperty(attr);
    } else {
        s.removeAttribute(attr);
    }
};

//显示隐藏
Dates.shde = function(elem, type){
    elem.style.display = type ? 'none' : 'block';
};

//简易选择器
Dates.query = function(node){
    if(node && node.nodeType === 1){
        if(node.tagName.toLowerCase() !== 'input'){
            throw new Error('选择器elem错误');
        }
        return node;
    }

    var node = (Dates.trim(node)).split(' '), elemId = doc[byid](node[0].substr(1)), arr;
    if(!elemId){
        return;
    } else if(!node[1]){
        return elemId;
    } else if(/^\./.test(node[1])){
        var find, child = node[1].substr(1), exp = new RegExp('\\b' + child +'\\b');
        arr = []
        find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
        Dates.each(find, function(ii, that){
            exp.test(that.className) && arr.push(that); 
        });
        return arr[0] ? arr : '';
    } else {
        arr = elemId[tags](node[1]);
        return arr[0] ? elemId[tags](node[1]) : '';
    }
};

//事件监听器
Dates.on = function(elem, even, fn){
    elem.attachEvent ? elem.attachEvent('on'+ even, function(){
        fn.call(elem, win.even);
    }) : elem.addEventListener(even, fn, false);
    return Dates;
};

//阻断mouseup
Dates.stopMosup = function(evt, elem){
    if(evt !== 'mouseup'){
        Dates.on(elem, 'mouseup', function(ev){
            Dates.stopmp(ev);
        });
    }
};

Dates.run = function(options){
    var S = Dates.query, elem, devt, even = as.event, target;
    try {
        target = even.target || even.srcElement || {};
    } catch(e){
        target = {};
    }
    elem = options.elem ? S(options.elem) : target;
	try
	{
		elem.onkeydown = function(event){
			event = event || window.event;
			eventPreventDefault(event);
		};
		elem.onclick = function(){this.blur();};
	}
	catch(ex){}

    if(even && target.tagName){
        if(!elem || elem === Dates.elem){
            return;
        }
        Dates.stopMosup(even.type, elem);
        Dates.stopmp(even);
        Dates.view(elem, options);
        Dates.reshow();
    } else {
        devt = options.event || 'click';
        Dates.each((elem.length|0) > 0 ? elem : [elem], function(ii, that){
            Dates.stopMosup(devt, that);
            Dates.on(that, devt, function(ev){
                Dates.stopmp(ev);
                if(that !== Dates.elem){
                    Dates.view(that, options);
                    Dates.reshow();
                }
            });
        });
    }
};

Dates.scroll = function(type){
    type = type ? 'scrollLeft' : 'scrollTop';
    return doc.body[type] | doc.documentElement[type];
};

Dates.winarea = function(type){
    return document.documentElement[type ? 'clientWidth' : 'clientHeight']
};

//判断闰年
Dates.isleap = function(year){
    return (year%4 === 0 && year%100 !== 0) || year%400 === 0;
};

//检测是否在有效期
Dates.checkVoid = function(YY, MM, DD){
    var back = [];
    YY = YY|0;
    MM = MM|0;
    DD = DD|0;
    if(YY < Dates.mins[0]){
        back = ['y'];
    } else if(YY > Dates.maxs[0]){
        back = ['y', 1];
    } else if(YY >= Dates.mins[0] && YY <= Dates.maxs[0]){
        if(YY == Dates.mins[0]){
            if(MM < Dates.mins[1]){
                back = ['m'];
            } else if(MM == Dates.mins[1]){
                if(DD < Dates.mins[2]){
                    back = ['d'];
                }
            }
        }
        if(YY == Dates.maxs[0]){
            if(MM > Dates.maxs[1]){
                back = ['m', 1];
            } else if(MM == Dates.maxs[1]){
                if(DD > Dates.maxs[2]){
                    back = ['d', 1];
                }
            }
        }
    }
    return back;
};

//时分秒的有效检测
Dates.timeVoid = function(times, index){
    if(Dates.ymd[1]+1 == Dates.mins[1] && Dates.ymd[2] == Dates.mins[2]){
        if(index === 0 && (times < Dates.mins[3])){
            return 1;
        } else if(index === 1 && times < Dates.mins[4]){
            return 1;
        } else if(index === 2 && times < Dates.mins[5]){
            return 1;
        }
    } else if(Dates.ymd[1]+1 == Dates.maxs[1] && Dates.ymd[2] == Dates.maxs[2]){
        if(index === 0 && times > Dates.maxs[3]){
            return 1;
        } else if(index === 1 && times > Dates.maxs[4]){
            return 1;
        } else if(index === 2 && times > Dates.maxs[5]){
            return 1;
        }
    }
    if(times > (index ? 59 : 23)){
        return 1;
    }
};

//检测日期是否合法
Dates.check = function(){
    var reg = Dates.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g,'\\d+\\').replace(/\\$/g, '');
    var exp = new RegExp(reg), value = Dates.elem[as.elemv];
    var arr = value.match(/\d+/g) || [], isvoid = Dates.checkVoid(arr[0], arr[1], arr[2]);
    if(value.replace(/\s/g, '') !== ''){
        if(!exp.test(value)){
            Dates.elem[as.elemv] = '';
            //Dates.msg('日期不符合格式，请重新选择。');
            return 1;
        } else if(isvoid[0]){
            Dates.elem[as.elemv] = '';
            //Dates.msg('日期不在有效期内，请重新选择。');
            return 1;
        } else {
            isvoid.value = Dates.elem[as.elemv].match(exp).join();
            arr = isvoid.value.match(/\d+/g);
            if(arr[1] < 1){
                arr[1] = 1;
                isvoid.auto = 1;
            } else if(arr[1] > 12){
                arr[1] = 12;
                isvoid.auto = 1;
            } else if(arr[1].length < 2){
                isvoid.auto = 1;
            }
            if(arr[2] < 1){
                arr[2] = 1;
                isvoid.auto = 1;
            } else if(arr[2] > Dates.months[(arr[1]|0)-1]){
                /*2月最多29天*/
                if(2 == (arr[1]|0)){
                    arr[2] = 29;
                }
                else{
                    arr[2] = 31;
                }
                isvoid.auto = 1;
            } else if(arr[2].length < 2){
                isvoid.auto = 1;
            }
            if(arr.length > 3){
                if(Dates.timeVoid(arr[3], 0)){
                    isvoid.auto = 1;
                };
                if(Dates.timeVoid(arr[4], 1)){
                    isvoid.auto = 1;
                };
                if(Dates.timeVoid(arr[5], 2)){
                    isvoid.auto = 1;
                };
            }
            if(isvoid.auto){
                Dates.creation([arr[0], arr[1]|0, arr[2]|0], 1);
            } else if(isvoid.value !== Dates.elem[as.elemv]){
                Dates.elem[as.elemv] = isvoid.value;
            }
        }
    }
};

//生成日期
Dates.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Dates.viewDate = function(Y, M, D){
    var S = Dates.query, log = {}, De = new Date();
	var now = new Date();
	var nowYmd = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    Y < (Dates.mins[0]|0) && (Y = (Dates.mins[0]|0));
    Y > (Dates.maxs[0]|0) && (Y = (Dates.maxs[0]|0));
    
    De.setFullYear(Y, M, D);
    log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];
    
    Dates.months[1] = Dates.isleap(log.ymd[0]) ? 29 : 28;
    
    De.setFullYear(log.ymd[0], log.ymd[1], 1);
    log.FDay = De.getDay();
    
    log.PDay = Dates.months[M === 0 ? 11 : M - 1] - log.FDay + 1;
    log.NDay = 1;
    
    //渲染日
    Dates.each(as.tds, function(i, elem){
        var YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
        elem.className = '';
        if(i < log.FDay){
            elem.innerHTML = DD = i + log.PDay;
            Dates.addClass(elem, 'laydate_nothis');
            MM === 1 && (YY -= 1);
            MM = MM === 1 ? 12 : MM - 1; 
        } else if(i >= log.FDay && i < log.FDay + Dates.months[log.ymd[1]]){
            elem.innerHTML = DD = i  - log.FDay + 1;
            if(i - log.FDay + 1 === log.ymd[2]){
                Dates.addClass(elem, as[2]);
                log.thisDay = elem;
				Dates.appendSpan(elem);
            }
        } else {
            elem.innerHTML = DD = log.NDay++;
            Dates.addClass(elem, 'laydate_nothis');
            MM === 12 && (YY += 1);
            MM = MM === 12 ? 1 : MM + 1; 
        }

		if (undefined != Dates.options.videoDay)
		{
			for (var i = 0, len = Dates.options.videoDay.length; i < len; i++)
			{
				if (YY == Dates.options.videoDay[i].year &&
					MM == Dates.options.videoDay[i].month &&
					DD == Dates.options.videoDay[i].day)
				{
					Dates.addClass(elem, 'has_video');
				}
			}
		}

		if (undefined != Dates.options.sysTime)
		{
			if ((Dates.options.sysTime.getFullYear() == YY) &&
				((Dates.options.sysTime.getMonth() + 1) == MM) &&
				(Dates.options.sysTime.getDate() == DD))
			{
				Dates.addClass(elem, 'laydate_today');
			}
		}
		else
		{
			if ((nowYmd[0] == YY)&&(nowYmd[1] == MM)&&(nowYmd[2] == DD))
			{
				Dates.addClass(elem, 'laydate_today');
			}
		}
       
        if(Dates.checkVoid(YY, MM, DD)[0]){
            Dates.addClass(elem, as[1]);
        }

        elem.setAttribute('y', YY);
        elem.setAttribute('m', MM);
        elem.setAttribute('d', DD);
        YY = MM = DD = null;
    });
    
    Dates.valid = !Dates.hasClass(log.thisDay, as[1]);
    Dates.ymd = log.ymd;

    //锁定年月
	if (as.currentChooseType == 0)
	{
		as.chooseShow.innerHTML = Dates.ymd[0] + '年 ' + Dates.digit(Dates.ymd[1] + 1) + '月';
	}
	else if (as.currentChooseType == 1)
	{
		as.chooseShow.innerHTML = Dates.ymd[0] + '年 ';
	}
	else
	{
		as.chooseShow.innerHTML = (Dates.ymd[0] - 7) + ' - ' + ((Dates.ymd[0] + 4));
	}
    
    //定位月
    Dates.each(as.mms, function(i, elem){
        var getCheck = Dates.checkVoid(Dates.ymd[0], (elem.getAttribute('m')|0) + 1);
        if(getCheck[0] === 'y' || getCheck[0] === 'm'){
            Dates.addClass(elem.childNodes[0], as[1]);
        } else {
            Dates.removeClass(elem.childNodes[0], as[1]);
        }
        Dates.removeClass(elem.childNodes[0], as[2]);
        getCheck = null
    });
    Dates.addClass(as.mms[Dates.ymd[1]].childNodes[0], as[2]);
    
    //确定按钮状态
    Dates[Dates.valid ? 'removeClass' : 'addClass'](as.ok, as[1]);
};

//生成年列表
Dates.viewYears = function(YY){
    var S = Dates.query, str = '';
	var tmp;
    Dates.each(new Array(12), function(i){
        if(i === 7) {
			str += '<span class="chooseY" y="'+ YY +'">'+'<span class="'+ as[2] +'">'+ YY +'</span></span>';
        } else {
			tmp = (YY-7+i);
			if ((tmp<2000) || (tmp>2037))
			{
				str += '<span class="chooseY laydate_nothis" y="'+ tmp +'">'+'<span>'+ tmp +'</span></span>';
			}
			else
			{
				str += '<span class="chooseY" y="'+ tmp +'">'+'<span>'+ tmp +'</span></span>';
			}
        }
    }); 
    S('#laydate_ys').innerHTML = str;
    Dates.each(S('#laydate_ys .chooseY'), function(i, elem){
        if(Dates.checkVoid(elem.getAttribute('y'))[0] === 'y'){
            Dates.addClass(elem, as[1]);
        } else {
            Dates.on(elem, 'click', function(ev){
                Dates.stopmp(ev).reshow();
				document.getElementById("laydate_ys").style.top = "-9999px";
				as.currentChooseType = 1;
                Dates.viewDate(this.getAttribute('y')|0, Dates.ymd[1], Dates.ymd[2]);
				typeof Dates.options.preInitFun == "function" && Dates.options.preInitFun(this.getAttribute('y'));
            });
        }
    });
};

//初始化面板数据
Dates.initDate = function(chooseTime){
    var S = Dates.query, log = {};
    var ymd = Dates.elem[as.elemv].match(/\d+/g) || [];/* elem中的文本 */

	if (undefined == chooseTime)
	{
		chooseTime = new Date();
	}

    if(ymd.length < 3){
        ymd = Dates.options.start.match(/\d+/g) || [];
        if(ymd.length < 3){
            ymd = [chooseTime.getFullYear(), chooseTime.getMonth()+1, chooseTime.getDate()];
        }
    }
    Dates.inymd = ymd;
    Dates.viewDate(ymd[0], ymd[1]-1, ymd[2]);
};

//是否显示零件
Dates.iswrite = function(){
    var S = Dates.query, log = {};
};

//方位辨别
Dates.orien = function(obj, pos){
    var tops, rect = Dates.elem.getBoundingClientRect();
    obj.style.left = rect.left + (pos ? 0 : Dates.scroll(1)) + 'px';
	if (false == Dates.options.close)
	{
		obj.style.left = "";
	}
    if(rect.bottom + obj.offsetHeight/1.5 <= Dates.winarea()){
        tops = rect.bottom - 1;         
    } else {
        tops = rect.top > obj.offsetHeight/1.5 ? rect.top - obj.offsetHeight + 1 : Dates.winarea() - obj.offsetHeight;
    }
    obj.style.top = tops + (pos ? 0 : Dates.scroll()) + 5 + 'px';
};

//吸附定位
Dates.follow = function(obj){
    if(Dates.options.fixed){
        obj.style.position = 'fixed';
        Dates.orien(obj, 1);
    } else {
        obj.style.position = 'absolute';
        Dates.orien(obj);
    }
};

//生成表格
Dates.viewtb = (function(){
    var tr, view = [], weeks = [ '日', '一', '二', '三', '四', '五', '六'];
    var log = {}, table = doc[creat]('table'), thead = doc[creat]('thead');
    thead.appendChild(doc[creat]('tr'));
    log.creath = function(i){
        var th = doc[creat]('th');
        th.innerHTML = weeks[i];
        thead[tags]('tr')[0].appendChild(th);
        th = null;
    };
    
    Dates.each(new Array(6), function(i){
        view.push([]);
        tr = table.insertRow(0);
        Dates.each(new Array(7), function(j){
            view[i][j] = 0;
            i === 0 && log.creath(j);
            tr.insertCell(j);
        });
    });
    
    table.insertBefore(thead, table.children[0]); 
    table.id = table.className = 'laydate_table';
    tr = view = null;
    return table.outerHTML.toLowerCase();
}());

//渲染控件骨架
Dates.view = function(elem, options){
    var S = Dates.query, div, log = {};
    options = options || elem;

    Dates.elem = elem;
    Dates.options = options;
    Dates.options.format || (Dates.options.format = config.format);
    Dates.options.start = Dates.options.start || '';
    Dates.mm = log.mm = [Dates.options.min || config.min, Dates.options.max || config.max];
    Dates.mins = log.mm[0].match(/\d+/g);
    Dates.maxs = log.mm[1].match(/\d+/g);
    
    as.elemv = /textarea|input/.test(Dates.elem.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';
       
    if(!Dates.box){
        div = doc[creat]('div');
        div.id = as[0];
        div.className = as[0];
        div.style.cssText = 'position: absolute;';
        div.setAttribute('name', 'laydate-v'+ laydate.v);
        
        div.innerHTML =  log.html = '<div id="laydate_top" class="laydate_top">'
        +'<a class="laydate_tab laydate_chprev"></a>'
		+'<span id="laydate_ym" class="ym"></span>'
        +'<a class="laydate_tab laydate_chnext"></a>'
		 +'<div class="laydate_yms" id="laydate_ys"></div>'
		 +'<div class="laydate_yms" id="laydate_ms">'+ function(){
                var str = '';
                Dates.each(new Array(12), function(i){
                    str += '<span class="chooseM" m="'+ i +'">'+ '<span>'+Dates.digit(i+1) +'月</span></span>';
                });
                return str;
            }() +'</div>'
        +'</div>'
        
        + Dates.viewtb

        +'<div class="laydate_bottom">'
          +'<div class="laydate_time" id="laydate_time"></div>'
          +'<div class="laydate_btn">'
            +'<a id="laydate_ok">确定</a>'
          +'</div>'
        +'</div>';
        doc.body.appendChild(div);
        Dates.box = S('#'+as[0]);
        Dates.events();
        div = null;
    } else {
        Dates.shde(Dates.box);
    }
    Dates.follow(Dates.box);
    options.zIndex ? Dates.box.style.zIndex = options.zIndex : Dates.removeCssAttr(Dates.box, 'z-index');
    Dates.stopMosup('click', Dates.box);

    Dates.initDate(options.sysTime);
    Dates.iswrite();
    Dates.check();
};
win.hideBox = function(){
	if (undefined == Dates.box)
	{
		return;
	}
	Dates.shde(Dates.box, true);
};

//隐藏内部弹出元素
Dates.reshow = function(){
    Dates.each(Dates.query('#'+ as[0] +' .laydate_show'), function(i, elem){
        Dates.removeClass(elem, 'laydate_show');
    });
    return this;
};

//关闭控件
Dates.close = function(){
    Dates.reshow();
	as.currentChooseType = 0;
	if (false == Dates.options.close)
	{
		Dates.shde(Dates.query('#'+ as[0]), false);
		Dates.view(Dates.elem, Dates.options);
	}
    else
	{
		Dates.shde(Dates.query('#'+ as[0]), true);
    	Dates.elem = null;
	}

	//as.currentChooseType = 0;
	document.getElementById("laydate_ys").style.top = "-9999px";
	document.getElementById("laydate_ms").style.top = "-9999px";
};

//转换日期格式
Dates.parse = function(ymd, hms, format){
    ymd = ymd.concat(hms);
    format = format || (Dates.options ? Dates.options.format : config.format);
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index){
        ymd.index = ++ymd.index|0;
        return Dates.digit(ymd[ymd.index]);
    });     
};

//返回最终日期
Dates.creation = function(ymd, hide){
    var S = Dates.query;
    var getDates = Dates.parse(ymd);
    Dates.elem[as.elemv] = getDates;
    if(!hide){
        Dates.close();
        typeof Dates.options.choose === 'function' && Dates.options.choose(getDates); 
    }
};

Dates.appendSpan = function(tdObj){
	if (null != Dates.options.choose)
	{
		var span;

		$('#laydate_table td span.borderBlue').remove();

		span = document.createElement("span");
		span.className = "borderBlue";
		tdObj.appendChild(span);
	}
};

//事件
Dates.events = function(){
    var S = Dates.query, log = {
        box: '#'+as[0]
    };

    Dates.addClass(doc.body, 'laydate_body');

    as.tds = S('#laydate_table td');
    as.mms = S('#laydate_ms .chooseM');
	as.chooseShow = S('#laydate_ym');
	as.currentChooseType = 0;

    //显示更多年月
    Dates.each(S(log.box + ' .ym'), function(i, elem){
        Dates.on(elem, 'click', function(ev){
            Dates.stopmp(ev).reshow();
			switch (as.currentChooseType)
			{
			case 0:
				//显示月份
				document.getElementById("laydate_ms").style.top = "34px";
				as.currentChooseType = 1;
				break;
			case 1:
				log.YY = parseInt(as.chooseShow.innerHTML);
                Dates.viewYears(log.YY);
				document.getElementById("laydate_ys").style.top = "34px";
				as.currentChooseType = 2;
				break;
			default:
				return;
			}
			 //修正年月
			if (as.currentChooseType == 0)
			{
				as.chooseShow.innerHTML = Dates.ymd[0] + '年 ' + Dates.digit(Dates.ymd[1] + 1) + '月';
			}
			else if (as.currentChooseType == 1)
			{
				as.chooseShow.innerHTML = Dates.ymd[0] + '年 ';
			}
			else
			{
				as.chooseShow.innerHTML = (Dates.ymd[0] - 7) + ' - ' + ((Dates.ymd[0] + 4));
			}
        });
    });

    Dates.on(S(log.box), 'click', function(){
        Dates.reshow();
    });

	//切换年区间
	log.tabYearRange = function(type){
		var tmp = log.YY;
		if ((type==0) && (tmp-7 <= 2000))
		{
			return;
		}
		if ((type==1) && (tmp+4 >= 2037))
		{
			return;
		}

		if(type==0)
		{
			log.YY -= 12;
		}
		else
		{
			log.YY += 12;
		}
		as.chooseShow.innerHTML = (log.YY - 7) + ' - ' + ((log.YY + 4));
		Dates.viewYears(log.YY);
	};
	
    //切换年
    log.tabYear = function(type){  
        if(type === 0){
            Dates.ymd[0]--;
        } else if(type === 1) {
            Dates.ymd[0]++;
        } 
        if(type < 2){
            Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
            Dates.reshow();
        } else {
            Dates.viewYears(log.YY);
        }
    };
   /* Dates.each(S('#laydate_YY .laydate_tab'), function(i, elem){
        Dates.on(elem, 'click', function(ev){
            Dates.stopmp(ev);
            log.tabYear(i);
        });
    });
    */
    
    //切换月
    log.tabMonth = function(type){
		var tabYear = false, isInit = false;

        if(type){ /* + */
            Dates.ymd[1]++;
            if(Dates.ymd[1] === 12){
                Dates.ymd[0]++;
                Dates.ymd[1] = 0;
				tabYear = true;
            }            
        } else { /* - */
            Dates.ymd[1]--;
            if(Dates.ymd[1] === -1){
                Dates.ymd[0]--;
                Dates.ymd[1] = 11;
				tabYear = true;
            }
        }

		if (true == tabYear)
		{
			if (typeof Dates.options.preInitFun == "function")
			{
				Dates.options.preInitFun(Dates.ymd[0], function(){
					Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
				});
				isInit = true;
            }
        }

        if (Dates.months[Dates.ymd[1]] < Dates.ymd[2])
        {
            Dates.ymd[2] = Dates.months[Dates.ymd[1]];
        }

		if (isInit == false) {
        Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
		}
    };

    Dates.each(S('#laydate_top .laydate_tab'), function(i, elem){
        Dates.on(elem, 'click', function(ev){
            Dates.stopmp(ev).reshow();
			if (as.currentChooseType == 0)
			{
				log.tabMonth(i);
			}
			else if (as.currentChooseType == 1)
			{
				log.tabYear(i);
			}
			else
			{
				log.tabYearRange(i);
			}
        });
    });
	
	//点击时变换图标
	Dates.each(S('#laydate_top .laydate_tab'), function(i, elem){
        Dates.on(elem, 'mousedown', function(ev){
			if (i == 0)
			{
				setStyle(this, {"backgroundImage":"url(../web-static/images/lastPagePressed.png)"});
			}
			else
			{
				setStyle(this, {"backgroundImage":"url(../web-static/images/nextPagePressed.png)"});
			}
        });
    });
	
	Dates.each(S('#laydate_top .laydate_tab'), function(i, elem){
        Dates.on(elem, 'mouseup', function(ev){
			if (i == 0)
			{
				setStyle(this, {"backgroundImage":""});
			}
			else
			{
				setStyle(this, {"backgroundImage":""});
			}
        });
    });

    //选择月
    Dates.each(S('#laydate_ms .chooseM'), function(i, elem){
        Dates.on(elem, 'click', function(ev){
            Dates.stopmp(ev).reshow();
			document.getElementById("laydate_ms").style.top = "-9999px";
			as.currentChooseType = 0;
            if(!Dates.hasClass(this, as[1])){
                if (Dates.months[this.getAttribute('m')|0] < Dates.ymd[2])
                {
                    Dates.ymd[2] = Dates.months[this.getAttribute('m')|0];
                }
                Dates.viewDate(Dates.ymd[0], this.getAttribute('m')|0, Dates.ymd[2]);
            }
        });
    });

    //选择日
    Dates.each(S('#laydate_table td'), function(i, elem){
        Dates.on(elem, 'click', function(ev){
			if (undefined != Dates.options.tdDisabled && true == Dates.options.tdDisabled.clickDisabled)
			{
				return;
			}

            if(!Dates.hasClass(this, as[1])){
                Dates.stopmp(ev);
                Dates.creation([this.getAttribute('y')|0, this.getAttribute('m')|0, this.getAttribute('d')|0]);
            }
        });
    });

    //清空
    /*as.oclear = S('#laydate_clear');
    Dates.on(as.oclear, 'click', function(){
        Dates.elem[as.elemv] = '';
        Dates.close();
    });*/

    //今天
    /*as.otoday = S('#laydate_today');
    Dates.on(as.otoday, 'click', function(){
        var now = new Date();
        Dates.creation([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
    });*/

    //确定
    as.ok = S('#laydate_ok');
    Dates.on(as.ok, 'click', function(){
        if(Dates.valid){
            Dates.creation([Dates.ymd[0], Dates.ymd[1]+1, Dates.ymd[2]]);
        }
    });

    Dates.on(doc, 'mouseup', function(){
        var box = S('#'+as[0]);
        if(box && box.style.display !== 'none'){
            Dates.check() || Dates.close();
        }
    });
	/*.on(doc, 'keydown', function(event){
        event = event || win.event;
        var codes = event.keyCode;

        //如果在日期显示的时候按回车
        if(codes === 13 && Dates.elem){
            Dates.creation([Dates.ymd[0], Dates.ymd[1]+1, Dates.ymd[2]]);
        }
    });*/
};

Dates.init = (function(){
    /*Dates.use('need');
    Dates.use(as[4] + config.defSkin, as[3]);
    Dates.skinLink = Dates.query('#'+as[3]);*/
}());

//重置定位
laydate.reset = function(){
    (Dates.box && Dates.elem) && Dates.follow(Dates.box);
};

//返回指定日期
laydate.now = function(timestamp, format){
    var De = new Date((timestamp|0) ? function(tamp){
        return tamp < 86400000 ? (+new Date + tamp*86400000) : tamp;
    }(parseInt(timestamp)) : +new Date);
    return Dates.parse(
        [De.getFullYear(), De.getMonth()+1, De.getDate()],
        [De.getHours(), De.getMinutes(), De.getSeconds()],
        format
    );
};

//皮肤选择
laydate.skin = function(lib){
    Dates.skinLink.href = Dates.getPath + as[4] + lib + as[5];
};

}(window);
