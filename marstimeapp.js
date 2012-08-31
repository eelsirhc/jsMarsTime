
function pad(n, len) {
   //Pad the number with 0s to length len
    s = n.toString();
    if (s.length < len) {
        s = ('0000000000' + s).slice(-len);
    }

    return s;
   
}
function getMonthString(n){
	var month=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	return month[n];
}

function hms(t)
{
    //format a time in hours to hh:mm:ss
    var t2 = (t+24.) % 24;
    var h=Math.floor(t2);
    var m=Math.floor((t2-Math.floor(h))*60.);
    var s=Math.floor(((t2-h)*60-m)*60);
    return pad(h,2)+":"+pad(m,2)+":"+pad(s,2);
}

function dhms(t)
{
    //format a time in hours to hh:mm:ss
    var t2 = (t+24.) % 24;
    var h=Math.floor(t2);
    var d = Math.floor(t/24.)
    var textd="";
    if (d >= 2)
    {
    	textd=d.toString()+" days, "
	}else if(d >= 1)
	{
		textd=d.toString()+" day, "
	}
		
    var rh=h;
    var m=Math.floor((t2-Math.floor(h))*60.);
    var s=Math.floor(((t2-h)*60-m)*60);
    return textd + pad(rh,2)+":"+pad(m,2)+":"+pad(s,2);
}

function ms(t)
{
    //format a time in seconds to mm:ss 
    var m = Math.floor(t/60);
    var s = Math.floor(t - Math.floor(m)*60);
    return pad(m,2)+":"+pad(s,2);
}

function startFrom(mil_land, longitude, d, vin, delta, sol0)
{
    var a = new Array();
    diff =d.getTime() - mil_land;
    s1=diff/(86400e3*1.027491252);
    s2 =s1-Math.floor(s1);
    a["sol"]=Math.floor(s1);
    var t=Local_Mean_Solar_Time(longitude, vin.j2000_ott)+delta;

    //t=t;
    while (t>24)
    {
        a["sol"]=a["sol"]+1;
        t=t-24;
    }
    if(sol0 != undefined)   a["sol"]+=sol0;
    a["time"]=hms(t);

    a["ltst"]=hms(Local_True_Solar_Time(longitude, vin.j2000_ott)+delta);

//	a["timeto"] = dhms(-diff/3600e3);
    return a;
}

function timeNow()
{
    var d = new Date();
    var v = new Array();
    var tz = String(String(d).split("(")[1]).split(")")[0];
    v["utcdate"]=d.getUTCFullYear()+"-"+pad(d.getUTCMonth()+1,2)+"-"+d.getUTCDate();
    v["utctime"]=pad(d.getUTCHours(),2)+":"+pad(d.getUTCMinutes(),2)+":"+pad(d.getUTCSeconds(),2);    
    v["utcmonth"] = getMonthString(d.getUTCMonth());
    v["localdate"]=d.getFullYear()+"-"+pad(d.getMonth()+1,2)+"-"+pad(d.getDate(),2);
    v["localtime"]=pad(d.getHours(),2)+":"+pad(d.getMinutes(),2)+":"+pad(d.getSeconds(),2)+" "+tz;
    v["localmonth"] = getMonthString(d.getMonth());
    v["jdut"]=julian(d.getTime());
    v["mjd"] = v.jdut - 2400000.5;

    //Mars stuff
    v["tt_utc"] = utc_to_tt_offset(v.jdut);
    v["jday_tt"] = julian_tt(v.jdut);
    v["j2000_ott"] = j2000_offset_tt(v.jday_tt);
    v["msd"] = Mars_Solar_Date(v.j2000_ott);
    v["mtc"] = hms(Coordinated_Mars_Time(v.j2000_ott));
    v["ls"] = Mars_Ls(v.j2000_ott).toFixed(2);
    v["lsstring"] = Mars_Ls_String(v.ls);
    
    var spirit_land = 1073137591000.;
    var spirit_lon = 184.5215;
    var opp_land = 1073137591000.+86400e3*22;
    var opp_lon = 0.0;
    var cur_land = 1344174593000. ; //1344231060000 - 56466000; //midnight before landing.
    var cur_lon = east_to_west(137.440247); //222.5781	; //5981;  // + 42/60. ; //0.0;

    v["spirit"] = startFrom(spirit_land, spirit_lon,d,v,(-41/60.-53./3600.),1);
    v["opportunity"] = startFrom(opp_land, opp_lon,d,v,(-61/60.-6/3600.),1);    
    v["curiosity"] = startFrom(cur_land, cur_lon,d,v,(0.0),0.);    
	
    v["lightdistance"] = ms(heliocentric_distance(v.j2000_ott)*499.005215);
    return v;
}
