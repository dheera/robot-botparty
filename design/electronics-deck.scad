batt_l = 68;
batt_w = 110;
batt_h = 18;

w_stretch = 6;
w_off = batt_l/2 - 16;

pi_l = 65;
pi_w = 56;
pi_hole_space_l = 58;
pi_hole_space_w = 49;

wheel_dist_l = 48;
m3_insert_d = 4.8;

t = 2;


h=9.5+t*2+2;

module m3insertstandoff() {
    difference() {
        cylinder(d1=8,d2=8,h=8,$fn=32);
        cylinder(d=m3_insert_d,h=10,$fn=32);
    }
}

translate([0,0,2]) {
    for(i=[-40:40:40])
    translate([-15,i,0]) {
        m3insertstandoff();
    }
    
    
    for(i=[-40:40:40])
    translate([40,i,0]) {
        m3insertstandoff();
    }
}

difference() {
    translate([10+t/2,0,0])
    cube_center([batt_l+2*t+20+t,batt_w+2*t,4]);
    
    for(x=[-25:10:35]) {
    for(y=[-40:10:40]) {
        if(!(x==35 && (abs(y)==40||y==0))) {
        translate([x,y,0])
        cylinder(d=2,h=5,$fn=16);
        }
    } }
    
    difference() {
        translate([-batt_l/23.5+11.5,0,2])
        cube_center([batt_l+13,batt_w,4.5]);
        for(s=[-1:1:1])
        translate([0,s*batt_w/2,0])
        cube_center([100,8,4]);
    }
    
    translate([+batt_l/2+2*t+12.5,0,0]) {
        for(s=[-1:1:1])
            translate([3,s*(batt_w/2-15),0]) {
            cylinder(d=3.1,h=3.001,$fn=32);
            translate([0,0,1])
            cylinder(d1=3.1,d2=6,h=3.001,$fn=32);
        }
    }
    
    for(i=[-60:15:60])
    translate([-batt_l/2-t+1,-7.5+i,0])
    cube_center([2,10.5,5]);
    
    translate([-batt_l/2-t+1,0,1.7])    
    cube_center([2,100,5]);
    
    for(s=[-1:2:1])
    translate([s*(batt_l/2-6),batt_w/2-20,0])
    power_cutout();
    
    for(s=[-1:2:1])
    translate([batt_l/2+w_off-10,s*(24.5-3.5-2+4),0])
    motorwire_cutout();
    
    translate([0,batt_w/2-9/2-13.5,0])
    indicator_cutout();

    
    /*
    translate([1,0,1])
    rotate([0,0,90])
    pi_standoffs_holes();
    
    translate([1,0,2])
    rotate([0,0,90])
    pi_dip();
    */
    
}


/*
translate([1,0,4])
rotate([0,0,90])
pi_standoffs();

translate([1,22,2])
dcdc_standoffs();

translate([20,0,2])
rotate([0,0,-90])
bno055_standoffs(h=5);


translate([-4,-23,2])
rotate([0,0,0])
ina219_standoffs(h=5);

translate([-9.5,0,2])
rotate([0,0,180])
powerboost_standoffs();
*/

module pi_dip() {
    difference() {
        cube_center([pi_l,pi_w,5]);
        translate([-pi_hole_space_l/2,pi_hole_space_w/2])
        cylinder(d=10,h=5,$fn=32);
        translate([pi_hole_space_l/2,pi_hole_space_w/2])
        cylinder(d=10,h=5,$fn=32);
        translate([-pi_hole_space_l/2,-pi_hole_space_w/2])
        cylinder(d=10,h=5,$fn=32);
        translate([pi_hole_space_l/2,-pi_hole_space_w/2])
        cylinder(d=10,h=5,$fn=32);
    }
}

module breadboard() {
    for (i = [-10:4:10]) {
        for (j = [-38:4:38]) {
            translate([i,j,0])
            cylinder(d=1.8,h=10,$fn=8);
        }
    }
}

module motorwire_cutout() {
    cube_center([5,16,10]);
}

module indicator_cutout() {
    cube_center([15,9,10]);
}

module power_cutout() {
    cube_center([8,14,10]);
}

module pi_cutout() {
    minkowski() {
        cube_center([pi_l-4,pi_w-4,10]);
        cylinder(d=4,$fn=16);
    }
}

module dcdc_standoffs() {
    translate([-36/2,11/2,0])
    standoff2();
    translate([36/2,-11/2,0])
    standoff2();
    difference() {
        cube_center([40,15,0.3]);
        cube_center([39.4,14.4,1]);
    }
}

module ina219_standoffs(h=3) {
    translate([-20/2,17/2,0])
    standoff2(h=h);
    translate([20/2,-17/2,0])
    standoff2(h=h);
    translate([-20/2,-17/2,0])
    standoff2(h=h);
    translate([20/2,17/2,0])
    standoff2(h=h);
    difference() {
        cube_center([25,22,0.3]);
        cube_center([24.4,21.4,1]);
    }
}

module bno055_standoffs(h=3) {
    translate([-21.5/2,15/2,0])
    standoff2(h=h);
    translate([21.5/2,-15/2,0])
    standoff2(h=h);
    translate([-21.5/2,-15/2,0])
    standoff2(h=h);
    translate([21.5/2,15/2,0])
    standoff2(h=h);
    difference() {
        cube_center([26,20,0.3]);
        cube_center([25.4,19.4,1]);
    }
}

module powerboost_standoffs() {
    translate([31.5/2,17.5/2,0])
    standoff2();
    translate([31.5/2,-17.5/2,0])
    standoff2();
    translate([-31.5/2,-13/2,0])
    standoff2();
    translate([-31.5/2,13/2,0])
    standoff2();
    difference() {
        cube_center([35,22,0.3]);
        cube_center([34.4,21.4,1]);
    }
}

module standoff2(h=3.5) {
    difference() {
        cylinder(d1=4.5,d2=3.5,h=h,$fn=32);
        cylinder(d=1.8,h=5,$fn=32);
    }
}

module pi_standoffs() {
    translate([-pi_hole_space_l/2,-pi_hole_space_w/2])
    standoff();
    translate([pi_hole_space_l/2,-pi_hole_space_w/2])
    standoff();
    translate([-pi_hole_space_l/2,pi_hole_space_w/2])
    standoff();
    translate([pi_hole_space_l/2,pi_hole_space_w/2])
    standoff();
}

module pi_standoffs_holes() {
    translate([-pi_hole_space_l/2,-pi_hole_space_w/2])
    cylinder(d=m3_insert_d,h=5,$fn=32);
    translate([pi_hole_space_l/2,-pi_hole_space_w/2])
    cylinder(d=m3_insert_d,h=5,$fn=32);
    translate([-pi_hole_space_l/2,pi_hole_space_w/2])
    cylinder(d=m3_insert_d,h=5,$fn=32);
    translate([pi_hole_space_l/2,pi_hole_space_w/2])
    cylinder(d=m3_insert_d,h=5,$fn=32);
}

module standoff(h=3.5) {
    difference() {
        cylinder(d1=8,d2=8,h=h,$fn=32);
        cylinder(d=m3_insert_d,h=h,$fn=32);
    }
}

module cube_center(dims) {
    translate([-dims[0]/2, -dims[1]/2, 0])
    cube(dims);
}


module triangle() {
scale([1,1,1])
rotate([0,-90,90])
linear_extrude(height = batt_w+2*t, center = true, convexity = 10, twist = 0)
polygon(points=[[0,0],[batt_h+t,8],[batt_h+t,0]]);
}

module triangle2() {
scale([1,1,1])
rotate([0,-90,0])
linear_extrude(height = 16, center = true, convexity = 10, twist = 0)
polygon(points=[[0,0],[5,7],[5,0]]);
}
