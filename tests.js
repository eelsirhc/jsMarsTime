function within(val, low, high){
    return (val>low)&&(val<high);
}

function within_error(val, equal, error){
    return (val>(equal-error))&&(val<(equal+error));
}

function assert(current,label,value)
{
	current = current && value;
	return current;
}

function test_should_pass(){
	var test = true;
	test = assert(test,"should be true",true);
	return test;
}

function test_should_fail(){
	var test = true;
	test = assert(test,"should be false",test == false);
	return !test;
}

function test_west_to_east()
{	
	var test = true;
    test=assert(test,"1",within_error(west_to_east(360.0),0.0,1e-8));
    test=assert(test,"2",within_error(west_to_east(540.0)- west_to_east(180.0),0.0,1e-5));
	return test;
}

function test_east_to_west(){
    return(true,"east_to_west1", west_to_east(0.0) == east_to_west(0.0));
}

function test_j2000_epoch(){
    return (true,"j2000_epoch",j2000_epoch() == 2451545.0);
}

function test_julian(){
	var tf=true;
    tf=assert(tf,"julian1", julian(0) == 2440587.5);
    tf=assert(tf,"julian2", julian(8.64e7) == 2440588.5);
    tf=assert(tf,"julian3", julian(8.64e10) == julian(0)+1000);
	return tf;
}

function test_utc_to_tt_offset(){
	var tf=true;
    t =  j2000_epoch();
//    #j2000 is Jan 1 2000, utc offset should be =32+32.184
    tf=assert(tf,"utc_to_tt_offset1",within_error(utc_to_tt_offset(t), 64.184, 1e-3))

    t = j2000_epoch() - 5*365.
    tf=assert(tf,"utc_to_tt_offset2",within_error(utc_to_tt_offset(t), 61.184, 1e-3))

    t=1
    tf=assert(tf,"utc_to_tt_offset3",within_error(utc_to_tt_offset(t), 0, 1e-3))

    t=j2000_epoch() + 365*9.+3*366.+190; //~July 2012
    tf=assert(tf,"utc_to_tt_offset3",within_error(utc_to_tt_offset(t), 67.184, 1e-3))
	return tf;

}

function test_julian_tt(){
   var tf=true;
    tf=assert(tf,"test_julian_tt1",julian_tt(0) == 0);
    v = julian_tt(j2000_epoch())-j2000_epoch();
    tf=assert(tf,"test_julian_tt2",within_error(v,64.184/86400.,1e-5));
    return tf;
}
function test_j2000_offset_tt(){
 var tf=true;
    tf=assert(tf,"test_j2000_offset_tt1",j2000_offset_tt(j2000_epoch())==0);
    tf=assert(tf,"test_j2000_offset_tt2",j2000_offset_tt(2451645)==100);
    return tf;
}
function test_Mars_Mean_Anomaly(){
 var tf=true;

    tf=assert(tf,"test_Mars_Mean_Anomaly1",within_error(Mars_Mean_Anomaly(0.0),19.387,1e-4));
    tf=assert(tf,"test_Mars_Mean_Anomaly2",within_error(Mars_Mean_Anomaly(1000.0),183.4077, 1e-4));
	tf=assert(tf,"test_Mars_Mean_Anomaly3",!within_error(Mars_Mean_Anomaly(1000.0),181.4077, 1e-4));
	
return tf;
}

function test_FMS_Angle(){
 var tf=true;

    tf=assert(tf,"test_FMS_Angle1",within_error(FMS_Angle(0.0), 270.3863, 1e-4));
    tf=assert(tf,"test_FMS_Angle2",within_error(FMS_Angle(1000.0), 74.4247, 1e-4));

return tf;
}
function test_alpha_perturbs(){
 var tf=true;

    tf=assert(tf,"test_alpha_perturbs1",within_error(alpha_perturbs(0.0), 0.001668,2e-5 )    );
    tf=assert(tf,"test_alpha_perturbs2",within_error(alpha_perturbs(1000.0), -0.007903, 2e-5));

return tf;
}

function test_equation_of_center(){
 var tf=true;

    tf=assert(tf,"test_equation_of_center1",within_error(equation_of_center(0.0), 3.98852, 2e-5)   );
    tf=assert(tf,"test_equation_of_center2",within_error(equation_of_center(1000.0),-0.57731, 2e-5));

return tf;
}
function test_Mars_Ls(){
 var tf=true;

    tf=assert(tf,"test_Mars_Ls1",within_error(Mars_Ls(4120),273,0.5)    );
    tf=assert(tf,"test_Mars_Ls2",within_error(Mars_Ls(0),274.37,1e-2)   );
    tf=assert(tf,"test_Mars_Ls3",within_error(Mars_Ls(1000),73.847,1e-2));
    tf=assert(tf,"test_Mars_Ls3",within_error(Mars_Ls(-3652.5),145.819,1e-2));

return tf;
}
function test_equation_of_time(){
 var tf=true;

    tf=assert(tf,"test_equation_of_time1",within_error(equation_of_time(0.0), -4.44596,1e-5)  );
    tf=assert(tf,"test_equation_of_time2",within_error(equation_of_time(1000.0), 2.17244,1e-5));

return tf;
}

function test_j2000_from_Mars_Solar_Date(){
 var tf=true;
  tf=assert(tf,"test_j2000_from_Mars_Solar_Date1",within_error(j2000_from_Mars_Solar_Date(44795.99904), 4.5,1e-2 ));
  tf=assert(tf,"test_j2000_from_Mars_Solar_Date2",within_error(j2000_from_Mars_Solar_Date(0), -46022.997,1e-3    ));

return tf;
}

function test_j2000_ott_from_Mars_Solar_Date(){
 var tf=true;

    tf=assert(tf,"test_j2000_ott_from_Mars_Solar_Date1",within_error(j2000_ott_from_Mars_Solar_Date(0.0), -46022.997, 1e-3) );

    tf=assert(tf,"test_j2000_ott_from_Mars_Solar_Date2",within_error(j2000_ott_from_Mars_Solar_Date(1000), -44995.505, 1e-3));

    t=Mars_Solar_Date(0);
    tf=assert(tf,"test_j2000_ott_from_Mars_Solar_Date3",within_error(j2000_ott_from_Mars_Solar_Date(t), 0.0007428,1e-5));
return tf;
}

function test_Clancy_Year(){
 var tf=true;
//    #j2000_epoch = 0.0 offset
    tf=assert(tf,"test_Clancy_Year1",within_error(Clancy_Year(0.0), 24, 0.5));
//    #1955 april 11th 12pm, julian date = 2435208.955
//    #offset = -16336.0
//    #my 1
    tf=assert(tf,"test_Clancy_Year2",within_error(Clancy_Year(-16335.0), 1, 0.5));
//    #6 months later, same year
    tf=assert(tf,"test_Clancy_Year3",within_error(Clancy_Year(-16200.0), 1, 0.5));
//    #6 months earlier, 0 year
    tf=assert(tf,"test_Clancy_Year4",within_error(Clancy_Year(-16500.0), 0, 0.5));

return tf;
}
function test_Mars24_Year(){
 var tf=true;

//    #j2000_epoch = 0.0 offset
    tf=assert(tf,"test_Mars24_Year1",within_error(Mars_Year(0.0), 24, 0.5));
//    #1955 april 11th 12pm, julian date = 2435208.955
//    #offset = -16336.0
//    #my 1
    tf=assert(tf,"test_Mars24_Year2",within_error(Mars_Year(-16335.0), 1, 0.5));
//    #6 months later, same year
    tf=assert(tf,"test_Mars24_Year3",within_error(Mars_Year(-16200.0), 1, 0.5));
//    #6 months earlier, 0 year
    tf=assert(tf,"test_Mars24_Year4",within_error(Mars_Year(-16500.0), 0, 0.5));

    
return tf;
}

function test_Coordinated_Mars_Time(){
 var tf=true;

    tf=assert(tf,"test_Coordinated_Mars_Time1",within_error(Coordinated_Mars_Time(0.0), 14.8665, 2e-4));
//    #1 mars hour later
    tf=assert(tf,"test_Coordinated_Mars_Time2",within_error(Coordinated_Mars_Time(3698.9685/86400.), 15.8665, 2e-4));
//    #1 mars day later
    tf=assert(tf,"test_Coordinated_Mars_Time3",within_error(Coordinated_Mars_Time(88775.244/86400.), 14.8665, 2e-4));
    

return tf;
}

function test_Local_Mean_Solar_Time(){
 var tf=true;

    tf=assert(tf,"test_Local_Mean_Solar_Time1",within_error(Local_Mean_Solar_Time(0,0)
                        -Local_Mean_Solar_Time(15,0), 1.0, 1e-2));


return tf;
}

function test_Local_True_Solar_Time(){
 var tf=true;

    tf=assert(tf,"test_Local_True_Solar_Time1",within_error(Local_True_Solar_Time(0,0)
                        -Local_True_Solar_Time(15,0), 1.0, 1e-2));

return tf;
}

function test_subsolar_longitude(){
 var tf=true;

    tf=assert(tf,"test_subsolar_longitude1",within_error(subsolar_longitude(0.0)-
                        subsolar_longitude(3698.9685/86400.),
                        -14.99, 1e-2));

return tf;
}

function test_solar_declination(){
 var tf=true;

    tf=assert(tf,"test_solar_declination1",within_error(solar_declination(0.0)  ,0.0,1e-3)    );
    tf=assert(tf,"test_solar_declination2",within_error(solar_declination(90.0) ,25.441,1e-3) );
    tf=assert(tf,"test_solar_declination3",within_error(solar_declination(180.0),0.0,1e-3)    );
    tf=assert(tf,"test_solar_declination4",within_error(solar_declination(270.0),-25.441,1e-3));

return tf;
}
function test_heliocentric_distance(){
 var tf=true;

    tf=assert(tf,"test_heliocentric_distance1",within_error(heliocentric_distance(0.0), 1.391,1e-3)   );
    tf=assert(tf,"test_heliocentric_distance2",within_error(heliocentric_distance(1000.0), 1.665,1e-3));

return tf;
}
function test_heliocentric_longitude(){
 var tf=true;

    tf=assert(tf,"test_heliocentric_longitude1",within_error(heliocentric_longitude(0.0), 359.45,1e-3)    );
    tf=assert(tf,"test_heliocentric_longitude2",within_error(heliocentric_longitude(1000.0), 158.912,1e-3));

return tf;
}
function test_heliocentric_latitude(){
 var tf=true;

    tf=assert(tf,"test_heliocentric_latitude1",within_error(heliocentric_latitude(0.0), -1.4195,1e-3) );
    tf=assert(tf,"test_heliocentric_latitude2",within_error(heliocentric_latitude(1000.0), 1.724,1e-3));

return tf;
}
function test_hourangle(){
 var tf=true;

    tf=assert(tf,"test_hourangle1",within_error(hourangle(0.0,0.0), -0.67287, 1e-4));
    tf=assert(tf,"test_hourangle2",within_error((hourangle(15.0,0.0)-
                        hourangle(0.0,0.0))*180/Math.PI
                        , 15,1e-3));

return tf;
}
function test_solar_zenith(){
 var tf=true;

    j2day=151.2737 //ls=0
    x = subsolar_longitude(j2day)
    tf=assert(tf,"test_solar_zenith1",within_error(x,114.113,1e-3)                );
    tf=assert(tf,"test_solar_zenith2",within_error(solar_zenith(x,0,j2day),0,1e-4));

return tf;
}
function test_solar_zenith_and_elevation(){
 var tf=true;

    j2day=151.2737 //ls=0
    x = subsolar_longitude(j2day)
    tf=assert(tf,"test_solar_zenith_and_elevation1",within_error(x,114.113,1e-3)                    );
    tf=assert(tf,"test_solar_zenith_and_elevation2",within_error(solar_zenith(x,0,j2day),0,1e-4)    );
    tf=assert(tf,"test_solar_zenith_and_elevation3",within_error(solar_zenith(x,15,j2day),15,1e-4)  );
    tf=assert(tf,"test_solar_zenith_and_elevation4",within_error(solar_zenith(x+15,0,j2day),15,1e-4));
    tf=assert(tf,"test_solar_zenith_and_elevation5",within_error(solar_elevation(x,45,j2day)-
                        solar_zenith(x,45,j2day)
                        ,0,1e-4));

    j2day=349.8778 //ls=90
    x = subsolar_longitude(j2day)
    tf=assert(tf,"test_solar_zenith_and_elevation6",within_error(x,232.7006,1e-3)                        );
    tf=assert(tf,"test_solar_zenith_and_elevation7",within_error(solar_zenith(x,0,j2day),25.441,1e-3)    );
    tf=assert(tf,"test_solar_zenith_and_elevation8",within_error(solar_elevation(x,0,j2day),64.5581,1e-4));
    //a= solar_zenith(0,100,0)
    //tf=assert(tf,"test_solar_zenith_and_elevation9",true)
    //a= solar_zenith(0,-100,0)
    //tf=assert(tf,"test_solar_zenith_and_elevation12",true)

return tf;
}

function test_solar_azimuth(){
 var tf=true;

    j2day=151.2737;//ls=0;
    x = subsolar_longitude(j2day);
    tf=assert(tf,"test_solar_azimuth1",within_error(x,114.113,1e-3));
    tf=assert(tf,"test_solar_azimuth2",within_error(solar_azimuth(x +10,0,j2day),90,1e-3));
    tf=assert(tf,"test_solar_azimuth3",within_error(solar_azimuth(x-10,0,j2day),270,1e-3));
    tf=assert(tf,"test_solar_azimuth4",within_error(solar_azimuth(x,45,j2day),180,1e-3));
    tf=assert(tf,"test_solar_azimuth5",within_error(solar_azimuth(x,-45,j2day),0,1e-3));

return tf;
}

function test_on_mills(){
 var tf=true;

    mills=959804082*1e3;
    j2k_ott = j2000_offset_tt(julian_tt(julian(mills)));
    tf=assert(tf,"test_on_mills1",within_error(j2k_ott, 151.344, 0.001));
    ls = Mars_Ls(j2k_ott);
    cy = Clancy_Year(j2k_ott);
    my = Mars_Year(j2k_ott);
    tf=assert(tf,"test_on_mills2",within_error(ls, 0.0352, 0.001));
    tf=assert(tf,"test_on_mills3",within_error(cy, 24, 0.5));
    tf=assert(tf,"test_on_mills4",within_error(my, 25, 0.5));
    

return tf;
}

function test_midnight_crossing(){
 var tf=true;

    mil = 947116800000
    longitude=0.
    latitude=0.
    jdut = julian(mil);
    tf=assert(tf,"test_midnight_crossing1",within_error(jdut,2451549.5,1e-3));
    
    tt_utc = utc_to_tt_offset(jdut);
    tf=assert(tf,"test_midnight_crossing2",within_error(tt_utc,64.184,1e-3));
    
    jday_tt = julian_tt(jdut);
    tf=assert(tf,"test_midnight_crossing3",within_error(jday_tt, 2451549.50074,1e-3));
    
    j2000_ott = j2000_offset_tt(jday_tt);
    tf=assert(tf,"test_midnight_crossing4",within_error(j2000_ott, 4.50074, 1e-3));

    m = Mars_Mean_Anomaly(j2000_ott);
    tf=assert(tf,"test_midnight_crossing5",within_error(m, 21.74548,1e3));

    alpha = FMS_Angle(j2000_ott);
    tf=assert(tf,"test_midnight_crossing6",within_error(alpha, 272.74486,1e-4));

    pbs = alpha_perturbs(j2000_ott);
    tf=assert(tf,"test_midnight_crossing7",within_error(pbs, 0.00142, 1e-3));

    v_m = equation_of_center(j2000_ott);
    tf=assert(tf,"test_midnight_crossing8",within_error(v_m, 4.44191, 1e-4));

    ls = Mars_Ls(j2000_ott);
    tf=assert(tf,"test_midnight_crossing9",within_error(ls, 277.18677, 1e-4));

    eot = equation_of_time(j2000_ott);
    tf=assert(tf,"test_midnight_crossing10",within_error(eot, -5.18764, 1e-4));

    mtc = Coordinated_Mars_Time(j2000_ott);
    tf=assert(tf,"test_midnight_crossing11",within_error(mtc,23.99431, 1e-4));

    lmst = Local_Mean_Solar_Time(longitude,j2000_ott);
    tf=assert(tf,"test_midnight_crossing12",within_error(lmst, 23.99431, 1e-4));

    ltst = Local_True_Solar_Time(longitude,j2000_ott);
    tf=assert(tf,"test_midnight_crossing13",within_error(ltst, 23.64847, 1e-4));

    subsol = subsolar_longitude(j2000_ott);
    tf=assert(tf,"test_midnight_crossing14",within_error(subsol, 174.72703,1e-4));

    dec = solar_declination(ls);
    tf=assert(tf,"test_midnight_crossing15",within_error(dec, -25.22838,1e-4));

    rm = heliocentric_distance(j2000_ott);
    tf=assert(tf,"test_midnight_crossing16",within_error(rm, 1.39358, 1e-4));

    im = heliocentric_longitude(j2000_ott);
    tf=assert(tf,"test_midnight_crossing17",within_error(im, 2.26270, 1e-4));

    bm = heliocentric_latitude(j2000_ott);
    tf=assert(tf,"test_midnight_crossing18",within_error(bm, -1.35959, 1e-4));

    sz = solar_zenith(longitude, latitude,j2000_ott);
    tf=assert(tf,"test_midnight_crossing19",within_error(sz, 154.26182, 1e-4));

    sa = solar_azimuth(longitude, latitude,j2000_ott);
    tf=assert(tf,"test_midnight_crossing20",within_error(sa, 191.03687,1e-4));


return tf;
}
function test_spirit_landing(){
 var tf=true;

    mil = 1073137591000
    longitude=184.702
    latitude=-14.460
    jdut = julian(mil);
    tf=assert(tf,"test_spirit_landing1",within_error(jdut,2453008.07397,1e-3));
    
    tt_utc = utc_to_tt_offset(jdut);
    tf=assert(tf,"test_spirit_landing2",within_error(tt_utc,64.184,1e-3));
    
    jday_tt = julian_tt(jdut);
    tf=assert(tf,"test_spirit_landing3",within_error(jday_tt, 2453008.07471,1e-3));
    
    j2000_ott = j2000_offset_tt(jday_tt);
    tf=assert(tf,"test_spirit_landing4",within_error(j2000_ott, 1463.07471, 1e-3));

    m = Mars_Mean_Anomaly(j2000_ott);
    tf=assert(tf,"test_spirit_landing5",within_error(m, 66.06851,1e3));

    alpha = FMS_Angle(j2000_ott);
    tf=assert(tf,"test_spirit_landing6",within_error(alpha, 317.09363,1e-4));

    pbs = alpha_perturbs(j2000_ott);
    tf=assert(tf,"test_spirit_landing7",within_error(pbs, 0.01614, 1e-3));

    v_m = equation_of_center(j2000_ott);
    tf=assert(tf,"test_spirit_landing8",within_error(v_m, 10.22959, 1e-4));

    ls = Mars_Ls(j2000_ott);
    tf=assert(tf,"test_spirit_landing9",within_error(ls, 327.32322, 1e-4));

    eot = equation_of_time(j2000_ott);
    tf=assert(tf,"test_spirit_landing10",within_error(eot, -12.77557, 1e-4));

    mtc = Coordinated_Mars_Time(j2000_ott);
    tf=assert(tf,"test_spirit_landing11",within_error(mtc,13.16542, 1e-4));

    lmst = Local_Mean_Solar_Time(longitude,j2000_ott);
    tf=assert(tf,"test_spirit_landing12",within_error(lmst, 0.85196, 1e-4));

    ltst = Local_True_Solar_Time(longitude,j2000_ott);
    tf=assert(tf,"test_spirit_landing13",within_error(ltst, 0.00025, 1e-5));

    subsol = subsolar_longitude(j2000_ott);
    tf=assert(tf,"test_spirit_landing14",within_error(subsol, 4.70575,1e-4));

    dec = solar_declination(ls);
    tf=assert(tf,"test_spirit_landing15",within_error(dec, -13.42105,1e-2));

    rm = heliocentric_distance(j2000_ott);
    tf=assert(tf,"test_spirit_landing16",within_error(rm,1.47767, 1e-4));

    im = heliocentric_longitude(j2000_ott);
    tf=assert(tf,"test_spirit_landing17",within_error(im, 52.37469, 1e-4));

    bm = heliocentric_latitude(j2000_ott);
    tf=assert(tf,"test_spirit_landing18",within_error(bm, 0.08962, 1e-4));

//#This is where we deviate significantly from the original Mars24 algorithm.
    sz = solar_zenith(longitude, latitude,j2000_ott);
    tf=assert(tf,"test_spirit_landing19",within_error(sz, 151.93895, 0.2));

    sa = solar_azimuth(longitude, latitude,j2000_ott);
    tf=assert(tf,"test_spirit_landing20",within_error(sa, 179.99225,1e-2));


return tf;
}

