function Checks()
{
	this.ipStr = "ip";
	this.maskStr = "mask";
	this.gatewayStr = "gateway";
	this.dnsStr = "dns";

	/* 检查IP地址类型是否合法（E类IP地址认定为非法） */
	this.validIpAddr = function(value, checkOption)
	{
		var ipByte = value.split(".");
		var result = true;

		for(var i = 1, len = ipByte.length; i < len; i++)
		{
			if (255 < ipByte[i])
			{
				return EINVIP;	// added by LiGuanghua
				result = false;
				break;
			}
		}

		/* 网段非法 */
		if (false == result || (0 == ipByte[0]) || 0xEF < ipByte[0])
		{
			return EINVNET;
		}

		/* 排除组播IP地址 */
		if ((undefined == checkOption || true != checkOption.unCheckMutiIp) && 0xE0 <= ipByte[0] && 0xEF >= ipByte[0])
		{
			return EINVGROUPIP;
		}
		
		/* 检测组播地址是否合法 */
		if (undefined != checkOption && checkOption.checkGroupIPRange == true && (0xE0 > ipByte[0] || 0xEF < ipByte[0] || (0xE0 == ipByte[0] && 0x00 == ipByte[1] && 0x00 == ipByte[2])))
		{
			return EINVGROUPIPRANGE;
		}

		/* 回环IP地址 */
		if ((undefined == checkOption || true != checkOption.unCheckLoopIp) && 127 == ipByte[0])
		{
			return EINVLOOPIP;
		}

		return ENONE;
	};

	/* 检查IP地址格式是否正确 */
	this.validIpFormat = function (value)
	{
		var result = /^([0-9]{1,3}\.){3}([0-9]{1,3})$/g.test(value);
		return (result == true ? ENONE : EINVIPFMT);
	};

	/* 检查IP是否合法 */
	this.checkIp = function(value, checkOption)
	{
		var result = ENONE;

		if (0 == value.length)
		{
			return EINVIP;
		}

		if (ENONE != (result = this.validIpFormat(value)))
		{
			return result;
		}

		if (ENONE != (result = this.validIpAddr(value, checkOption)))
		{
			return result;
		}

		return result;
	};

	/* 检查MAC地址范围是否合法 */
	this.validMacAddr = function(value)
	{
		var charSet = "0123456789abcdef";
		var macAddr = value.toLowerCase();

		if (macAddr == "00-00-00-00-00-00")
		{
			return EINVMACZERO;
		}

		if (macAddr == "ff-ff-ff-ff-ff-ff")
		{
			return EINVMACBROAD;
		}

		if (1 == charSet.indexOf(macAddr.charAt(1)) % 2)
		{
			return EINVMACGROUP;
		}

		return ENONE;
	};

	/* 检查MAC地址格式是否合法 */
	this.validMacFormat = function(value)
	{
		var macAddr = value.split("-");
		var result = /^([0-9a-f]{2}-){5}([0-9a-f]{2})+$/gi.test(value);

		return (result == true ? ENONE : EINVMACFMT);
	};

	/* 检查MAC地址是否正确 */
	this.checkMac = function(value)
	{
		var result = ENONE;

		if (ENONE != (result = this.validMacFormat(value)))
		{
			return result;
		}

		if (ENONE != (result = this.validMacAddr(value)))
		{
			return result;
		}

		return result;
	};

	/* 检查子网掩码是否正确 */
	this.checkMask = function(value)
	{
		var maskVal, maskTmp = 0x00000001;

		if (ENONE != this.validIpFormat(value))
		{
			return EINVMASK;
		}

		maskVal = this.transIp(value)

		for (var index = 0; index < 32; index++, maskTmp <<= 1)
		{
			if (0x00 != (maskTmp & maskVal))
			{
				if (0 == (maskVal ^ (0xFFFFFFFF << index)))
				{
					return ENONE;
				}

				return EINVMASK;
			}
		}

		return EINVMASK;
	};

	/* 检查MTU值是否在规定范围内 */
	this.checkMtu = function(value, max, min)
	{
		var result = ENONE;

		if (this.checkNum(value) == false)
		{
			return EINVMTU;
		}

		if (max == undefined)
		{
			max = 1500;
			min = 576;
		}

		if (false == this.checkNumRange(parseInt(value), max, min))
		{
			return EINVMTU;
		}

		return ENONE;
	};

	/* 使用掩码检查IP是否合法 */
	this.checkIpMask = function(ipValue, maskValue)
	{
		var maskVal = this.transIp(maskValue);
		var ipVal = this.transIp(ipValue);
		var result = this.checkIPNetHost(ipVal, maskVal);

		if (result != ENONE)
		{
			return result;
		}

		result = this.checkIpClass(ipValue, maskValue);

		/* 子网掩码比IP地址网络号小 */
		if (result != ENONE)
		{
			return result;
		}

		return ENONE;
	};
	
	/* 使用掩码检查网络是否合法, added by WuWeier */
	this.checkNetworkMask = function(netValue, maskValue)
	{
		var result = netValue == this.getNetwork(netValue, maskValue);
		return (result ? ENONE : EINVIPMASKPAIR);
	};
	
	/* 根据IP和掩码获取网络地址, added by WuWeier */
	this.getNetwork = function(ipValue, maskValue)
	{
		var ipByte = ipValue.split(".");
		var maskByte = maskValue.split(".");
		var netByte = new Array();
		
		for(var i = 0, len = ipByte.length; i < len; i++)
		{
			var temp = ipByte[i] & maskByte[i];
			netByte.push(temp);
		}
		
		return netByte.join(".");
	};
	
	/* 使用掩码判断两个IP是否处于同一网段, added by WuWeier */
	this.isSameNet = function(srcIpValue, srcMaskValue, dstIpValue)
	{
		var result = true;
		var srcNetValue = this.getNetwork(srcIpValue, srcMaskValue);
		var dstNetValue = this.getNetwork(dstIpValue, srcMaskValue);
		result = srcNetValue == dstNetValue;
		return result;
	};

	/* 将点分格式的IP转换为整数 */
	this.transIp = function(val)
	{
		var value = val.split(".");
		return (0x1000000 * value[0] + 0x10000 * value[1] + 0x100 * value[2] + 1 * value[3]);
	};

	/* 获取汉字的长度 */
	this.getCNStrLen = function(str)
	{
		return str.replace(/[^\x00-\xFF]/g, "xxx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};

	/* 获取IP类型：A、B、C、D、E */
	this.getIpClass = function(value)
	{
		var ipByte = value.split(".");
		if (ipByte[0] <= 127)
		{
			return 'A';
		}
		if (ipByte[0] <= 191)
		{
			return 'B';
		}
		if (ipByte[0] <= 223)
		{
			return 'C';
		}
		if (ipByte[0] <= 239)
		{
			return 'D';
		}
		return 'E';
	};

	/* 检查是否含有非数字的字符 */
	this.checkNum = function(value)
	{
		if (value.toString().length == 0)
		{
			return false;
		}

		/* 返回值为true表明是纯数字，false表明不是纯数字 */
		return (!(/\D/g.test(value.toString())));
	};

	/* 检测主机号和网络号是否全是0/1 */
	this.checkIPNetHost = function(ipVal, maskVal)
	{
		/* 网络号全0/1 */
		if (0x0 == (ipVal & maskVal) || maskVal == (ipVal & maskVal))
		{
			return EINVNETID;
		}

		/* 主机号全0/1(源地址/广播地址) */
		if (0x0 == (ipVal & (~maskVal)) || (~maskVal) == (ipVal & (~maskVal)))
		{
			return EINVHOSTID;
		}

		return ENONE;
	};

	/* 检查Ip类型是否合法 */
	this.checkIpClass = function(ipValue, maskValue)
	{
		var netId = this.getIpClass(ipValue);
		var ipVal = this.transIp(ipValue);
		var maskVal = this.transIp(maskValue);

		switch(netId)
		{
		case 'A':
			ipVal &= 0xFF000000;
			break;
		case 'B':
			ipVal &= 0xFFFF0000;
			break;
		case 'C':
			ipVal &= 0xFFFFFF00;
			break;
		}

		return (maskVal > ipVal ? ENONE : EINVIPMASKPAIR);
	};

	/* 检查输入的值是否在规定的范围内 */
	this.checkInputName = function(value, maxLen, minLen)
	{
		var len = this.getCNStrLen(value);

		if (minLen > len || maxLen < len)
		{
			return EOUTOFRANGE;
		}

		return ENONE;
	};

	/* 检查给出的值是否在指定的范围内 */
	this.checkNumRange = function(value, max, min)
	{
		if (isNaN(value) || value < min || value > max)
		{
			return false;
		}

		return true;
	};
	
	/* checkWepPasswd added by xiesimin */
	this.checkWepPasswd = function(value)
	{
		//密码只能是代表16进制数字的字符
		if (/[^\da-fA-F]/g.test(value))
		{
			return false;
		}
		
		var len = this.getCNStrLen(value);
		if ((len != 5) && (len != 10) && (len != 13) && (len != 26))
		{
			return false;
		}
		
		return true;
	};
	
	/* checkPskPasswd added by xiesimin */
	this.checkPskPasswd = function(value)
	{
		//密码只能包含字母、数字、下划线
		if (/\W/g.test(value))
		{
			return false;
		}
		
		//对最大最小长度进行限制
		var len = this.getCNStrLen(value);
		if ((len < 8) || (len > 64))
		{
			return false;
		}

		return true;
	};
	
	/* checkWifiPasswd added by xiesimin */
	this.checkWifiPasswd = function(value, mode)
	{
		switch(mode)
		{
			case "wep":
				return this.checkWepPasswd(value);
				break;
			case "psk":
				return this.checkPskPasswd(value);
				break;
			default :
				return false;
				break;
		}
	};
	
	/* checkWifiName added by xiesimin */
	this.checkWifiName = function(value, maxLen, minLen)
	{
		if (ENONE != this.checkInputName(value, maxLen, minLen))
		{
			return false;
		}
		
		return true;
	};

	/* 检查域名是否含有非法字符 */
	this.checkDomain = function(value)
	{
		if (/[^0-9a-z\-\.]/gi.test(value) == true)
		{
			return EINDOMAIN;
		}

		return ENONE;
	};

	/* 检查无线密码长度，如果长度符合，则检查是否有非法字符 */
	this.checkWlanPwd = function(wlanPwd)
	{
		var pwdLen = getCNStrLen(wlanPwd);

		/* 检查无线密码是否含有非法字符 */
		function checkIllegalChar(value)
		{
			var ch = "0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$^&*()-=_+[]{};:\'\"\\|/?.,<>/% ";
			var chr;

			for (var i = 0, len = value.length; i < len; i++)
			{
				chr = value.charAt(i);
				if (ch.indexOf(chr) == -1)
				{
					return false;
				}
			}

			return true;
		};

		if (0 == pwdLen)		/* 无线密码为空 */
		{
			return ENONE;
		}
		else if (false == checkIllegalChar(wlanPwd)) /* 检查密码是否有非法字符 */
		{			
			return EINVWLANPWD;
		}		
		else if (8 > pwdLen || 63 < pwdLen)	/* 密码位数小于8 或者是大于63位*/
		{
			return EINVPSKLEN;
		}

		return ENONE;
	};

	/* 检查文件路径是否合法 added by LiGuanghua */
	this.checkPath = function(value)
	{
		if (null == value || undefined === value || 0 == value.length)
		{
			return EINVPATHNULL;
		}

		return ENONE;
	};

	/* 检查邮箱格式 */
	this.checkPhoneNum = function(number)
	{
		return /^\d{11}$/.test(number);
	};

	/* 检查邮箱格式 */
	this.checkEmail = function(email)
	{
		var reg = /^[\x21-\x7e]+@[\w\d\-]+\./;
		if (!reg.test(email))
		{
			return false;
		}

		var tokens = email.split("@");
		if (tokens.length > 2)
		{
			return false;
		}

		var domain = tokens[1];
		if (domain.length > 255)
		{
			return false;
		}

		var domainTokens = domain.split(".");
		for (var i in domainTokens) 
		{
			if (!/^[a-zA-Z\d\-]{1,64}$/.test(domainTokens[i]))
			{
				return false;
			}
		}

		return true;
	};

	this.checkUsername = checkEmail;
}

(function(){
	Checks.call(window);
})();
