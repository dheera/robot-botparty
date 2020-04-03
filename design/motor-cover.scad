batt_l = 66;
batt_w = 108;
batt_h = 19;

w_stretch = 5;
w_off = batt_l/2 - 16;

pi_l = 65;
pi_w = 56;
pi_hole_space_l = 58;
pi_hole_space_w = 49;

wheel_dist_l = 48;
m3_insert_d = 4.8;

t = 2;

    top_space = 4;
    h=12;

difference() {
    union() {
        cube_center([16,batt_w+7+7 + 2*t,1]);
        cube_center([16,batt_w + 4 + 4 + 2*t,top_space]);

        translate([16/2+8/2,0,0])
        cube_center([8,batt_w+2*t,top_space]);

        translate([0,-batt_w/2-t-4,1])
        rotate([0,0,90])
        scale([3,16,3])
        triangle();

        translate([0,batt_w/2+t+4,1])
        rotate([0,0,90])
        scale([-3,16,3])
        triangle();

    }

translate([-7,0,0,])
cube_center([2,batt_w+2*t+0.2,10]);

translate([-6.5,0,0])
cube_center([1.1,150,1.1]);

translate([6.5,0,0])
cube_center([1.1,150,1.1]);

translate([11.5,-batt_w/2+4,0]) {
translate([0,0,1])
cylinder(d1=3.1,d2=6.1,h=3.001,$fn=32);
translate([0,0,0])
cylinder(d1=3.1,d2=3.1,h=3,$fn=32);
}

translate([11.5,batt_w/2-4,0]) {
translate([0,0,1])
cylinder(d1=3.1,d2=6.1,h=3.001,$fn=32);
translate([0,0,0])
cylinder(d1=3.1,d2=3.1,h=3,$fn=32);
}

translate([-2,0,0]) {
translate([0,0,1])
cylinder(d1=3.1,d2=6.1,h=3.001,$fn=32);
translate([0,0,0])
cylinder(d1=3.1,d2=3.1,h=3,$fn=32);
}

translate([11.5,-batt_w/2+15,0])
cylinder(d=m3_insert_d,h=5,$fn=32);
translate([11.5,0,0])
cylinder(d=m3_insert_d,h=5,$fn=32);
translate([11.5,batt_w/2-15,0])
cylinder(d=m3_insert_d,h=5,$fn=32);

translate([0,-19,0])
cube_center([12,16,0.75]);
translate([0,-24.5+3.5+2,0])
cube_center([5,16,4]);

translate([0,19,0])
cube_center([12,16,0.75]);
translate([0,24.5-3.5-2,0])
cube_center([5,16,4]);

}


translate([-12/2+3/2,batt_w/2+7+t-3.5/2-1,-.5])
cube_center([3,3.5,0.5]);

translate([-12/2+3/2,batt_w/2+7+t-2/2-5.75,-.5])
cube_center([3,2,0.5]);

translate([12/2-1/2,batt_w/2+7+t-3.5/2-9,-1])
cube_center([1,3.5,1]);

translate([-12/2+1/2,batt_w/2+7+t-3.5/2-9,-1])
cube_center([1,3.5,1]);

rotate([0,0,180]) {
translate([-12/2+3/2,batt_w/2+7+t-3.5/2-1,-.5])
cube_center([3,3.5,0.5]);

translate([-12/2+3/2,batt_w/2+7+t-2/2-5.75,-.5])
cube_center([3,2,0.5]);
    
translate([12/2-1/2,batt_w/2+7+t-3.5/2-9,-1])
cube_center([1,3.5,1]);

translate([-12/2+1/2,batt_w/2+7+t-3.5/2-9,-1])
cube_center([1,3.5,1]);
}

module cube_center(dims) {
    translate([-dims[0]/2, -dims[1]/2, 0])
    cube(dims);
}
 
module triangle() {
rotate([0,-90,90])
linear_extrude(height = 1, center = true, convexity = 10, twist = 0)
polygon(points=[[0,0],[0,1],[1,0]]);
}
