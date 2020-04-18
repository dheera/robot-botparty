(()=>{
  let nh = ros.initNode("imu_node");
  let pub_imu_data = nh.advertise("/imu/data", "sensor_msgs/Imu");

  let imu = new AbsoluteOrientationSensor({
    frequency: 60,
    referenceFrame: "device"
  });

  imu.addEventListener("reading", e => {
    let msg = { "@type": "sensor_msgs/Imu" };
    msg.orientation = {
      x: imu.quaternion[0],
      y: imu.quaternion[1],
      z: imu.quaternion[2],
      w: imu.quaternion[3],
    };
    msg.angular_velocity = {
      x: 0,
      y: 0,
      z: 0,
    };
    msg.linear_acceleration = {
      x: 0,
      y: 0,
      z: 0,
    };
    pub_imu_data.publish(msg);
  })
})();
