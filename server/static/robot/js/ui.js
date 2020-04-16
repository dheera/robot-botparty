let saveSettings = () => {
  console.log("saving");
  window.localStorage.setItem("robotId", $("#inputRobotId").val());
  window.localStorage.setItem("passCode", $("#inputPassCode").val());
  $("#botNumDisplay").text(robotId);
  readSettings();
  connectSocket();
};

$(() => {
  if(!window.localStorage.getItem("robotId")) {
    $("#panelConfiguration").show();
    $("#inputPassCode").val(makeid(6));
  } else {
    robotId = window.localStorage.getItem("robotId");
    passCode = window.localStorage.getItem("passCode");
    $("#inputRobotId").val(robotId);
    $("#inputPassCode").val(passCode);
    $("#botNumDisplay").text(robotId);
  }

  $("#inputRobotId").change(saveSettings);
  $("#inputPassCode").change(saveSettings);

  $("#buttonConfigurationContainer").click(()=>{
    $("#panelConfiguration").toggle();
  });

});
