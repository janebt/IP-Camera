var uciOverLineDetection = {
	fileName:"overline_detection",
	secName:{
		det:"detection",
		defenceTime:"arming_schedule",
		region:"region"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addOlRegions:"add_regions",
		cleanOlNum:"overline_num_clean"
	},
	optName:{
		enabled:"enabled",
		osdEnabled:"osd_enabled",
		xCoor:"x_coor",
		yCoor:"y_coor",
		direct:"direction",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciAlarmOut = {
	fileName: "alarm_output",
	secName:
	{
		alarmOutDevInfo:"alarm_out_dev_info",
		alarmOutPrefix:"alarm_out_",
		planPrefix:"arming_schedule_"
	},
	optName:
	{
		alarmOutDevNum:"alarm_out_dev_num",
		alarmOutDevName:"alarm_out_dev_name",
		enabled:"enabled",
		alarmTime:"alarm_duration",
		alias:"alias",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciAlarmIn = {
	fileName: "alarm_input",
	secName:
	{
		alarmInDevInfo:"alarm_in_dev_info",
		alarmInPrefix:"alarm_in_",
		alarmInNotifListPrefix:"notify_list_",
		planPrefix:"arming_schedule_"
	},
	optName:
	{
		alarmInDevNum:"alarm_in_dev_num",
		alarmInDevName:"alarm_in_dev_name",
		enabled:"enabled",
		alarmType:"alarm_type",
		alias:"alias",
		ftpEnabled:"ftp_enabled",
		emailEnabled:"email_enabled",
		deviceEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

/*var uciAlarmIn = {
	fileName: "alarm_input",
	secName:
	{
		alarmIn1:"alarm_in_A1",
		alarmInNotifList1:"notify_list_A1",
		plan1:"arming_schedule_A1"
	},
	optName:
	{
		enabled:"enabled",
		devNum:"dev_num",
		alarmType:"alarm_type",
		alias:"alias",
		ftpEnabled:"ftp_enabled",
		emailEnabled:"email_enabled",
		deviceEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};*/

var uciOverLineEntry = {
	fileName: "overline_entry",
	secName: {
		ol:"overline"
	},
	actionName:
	{
		downloadEntry:   "download_entry",
		olEntryClean:     "olentry _clean",
		readEntry:       "read_entry"
	},
	optName: {
		startTime:"start_time",
		olType:"overline_type",
		listType:"list_type",
		Count:"count"
	}
};

/* imageSetting begin */
var uciImage = {
	fileName: "image",
	secName:
	{
		para_switch: "switch",
		common: "common",
		day: "day",
		night: "night"
	},
	optName:
	{
		switch_mode: "switch_mode",
		switchSchedule:"switch_schedule",
		flip_type:"flip_type",
		rotate_type:"rotate_type",
		luma: "luma",
		contrast: "contrast",
		saturation: "saturation",
		chroma:"chroma",
		sharpness:"sharpness",
		shutter:"shutter",
		exp_gain:"exp_gain",
		exp_type:"exp_type",
		infType:"inf_type",
		infSche:"inf_schedule",
		infSens:"inf_sensitivity",
		infDelay:"inf_delay",
		wb_type:"wb_type",
		wb_R_gain:"wb_R_gain",
		wb_G_gain:"wb_G_gain",
		wb_B_gain:"wb_B_gain",
		wide_dynamic:"wide_dynamic",
		wd_gain:"wd_gain",
		scheStartTime:"schedule_start_time",
		scheEndTime:"schedule_end_time",
		infStartTime:"inf_start_time",
		infEndTime:"inf_end_time",
		wb_R_gain_locked:"wb_R_gain_locked",
		wb_Gr_gain_locked:"wb_Gr_gain_locked",
		wb_Gb_gain_locked:"wb_Gr_gain_locked",
		wb_B_gain_locked:"wb_B_gain_locked",
		wb_source:"wb_source",
		area_com:"area_compensation"
	},
	optValue:
	{
		modCom:"common",
		modAuto:"auto_switch",
		modSche:"schedule_switch",
		flipLR:"left_and_right",
		flipUD:"up_and_down",
		flipCen:"center",
		flipOff:"off",
		rotAcw90:"anticlockwise_90",
		rotAcw180:"anticlockwise_180",
		rotAcw270:"clockwise_90",
		rotOff:"off",
		expAuto:"auto",
		expManual:"manual",
		infAuto:"auto",
		infSche:"schedule",
		infOn:"on",
		infOff:"off",
		infSenH:"high",
		infSenM:"medium",
		infSenL:"low",
		blOff:"off",
		blReg:"regions",
		blWD:"wide_dynamic",
		wdrOn:"on",
		wdrOff:"off",
		areaComClose:"default",
		areaComTop:"top",
		areaComBottom:"bottom",
		areaComCenter:"middle",
		areaComLeft:"left",
		areaComRight:"right",
		wbAuto:"auto",
		wbLck:"locked",
		wbDayLig:"day_light",
		wbNature:"nature",
		wbInc:"incandescent",
		wbWarm:"warm",
		wbManual:"manual",
		sensitivity:
		{
			customized:"-1",
			degree0:"0",
			degree1:"1",
			degree2:"2",
			degree3:"3",
			degree4:"4",
			degree5:"5",
			degree6:"6",
			degree7:"7"
		}
	}
};

var uciEmail = {
	fileName:"email",
	secType:{
		receiver_info:"receiver_info"
	},
	secName:{
		sender_info:"sender_info",
		server_info:"server_info",
		accessories_info:"accessories_info"
	},
	optName:{
		sender_address:"sender_address",
		sender_name:"sender_name",
		smtp_server:"smtp_server",
		smtp_port:"smtp_port",
		encrypt_type:"encrypt_type",
		enabled_starttls:"enabled_starttls",
		server_auth:"server_auth",
		account_name:"account_name",
		account_passwd:"account_passwd",
		picture_accessories:"picture_accessories",
		picture_interval:"picture_interval",
		picture_number:"picture_number",
		receiver_address:"receiver_address",
		receiver_name:"receiver_name"
	},
	actionName:{
		email_test:"email_test",
		get_test_status:"get_test_status"
	},
	optValue:{
		on: "on",
		off: "off"
	}
};

var uciPicturePlan = {
	fileName:"picture_plan",
	secName:{
		schedule:"schedule",
		timingConfig:"timing_config",
		eventConfig:"event_config",
		pictureConfig:"picture_config"
	},
	optName:{
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		enabled:"enabled",
		quality:"quality",
		codecType:"codec_type",
		captureInterval:"capture_interval",
		captureNumber:"capture_number",
		resolution:"resolution"
	},
	optValue:{
		on: "on",
		off: "off"
	}
};

var uciRecordPlan = {
	fileName: "record_plan",
	secType:{
		plan:"plan"
	},
	secName: {
		channel:"channel"
	},
	optName: {
		enabled: "enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue: {
		on: "on",
		off: "off"
	}
};

var uciPlanAdv = {
	fileName:"plan_advance",
	secName:
	{
		planAdv:"plan_advance"
	},
	optName:
	{
		preRecord:"pre_record",
		delayRecord:"delay_record",
		stream_type:"stream_type"
	},
	optValue:
	{
		main:"main",
		minor:"minor"
	}
};

var uciDiskManage = {
	fileName: "disk_manage",
	secName:
	{
		storage: "storage",
		video: "video",
		picture: "picture"
	},
	secType:
	{
		disk_info: "disk_info",
		disk: "disk"
	},
	actionName:{
		format_disk: "format_disk",
		get_format_status: "get_format_status",
		test_nas: "test_nas",
		get_test_status: "get_test_status"
	},
	optName:
	{
		loop:"loop",
		ratio:"ratio",
		type:"type",
		addr:"addr",
		path:"path",
		username:"username",
		password:"password",
		disk_id:"id",
		rw_attr:"rw_attr",
		free_space:"free_space",
		total_space:"total_space",
		video_free_space:"video_free_space",
		video_total_space:"video_total_space",
		picture_free_space:"picture_free_space",
		picture_total_space:"picture_total_space",
		status:"status",
		type:"type",
		seq_num:"seq_num",
		result:"result",
		percent:"percent"
	},
	optValue:
	{
		on:"on",
		off:"off",
		r:"r",
		rw:"rw",
		normal:"normal",
		abnormal:"abnormal",
		unformatted:"unformatted",
		none:"none",
		insufficient:"insufficient",
		formatting:"formatting",
		offline:"offline",
		abnormal:"abnormal",
		local:"local",
		remote:"remote",
		waiting:"waiting",
		success:"success",
		failed:"failed",
		nfs:"nfs",
		cifs:"cifs"
	}
};

var uciVideo = {
	fileName: "video",
	secName:
	{
		main: "main",
		minor: "minor",
		third: "third"
	},
	secType:
	{
		main: "main_res",
		minor: "minor_res",
		third: "third_res",
		stream: "stream",
		mainRes: "main_res",
		minorRes: "minor_res",
		thirdRes: "third_res"
	},
	optName:
	{
		stream_type:"stream_type",
		encode_type:"encode_type",
		resolution:"resolution",
		bitrate_type:"bitrate_type",
		frame_rate:"frame_rate",
		quality:"quality",
		bitrate:"bitrate",
		frLlimit:"fr_llimit",
		frUlimit:"fr_ulimit",
		quaLlimit:"quality_llimit",
		quaULimit:"quality_ulimit",
		brLlimit:"bitrate_llimit",
		brUlimit:"bitrate_ulimit"
	},
	optValue:
	{
		stGener:"general",
		stMotDet:"motion_detection",
		h264:"H264",
		h265:"H265",
		cbr:"cbr",
		vbr:"vbr",
		quaH:"5",
		quaM:"3",
		quaL:"1",
		reso320_240:"320*240",
		reso352_288:"352*288",
		reso640_480:"640*480",
		reso704_576:"704*576",
		reso1280_720:"1280*720",
		reso1280_960:"1280*960",
		reso1920_1080:"1920*1080",
		reso2048_1536:"2048*1536",
		reso2560_1440:"2560*1440",
		reso2592_1520:"2592*1520",
		reso2592_1944:"2592*1944",
		fr1:"0x00010001",
		fr10:"0x0001000a",
		fr15:"0x0001000f",
		fr20:"0x00010014",
		fr25:"0x00010019",
		minBT:"64",
		maxBT:"8192"
	}
};

var uciAudio = {
	fileName: "audio_config",
	secName:
	{
		speaker: "speaker",
		microphone: "microphone"
	},
	secType:
	{
		speakerInfo: "speaker_info",
		microphoneInfo: "microphone_info"
	},
	optName:
	{
		samplingRate:"sampling_rate",
		channels:"channels",
		encodeType:"encode_type",
		volume:"volume",
		mute:"mute",
		inputDeviceType:"input_device_type",
		noiseEliminate:"noise_cancelling",
		bitrate:"bitrate",
		echoCancelling:"echo_cancelling"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciProto =
{
	fileName:		"protocol",
	secType:
	{
		iface:		"interface",
		proto:		"proto"
	},
	secName:
	{
		wan:		"wan",
		dhcp:		"dhcp",
		sta:		"static",
		pppoe:		"pppoe"
	},
	optName:
	{
		type:		"wan_type",
		rate:		"wan_rate",
		proto:		"proto",
		ip:		"ipaddr",
		pppoeUsr:	"username",
		pppoePwd:	"password",
		netmask:	"netmask",
		gateway:	"gateway",
		dnsMode:	"dns_mode",
		priDns:		"pri_dns",
		sndDns:		"snd_dns",
		mtu:		"mtu",
		speed:		"wan_rate",
		dialMode:	"dial_mode",
		connMode:	"conn_mode",
		demand:		"demand_idle",
		manual:		"manual_idle",
		ipMode:		"ip_mode",
		ISPIp:		"specific_ip",
		connect:	"connect",
		hostName:	"hostname",
		acName:		"access",
		broadcast:	"broadcast",
		broadcast_en:	"enable_broadcast",
		svcName:	"server",
		facMac:		"fac_macaddr",
		macaddr:	"macaddr",
		facIp:		"fac_ipaddr",
		linkStatus:"link_status",
		phyStatus:"phy_status"
	},
	optValue:
	{
		proto:
		{
			none:"none",
			dynIp:"dhcp",
			staticIp:"static",
			pppoe:"pppoe"
		},
		wanSpeed:["auto", "10F", "10H", "100F", "100H", "1000F"],
		dnsMode:
		{
			dynamic:	"dynamic",
			manual:		"manual"
		},
		connMode:
		{
			auto:		"auto",
			demand:		"demand",
			manual:		"manually"
		},
		ispMode:
		{
			dhcp:		"dynamic",
			sta:		"static"
		},
		diagMode:
		{
			auto:		"auto",
			normal:		"normal",
			special1:	"special1",
			special2:	"special2",
			special3:	"special3",
			special4:	"special4",
			special5:	"special5",
			special6:	"special6",
			special7:	"special7"
		}
	}
};

var uciCover = {
	fileName: "cover",
	secName:
	{
		cover: "cover"
	},
	secType:{
		coverInfo:"cover_info",
		regionInfo:"region_info"
	},
	optName:
	{
		enabled:"enabled",
		xCoor:"x_coor",
		yCoor:"y_coor",
		width:"width",
		height:"height"
	},
	optValue:
	{
		enableVal:{
			on:"on",
			off:"off"
		}
	},
	actionName:{
		addCoverReg:"add_cover_regions"
	}
};

var uciRoi = {
	fileName:"ROI",
	secType:
	{
		onOff:"on_off",
		mainRoi:"main_roi",
		minorRoi:"minor_roi",
		thirdRoi:"third_roi"
	},
	secName:
	{
		roi_enable:"roi_enable",
		main_r1:"main_roi_1",
		minor_r1:"minor_roi_1",
		third_r1:"third_roi_1"
	},
	optName:
	{
		main_enabled:"main_enabled",
		minor_enabled:"minor_enabled",
		third_enabled:"third_enabled",
		level:"level",
		rect_info:"rect_info",
		xCoor:"x_coor",
		yCoor:"y_coor",
		width:"width",
		height:"height"
	},
	optValue:
	{
		roiOn:"on",
		roiOff:"off",
		lev1:1,
		lev2:2,
		lev3:3,
		lev4:4,
		lev5:5,
		lev6:6
	},
	actionName:
	{
		addRoi:"add_ROI_regions"
	}
};

var uciSystem = {
	fileName:"system",
	secName:{
		basic:"basic",
		clockStatus:"clock_status",
		ntp:"ntp",
		sys:"sys"
	},
	secType:{
		syslog:"syslog"
	},
	optName:{
		timingMode:"timing_mode",
		seconds:"seconds_from_1970",
		server:"server",
		ntpPort:"ntp_port",
		setDate:"set_date",
		configName:"config_name",
		startTime:"start_time",
		endTime:"end_time",
		pageNum:"page_num",
		logsPerPage:"logs_per_page",
		type:"type",
		url:"url",
		total:"total",
		pluginUrl:"plugin_url",
		pluginVersion:"plugin_version",
		browserType:"browser_type",
		browserVersion:"browser_version",
		browserBits:"browser_bits",
		browserOS:"browser_os",
		osVersion:"os_version",
		exist:"exist",
		page:"page",
		userId:"user_id",
		devAlias:"dev_alias"
	},
	optValue:{
		timeMode:{
			ntp:"ntp",
			manual:"manual"
		},
		types:{
			all:"all",
			alarm:"alarm",
			abnormal:"abnormal",
			op:"op",
			info:"info"
		}
	},
	actionName:
	{
		downloadConf:	"download_conf",
		uploadConf:		"upload_conf",
		firmUpgrade:	"firmware_upgrade",
		downloadLogs:	"download_logs",
		syslogClean:	"syslog_clean",
		getDomainArray:	"get_domain_array",
		configReset: 	"config_recovery",
		getPluginUrl:	"get_plugin_url",
		bootSetDate:	"boot_set_date",
		readLogs:		"read_logs",
		getUserId:		"get_user_id"
	}
};
var uciCloudConfig =
{
	fileName:		"cloud_config",

	secType:
	{
		cloudReply : "cloud_reply"
	},
	secName:
	{
		bind : "bind",
		info : "info",
		register : "register",
		newFirmware : "new_firmware",
		deviceStatus : "device_status",
		upgradeInfo : "upgrade_info",
		resetPassword : "reset_password",
		modifyAccountPwd : "modify_account_pwd",
		cloudAccountStat: "cloudAccountStat",
		downloadFw: "download_fw",
		bindTip: "bind_tip",
		deviceLegality: "device_legality"
	},
	optName:
	{
		type 			: "type",
		accountType		: "account_type",
		username 		: "username",
		password 		: "password",
		newPassword 	: "new_pwd",
		oldPassword 	: "old_pwd",
		bindStatus 		: "bind_status",
		loginStatus 	: "login_status",
		accountStatus 	: "account_status",
		releaseDate 	: "release_date",
		downloadUrl 	: "download_url",
		location 		: "location",
		releaseLogUrl 	: "release_log_url",
		verifyCode      : "verify_code",
		cloudAccountStat: "cloudAccountStat",
		fwNewNotify		: "fw_new_notify",
		fwUpdateType	: "fw_update_type",
		version			: "version",
		releaseLog		: "release_log",
		reconnectTime	: "reconnect_time",
		noShow			: "not_show",
		illegal			: "illegal"
	},
	optValue:
	{
		cloudOutline: 0,
		cloudDownloading:1,
		cloudComplete: 2,
		cloudIdle: "3",
		fwNewTrue: 1,
		fwNewFalse: 0,
		fwUpdateTypeNormal: "1",
		unRegestStatus:0,
		regestStatus:1,
		bindStatusBind:1,
		bindStatusUnbind:0,
		accountTypeEmail:0,
		accountTypePhoneNum:1,
		reconnectVal:1,
		noShow:
		{
			yes:"1",
			no:"0"
		},
		illegal:
		{
			yes:"1",
			no:"0"
		}
	},
	actionName:
	{
		bind : "bind",
		login : "login",
		unbind : "unbind",
		reconnect:"reconnect",
		register : "register",
		downloadFw: "fw_download",
		checkFwVer: "check_fw_version",
		fwDownload : "fw_download",
		getAccountStat : "get_account_stat",
		resetPassword : "reset_password",
		resendRegisterEmail : "resend_register_email",
		checkFwVersion : "check_fw_version",
		cancelReg : "cancel_reg",
		getRegVerifyCode : "get_reg_verify_code",
		checkRegVerifyCode : "check_reg_verify_code",
		getResetPwdVerifyCode : "get_reset_pwd_verify_code",
		checkResetPwdVerifyCode : "check_reset_pwd_verify_code",
		modifyAccountPwd : "modify_account_pwd"
	}
};

var cloudClientStatus =
{
	fileName:		"cloud_status",

	secName:
	{
		bind : "bind",
		unbind : "unbind",
		login : "login",
		register : "register",
		checkFwVer : "check_fw_ver",
		downloadFw : "download_fw",
		clientInfo : "client_info",
		resendEmail : "resend_email",
		getAccountStat : "get_account_stat",
		resetPassword : "reset_account_pwd",
		fwDownloadProg : "fw_download_prog",
		getRegVerifyCode : "get_reg_verify_code",
		checkRegVerifyCode : "check_reg_verify_code",
		getResetPwdVerifyCode : "get_reset_pwd_verify_code",
		checkResetPwdVerifyCode : "check_reset_pwd_verify_code",
		modifyAccountPwd : "modify_account_pwd",
		getCanUpdateApps : "get_can_update_plugins",
		getNotInstalledApps: "get_not_installed_plugins",
		regVeriCodeTimer:"reg_veri_code_timer",
		resetVeriCodeTimer:"reset_veri_code_timer"
	},
	optName:
	{
		owner: "owner",
		errCode: "err_code",
		actionStatus: "action_status",
		connectStatus: "connect_status",
		dlProgress : "fw_download_progress",
		fwDownloadStatus: "fw_download_status",
		fwDownloadProgress: "fw_download_progress",
		regVeriCodeTimer:"reg_veri_code_timer",
		resetVeriCodeTimer:"reset_veri_code_timer"
	},
	optValue:
	{
		connectStatus:{
			connected:1,
			disconnected:0
		},
		queryStatus:{
			failed:0,
			idle:1,
			prepare:2,
			trying:3,
			success:4,
			timeout:5,
			max:6
		}
	}
};

var uciAbnormalEvents = {
	fileName:"abnormal_events",
	secName:{
		loginErr:"login_err",
		sdFull:"sd_full",
		sdError:"sd_error",
		ipConflict:"ip_conflict",
		networkBroken:"network_broken"
	},
	secType:{
		type:"on_off"
	},
	optName:{
		enabled:"enabled",
		maxNumErr:"max_num_err",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciMotionDetection = {
	fileName:"motion_detection",
	secName:{
		motionDet:"motion_det",
		motionNotifList:"motion_notif_list",
		region:"region"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addMdRegions:"add_md_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		rectArray:"rect_array",
		xCoor:"x_coor",
		yCoor:"y_coor",
		width:"width",
		height:"height"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciTamperDetection = {
	fileName:"tamper_detection",
	secName:{
		tamperDet:"tamper_det",
		tamperNotifList:"tamper_notif_list"
	},
	secType:{
		regionInfo:"region_info"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		rectInfo:"rect_info"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciLineCrossingDetection = {
	fileName:"linecrossing_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		direction:"direction",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciIntrusionDetection = {
	fileName:"intrusion_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		threshold:"threshold",
		percentage:"percentage",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciRegionEntranceDetection = {
	fileName:"regionentrance_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciRegionExitingDetection = {
	fileName:"regionexiting_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciLoiteringDetection = {
	fileName:"loitering_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		threshold:"threshold",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciGatheringDetection = {
	fileName:"gathering_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		percentage:"percentage",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciFastMovingDetection = {
	fileName:"fastmoving_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciParkingDetection = {
	fileName:"parking_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		threshold:"threshold",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciUnattendedBaggageDetection = {
	fileName:"unattendedbaggage_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		threshold:"threshold",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciObjectRemoveDetection = {
	fileName:"objectremove_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	secType:{
		regionInfo:"region_info"
	},
	actionName:{
		addRegions:"add_regions"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		ftpEnabled:"ftp_enabled",
		threshold:"threshold",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		pt1x:"pt1_x",
		pt1y:"pt1_y",
		pt2x:"pt2_x",
		pt2y:"pt2_y",
		pt3x:"pt3_x",
		pt3y:"pt3_y",
		pt4x:"pt4_x",
		pt4y:"pt4_y"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};
var uciSceneDetection = {
	fileName:"scenechange_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		ftpEnabled:"ftp_enabled",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};
var uciFaceDetection = {
	fileName:"face_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list",
		armingSchedule:"arming_schedule"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		ftpEnabled:"ftp_enabled",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};
var uciDefocusDetection = {
	fileName:"defocus_detection",
	secName:{
		detection:"detection",
		notifyList:"notify_list"
	},
	optName:{
		enabled:"enabled",
		sensitivity:"sensitivity",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};
var uciAudioException = {
	fileName: "audioexception_detection",
	secName:
	{
		detection:"detection",
		inputAbnormal:"input_abnormal",
		voiceRise:"voice_rise",
		voiceDown:"voice_down",
		armingSchedule:"arming_schedule",
		notifyList:"notify_list"
	},
	optName:
	{
		enabled:"enabled",
		inputAbnormalEnabled:"enabled",
		voiceupEnabled:"enabled",
		voiceupSens:"sensitivity",
		thresh:"threshold",
		voicedownEnabled:"enabled",
		voicedownSens:"sensitivity",
		mon:"monday",
		tue:"tuesday",
		wed:"wednesday",
		thu:"thursday",
		fri:"friday",
		sat:"saturday",
		sun:"sunday",
		emailEnabled:"email_enabled",
		alarmEnabled:"alarm_enabled",
		recordEnabled:"record_enabled"
	},
	optValue:{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

var uciNetwork =
{
	fileName:	"network",
	secType:
	{
		iface:		"interface",
		user_route:	"user_route",
		sys_route:	"sys_route"
	},
	secName:
	{
		lan:		"lan",
		wan:		"wan"
	},
	optName:
	{
		ifName:		"ifname",
		proto:		"proto",
		ip:		"ipaddr",
		pppoeUsr:	"username",
		pppoePass:	"password",
		netmask:	"netmask",
		ipMode:		"ip_mode",
		gateway:	"gateway",
		dns:		"dns",
		mtu:		"mtu",
		speed:		"speed_duplex",
		mac:		"macaddr",
		facMac:		"fac_macaddr",
		target:		"target",
		iface:		"interface",
		facIp:		"fac_ipaddr",
		linkStatus:	"link_status",
		phyStatus:	"phy_status",
		pppoeLinkSta:"pppoe_link_status",
		result:		"result",
		ipAddr:		"ipaddr",
		ipv4:		"ipv4",
		pppoeIpv4:	"pppoe_ipv4",
		wanType: 	"wan_type"
	},
	optValue:
	{
		proto:
		{
			dynIp:"dhcp",
			staticIp:"static",
			pppoe:"pppoe",
			none:"none"
		},
		ifname:
		{
			wan:"eth0",
			lan:"br-lan",
			host:"host",
			factory:"factory"
		},
		ipMode:
		{
			dynamic:	"dynamic",
			manual:		"manual"
		},
		DFT_LAN_IP:["192.168.1.1", "192.168.0.1"],
		timeout:"timeout",
		waiting:"waiting",
		success:"success"
	},
	dynData:
	{
		wanStatus:	"wan_status",
		wanProto:	"wan_proto",
		ifaceMac:	"iface_mac"
	},
	action:
	{
		wanDetect:	"detect_wan_proto",
		chgWanSta: "change_wan_status",
		operate: "operate",
		getDhcpIp:"get_dhcp_ip",
		applyDhcpIp:"apply_dhcp_ip",
		releaseStaticIp:"release_static_ip",
		checkIpConflict:"check_ip_conflict"
	},
	actionValue:
	{
		connect:"connect",
		disconnect:"disconnect"
	}
};

var uciOsd = {
	fileName:"OSD",
	secName:
	{
		font:"font",
		week:"week",
		date:"date"
	},
	secType:
	{
		labelInfo:"label_info"
	},
	optName:
	{
		display:"display",
		size:"size",
		color:"color",
		colorType:"color_type",
		enabled:"enabled",
		coorInfo:"coor_info",
		xCoor:"x_coor",
		yCoor:"y_coor",
		text:"text"
	},
	optValue:
	{
		enableVal:{
			on:"on",
			off:"off"
		},
		clorTypeVal:{
			auto:"auto",
			userDef:"user_defined"
		}
	}
};
var uciPic = {
	fileName:"image_capture",
	secName:
	{
		capture:"capture"
	},
	optName:
	{
		capType:"cap_type",
		streamType:"stream_type",
		imageSize:"image_size",
		quality:"quality",
		capInterval:"cap_interval"
	}
};

var uciUpnp =
{
	fileName:		"upnpc",
	secType:
	{
		onOff:		"on_off",
		entry:		"entry",
		upnpStatus: "upnp_status"
	},
	secName:
	{
		upnpcInfo:	"upnpc_info",
		uhttpd:		"uhttpd",
		vhttpd:		"vhttpd",
		rtsp:		"rtsp",
		onvifSer:	"onvif_service"
	},
	optName:
	{
		enabled:	"enabled",
		mode:		"mode",
		proto:		"proto",
		extPort:	"ext_port",
		innerPort:	"inner_port",
		client:		"client",
		desc:		"desc",
		ipaddr:		"ipaddr",
		status:		"status"
	},
	dynData:
	{
		upnpLease:	"upnp_lease"
	}
};
var uciDeviceInfo =
{
	fileName:		"device_info",
	secType:
	{
		info:		"info"
	},
	secName:
	{
		info:		"info"
	},
	optName:
	{
		devModel:	"device_model",
		serialNumber:"serial_number",
		productId:	"product_id",
		vendorId:	"vendor_id",
		sysSwRev:	"sys_software_revision",
		sysSwRevMin:"sys_software_revision_minor",
		buildTime:	"build_time",
		language:	"language",
		devName:	"device_name",
		deviceInfo:	"device_info",
		devId:		"device_id",
		deviceModel:"device_model",
		hwVer:		"hw_version",
		swVer:		"sw_version",
		domainName:	"domain_name"
	}
};
var uciFirewall = {
	fileName:"firewall",
	secName:
	{
		ipCtrl:			"ipctrl",
		fireWall:		"firewall"
	},
	secType:
	{
		blacklist:		"blacklist",
		whitelist:		"whitelist"
	},
	optName:
	{
		enabled:		"enabled",
		filterMode:		"filter_mode",
		ip:				"ip",
		desc:			"desc",
		startIp:		"start_ip",
		endIp:			"end_ip"
	},
	optValue:
	{
		accessVal:
		{
			all:		"off",
			some:		"on"
		},
		typeVal:{
			forbid:		"blacklist",
			allow:		"whitelist"
		}
	}
};
var uciFtp = {
	fileName:"ftp",
	secName:
	{
		ftpInfo:	"ftp_info",
		directory1:	"directory_1"
	},
	secType:
	{
		info:			"info",
		directoryLevel:	"directory_level"
	},
	optName:
	{
		address:			"address",
		port:				"port",
		anonymousEnabled:	"anonymous_enabled",
		username:			"username",
		password:			"password",
		dirStructure:		"directory_structure",
		directoryType:		"directory_type",
		customName:			"custom_name"
	},
	actionName:
	{
		testFtp:"test_ftp",
		get_test_status:"get_test_status"
	}
};
var uciUserMgt = {
	fileName:"user_management",
	secType:
	{
		root:"root",
		admin:"admin",
		guest:"guest"
	},
	optName:
	{
		username:"username",
		passwd:"passwd",
		oldPasswd:"old_passwd",
		comment:"comment",
		secName:"secname",
		group:"group",
		ciphertext:"ciphertext"
	},
	optValue:
	{
		curUsrInfo:"current_user_info"
	},
	actionName:{
		userMgt:"user_management",
		chgUsrInfo:"change_user_info"
	}
};

var uciPlayBack = {
	fileName:"playback",
	secType:
	{

	},
	optName:
	{
		channel:"channel",
		seconds:"seconds",
		day:"day",
		startTime:"startTime",
		endTime:"endTime",
		videoType:"vedio_type",
		map:"map",
		size:"size",
		idStr:"id_str",
		result:"result",
		userId:"user_id",
		id:"id",
		type:"type",
		scale:"scale"
	},
	action:
	{
		searchYear:"search_year",
		searchVideo:"search_video",
		suspend:"suspend"
	}
};

var uciDdns = {
	fileName:		"ddns",
	secType:
	{
		ddns:		"ddns"
	},
	secName:
	{
		phddns:		"phddns",
		tpddns:		"tpddns"
	},
	optName:
	{
		autologin:		"auto_login",
		username:		"username",
		password:		"password",
		used:			"is_used",
		table:			"table",
		bindDevNum:		"bind_number",
		status:			"status",
		domain:			"domain",
		suffix:			"suffix",
		force:			"force",
		mac:			"mac",
		device:			"device",
		isCurhost:		"is_cur_host"
	},
	optValue:
	{
		ddns_list:		"ddns_list",
		device_num:		"device_num",
		register_status:"register_status",
		bind_status:	"bind_status",
		unbind_status:	"unbind_status",
		get_domain_list_status:"get_domain_list_status",
		get_device_num_status :"get_device_num_status"
	},
	actionName:
	{
		register_domain:"register",
		bind_domain:"bind",
		unbind_domain:"unbind",
		get_domain_list:"get_domain_list",
		get_device_num:"get_device_num",
		logout:"logout",
		login:"login"
	},
	actionDetail:
	{
		domain:"domain",
		suffix:"suffix",
		force:"force",
		logout:"logout",
		login:"login"
	},
	dynData:
	{
		ddnsStatus:	"ddns_status",
		tpddnsStatus:"tpddns_status"
	}
};

var uciUhttpd =
{
	fileName:		"uhttpd",
	secType:
	{
		uhttpd: "uhttpd",
		cert:"cert"
	},
	secName:
	{
		main:"main",
		px5g:"px5g"
	},
	optName:
	{
		listenHttpPort:"listen_http"
	}
};

var uciCet =
{
	fileName:		"cet",
	secType:
	{
		server:		"server"
	},
	secName:
	{
		rtsp:"rtsp",
		vhttpd:"vhttpd"
	},
	optName:
	{
		port:"port"
	}
};

var uciMulticast =
{
	fileName:		"multicast",
	secType:
	{
		server:		"server"
	},
	secName:
	{
		main:"main",
		minor:"minor",
		third:"third"
	},
	optName:
	{
		enabled:"enabled",
		address:"address",
		port:"port",
		random:"random"
	},
	optValue:
	{
		enableVal:{
			on:"on",
			off:"off"
		}
	}
};

/*------------- 新的SLP交互接口宏定义 -------------*/
var SEC_NAME       = ".name";
var KEY_NAME = NAME = "name";
var KEY_TABLE = "table";
var KEY_PARA = "para";

var ERR_NONE = ENONE = 0;

/*------------- 新的SLP交互接口宏定义 -------------*/
var SEC_INDEX      = ".index";

var RTN_TYPE_ARRAY = ".array";

var UCI_SET = "config.";
var UCI_SET_LIST = "list.";
var UCI_DEL = "delete.";

var UCI_FNAME      = ".config";
var UCI_SNAME      = ".section_name";
var UCI_STYPE      = ".section_type";
var UCI_STYPE_LIST = ".sectype_list";
var UCI_RTN_DATA_TYPE = ".rtn_data_type";
var UCI_APPLY      = ".cfg_filelist";

var UCI_ADD_SEC = "addsec.";
var UCI_DEL_SEC = "delsec.";
var UCI_RENAME_SEC = "rensec.";
var UCI_ADD_OPT = ".config.";
var UCI_DEL_OPT = ".delete.";
var UCI_ADD_LIST = ".list.";

var localData = {
	"network": { "wan_status": { "ipaddr": "192.168.1.60", "snd_dns": "0.0.0.0", "up_time": 112933, "phy_status": 1, "link_status": 1, "proto": "static", "netmask": "255.255.255.0", "down_speed": 0, "pppoe_link_status": 0, "mac": "A8-57-4E-FD-93-5E", "pppoe_ipv4": "0.0.0.0", "pri_dns": "0.0.0.0", "gateway": "192.168.1.1", "error_code": 0, "up_speed": 0 } }, 
	"upnpc": { "upnp_status": [ { "uhttpd": { "ipaddr": "192.168.1.60", "status": "off", "proto": "TCP", ".name": "uhttpd", ".type": "entry", "inner_port": "80", "desc": "uhttpd", ".index": 1, "ext_port": "80", ".anonymous": false } }, { "rtsp": { "ipaddr": "192.168.1.60", "status": "off", "proto": "TCP", ".name": "rtsp", ".type": "entry", "inner_port": "554", "desc": "rtsp", ".index": 2, "ext_port": "554", ".anonymous": false } }, { "onvif_service": { "ipaddr": "192.168.1.60", "status": "off", "proto": "TCP", ".name": "onvif_service", ".type": "entry", "inner_port": "2020", "desc": "onvif_service", ".index": 3, "ext_port": "2020", ".anonymous": false } }, { "vhttpd": { "ipaddr": "192.168.1.60", "status": "off", "proto": "TCP", ".name": "vhttpd", ".type": "entry", "inner_port": "8080", "desc": "vhttpd", ".index": 4, "ext_port": "8080", ".anonymous": false } } ] },
	"video": { "main": { "stream_type": "general", "name": "VideoEncoder_1", ".name": "main", ".type": "stream", "frame_rate": "65556", "bitrate": "4096", "bitrate_type": "cbr", "resolution": "1280*720", "quality": "5", ".anonymous": false }, "minor": { "name": "VideoEncoder_2", ".name": "minor", ".type": "stream", "frame_rate": "65551", "bitrate": "512", "quality": "3", "resolution": "640*480", "bitrate_type": "cbr", ".anonymous": false }, "third": { "name": "VideoEncoder_3", ".name": "third", ".type": "stream", "frame_rate": "65551", "bitrate": "512", "quality": "3", "resolution": "640*480", "bitrate_type": "cbr", ".anonymous": false } },
	"system": { "clock_status": { "dev_alias": "TL-IPC533-6 1.0","seconds_from_1970": 1466771201 } },
	"device_info": { "info": { "friendly_name": "IPC", "device_model": "300W IPC", "vendor_id": "0x00000001", "manufacturer_name": "TP-LINK", "zone_code": "0x0", ".name": "info", ".type": "info", "sw_version": "1.0.7 Build 160629 Rel.34341n", ".anonymous": false, "td_reg_num": "1", "sys_software_revision": "0x500a0100", "enable_dns": "1", "md_reg_num": "128", "cover_reg_num": "4", "roi_reg_num": "1", "device_name": "TL-IPC533-6 1.0", "manufacturer_url": "http://www.tp-link.com", "fw_description": "Default-devName Default-hwVer", "hw_version": "Default-hwVer", "model_description": "IPC", "device_info": "Default-devName Default-hwVer", "domain_name": "tplogin.cn", "sys_software_revision_minor": "0x0004", "product_id": "12344321", "language": "CN" } },
	"protocol": { "wan": { "fac_macaddr": "A8-57-4E-FD-93-5E", "proto": "none", "ifname": "eth0", ".name": "wan", ".type": "interface", ".anonymous": false, "wan_type": "pppoe", "wan_rate": "auto", "macaddr": "A8-57-4E-FD-93-5E", "auto": "0" }, "pppoe": { "wan_type": "pppoe", "ip_mode": "dynamic", "ifname": "eth0", "mtu": "1480", "dial_mode": "special3", "dns_mode": "dynamic", "parent": "wan", "connect": "1", ".name": "pppoe", ".type": "proto", "demand_idle": "600", "proto": "pppoe", ".anonymous": false, "conn_mode": "auto", "keepalive": "3%2c10", "auto": "0" },"static": { "pri_dns": "0.0.0.0", "mtu": "1500", "netmask": "255.255.255.0", "proto": "static", "ifname": "eth0", ".name": "static", ".type": "proto", "wan_type": "static", "auto": "1", "fac_ipaddr": "192.168.1.110", "gateway": "192.168.1.1", "ipaddr": "192.168.1.110", ".anonymous": false }},
	"image": { "switch": { ".name": "switch", ".type": "switch_type", "switch_mode": "common", "rotate_type": "off", "schedule_end_time": "64800", "flip_type": "left_and_right", "schedule_start_time": "21600", ".anonymous": false }, "common": { "chroma": "50", "inf_start_time": "64800", "inf_sensitivity": "medium", "wb_B_gain": "0", "backlight": "off", "wb_type": "auto", ".type": "para", "exp_type": "auto", "inf_delay": "5", "wb_R_gain": "0", ".anonymous": false, "contrast": "76", "shutter": "1/25", "luma": "47", "wd_gain": "0", "wb_G_gain": "0", "sharpness": "22", "saturation": "50", "exp_gain": "0", "inf_type": "auto", "inf_end_time": "21600", ".name": "common" } },
	"OSD": { "date": { ".name": "date", ".type": "date_info", "y_coor": "500", "enabled": "on", "x_coor": "1000", ".anonymous": false }, "font": { ".name": "font", ".type": "font_info", "size": "auto", "color": "white", "color_type": "auto", "display": "ntnb", ".anonymous": false }, "label_info": [ { "label_info_1": { ".name": "label_info_1", ".type": "label_info", "y_coor": "8000", "x_coor": "1000", "text": "TP IPC", "enabled": "off", ".index": 3, ".anonymous": false } }, { "label_info_2": { ".name": "label_info_2", ".type": "label_info", "y_coor": "4000", "x_coor": "1000", "text": "1234567", "enabled": "off", ".index": 4, ".anonymous": false } }, { "label_info_3": { ".name": "label_info_3", ".type": "label_info", "y_coor": "6000", "x_coor": "1000", "text": "abcdefg", "enabled": "off", ".index": 5, ".anonymous": false } } ], "week": { ".name": "week", ".type": "date_info", "y_coor": "500", "enabled": "on", "x_coor": "6000", ".anonymous": false } },
	"cover": { "region_info": [ { "region_info_1": { ".name": "region_info_1", ".type": "region_info", "x_coor": "7609", ".index": 1, "width": "2023", "y_coor": "7291", "height": "2458", ".anonymous": false } } ], "cover": { ".name": "cover", ".type": "cover_info", "enabled": "off", ".anonymous": false } },
	"ROI": { "third_roi": [ { "third_roi_1": { ".index": 3, "x_coor": "5703", "y_coor": "3562", ".name": "third_roi_1", ".type": "third_roi", "width": "531", "level": "1", "height": "3145", ".anonymous": false } } ],"minor_roi": [ { "minor_roi_1": { ".index": 2, "x_coor": "5703", "y_coor": "3562", ".name": "minor_roi_1", ".type": "minor_roi", "width": "531", "level": "3", "height": "3145", ".anonymous": false } } ],"main_roi": [ { "main_roi_1": { ".index": 1, "x_coor": "1375", "y_coor": "2472", ".name": "main_roi_1", ".type": "main_roi", "width": "1312", "level": "2", "height": "2888", ".anonymous": false } } ], "roi_enable": { ".name": "roi_enable", ".type": "on_off", ".anonymous": false, "third_enabled": "off", "minor_enabled": "off", "main_enabled": "off" } },"motion_detection": { "motion_det": { ".name": "motion_det", ".type": "on_off", "enabled": "off", "sensitivity": "medium", ".anonymous": false }, "region_info": [ { "region_info_1": { ".name": "region_info_1", ".type": "region_info", ".index": 2, "x_coor": "125", "width": "9749", "y_coor": "200", "height": "9599", ".anonymous": false } } ],"motion_notif_list": { ".name": "motion_notif_list", ".type": "notif_list", "client_enabled": "off", "app_enabled": "off", ".anonymous": false } },	
	"tamper_detection": { "tamper_notif_list": { ".name": "tamper_notif_list", ".type": "notif_list", "client_enabled": "off", "app_enabled": "off", ".anonymous": false }, "tamper_det": { ".name": "tamper_det", ".type": "on_off", "enabled": "off", "sensitivity": "medium", ".anonymous": false } },
	"abnormal_events": { "login_err": { ".name": "login_err", ".type": "on_off", "enabled": "on", "max_num_err": "10", ".anonymous": false }, "login_err_notif_list": { ".name": "login_err_notif_list", ".type": "notif_list", "client_enabled": "off", "app_enabled": "off", ".anonymous": false } },	"network": { "wan_status": { "ipaddr": "192.168.1.60", "snd_dns": "0.0.0.0", "up_time": 117653, "phy_status": 1, "link_status": 1, "proto": "static", "netmask": "255.255.255.0", "down_speed": 0, "pppoe_link_status": 0, "mac": "A8-57-4E-FD-93-5E", "pppoe_ipv4": "0.0.0.0", "pri_dns": "0.0.0.0", "gateway": "192.168.1.1", "error_code": 0, "up_speed": 0 } },
	"uhttpd": { "main": { "network_timeout": "180", "home": "/www", "script_timeout": "180", "listen_https": [ "0.0.0.0:443" ], "listen_http": "80", "cgi_prefix": "/cgi-bin", "tcp_keepalive": "0", "max_requests": "6", ".name": "main", ".type": "uhttpd", "cert": "/etc/uhttpd.crt", "rfc1918_filter": "1", "lua_prefix": "/luci", "lua_handler": "/usr/lib/lua/luci/sgi/uhttpd.lua", "key": "/etc/uhttpd.key", ".anonymous": false } }, 
	"cet": { "vhttpd": { ".name": "vhttpd", ".type": "server", "port": "8080", ".anonymous": false }, "rtsp": { ".name": "rtsp", ".type": "server", "port": "554", ".anonymous": false } },
	"ddns": { "tpddns": { "is_used": "0" }, "ddns_status": { "status": 0 } },  
	"cloud_status": { "client_info": { "fw_download_progress": "0", "reconnect_time": "0", "connect_status": "0", ".name": "client_info", ".type": "cloud_client", "disconnect_reason": "0", "fw_verify_status": "0", "fw_download_status": "0", ".anonymous": false } },
	"firewall": { "blacklist": [ { "blacklist_1": { ".name": "blacklist_1", ".type": "blacklist", "start_ip": "192.168.1.11", "end_ip": "192.168.1.11", "desc": "b1", ".index": 1, ".anonymous": false } }, { "blacklist_2": { ".name": "blacklist_2", ".type": "blacklist", "start_ip": "192.168.1.12", "end_ip": "192.168.1.12", "desc": "b2", ".index": 2, ".anonymous": false } }, { "blacklist_3": { ".name": "blacklist_3", ".type": "blacklist", "start_ip": "192.168.1.13", "end_ip": "192.168.1.13", "desc": "b3", ".index": 3, ".anonymous": false } }, { "blacklist_4": { ".name": "blacklist_4", ".type": "blacklist", "start_ip": "192.168.1.14", "end_ip": "192.168.1.14", "desc": "b4", ".index": 4, ".anonymous": false } }, { "blacklist_5": { ".name": "blacklist_5", ".type": "blacklist", "start_ip": "192.168.1.15", "end_ip": "192.168.1.15", "desc": "b5", ".index": 5, ".anonymous": false } }, { "blacklist_6": { ".name": "blacklist_6", ".type": "blacklist", "start_ip": "192.168.1.16", "end_ip": "192.168.1.16", "desc": "b6", ".index": 6, ".anonymous": false } }, { "blacklist_7": { ".name": "blacklist_7", ".type": "blacklist", "start_ip": "192.168.1.17", "end_ip": "192.168.1.17", "desc": "b7", ".index": 7, ".anonymous": false } }, { "blacklist_8": { ".name": "blacklist_8", ".type": "blacklist", "start_ip": "192.168.1.18", "end_ip": "192.168.1.18", "desc": "b8", ".index": 8, ".anonymous": false } }, { "blacklist_9": { ".name": "blacklist_9", ".type": "blacklist", "start_ip": "192.168.1.19", "end_ip": "192.168.1.19", "desc": "b9", ".index": 9, ".anonymous": false } }, { "blacklist_10": { ".name": "blacklist_10", ".type": "blacklist", "start_ip": "192.168.1.20", "end_ip": "192.168.1.20", "desc": "b10", ".index": 10, ".anonymous": false } } ], "whitelist": [ { "whitelist_1": { ".name": "whitelist_1", ".type": "whitelist", "start_ip": "192.168.1.31", "end_ip": "192.168.1.31", "desc": "w1", ".index": 11, ".anonymous": false } }, { "whitelist_2": { ".name": "whitelist_2", ".type": "whitelist", "start_ip": "192.168.1.32", "end_ip": "192.168.1.32", "desc": "w2", ".index": 12, ".anonymous": false } }, { "whitelist_3": { ".name": "whitelist_3", ".type": "whitelist", "start_ip": "192.168.1.33", "end_ip": "192.168.1.33", "desc": "w3", ".index": 13, ".anonymous": false } }, { "whitelist_4": { ".name": "whitelist_4", ".type": "whitelist", "start_ip": "192.168.1.34", "end_ip": "192.168.1.34", "desc": "w4", ".index": 14, ".anonymous": false } }, { "whitelist_5": { ".name": "whitelist_5", ".type": "whitelist", "start_ip": "192.168.1.35", "end_ip": "192.168.1.35", "desc": "w5", ".index": 15, ".anonymous": false } }, { "whitelist_6": { ".name": "whitelist_6", ".type": "whitelist", "start_ip": "192.168.1.36", "end_ip": "192.168.1.36", "desc": "w6", ".index": 16, ".anonymous": false } }, { "whitelist_7": { ".name": "whitelist_7", ".type": "whitelist", "start_ip": "192.168.1.37", "end_ip": "192.168.1.37", "desc": "w7", ".index": 17, ".anonymous": false } }, { "whitelist_8": { ".name": "whitelist_8", ".type": "whitelist", "start_ip": "192.168.1.38", "end_ip": "192.168.1.38", "desc": "w8", ".index": 18, ".anonymous": false } }, { "whitelist_9": { ".name": "whitelist_9", ".type": "whitelist", "start_ip": "192.168.1.39", "end_ip": "192.168.1.39", "desc": "w9", ".index": 19, ".anonymous": false } }, { "whitelist_10": { ".name": "whitelist_10", ".type": "whitelist", "start_ip": "192.168.1.40", "end_ip": "192.168.1.40", "desc": "w10", ".index": 20, ".anonymous": false } } ], "ipctrl": { ".name": "ipctrl", ".type": "ipctrl", "filter_mode": "blacklist", "enabled": "off", ".anonymous": false } },
	"user_management": { "root": { ".name": "root", ".type": "root", "username": "admin", "ciphertext": "plQJ/h/dHSqk972wRUPmDvellylBU5uoKwHzNv7QyNuVbMD+PjjVc3W12T3vnmkjTfw5npDWAzlMQNRWjODc5ZyEQyAqXKT/zPqU2D4Z54nvBMYR464XzuSRApXN2Ky3TPkzEI0Q37c3V28E1GDUZh/8JDWqVnIUs1w1erRb7/Y=", ".anonymous": false }, "admin": [ { "admin_1": { ".name": "admin_1", ".type": "admin", "ciphertext": "qxs7t4jEldNAAG3yhSyCwfmQarwpNtvHUXTv3FFj8xKfQs6RZfehsJb/JGCsbiimHPYoBqngEfZOXItFMfae/vMUZwPBb6EJlkiOgEskeBexeaBpSOcbhbOcjYGUqlmLPbwT83lLkqbiubgcDFHDtd7d6PfLLM4aTgZT751cQRo=", "username": "test", ".index": 2, ".anonymous": false } } ], "guest": [  ] },
	"cloud_config": { "upgrade_info": { ".name": "upgrade_info", ".type": "cloud_reply", ".anonymous": false }, "new_firmware": { ".name": "new_firmware", ".type": "cloud_push", "fw_new_notify": "0", "not_show": "0", "fw_update_type": "1", ".anonymous": false } },
};