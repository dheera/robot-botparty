// imuNode.js
// by Dheera Venkatraman (`echo qurren | sed -e "s/\(.*\)/\1@\1.arg/" | tr a-z n-za-m`)

// This is a roslite.js node that runs inside a web browser and makes use of the
// HTML5 Web Sensors API to publish IMU data to /imu/data at 60 Hz.

(()=>{
  let nh = ros.initNode("gps_node");
  let pub_gps_fix = nh.advertise("/gps/fix", "sensor_msgs/NavSatFix");
  let msg = { "@type": "sensor_msgs/NavSatFix" };

  msg.position_covariance_type = 2; // COVARIANCE_TYPE_DIAGONAL_KNOWN

  if(!("geolocation" in navigator)) {
    console.error("error: geolocation not available");
    return;
  }

  let lastDataTime = Date.now();
  navigator.geolocation.watchPosition((position)=>{});

  setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      lastDataTime = Date.now();
      msg.latitude = position.coords.latitude;
      msg.longitude = position.coords.longitude;
      msg.altitude = position.coords.altitude;
      msg.covariance = [
        position.coords.accuracy,
        0, 0, 0,
        position.coords.accuracy,
        0, 0, 0,
        position.coords.accuracy ** 2
      ];
      msg.header = {
        timestamp: msg.timestamp / 1000.0,
        frame_id: "gps",
      };
      pub_gps_fix.publish(msg);
    }, (error) => {
      msg.latitude = null;
      msg.longitude = null;
      msg.altitude = null;
      msg.covariance = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      msg.header = {
        timestamp: msg.timestamp / 1000.0,
        frame_id: "gps",
      };
      pub_gps_fix.publish(msg);
    }, {
      timeout: 5000,
      enableHighAccuracy: true
    });
  }, 5000);

})();
