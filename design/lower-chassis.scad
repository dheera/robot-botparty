batt_l = 68;
batt_w = 110;
batt_h = 18;

w_stretch = 2;
w_off = batt_l/2 - 16;

/*
translate([-8,batt_w/2+10,11])
rotate([90,0,0])
cylinder(d=3,$fn=32);
translate([-8+48+2,batt_w/2+10,11])
rotate([90,0,0])
cylinder(d=3,$fn=32);
*/

/*
translate([-8.5,batt_w/2+15,10])
rotate([90,0,0])
cylinder(d=35);
translate([-8.5+48+2,batt_w/2+15,10])
rotate([90,0,0])
cylinder(d=35);
*/

pi_l = 65;
pi_w = 56;
pi_hole_space_l = 58;
pi_hole_space_w = 49;

wheel_dist_l = 48;
m3_insert_d = 4.8;

t = 2;

    //h=9.5+t*2+2;
    
    top_space = 4;
    h=12;


/*
translate([0,0,35])
rotate([0,0,90])
cube_center([105,65,17]);
*/
/*
translate([batt_l/2+20,0,30])
cube_center([8.5,143.8,69.5]);
*/

    translate([batt_l/2+5+1.5*t,0,0])
    cube_center([16,batt_w+2*t,6]);

difference() {
    cube_center([batt_l+2*t,batt_w+2*t,batt_h + t]);
    translate([0,0,t])
    cube_center([batt_l,batt_w,batt_h * 2]);
    
    translate([14,100,2+9-8/2])
    cube_center([14,100,8]);
    
        translate([-wheel_dist_l/2+w_off-w_stretch,0,(h+t)/2+batt_h+t-h-top_space])
        rotate([90,0,0])
        cylinder(d=m3_insert_d, h=500, center=true, $fn=32);
}

difference() {
wheelbars();
    scale([1,1,-1])
cube_center([200,200,100]);
}

module cube_center(dims) {
    translate([-dims[0]/2, -dims[1]/2, 0])
    cube(dims);
}



module wheelbars() {
    
    //h=15.5;
    
    translate([0,0,batt_h+t - h - top_space])
    difference() {
        union() {
            
            translate([0,batt_w/2+t+3.5,0])
            translate([6+t/2,0,0])
            cube_center([batt_l + 2*t + 12 + t, 7, h]);
            translate([0,-(batt_w/2+t+3.5),0])
            translate([6+t/2,0,0])
            cube_center([batt_l + 2*t + 12 + t, 7, h]);
            
            translate([batt_l/2 + 6 + t*1.5 ,0,0])
            cube_center([16+t-4,batt_w + 2*t, h]);
        
            translate([-wheel_dist_l/2+w_off-w_stretch,batt_w/2+t-2,-5])
            triangle2();
            translate([wheel_dist_l/2+w_off,batt_w/2+t,-5])
            triangle2();
            
        translate([-wheel_dist_l/2+w_off-w_stretch,-(batt_w/2+t)+2,-5])
            scale([1,-1,1])
        triangle2();
        translate([wheel_dist_l/2+w_off,-(batt_w/2+t),-5])
            scale([1,-1,1])
            triangle2();    
                    
        }
    
        translate([w_off-w_stretch/2,batt_w/2 + 7, 0])
        cube_center([32+w_stretch, 10, h]);
        
        translate([w_off-w_stretch/2,-(batt_w/2 + 7), 0])
        cube_center([32+w_stretch, 10, h]);
        
        translate([w_off-14.5-32.5-w_stretch,batt_w/2 + 7, 0])
        cube_center([30, 10, h]);
        
        translate([w_off-14.5-32.5-w_stretch,-(batt_w/2 + 7), 0])
        cube_center([30, 10, h]);
        
        
        translate([-32.5,-(batt_w/2 + 7+ 5), 0])
        cube_center([80, 10, h]);
        
        translate([-32.5,(batt_w/2 + 7+ 5), 0])
        cube_center([80, 10, h]);
        
        translate([-wheel_dist_l/2+w_off-w_stretch,0,(h+t)/2])
        rotate([90,0,0])
        cylinder(d=m3_insert_d, h=200, center=true, $fn=32);
        
        
    translate([wheel_dist_l/2+w_off-2,0,h-6])
        cylinder(d=m3_insert_d,h=100,$fn=32);
        
        // motor mount cutouts
        for(sign=[-1:2:1])
        translate([wheel_dist_l/2+w_off,sign*(batt_w/2 + t +7 - 38/2),t])
        rotate([0,0,sign*90+90])
        motor_mount_cutout();
        
    }
    
}

module motor_mount_cutout() {
        difference() {
            union() {
                cube_center([12,38.001,9.5+5]);
                //translate([0,-38/2+24+5/2,0])
                //cube_center([14,5,9.5+5]);
                
                translate([0,24.5-3.5,0])
                cube_center([12,16,15]);
            }
            translate([-4,-38/2+1+3.5/2,0])
            cube_center([3,3.5,0.5]);
            translate([-5.75,-38/2+1+3.5/2,0])
            cube_center([0.5,3.5,2]);
            
            translate([-4,-38/2+5.75+2/2,0])
            cube_center([3,2,0.5]);
            translate([-5.75,-38/2+5.75+2/2,0])
            cube_center([0.5,2,2]);
            
            translate([0,-38/2+24+0.3/2,0])
            cube_center([14,0.3,0.5]);
            
            translate([-12/2+1/2,-38/2+9+5/2,0])
            cube_center([1,5,1]);
            translate([12/2-1/2,-38/2+9+5/2,0])
            cube_center([1,5,1]);
        }
}

translate([+batt_l/2+2*t+12,0,0])
{
    difference() {
        scale([-1,1,1]) triangle();
        translate([3.5,batt_w/2-4,batt_h+t-top_space - 6.5])
        cylinder(d=m3_insert_d,h=100,$fn=32);
        translate([3.5,-batt_w/2+4,batt_h+t-top_space - 6.5])
        cylinder(d=m3_insert_d,h=100,$fn=32);
    }
}

module triangle() {
scale([1,1,1])
rotate([0,-90,90])
linear_extrude(height = batt_w+2*t, center = true, convexity = 10, twist = 0)
polygon(points=[[0,0],[12,8],[batt_h+t-top_space,8],[batt_h+t-top_space,0]]);
}

module triangle2() {
scale([1,1,1])
rotate([0,-90,0])
linear_extrude(height = 16, center = true, convexity = 10, twist = 0)
polygon(points=[[0,0],[5,7],[5,0]]);
}


for(q=[0:1:1])
translate([w_off +17.5+ q*13,0,batt_h + t - top_space])
difference() {
    cube_center([1,batt_w+2*7+2*t,1]);
    //for(sign=[-1:2:1])
    //translate([0,sign*(batt_w/2-17.5),0])
    //cube_center([5,5,5]);
}


translate([-batt_l/2-t/2,0,batt_h+t]) {
    difference() {
        cube_center([2,batt_w+2*t,4]);
        for(i=[-45:15:45]) {
        translate([0,-i,0])
        cube_center([2,5,2]);
        }
            
    }
}
