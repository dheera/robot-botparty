translate([0,8,0])
difference() {
    cube_center([102,8,8.5]);
    translate([0,-2,9.0])
    scale([1,1,0.5])
    rotate([0,90,0])
    cylinder(center=true,d=12,h=200,$fn=32);
    translate([0,-5.5,6])
    cube_center([102,8,10]);
}

difference() {
    for(s=[-1:2:1]) {
    translate([s*20,0,0])
    rotate([9.0,0,0])
    cube_center([10,8,50]);
    }
    
    scale([1,1,-1])
    cube_center([100,100,100]);
}


difference() {
    union() {
        cube_center([102,10,6]);
        translate([0,-60/2,0])
        cube_center([10,60,6]);
    }
    for(i=[-40:40:40]) {
        translate([i,0,0])
        cylinder(d=3.2,h=50,$fn=32);
        translate([i,0,2])
        cylinder(d=6.5,h=50,$fn=32);
    }
    translate([0,-55,0])
    cylinder(d=3.2,h=50,$fn=32);
    translate([0,-55,2])
    cylinder(d=6.5,h=50,$fn=32);
}

module cube_center(dims,r=0) {
    if(r==0) {
        translate([-dims[0]/2, -dims[1]/2, 0])
        cube(dims);
    } else {
        
        minkowski() {
            translate([-dims[0]/2+r, -dims[1]/2+r, 0])
            cube([dims[0]-2*r,dims[1]-2*r,dims[2]]);
            cylinder(r=r,h=0.00001,$fn=32);
        }
    }
}