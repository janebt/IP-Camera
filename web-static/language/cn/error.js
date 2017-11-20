var ERR_CODE = "error_code";			/* 定义错误码名称 */
var ERR_PERCENT = -1;					/* 进度错误的定义 */
var ENONE = 0;							/* 没有错误 */

/* ---------------------------------- 系统通用错误 ----------------------------------- */
var ESYSTEM = -40101;					/* 系统错误。 */
var EEXPT = -40102;						/* 异常情况 */
var ENOMEMORY = -40103;					/* 内存不足 */
var EINVEVT = -40104;					/* 不支持的事件 */
var ECODE = -40105;						/* 不支持的操作类型； */
var EINVINSTRUCT = -40106;				/* 不支持的指令 */
var EFORBID = -40107;					/* 禁止的操作。 */
var ENOECHO = -40108;					/* 超时无响应。 */
var ESYSBUSY = -40109;					/* 系统繁忙。 */
var ENODEVICE = -40110;					/* 找不到设备。 */

/* ---------------------------------- 数据通用错误 ----------------------------------- */
var EOVERFLOW = -40201;					/* 数据溢出。 */
var ETOOLONG = -40202;					/* 数据过长。 */
var EENTRYEXIST = -40203;				/* 条目已存在。 */
var EREFERED = -40204;					/* 条目被关联了 */
var EENTRYNOTEXIST = -40205;			/* 条目不存在。 */
var EENTRYCONFLIC = -40206;				/* 条目冲突。 */
var ETABLEFULL = -40207;				/* 表满。 */
var ETABLEEMPTY = -40208;				/* 空表。 */
var EINVARG = -40209;					/* 参数错误 */
var EINVFMT = -40210;					/* 格式错误 */
var ELACKARG    = -40211;				/* 缺少必要参数 */

/* --------------------------------- 网络参数通用错误 --------------------------------- */
var EINVIP = -40301;					/* IP地址不正确。 */
var EINVGROUPIP = -40302;				/* 组播的IP地址 */
var EINVIPFMT = -40303;					/* IP地址格式错误 */
var EINVLOOPIP = -40304;				/* 回环的IP地址 */
var EINVMASK = -40305;					/* 掩码不正确。 */
var EINVGTW = -40306;					/* 网关不正确。 */
var EGTWUNREACH = -40307;				/* 网关不可达。 */
var ECOMFLICTNET = -40308;				/* 网段冲突*/
var EINVNET = -40309;					/* 非法的网段 */
var EINVMACFMT = -40310;				/* MAC地址格式不正确。 */
var EINVMACGROUP = -40311;				/* MAC地址为组播地址 */
var EINVMACZERO = -40312;				/* MAC地址全零 */
var EINVMACBROAD = -40313;				/* 广播地址的MAC地址 */
var EINVNETID = -40314;					/* 网络号全0或者1 */
var EINVHOSTID = -40315;				/* 主机号全0或者1 */
var EINDOMAIN = -40316;					/* 非法的域名 */
var EINVIPMASKPAIR = -40317;				/* IP和掩码不匹配 */
var EINVIPGWPAIR = -40318;				/* 网关与IP不匹配 */
var EINVGROUPIPRANGE = -40319;				/* 组播地址范围错误 */
var EDUPLICATEDIPANDPORT = -40320;			/* 主码流和子码流IP地址与端口均重复 */
var EIPCONFLICT = -40321;				/* IP冲突 */

/* --------------------------------- 认证通用错误 -------------------------------------- */
var EUNAUTH = -40401;					/* 认证失败。 */
var ECODEUNAUTH = -40402;				/* 验证码认证失败 */
var ESESSIONTIMEOUT = -40403;			/* session超时 */
var ESYSLOCKED = -40404;				/* 客户端被锁定。 */
var ESYSRESET = -40405;					/* 恢复出厂设置。 */
var ESYSCLIENTFULL = -40406;			/* 认证失败，超出支持的客户端数量 */
var ESYSCLIENTNORMAL = -40407;			/* 其它情况，一般是首次登录。 */
var ESYSLOCKEDFOREVER = -40408;			/* 系统被锁定 */

/* --------------------------------- 模块network错误 ------------------------------------ */
var EINVMTU = -50101;				/* MTU错误 */
var EINVFDNSVR = -50102;			/* 非法的首选DNS */
var EINVSDNSVR = -50103;			/* 非法的备选DNS */
var EDNSMODE = -50104;				/* DNS模式非法 */
var ENOLINK = -50105; 				/* WAN口未连接 */
var ENETMASKNOTMATCH = -50106;        		/* 网络号与掩码不匹配 */
var ENETLANSAME = -50107;             		/* 网络号处于LAN口IP网段 */
var ENETWANSAME = -50108;            		/* 网络号处于WAN口IP网段 */
var EWANSPEED = -50109;				/* WAN口速率非法 */
var EISPMODE = -50110;				/* ISP模式值非法 */
var EDIAGMODE = -50111;				/* 拨号模式值非法 */
var ECONNECTMODE = -50112;			/* 连接模式值非法 */
var ELANIPMODE = -50113;			/* LAN口IP模式值非法 */
var EHOSTNAME = -50114;				/* 主机名非法 */
var EPPPOEUSER = -50115;			/* 宽带帐号长度非法 */
var EPPPOEPWD = -50116;				/* 宽带密码长度非法 */
var EINVTIME = -50117;				/* 自动断线等待时间非法 */
var EPPPOEAC = -50118;				/* PPPoE服务名器名非法 */
var EPPPOESVR = -50119;				/* PPPoE服务名名非法 */
var EINVPTC = -50120;				/* 不支持的协议类型。 */
var EWANTYPE = -50121;				/* 不支持的WAN口接入类型。*/

/* --------------------------------- 模块wireless错误 ------------------------------------ */
var EWLANPWDBLANK = -50201;				/* 无线密码为空 */
var EINVSSIDLEN = -50202;				/* 无线SSID长度不合法 */
var EINVSECAUTH = -50203;				/* 无线安全设置的认证类型错误 */
var EINVWEPAUTH = -50204;				/* WEP认证类型错误 */
var EINVRADIUSAUTH = -50205;				/* RADIUS认证类型错误 */
var EINVPSKAUTH = -50206;				/* PSK认证类型错误 */
var EINVCIPHER = -50207;				/* 加密算法错误 */
var EINVRADIUSLEN = -50208;				/* radius密钥短语长度错误 */
var EINVPSKLEN = -50209;				/* psk密钥短语错误 */
var EINVGKUPINTVAL = -50210;				/* 组密钥更新周期错误 */
var EINVWEPKEYTYPE = -50211;				/* WEP密钥类型错误 */
var EINVWEPKEYIDX = -50212;				/* 默认WEP密钥索引错误 */
var EINVWEPKEYLEN = -50213;				/* WEP密钥长度错误 */
var EINVACLDESCLEN = -50214;				/* MAC地址过滤条目描述信息长度错误 */
var EINVWPSPINLEN = -50215;				/* WPS PIN码长度错误 */
var EINVAPMODE = -50216;				/* 无线设备工作模式错误 */
var EINVWLSMODE = -50217;				/* 无线速率模式(bgn)错误 */
var EINVREGIONIDX = -50218;				/* 无线国家码错误 */
var EINVCHANWIDTH = -50219;				/* 频段带宽错误 */
var EINVRTSTHRSHLD = -50220;				/* 无线RTS阈值错误 */
var EINVFRAGTHRSHLD = -50221;				/* 无线分片阈值错误 */
var EINVBCNINTVL = -50222;				/* 无线beacon间隔错误 */
var EINVTXPWR = -50223;					/* 无线Tx功率错误 */
var EINVDTIMINTVL = -50224;				/* 无线DTIM周期错误 */
var EINVWLANPWD = -50225;				/* 无线密码错误 */
var ESSIDBROAD = -50226;              			/* 广播配置错误 */
var EAPISOLATE = -50227;             			/* AP隔离配置错误 */
var EWIFISWITCH = -50228;             			/* 无线开启关闭配置错误 */
var EMODEBANDWIDTHNOTMATCH = -50229; 			/* 无线模式与带宽不匹配 */
var EINVCHANNEL2G = -50230;          			/* 2g信道不合法 */
var EINVCHANNEL5G = -50231;           			/* 5g信道不合法 */
var EPSKNOTHEX = -50232;         			/* 64位加密包含非十六进制字符 */
var EINVWDSAUTH = -50233;				/* 无线WDS认证类型错误 */
var EINVA34DETECT = -50234;				/* 3/4地址格式配置错误 */
var	EINVTURBO = -50235;					/* turbon on配置错误 */
var	EINVSECCHECK = -50236;				/* 防蹭网配置错误 */
var	EINVSSIDEMPTY = -50237;				/* SSID为空 */
var	EINVCHNAMODEBAND = -50238;			/* WDS开启时，信道、模式和带宽均不可配 */
var	EINVSSIDBLANK = -50239;				/* SSID全为空格 */

/* --------------------------------- 模块dhcp错误 ------------------------------------ */
var EINVLEASETIME = -50301;				/* 非法的地址租期。 */
var EINVSTARTADDRPOOL = -50302;				/* 地址池开始地址非法 */
var EINVENDADDRPOOL = -50303;				/* 地址池结束地址非法 */
var EDHCPDGTW = -50304;					/* 网关非法 */
var EGTWNOTLANSUBNET = -50305;				/* 网关不在LAN网段 */
var EDHCPDPRIDNS = -50306;				/* 首选DNS服务器地址非法 */
var EDHCPDSNDDNS = -50307;				/* 备用DNS服务器地址非法 */

/* --------------------------------- 模块firewall错误 -------------------------------- */
var EHOSTNAMEEMP = -50401;				/* 受控主机名为空 */
var EOBJNAMEEMP = -50402;				/* 访问目标名为空 */
var EPLANNAMEEMP = -50403;				/* 日程计划名为空 */
var ERULENAMEEMP = -50404;				/* 规则描述名为空 */
var EOBJDOMAINALLEMP = -50405;			/* 访问目标域名全为空 */
var EHOSTALLEMPTY = -50406;				/* 受控主机IP全为空 */
var EOBJALLEMPTY = -50407;				/* 访问目标IP和端口全为空 */
var ENOTLANSUBNET = -50408;				/* IP地址必须是LAN网段IP */
var ELANSUBNET = -50409;				/* IP地址不能为LAN网段IP */
var ELANIPCONFLIC = -50410;				/* IP地址不能为LAN口IP */
var EILLEGALPORT = -50411;				/* 端口值非法 */
var EPORTRESERVED = -50412;				/* 端口冲突*/
var EINVPORT = -50413;					/* 超出端口范围*/
var EINVPORTFMT = -50414;				/* 端口格式错误 */

/* --------------------------------- 模块nas错误 ------------------------------------ */
var EINVNASUSER = -50501;				/* 用户名非法 */
var EINVNASUSERLEN = -50502;				/* 用户名长度非法 */
var EINVNASPWD = -50503;				/* 密码非法 */
var EINVNASPWDLEN = -50504;				/* 密码长度非法 */
var EDELADMIN = -50505;					/* admin帐户不能删除 */
var EEDITADMIN = -50506;				/* admin帐户名不能修改 */
var EINVPATHNULL = -50507;				/* 文件夹路径为空 */
var EINVPATH = -50508;					/* 文件夹路径格式非法 */
var EINVPATHLEN = -50509;				/* 文件夹路径长度非法 */
var EPATHCONFLICT = -50510;				/* 文件夹路径冲突 */
var EPATHNOTEXIST = -50511				/* 文件夹路径不存在 */
var EACCESS = -50512					/* 账户无访问权限，可能由于账号不存在或账号密码不匹配 */
var ESERVERDOWN = -50513				/* NAS服务器IP不可达，或NAS服务不存在 */
var EEXPIRED = -50514					/* 请求的序列号过期，可能是由于多个用户同时操作探测 */
var EUNKNOWN = -50515					/* 未知错误 */

/* --------------------------------- 模块FTP错误 ------------------------------------ */
var EFTPNAMENULL = -51001;				/* FTP文件夹名称为空 */
var EFTPNAME = -51002;					/* FTP文件夹名称非法 */
var EFTPNAMELEN = -51003;				/* FTP文件夹名称长度非法 */
var EFTPNAMECONFLICT = -51004;				/* FTP文名称冲突 */

/* --------------------------------- 模块media_server错误 ---------------------------- */
var ESCANVAL = -50701;					/* added by LiGuanghua, 自动扫描时间非法 */
var EMSNAMENULL = -50702;				/* 媒体服务器共享名称为空 */
var EMSNAME = -50703;					/* 媒体服务器共享名称非法 */
var EMSNAMELEN = -50704;				/* 媒体服务器共享名称长度非法 */
var EMSNAMECONFLICT = -50705;				/* 媒体服务器共享名称冲突 */

/* --------------------------------- 模块ddns错误 ------------------------------------ */
var ENAMEBLANK = -50801;			/* 用户名输入为空 */
var EINVNAME = -50802;				/* 用户名非法 */
var EINVNAMELEN = -50803;			/* 用户名长度超出范围 */
var EDDNSPWDLEN = -50804;			/* 密码长度非法 */
var EDDNSPWD = -50805;				/* 密码还有非法字符 */
var EDDNSPWDBLANK = -50806;			/* 密码为空 */
var EINVDOMAINLENGTH = -51701;		/* 域名长度非法 */
var EINVFIRSTLASTRAIL = -51702; 	/* "-"不能在首尾 */
var EINVSUFFIX = -51703;			/* 非法顶级和一级域名 */
var EINVDOMAINBLANK = -51704;		/* 域名为空 */

var EINVACCOUNTIN = -22000;			/* 参数错误：如账号不合法 */
var EDOUDOMAIN = -22001;			/* 域名已被注册 */
var EOVERREGMAXDOMAIN = -22002;		/* 同一云账号注册域名数超过限制 */
var EOVERBINDMAXDOMAIN = -22003;	/* 同一设备绑定域名数超过限制 */
var EDOMAINBINDOTHER = -22004;		/* 域名已被绑定到其他设备 */
var ENOBINDDOMIAN = -22005;			/* 设备未绑定域名 */
var EINVSYSTEM = -22006;			/* 系统错误：如数据库操作失败 */
var ENORESDOMAIN = -22008;			/* 域名没有注册 */

/* --------------------------------- 模块system错误 ---------------------------------- */
var EINVDATE = -50901;					/* 日期输入错误 */
var EINVTIMEZONE = -50902;			    /* 时区输入错误 */
var EFWERRNONE = -50903;                /* 固件无错误，升级模块base code */
var EFWEXCEPTION = -50904;            /* 固件升级出现异常 */
var EFWRSAFAIL = -50905;              /* 固件RSA签名错误 */
var EFWHWIDNOTMATCH = -50906;         /* 固件不支持该类型硬件升级 */
var EFWZONECODENOTMATCH = -50907;     /* 固件区域码不匹配 */
var EFWVENDORIDNOTMATCH = -50908;     /* 固件品牌不匹配 */
var EFWNOTINFLANDBL = -50909;         /* 固件不在升级列表之内 */
var EFWNEWEST = -50910;               /* 固件内容与现有相同 */
var EFWNOTSUPPORTED = -50911;         /* 固件类型不支持升级 */
var EMD5 = -50914;						/* MD5校验失败 */
var EDESENCODE = -50915;				/* DES加密失败 */
var EDESDECODE = -50916;				/* DES解密失败 */
var ECHIPID = -50917;					/* 不支持的芯片类型； */
var EFLASHID = -50918;					/* 不支持的FLASH类型； */
var EPRODID = -50919;					/* 不支持的产品型号； */
var ELANGID = -50920;					/* 不支持的语言； */
var ESUBVER = -50921;					/* 不支持子版本号； */
var EOEMID = -50922;					/* 不支持的OEM类型； */
var ECOUNTRYID = -50923;				/* 不支持的国家； */
var EFILETOOBIG = -50924;      	    	/* 上传文件过大 */
var EPWDERROR = -50925;               	/* 登录密码错误 */
var EPWDBLANK = -50926;					/* 密码输入为空 */
var EINVPWDLEN = -50927;				/* 密码长度超出范围 */
var EINVKEY = -50928;					/* 旧密码错误 */
var EINVLGPWDLEN = -50929;				/* 登录密码长度不合法 */
var EINLGVALCHAR = -50930;				/* 登录密码含有非法字符 */
var EINLGVALOLDSAME = -50931;			/* 新登录密码和旧登录密码一样 */
var EHASINITPWD = -50932;              	/* 已设置过初始密码，不能重复设置 */
var ECHPWDDIF = -50933;              	/* 原密码和确认密码不一至 */


/* --------------------------------- 模块cloud错误 ------------------------------------- */
var EINVMAILFMT = -50201;       			/* 邮箱格式不正确 */
var EINVMAILLEN = -50202;        			/* 邮箱长度不正确 */
var EINVMAILPWDLEN = -50203;      			/* 邮箱密码长度不正确 */
var EINVCLIENTINTERNAL = -51204;			/* 云客户端内部错误 */
var EINVREQUESTIDNOTFOUND = -51205;			/* 请求字段中无ID */
var EINVMETHODNOTFOUND = -51206;			/* 请求方法不存在 */
var EINVPARAMETER = -51207;					/* 请求参数非法 */
var EINVGETDATAFAILED = -51208;				/* 获取数据失败 */
var EINVURLINVALID = -51209;				/* URL无效 */
var EINVPASSWORDFMT = -51210;				/* 无效密码 */
var EINVDOWNLOADFWFAILED = -51211;			/* 固件下载失败 */
var EINVUPGRADEFWFAILED = -51212;			/* 固件升级失败 */
var EINVCONFIGURATEFAILED = -51213;			/* 配置失败 */
var EINVPERMISSIONDENIED = -51214;			/* 权限不足 */
var EINVREQUESTTIMEOUT = -51215;			/* 请求超时 */
var EINVMEMORYOUT = -51216;					/* 存储空间不足 */
var EINVSENDREQMSGFAILED = -51217;			/* 发送请求失败 */
var EINVCONNECTTINGCLOUDSERVER = -51218;	/* 正在连接云路由服务器 */
var EINVLASTOPTIONISNOTFINISHED = -51219;	/* 上个动作执行中 */
var EINVCLOUDUSRCOUNTFORMAT = -51220;		/* 账户格式错误 */
var EINVVERICODEFORMAT = -51221;			/* 验证码格式错误 */
var EINVNEWPASSWORD = -51222;				/* 无效新密码 */
var EINVCLOUDACCOUNT = -51223;				/* 账户名错误 */
var EINDEVICEIDERROR = -51224;				/* 设备ID错误 */
var EINDEVICENOTBIND = -51225;				/* 未绑定TP-LINK云帐号，无法安装应用*/
var EINACCOUNTEMPTY = -51226;				/* 账号为空*/ 
var EINPASSWORDEMPTY = -51227;			 	/* 密码为空*/ 
var EINVERICODEEMPTY = -51228; 				/* 验证码为空*/ 
var EINVILLEGALDEVICE = -51229;				/* 非法设备 */ 
var EINDEVICEALREADYBOUND = -51230; 		/*设备已经被绑定*/
var EINDEVICEALREADYUNBOUND = -51231; 		/*设备已经被解除绑定*/

/* --------------------------------- cloud server 错误 ------------------------------------- */
var EINVCLOUDERRORGENERIC = -10000;						/* 未知的错误，通用的错误 */
var EINVCLOUDERRORPARSEJSON = -10100;					/* JSON 消息体格式错误 */
var EINVCLOUDERRORPARSEJSONNULL = -10101;				/* JSON 消息体为空 */
var EINVCLOUDERRORSERVERINTERNALERROR = -20000;			/* 服务器内部错误 */
var EINVERRORPERMISSIONDENIED = -20001;					/* 权限不够，需要登录才能访问 */
var EINVCLOUDERRORPERMISSIONDENIED = -20002;			/* 请求超时 */
var EINVCLOUDERRORPARSEJSONID = -20100;					/* JSON ID解析错误 */
var EINVCLOUDERRORMETHODNOTFOUND = -20103;				/* 请求指令未带方法或者方法未定义 */
var EINVCLOUDERRORPARAMSNOTFOUND = -20104;				/* 该方法内参数名不存在 */
var EINVCLOUDERRORPARAMSWRONGTYPE = -20105;				/* 该方法内参数类型与值不符 */
var EINVCLOUDERRORPARAMSWRONGRANGE = -20106;			/* 该方法内参数值超出范围 */
var EINVCLOUDERRORINVALIDPARAMS = -20107;				/* 非法参数 */
var EINVACCOUNTEMAILFMT = -20200;						/* 邮箱地址格式错误 */		/****/
var EINVACCOUNTPHONENUMFMT = -20201;					/* 手机号码格式错误 */		/****/
var EINVERRORDEVICEIDFORMATERROR = -20500;				/* Device ID格式错误 */
var EINVDEVICEIDNOTEXIST = -20501;						/* device ID 不存在 */		/****/
var EINVCLOUDERRORBINDDEVICEERROR =  -20502;			/* 绑定设备出错,发送未知错误 */
var EINVCLOUDERRORUNBINDDEVICEERROR = -20503;			/* 解除绑设备出错,发送未知错误*/
var EINVCLOUDERRORHWIDNOTFOUND = -20504;				/* 硬件ID不存在 */
var EINVNOTFOUNTNEWFW = -20505;							/* 未检测到新版软件 */		/****/
var EINVACCOUNTBINDED = -20506;							/* 该设备已经被绑定给其他账户 */		/****/
var EINVACCOUNTUNBINDED = -20507;						/* 该设备已经被APP端或者云端解除绑定（用于设备启动后的登录过程） */		/****/
var EINVCLOUDERRORDEVICEOFFLINE = -20571;				/* 设备离线 */
var EINVCLOUDERRORDEVICEALIASFORMATERROR = -20572;		/* 设备别名格式错误，包括长度不符合要求 */
var EINVACCOUNTNOTEXIST = -20600;						/* 云帐号不存在 */		/****/
var EINVACCOUNTPWDERR = -20601;							/* 账户名与密码不匹配，即密码错误 */		/****/
var EINVACCOUNTREGISTED = -20603;						/* 帐号已被注册 */		/****/
var EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR = -20604;	/* 账户名错误，既不是邮箱也不是手机号码 */
var EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL = -20606;	/* 发送激活邮件失败 */
var EINVACCOUNTRESETPWDCAPTCHAERR = -20607;				/* 找回云帐号密码的验证码验证失败 */		/****/
var EINVACCOUNTLENGTH = -20608;							/* 账号长度不符合要求 */		/****/
var EINVCLOUDERRORRESETMAILSENDFAIL = -20609;			/* 发送重设账户信息邮件失败 */
var EINVACCOUNTTYPEERR = -20610;						/* 云帐号类型错误 */		/****/
var EINVACCOUNTPWDFMT = -20615 ;						/* 密码格式错误 */		/****/
var EINVACCOUNTNEWPWDERR = -20616;						/* 新密码格式错误，包括长度不符合要求 */		/****/
var EINVCLOUDERRORTOKENEXPRIED = -20651;				/* Token过期 */
var EINVCLOUDERRORTOKENINCORRECT = -20652;				/* Token错误 */
var EINVACCOUNTLOCKED = -20661;							/* 云服务器锁定该TP-LINK ID 2小时 */		/****/
var EINVDEVICELOCKED = -20662;							/* 设备被锁定，24小时内不能再获取验证码 */		/****/
var EINVCLOUDERRORACCOUNTACTIVEFAIL = -20671;			/* 验证账户失败，发生未知错误 */
var EINVCLOUDERRORACCOUNTACTIVETIMEOUT = -20672;		/* 验证账户失败，验证链接失效 */
var EINVCLOUDERRORRESETPWDTIMEOUT = -20673;				/* 重设密码链接失效 */
var EINVCLOUDERRORRESETPWDFAIL = -20674;				/* 重设密码失败，发生未知错误 */
var EINVCLOUDERRORCAPTCHAINVAL = -20676;				/* 验证码验证三次失败，则验证码失效 */
var EINVCLOUDERRORFWIDNOTSUPPORTDEVICE = -20703;		/* Device ID与fwId不匹配 */

/* --------------------------------- 模块guest_network错误 ----------------------------- */
var EINVSPEEDCFG = -51301;				/* 最大上传速度或最大下载速度配置错误 */
var EINVTIMEOUTCFG = -51302;				/* 超时配置错误 */
var EINVLIMITTYPE = -51303;				/* 开放时间类型非法 */
var EINVMON = -51304;					/* 周期的开放时间，周一时间非法 */
var EINVTUE = -51305;					/* 周期的开放时间，周二时间非法 */
var EINVWED = -51306;					/* 周期的开放时间，周三时间非法 */
var EINVTHU = -51307;					/* 周期的开放时间，周四时间非法 */
var EINVFRI = -51308;					/* 周期的开放时间，周五时间非法 */
var EINVSAT = -51309;					/* 周期的开放时间，周六时间非法 */
var EINVSUN = -51310;					/* 周期的开放时间，周日时间非法 */
var EINVPERIODBLANK = -51311;    			/* 定时时间限制时间段描述为空 */
var EINVPERIODTOOLONG = -51312;    			/* 定时时间限制时间段描述太长 */
var EINVBEGINTIME = -51313;       			/* 定时时间限制开始时间非法 */
var EINVENDTIME = -51314;        			/* 定时时间限制结束时间非法 */
var EINVBEGINENDTIME = -51315;    			/* 定时时间限制开始时间不早于结束时间 */
var EINVREPEATBLANK = -51316;        			/* 定时时间限制重复周期为空 */

/* --------------------------------- 模块ip_mac_bind错误 -------------------------------- */
var ENOTLANWANNET = -51401;			/* 网段不是LAN或WAN */
var EBINDIPUSED = -51402;			/* 要绑定的IP已经被占用 */


/* --------------------------------- 模块hosts_info错误 ----------------------------- */
var ETIMEPERIODBLANK = -51501;      /* 上网时间限制时间段描述为空 */ 
var ETIMEPERIODTOOLONG = -51502;    /* 上网时间限制时间段描述太长 */ 
var EINVTLBEGINTIME = -51503;       /* 上网时间限制开始时间非法 */ 
var EINVTLEENDTIME = -51504;        /* 上网时间限制结束时间非法 */ 
var EINVTLBEGINENDTIME = -51505;    /* 上网时间限制开始时间不早于结束时间 */ 
var ETLREPEATBLANK = -51506;        /* 上网时间限制重复周期为空 */ 
var ELIMITTIMEREPEAT = -51507; 		/* 上网时间限制时间重复 */

/* ---------------------------------  IPC系统错误 ----------------------------- */
 var IPCUBUSCONNFAIL = -60101 			/* 连接ubusd失败*/
 var IPCUBUSCALLERR = -60102 			/* ubus调用出错 */
 var IPCFILEOPENERR = -60103 			/* 打开文件失败 */
 var IPCDIRMKERR = -60104 				/* 创建目录失败 */
 var IPCDATESETERR = -60105  			/* 手动设置日期出错 */
 var IPCFUNCPARAEXPT  = -60106 			/* 函数参数异常 */
 var IPCUCCONVERR = -60107 				/* uc_convert程序出错 */

/* --------------------------------- IPC通用数据错误 ----------------------------- */
var IPCFLTNFUNC = -60301;  			/* 没有注册过滤器 */
var IPCRECTERR = -60302;  			/* 矩形信息出错 */
var IPCDATAINVARG = -60303;		 	/* 直接返回不合法 */
var IPCSECNAMEERR = -60304;  		/* 添加section时，secname不合法 */
var IPCINTFPARAERR = -60305;  		/* 接口参数错误 */
var IPCENUMEXPT = -60311;  			/* 枚举类型，异常 */
var IPCENUMNINSET = -60312 ;  		/* 枚举类型，不在合法范围内 */
var IPCINTNOT = -60321;  			/* 整型：不是整数 */
var IPCINTNINRANGE = -60322;  		/* 整型：不在取值范围 */
var IPCINTGTMAX = -60323;  			/* 整型：数值大于最大值 */
var IPCINTGTMIN = -60324;  			/* 整型：数值小于最小值 */
var IPCSTRNOT = -60331;  			/* 字符串类型：不是字符串 */
var IPCSTRINV = -60332;  			/* 字符串类型：字符串非法，长度不对，或非法字符，或者格式不对 */
var IPCSTRLENINV = -60333;  		/* 字符串类型：长度非法，太长或者太短 */
var IPCSTRCHAINV = -60334;  		/* 字符串类型：存在非法字符 */

/* ---------------------------------  IPC登陆模块错误 ----------------------------- */
var IPCUMUSRBLANK		= -60501;	/* 登陆模块用户名输入为空 */
var IPCUMUSRNEXIST 		= -60502;	/* 用户名不存在 */
var IPCUMUSRNAUTH		= -60503;	/* 当前用户没有权限 */
var IPCUMGUESTGERR 		= -60504;	/* 获取普通管理员的信息失败 */
var IPCUMSECERR 		= -60505;	/* 用户管理模块section nam出错 */
var IPCUMOLDPWDERR 		= -60506;	/* 用户管理模块，旧密码出错。 */
var IPCUMGUESTNAUTH 	= -60507;	/* 用户组guest， 没有权限请求数据或者执行动作， permission denied */
var IPCUMUSRNAMEINV 	= -60508;	/* 用户名格式错误 */
var IPCUMUSREXIST		= -60509;	/* 用户名已经存在 */
var IPCUMUSRNAMELTM 	= -60510;	/* 用户名长度小于最小值 */
var IPCUMUSRNAMEGTM 	= -60511;	/* 用户名长度大于最大值 */
var IPCUMINFOERR 		= -60512;   /* 修改用户信息时，用户信息出错 */
var IPCUMTABFULL		= -60514;	/* 修改用户组别时，目标组别中用户条目数已达上限 */

/* ---------------------------------  IPC Image模块错误 ----------------------------- */
var IPCIMSWMERR = -60701;  		 /* switchmode错误 */
var IPCIMSCHERR = -60702;  		 /* 定时出错 */
var IPCIMFLPERR = -60703;  		 /* fliptype错误 */
var IPCIMRTTERR = -60704;  		 /* rotatetype错误 */
var IPCIMINFTERR = -60705; 		 /* inftype错误 */
var IPCIMINFDERR = -60706;  	 /* infdelay错误 */
var IPCIMINFSERR = -60707;  	 /* infsensitivity错误 */
var IPCIMLUMAERR = -60709; 		 /* luma错误 */
var IPCIMCNTRERR = -60710; 		 /* contrast错误 */
var IPCIMCHRERR = -60711;  		 /* chroma错误 */
var IPCIMSHRERR = -60712; 		 /* sharpness错误 */
var IPCIMSATERR = -60713; 		 /* saturation错误 */
var IPCIMEXPTERR = -60714;		 /* exptype错误 */
var IPCIMSHTERR = -60715; 		 /* shutter错误 */
var IPCIMEXPGERR = -60716;		 /* expgain错误 */
var IPCIMWDERR = -60717; 		 /* wide_dynamic错误 */
var IPCIMWDGERR = -60718;		 /* wdgain错误 */
var IPCIMWBTERR = -60719;		 /* wbtype错误 */
var IPCIMWBRERR = -60720;		 /* wbRgain错误 */
var IPCIMWBGERR = -60721;		 /* wbGgain错误 */
var IPCIMWBBERR = -60722; 		 /* wbBgain错误 */
var IPCIMWBSERR = -60723; 		 /* wbsource错误 */
var IPCIMAREACOMPENERR	= -60726;	/* 区域补偿错误 */

/* ---------------------------------  IPC cover模块错误 ----------------------------- */
var IPCCVNUMERR = -60901;  			/* cover矩形个数过多 */
var IPCCVENERR = -60902;  			/* enabled错误 */
var IPCCVSIZEERR = -60903;			/* cover区域过小 */

/* ---------------------------------  IPC ROI模块错误 ----------------------------- */
var IPCROINUMERR = -61101;  		/* ROI矩形个数过多 */
var IPCROIMAENERR = -61102;  		/* mainenabled错误 */
var IPCROIMIENERR = -61103;  		/* minorenabled错误 */
var IPCROIADDINVP = -61104;  		/* 添加矩形，参数不合法 */
var IPCROISIZEERR = -61105;		/* ROI区域过小 */
var IPCROITHDENERR = -61106;  		/* thirdenabled错误 */

/* ---------------------------------  IPC Motion Detection模块错误 ----------------------------- */
var IPCMDNUMERR = -61301; 			 /* motion detection矩形个数过多 */
var IPCMDENERR = -61302;  			 /* MD enabled错误 */
var IPCMDSENERR = -61303;  			 /* MD sensitity错误 */
var IPCMDAPPENERR = -61304; 		 /* MD appenabled错误 */
var IPCMDCLTENERR = -61305; 		 /* MD clientenabled错误 */
var IPCMDEMAILERR = -61306; 		 /* MD emailenabled错误 */
var IPCMDALARMERR = -61307; 		 /* MD alarmenabled错误 */
var IPCMDRECORDERR = -61308; 		 /* MD recordenabled错误 */
var IPCMDFTPERR = -61309; 		     /* MD ftpenabled错误 */

/* ---------------------------------  IPC Tamper Detection模块错误 ----------------------------- */
var IPCTDNUMERR = -61501;  			/* tamper detection矩形个数过多 */
var IPCTDENERR = -61502;  			/* enabled错误 */
var IPCTDSENERR = -61503;  			/* sensitivity错误 */
var IPCTDAPPENERR = -61504;  		/* appenabled错误 */
var IPCTDCLTENERR = -61505;  		/* clientenabled错误 */
var IPCTDEMAILERR = -61506;  		/* emailenabled错误 */
var IPCTDALARMERR = -61507;  		/* alarmenabled错误 */
var IPCTDFTPERR = -61508;  		    /* ftpabled错误 */

/* ---------------------------------  IPC Abnormalevents模块错误 ----------------------------- */
var IPCABENERR = -61701;  			/* enabled参数错误 */
var IPCABMAXERR = -61702;  			/* maxnumerr错误 */
var IPCABAPPENERR = -61703;  		/* appenabled错误 */
var IPCABCLTENERR = -61704;  		/* clientenabled错误 */
var IPCABEMAILENERR = -61705;       /* emailenable错误 */
var IPCABALARMENERR = -61706;       /* alarmenable错误 */

/* ---------------------------------  IPC Video模块错误 ----------------------------- */
var IPCVISTMTERR = -61901;		  /* streamtype错误 */
var IPCVIRESERR = -61902; 	 	  /* resolution错误 */
var IPCVIBRTERR = -61903;		  /* bitratetype错误 */
var IPCVIFRERR = -61904; 		  /* framerate错误 */
var IPCVIQUAERR = -61905; 		  /* quality错误 */
var IPCVIBRERR = -61906;  		  /* bitrate错误 */
var IPCVIMAPERR = -61907; 		  /* 映射到枚举类型出错 */
var IPCVIENCTERR = -61908; 		  /* encodetype错误 */

/* ---------------------------------  IPC OSD模块错误 ----------------------------- */
var IPCOSDDISPERR = -62101;  		 /* display错误 */
var IPCOSDSIZEERR = -62102;  		 /* size错误 */
var IPCOSDCOLTERR = -62103; 		 /* colortype错误 */
var IPCOSDCOLERR = -62104; 		 	 /* colortype错误 */
var IPCOSDENERR = -62105;  			 /* enabled错误 */
var IPCOSDCOORERR = -62106; 		 /* 坐标格式错误 */
var IPCOSDTEXTERR = -62107; 		 /* text错误 */
var IPCOSDCONTOOLERR = -62108;		/* iconv创建错误 */
var IPCOSDICONVERR = -62109;			/* iconv转换错误 */

/* ---------------------------------  IPC System模块错误 ----------------------------- */
var IPCSYSTMERR = -62301;  			/* timingmode错误 */
var IPCSYSRPARAERR = -62302;  		/* 恢复默认功能参数出错 */
var IPCSYSRCONFERR = -62303;  		/* 恢复默认功能配置文件出错 */
var IPCSYSNPORTERR = -62304;  		/* ntpport出错 */
var IPCSYSNSERVERERR = -62306;  	/* ntpserver出错 */

/* ---------------------------------  IPC Upnpc模块错误 ----------------------------- */
var IPCUPCENERR = -62501; 		  /* enabled错误 */
var IPCUPCMDERR = -62502; 		  /* mode错误 */
var IPCUPCPROERR = -62503;		  /* proto错误 */
var IPCUPCIPRTERR = -62504;		  /* innerport错误 */
var IPCUPCEPRTERR = -62505;		  /* extport错误 */
var IPCUPCDESCERR = -62506; 	  /* desc错误 */

/* ---------------------------------  IPC Firewall模块错误 ----------------------------- */
var IPCFWENERR = -62701; 		 /* enabled错误 */
var IPCFWFMDERR = -62702; 		 /* filtermode错误 */
var IPCFWIPERR = -62703;  		 /* IP地址出错 */
var IPCFWIPRERR = -62704; 		 /* IP地址范围出错 */
var IPCFWIPINVERR = -62705;	 /* IP地址重复 */

/* ---------------------------------  IPC 网络模块模块错误 ----------------------------- */
var IPCNETGDIPERR = -62901; 		  /* 读取dhcp IP出错 */
var IPCNETDIPFNEXI = -62902;		  /* 存储dhcp IP的文件不存在 */
var IPCNETADIPERR = -62903; 		  /* 配置dhcp IP出错 */
var IPCNETDCMDNEXI = -62904;		  /* 存放配置dhcp命令的文件不存在 */

/* ---------------------------------  IPC Deviceinfo模块错误 ----------------------------- */
var IPCDEVDNAMEERR = -63101;  		/* devicename出错 */
var IPCDEVDIDERR = -63102;  		/* deviceid出错 */
var IPCDEVDNAMELENERR = -63103;		/* devicename 长度出错 */

/* ---------------------------------  IPC Onvif模块错误 ----------------------------- */
var IPCONVMODEERR = -63301;  		/* mode出错 */
var IPCONVSCPERR = -63302;  		/* scope出错 */

/* ---------------------------------  IPC Image模块错误 ----------------------------- */
var IPCPRTUPORTERR = -63501;  		/* uhttpd port错误 */

/* ---------------------------------  IPC 系统日志模块错误 ----------------------------- */
var IPCSYSLOGPARAERR = -63701;  		/* 日志模块参数错误 */
var IPCSYSLOGTIMEERR = -63702;			/* 开始时间大于结束时间 */

/* --------------------------------  IPC Multicast模块 --------------------------*/
var IPC_MULT_EN_ERR	= -63801;	/* enabled错误 */
var IPC_MULT_ADDR_ERR	= -63802;	/* IP地址错误 */
var IPC_MULT_PORT_ERR	= -63803;	/* port错误 */
var IPC_MULT_RAND_ERR	= -63804;	/* 取随机地址端口错误 */
/* --------------------------------  IPC Audio模块 --------------------------*/
var IPCAUOPRERR  = -64201;	/* 不支持的操作 */
var IPCAUSRERR = -64202;		/* 不支持的采样率 */
var IPCAUCHNERR = -64203;	/* 不支持的通道数 */
var IPCAUCODERR = -64204;	/* 不支持的编码格式 */
var IPCAUDECERR = -64205;	/* 不支持的解码格式 */
var IPCAUVOLERR = -64206;	/* 不支持的音量值 */
var IPCAUDEVERR = -64207;	/* 不支持的输入设备 */
var IPCAUBRERR = -64208;		/* 不支持的不支持的码率 */
/* ---------------------------------  IPC 智能检测模块错误 ----------------------------- */
var IPCSMDENABLEERR      = -64901;    /* enabled错误 */
var IPCSMDSENSITIVITYERR = -64902;    /* sensitivity错误 */
var IPCSMDTHRESHOLDERR   = -64903;    /* threshold错误 */
var IPCSMDPERCENTAGEERR  = -64904;    /* percentage错误 */
var IPCSMDREGIONNUMERR   = -64905;    /* 布防区域个数错误 */
var IPCSMDREGIONEILLEGAL = -64906;    /* 布防区域参数错误 */
var IPCNOTIFYEMAILENERR   = -64907;    /* email_enabled错误 */
var IPCNOTIFYFTPENERR     = -64908;    /* ftp_enabled错误 */
var IPCNOTIFYALARMENERR   = -64909;    /* alarm_enabled错误 */
var IPCNOTIFYRECORDENERR  = -64910;    /* record_enabled错误 */
var IPCARMINGSCHEDULEEOVERFLOW       = -64911;    /* 布防时间超出范围[0000-2400] */
var IPCARMINGSCHEDULEMIX      = -64912;    /* 布防时间段交叉 */
var IPCARMINGSCHEDULEILLEGAL  = -64913;    /* 布防时间 开始时间大于结束时间 */
var IPCFACEDETECTIONEDYNEN           = -64914;    /* 人脸侦测dynamic_analysis错误 */
var IPCLINECROSSINGDIRERR            = -64915;    /* 越界方向错误{left,right,both} */
/* --------------------------------  IPC Ftp模块 --------------------------*/
var IPCFTPADDRERR = -65101;		/* 地址错误 */
var IPCFTPPORTERR = -65102;		/* 端口错误 */
var IPCFTPANOENERR = -65103;	/* 匿名使能错误 */
var IPCFTPUNAMEERR = -65104;	/* 用户名错误 */
var IPCFTPPAWDERR = -65105;		/* 密码错误 */
var IPCFTPDIRSTRCERR = -65106;	/* 目录结构错误 */
var IPCFTPDIRTYPEERR = -65107;	/* 目录类型错误 */
var IPCFTPCUSNAMEERR = -65108;	/* 自定义名称错误 */
var IPCFTPTESTERR = -65109;		/* 测试失败 */
var IPCFTPSERERR = -65110;		/* 连接测试服务器失败 */
var IPCFTPAUTHERR = -65111;		/* 用户名或密码错误 */
var IPCFTPCREAERR = -65112;		/* 创建目录失败 */
var IPCFTPWRITERR = -65113;		/* 没有写入权限 */

/* ----------------------------- IPC 邮箱模块 -----------------------------------------*/
var IPCEMAILSENAMEERR	= -65201;	/* 发件人名称错误 */
var IPCEMAILSEADDRERR	= -65202;	/* 发件人地址错误 */
var IPCEMAILSMSERVERR	= -65203;	/* SMTP服务器地址错误 */
var IPCEMAILSMPORTERR	= -65204;	/* SMTP服务器端口错误 */
var IPCEMAILENTYPEERR	= -65205;	/* 邮件加密方式错误 */
var IPCEMAILENSTLSERR	= -65206;	/* STARTTLS使能错误 */
var IPCEMAILSEAUTHERR	= -65207;	/* 服务器认证使能错误 */
var IPCEMAILACNAMEERR	= -65208;	/* 服务器用户名错误 */
var IPCEMAILACPAWDERR	= -65209;	/* 服务器密码错误 */
var IPCEMAILPIACCEERR	= -65210;	/* 图片附件使能错误 */
var IPCEMAILPIINTEERR	= -65211;	/* 抓图间隔错误 */
var IPCEMAILPINUMBERR	= -65212;	/* 抓图数量错误 */
var IPCEMAILRENAMEERR	= -65213;	/* 收件人名称错误 */
var IPCEMAILREADDRERR	= -65214;	/* 收件人地址错误 */
var IPCEMAILTESTERR	    = -65215;	/* 测试失败 */
var IPCEMAILSERERR		= -65216;	/* 连接测试服务器错误 */
var IPCEMAILAUTHERR	    = -65217;	/* 用户名或密码错误 */

/* --------------------------------  IPC 报警输入输出模块 --------------------------*/
var IPCALAINENERR = -65301;      /*输入使能错误*/
var IPCALAINALIASERR = -65302;   /*输入别名错误*/
var IPCALAINTYPEERR = -65303;   /*报警类型错误*/
var IPCALAOUTENERR = -65304;     /*输出使能错误*/
var IPCALAOUTALIASERR = -65305;  /*输出别名错误*/
var IPCALAOUTDURERR = -65306;    /*输出时长错误*/

/* --------------------------------  IPC 过线统计模块 --------------------------*/
var IPCODENABLEERR      = -66301    /* 使能错误 */
var IPCODOSDENABLEERR  = -66302    /* osd enabled错误 */
var IPCODREGIONDIRERR  = -66303    /* 方向错误 */
var IPCODREGIONNUMERR  = -66304    /* 布防区域个数错误 */
var IPCODREGIONEILLEGAL = -66305    /* 布防区域参数错误 */
var IPCODENTRYPARAERR  = -66311    /* 获取数据库中的过线计数列表参数错误 */

/*-------------- /IPC系统通用错误 -----------------*/
var EUBUSCONNECTFAIL = -70101;          //UBUS connect异常
var EUBUSCALLFAIL = -70102;          //UBUS call进程异常

/* --------------------------------- 回放模块错误------------------------------------- */
var EIDREACHLIMIT = -71101;			/* client数已满，目前最多4个客户端 */
var EIDOCCUPIED = -71102; 			/* client id已被占用 */
var EIDINVALID = -71103; 			/* client id非法 */
var ENOEVENTS = -71104; 			/* 当天没有事件，或者尚未搜索事件就点击播放 */
var ESEARCHFAILED = -71105; 		/* 搜索事件或获取日历失败 */
var EYEARNVALID = -71106; 			/* 获取日历时年份非法 */
var ETIMEINVALID = -71107; 			/* 搜索事件或播放的时间非法 */
var ECHNINVALID = -71108; 			/* 播放时channel非法 */
var ECHNEMPTY = -71109; 			/* 播放时没有选择任何channel */
var ECLIPLAYING = -71110; 			/* 正在播放时不允许搜索事件 */
var ECLINOTCONNECTED = -71111; 		/* client尚未建立socket连接，不能播放 */
var EARGSILLEGAL = -71112; 			/* 参数错误，如请求的json格式非法 */
var EOPENFILEFAILED = -71113; 		/* 用于保存事件列表的文件打开失败 */
var EUNKNOWN = -71114; 				/* 未知错误 */

/* ------------------ 未分类的错误码 ----------------------- */
var EINVCODE = 5;
var EINVTYPE = 43;					/* 非法的类型。 */
var EINVMODE = 44;					/* 非法的模式。 */
var EINVDATA = 48;					/* 数据合法性验证失败 */
var EINVNUM = 55;
var EINVSIZE = 56;
var EINVTIMEOUT = 57;
var EINVMETRIC = 58;
var EINVINTERVAL = 59;				/* 时间间隔输入错误 */
var EINVBOOL = 69;					/* 布尔类型的取值只能是0或者1 */
var EINVHOSTNAMELEN = 96;			/* hostname is null */
var EDELPARTIAL = 109;				/* 只删除了部分条目 */
var EDELNOTHING = 110;				/* 一个条目都没有删除 */
var ERSACHECK = 111;				/* RSA校验错误 */
var EOUTOFRANGE = 117;				/* 超出范围 */
var ELACKCFGINFO = 119;				/* 缺少必要的配置信息 */
var EINVRMTPORT = 121;				/* 远程管理端口超出范围 */
var ECFGSAVEFAIL = 1001;            /* added by xiesimin 配置存储失败 */
var ECFGAPPLYFAIL = 1002;           /* added by xiesimin 配置应用失败 */
var ESTRINGLEN = 1037;				/* added by LiGuanghua, 字符串长度非法 */

/* ------------------ 保存配置错误码 ----------------------- */
var ENOUCI      = 2000;             /* added by WuWeier, 没有指定UCI文件 */
var ENOSEC      = 2001;             /* added by WuWeier, 没有指定section */
var EREPEATSEC  = 2002;             /* added by WuWeier, 添加的section名称已存在 */

/* --------------------------------- 模块app错误 --------------------------------------- */
var EAPPNONE    = 2004;             /* added by WuWeier, 安装应用不存在 */
var EAPPHAS     = 2005;             /* added by WuWeier, 应用程序已安装 */ 
var EAPPNOT     = 2006;             /* added by WuWeier, 应用程序未安装 */
var EINSFAIL    = 2007;             /* added by WuWeier, 应用程序安装失败 */
var EUNINSFAIL  = 2008;             /* added by WuWeier, 应用程序卸载失败 */
