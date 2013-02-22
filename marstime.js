/*Copyright (c) 2011, Christopher Lee eelsirhc@gmail.com
 All rights reserved.
Mars Calendar and orbit calculation based on Allison and McEwen (2000), Allison (1997)

Allison, M., and M. McEwen 2000. A post-Pathfinder evaluation of aerocentric solar coordinates with improved timing recipes for Mars seasonal/diurnal climate studies. Planet. Space Sci. 48, 215-235

Allison, M. 1997. Accurate analytic representations of solar time and seasons on Mars with applications to the Pathfinder/Surveyor missions. Geophys. Res. Lett. 24, 1967-1970.

http://www.giss.nasa.gov/tools/mars24/
 (Modified BSD license)
     Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
     Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
     Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/ 

function protected_mod(value, modulus)
{
    if (value < 0){
    return (value -Math.floor(value/modulus)*modulus) % modulus}
	else
	{return value % modulus;}
}

function west_to_east(west){
    //Convert from aerographic west longitude to aerocentric east longitude,
    //or vice versa. 
    //west = west longitude
    east = (360 - west) ;//+ 0.271; Removing 0.271 degrees because I'm not sure it's relevent anymore.
    return protected_mod(east, 360.);//javascript has a different interpretation of mod on negative numbers, protect us from the insanity
}

function east_to_west(east){
    //east = east longitude
    return west_to_east(east);
}


function j2000_epoch(){
 //   """Returns the j2000 epoch as a float"""
 // no inputs
    return 2451545.0;
}


function mills(){
//    """Returns the current time in milliseconds Math.since Jan 1 1970"""
//no inputs
    d=new Date;
    return d.getTime();
}


function julian(m){
/*    """Returns the julian day number given milliseconds Math.since Jan 1 1970"""
 m = milliseconds*/
    return 2440587.5 + (m/8.64e7);
}

function utc_to_tt_offset(jday){
/*     """Returns the offset in seconds from a julian date in Universal Coordinated Time (UTC)
     to a Julian day in Terrestrial Time (TT)"""
     jday=julian day
     */

    var jday_vals = new Array(-2441318.5, 0.,    182.,    366.,
                                731.,   1096.,   1461.,   1827.,
                                2192.,   2557.,   2922.,   3469.,
                                3834.,   4199.,   4930.,   5844.,
                                6575.,   6940.,   7487.,   7852.,
                                8217.,   8766.,   9313.,   9862.,
                                12419.,  13515., 14792.);
                       
    for(var c=0;c<jday_vals.length;c++)
    {jday_vals[c] += 2441317.5;}
    
    var offset_vals = new Array(-32.184,10., 11.0, 12.0, 13.0,
                                              14.0, 15.0, 16.0, 17.0, 18.0,
                                              19.0, 20.0, 21.0, 22.0, 23.0,
                                              24.0, 25.0, 26.0, 27.0, 28.0,
                                              29.0, 30.0, 31.0, 32.0, 33.0,
                                              34.0, 35.0);
    
    for(var c=0;c<offset_vals.length;c++)
    {offset_vals[c] += 32.184;}
    
    var l;
    if (jday > jday_vals[jday_vals.length-1])
    {l=jday_vals.length-1;}
    else if(jday < jday_vals[0])
    {l=0;}
    else{
        for(l=0;l<jday_vals.length-2;l++)
        {
            if((jday > jday_vals[l]) && (jday < jday_vals[l+1]))
            {break;}
        }
    }
    
    return offset_vals[l];
}

 
function julian_tt(jday_utc){
/*     """Returns the TT Julian day given a UTC Julian day"""
jday_utc=julian day in UTC
*/

     var jdtt = jday_utc + utc_to_tt_offset(jday_utc)/86400.;
     return jdtt;
 }
 
function j2000_offset_tt(jday_tt){
/*     """Returns the julian day offset Math.since the J2000 epoch"""
jday_tt = julian day in terrestrial time*/
     return (jday_tt - j2000_epoch());
} 
function Mars_Mean_Anomaly(j2000_ott){
/*     """Calculates the Mars Mean Anomaly given a j2000 julian day offset"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var M = 19.3870 + 0.52402075 * j2000_ott;
     return protected_mod(M, 360.);
} 

function FMS_Angle(j2000_ott){
/*     """Returns the Fictional Mean Sun angle"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
   var alpha_fms = 270.3863 + 0.52403840 * j2000_ott;
   return protected_mod(alpha_fms, 360.);
}

function alpha_perturbs(j2000_ott){
/*     """Returns the perturbations to apply to the FMS Angle from orbital perturbations"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var array_A   = new Array(0.0071, 0.0057, 0.0039, 0.0037, 0.0021, 0.0020, 0.0018);
     var array_tau = new Array(2.2353, 2.7543, 1.1177, 15.7866, 2.1354, 2.4694, 32.8493);
     var array_phi = new Array(49.409, 168.173, 191.837, 21.736, 15.704, 95.528, 49.095);

     var pbs = 0;
     for (var i=0;i<array_A.length;i++)
     {
        pbs+=array_A[i]*Math.cos(((0.985626 * j2000_ott/array_tau[i]) + array_phi[i])*Math.PI/180.);
    }
     return pbs;
}

function equation_of_center(j2000_ott){
/*     """The true anomaly (v) - the Mean anomaly (M)"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
      var M = Mars_Mean_Anomaly(j2000_ott)*Math.PI/180.;
     var pbs = alpha_perturbs(j2000_ott);
 
     var val = (10.691 + 3.0e-7 * j2000_ott)*Math.sin(M)
         + 0.6230 * Math.sin(2*M)
         + 0.0500 * Math.sin(3*M)
         + 0.0050 * Math.sin(4*M)
         + 0.0005 * Math.sin(5*M) 
         + pbs;

     return val;
 }
function Mars_Ls_String(ls){
    /*given the Ls, returns a string representation of the approximate 'season'
        j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var d=new Array(0,30,60,90,120,150,180,210,240,270,300,330)
    var s=new Array("Early NH Spring",
                    "NH Spring",
                    "Late NH Spring",                    
                    "Early NH Summer",
                    "NH Summer",                    
                    "Late NH Summer",
                    "Early NH Fall",                    
                    "NH Fall",
                    "Late NH Fall",                    
                    "Early NH Winter",
                    "NH Winter",
                    "Late NH Winter");
    var i;                     
    for(i=0;i<d.length-2;i++)
    {
        if(ls>d[i] && ls<d[i+1])
        {
            break;
        }
    }
    return s[i];
    
}

function Mars_Ls(j2000_ott){
/*     """Returns the Areocentric solar longitude (aka Ls)"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var alpha = FMS_Angle(j2000_ott);
     var v_m   = equation_of_center(j2000_ott);

     var ls = (alpha + v_m);
     ls = protected_mod(ls, 360);
     return ls;
 }

function equation_of_time(j2000_ott){
/*    """Equation of Time, to convert between Local Mean Solar Time
    and Local True Solar Time, and make pretty analemma plots"""
        j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var ls = Mars_Ls(j2000_ott)*Math.PI/180.;

    var EOT = 2.861*Math.sin(2*ls)
        - 0.071 * Math.sin(4*ls)
        + 0.002 * Math.sin(6*ls) - equation_of_center(j2000_ott);

    return EOT;
}

function j2000_from_Mars_Solar_Date(msd){
/*     """Returns j200 based on MSD"""*/
     var j2000_ott = ((msd + 0.00096 - 44796.0) * 1.027491252)+4.5;
     return j2000_ott;
     }
 
function j2000_ott_from_Mars_Solar_Date(msd){ 
/*     """Returns j200 based on MSD"""
msd = mars solar date */
     var j2000 = j2000_from_Mars_Solar_Date(msd);
     var j2000_ott = julian_tt(j2000+j2000_epoch());
     return j2000_ott-j2000_epoch();
} 

function Mars_Solar_Date(j2000_ott){
/*     """Return the Mars Solar date"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var MSD = (((j2000_ott - 4.5)/1.027491252) + 44796.0 - 0.00096);
     return MSD;
     }
     
function Clancy_Year(j2000_ott){
	/*"""Returns the Mars Year date based on the reference date from Clancy(2000): 1955 April 11, 11am"""*/
	var ref1955_4_11_11am = -16336.0416; // j2000 offset tt reference
	var year = Math.floor(1 + (j2000_ott - ref1955_4_11_11am)/686.978);
	return year;    
}

function Mars_Year(j2000_ott)
{
    jday_vals = new Array(-16336.044076, -15649.093471, -14962.0892946, -14275.0960023, -13588.1458658, -12901.1772635, -12214.2082215, -11527.2637345, -10840.2842249, -10153.2828749, -9466.3114025, -8779.3356111, -8092.3607738, -7405.4236452, -6718.4615347, -6031.4574604, -5344.4876509, -4657.5318339, -3970.5474528, -3283.5848372, -2596.6329362, -1909.6426682, -1222.6617049, -535.7040268, 151.2736522, 838.2369682, 1525.1834712, 2212.1799182, 2899.1848518, 3586.1403058, 4273.1024234, 4960.0765368, 5647.0207838, 6333.986502, 7020.9875066, 7707.9629132, 8394.9318782, 9081.9102062, 9768.8526533, 10455.8028354, 11142.8050514, 11829.7873254, 12516.7417734, 13203.725449, 13890.6991502, 14577.6484912, 15264.6324865, 15951.6217969, 16638.5798914, 17325.5517216, 18012.5209097, 18699.4628887, 19386.4443201, 20073.4534421, 20760.4152811, 21447.3696661, 22134.3466251, 22821.2966642, 23508.2529432, 24195.2539572, 24882.2400506, 25569.2081296, 26256.1902459, 26943.1429481, 27630.0847446, 28317.0793316, 29004.0710936, 29691.0238241, 30377.9991486, 31064.9784277, 31751.9249377, 32438.896907, 33125.8902412, 33812.8520242, 34499.8183442, 35186.7944595, 35873.740573, 36560.7112423, 37247.7247318);
    year_vals = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79);
    year_length = new Array(686.95252, 686.950605, 687.0041764, 686.9932923, 686.9501365, 686.9686023, 686.969042, 686.944487, 686.9795096, 687.00135, 686.9714724, 686.9757914, 686.9748373, 686.9371286, 686.9621105, 687.0040743, 686.9698095, 686.955817, 686.9843811, 686.9626156, 686.951901, 686.990268, 686.9809633, 686.9576781, 686.977679, 686.963316, 686.946503, 686.996447, 687.0049336, 686.955454, 686.9621176, 686.9741134, 686.944247, 686.9657182, 687.0010046, 686.9754066, 686.968965, 686.978328, 686.9424471, 686.9501821, 687.002216, 686.982274, 686.954448, 686.9836756, 686.9737012, 686.949341, 686.9839953, 686.9893104, 686.9580945, 686.9718302, 686.9691881, 686.941979, 686.9814314, 687.009122, 686.961839, 686.954385, 686.976959, 686.9500391, 686.956279, 687.001014, 686.9860934, 686.968079, 686.9821163, 686.9527022, 686.9417965, 686.994587, 686.991762, 686.9527305, 686.9753245, 686.9792791, 686.94651, 686.9719693, 686.9933342, 686.961783, 686.96632, 686.9761153, 686.9461135, 686.9706693, 687.0134895);

	if (j2000_ott < jday_vals[0])
	{
		return Math.floor(1 + (j2000_ott - jday_vals[0])/year_length[0]);
	}
	else if(j2000_ott > jday_vals[jday_vals.length-1]) {
		return Math.floor(1 + (1-jday_vals[jday_vals.length-1])/year_length[jday_vals.length-1]);
	}
	else{
		var l=0;
		for(l=0;l<year_vals.length-1;l++)
	    {
			if ((jday_vals[l] <= j2000_ott) && (jday_vals[l+1] > j2000_ott))
			{break;}
	    }
		var y = year_vals[l];
		return y;
	}
}

function Coordinated_Mars_Time(j2000_ott){
/*    """The Mean Solar Time at the Prime Meridian"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var MTC = 24 * (((j2000_ott - 4.5)/1.027491252) + 44796.0 - 0.00096);
    MTC = protected_mod(MTC, 24.);
    return MTC;
}

function Local_Mean_Solar_Time(longitude, j2000_ott){
/*     """The Local Mean Solar Time given a planetographic (west) longitude"""
    longitude = west longitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var MTC = Coordinated_Mars_Time(j2000_ott);
     var LMST = MTC - longitude * (24/360.);
     LMST = protected_mod(LMST,  24);
     return LMST;
 }
 
function Local_True_Solar_Time(longitude, j2000_ott){
/*    """Local true solar time is the Mean solar time + equation of time perturbation"""  
    longitude = west longitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var eot = equation_of_time(j2000_ott);
    var lmst = Local_Mean_Solar_Time(longitude, j2000_ott);
    var ltst = lmst + eot*(24/360.);
    ltst = protected_mod(ltst, 24);
    return ltst;
}

function subsolar_longitude(j2000_ott){
 /*   """returns the longitude of the subsolar point for a given julian day."""
     j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var MTC = Coordinated_Mars_Time(j2000_ott);
    var EOT = equation_of_time(j2000_ott)*24/360.;
    var subsol = (MTC + EOT)*(360/24.) + 180.;
    return protected_mod(subsol, 360.);
}

function solar_declination(ls){
/*     """Returns the solar declination""" 
    ls = calculated by Mars_Ls*/
     var ls1 = ls * Math.PI/180.;
     var dec = Math.asin(0.42565 * Math.sin(ls1)) + 0.25*(Math.PI/180.) * Math.sin(ls1);
     dec = dec * 180. / Math.PI;
     return dec;
 }
 
function heliocentric_distance(j2000_ott){
/*     """Instantaneous orbital radius"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var M = Mars_Mean_Anomaly(j2000_ott)*Math.PI/180.;
     
     var rm = 1.523679 * 
         (1.00436 - 0.09309*Math.cos(M)
              - 0.004336*Math.cos(2*M)
              - 0.00031*Math.cos(3*M)
              - 0.00003*Math.cos(4*M));
 
     return rm;
 }
 
function heliocentric_longitude(j2000_ott){
/*     """Heliocentric longitude, which is not Ls (offsets are different)"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var ls = Mars_Ls(j2000_ott);
     var im = ls + 85.061 - 
         0.015 * Math.sin((71+2*ls)*Math.PI/180.) - 
         5.5e-6*j2000_ott;
     
     return protected_mod(im, 360.);
 }
 
function heliocentric_latitude(j2000_ott){
/*     """Heliocentric Latitude, which is not Ls"""
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var ls        = Mars_Ls(j2000_ott); 
     var bm = -(1.8497 - 2.23e-5*j2000_ott)
         * Math.sin((ls - 144.50 + 2.57e-6*j2000_ott)*Math.PI/180.);
 
     return bm;
 }
 
function hourangle(longitude, j2000_ott){
/*    """Hourangle is the longitude - subsolar longitude"""
    longitude = west longitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var subsol = subsolar_longitude(j2000_ott)*Math.PI/180.;
    var hangle = longitude*Math.PI/180. - subsol;
    return hangle;
}

function solar_zenith(longitude,latitude, j2000_ott){
/*    """Zenith Angle, angle between sun and nadir"""
    longitude = west longitude
    latitude = north latitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var ha = hourangle(longitude, j2000_ott);
    var ls = Mars_Ls(j2000_ott);
    var dec = solar_declination(ls)*Math.PI/180;
    var cosZ = Math.sin(dec) * Math.sin(latitude*Math.PI/180) + 
        Math.cos(dec)*Math.cos(latitude*Math.PI/180.)*Math.cos(ha);

    var Z = Math.acos(cosZ)*180./Math.PI;
    return Z;
}
function solar_elevation(longitude, latitude, j2000_ott){
 /*   """Elevation = 90-Zenith, angle between sun and flat surface """
    longitude = west longitude
    latitude = north latitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
    var Z = solar_zenith(longitude, latitude, j2000_ott);
    return 90. - Z;
}

function solar_azimuth(longitude, latitude, j2000_ott){
/*     """Azimuth Angle, between sun and north pole"""
    longitude = west longitude
    latitude = north latitude
    j2000_ott = julian day in terrestrial time offset form j2000 (calculated by j2000_offset_tt) */
     var ha = hourangle(longitude, j2000_ott);
     var ls = Mars_Ls(j2000_ott);
     var dec = solar_declination(ls)*Math.PI/180.;
     var denom = (Math.cos(latitude)*Math.tan(dec)
                  - Math.sin(latitude)*Math.cos(ha));
 
     var num = Math.sin(ha) ;
 
     var az = protected_mod((360.+Math.atan2(num,denom)*180./Math.PI), 360.);
 
     return az;
 }

