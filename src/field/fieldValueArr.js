import { Buffer } from 'buffer';

function rtnAwakeDevArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x00]);
	return cmd;	
}

function rtnSetVibrateParasArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x01]);
	return cmd;
}

function rtnGetVibrateParasArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x02]);
	return cmd;
}

//设备-系统 信息中的获取命令
function rtnGetDevMsgArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x03]);
	return cmd;	
}

//设备-系统 信息 中的设置命令 --设置监测间隔
function rtnSetDevIntervalArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x04]);
	return cmd;	
}

//设备-系统 信息 中的设置命令 --设置系统时间
function rtnSetDevSysTimeArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x07]);
	return cmd;		
}

//手动获取数据页面 中的采集命令
function rtnManualGetDataArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x05]);
	return cmd;	
}

//手动获取数据页面 中的采集命令
function rtnGetHistoryDataArr()
{
	const cmd = Buffer.from([0xef, 0x04, 0x00, 0x00, 0x00, 0x06]);
	return cmd;	
}

export default{
	rtnAwakeDevArr,
	rtnSetVibrateParasArr,
	rtnGetVibrateParasArr,	
	rtnGetDevMsgArr,	
	rtnManualGetDataArr,
	rtnGetHistoryDataArr,
	rtnSetDevIntervalArr,
	rtnSetDevSysTimeArr,
	
};
