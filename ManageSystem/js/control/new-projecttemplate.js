﻿if (Globals.getCookie("SystemUserId") == null) {
    alert("请登录");
    location.href = "login.html";
}
function newprojecttempalet() {
    (function () {
        $("#login").click(function () {
            if (confirm("确定注销？")) {
                location.href = "login.html";
            }
        })
            $.ajax({
                type: "post",
                url: Globals.ServiceUrl + "SelectRoom",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var s = JSON.parse(data.d);
                    var option = $("#roomid").empty();
                    for (var i in s) {
                        option.append($("<option>").val(s[i].RoomId).text(s[i].Name));
                    }
                    $('#roomid').select2();
                }, error: function (xhr) {
                    alert("请联系管理员");
                    return false;
                }
            })
            $("#btnSave").click(function () {
                if (Globals.trim($("#taskname").val()) != "") {
                    var jsonPara = {
                        projecttemplate: {
                            taskname: $("#taskname").val(),
                            roomid: $("#roomid").val(),
                            description:$("#description").val()
                        }
                    }
                    $.ajax({
                        type: "post",
                        url: Globals.ServiceUrl + "CreateProjectTemplate",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(jsonPara),
                        dataType: "json",
                        success: function (data) {
                            var s = JSON.parse(data.d);
                            if (s) {
                                alert("添加成功")
                                location.href = "projecttemplate-list.html";
                            } else {
                                alert("添加失败");
                                return false;
                            }
                        }, error: function (xhr) {
                            alert("请联系管理员");
                            return false;
                        }
                    })
                } else {
                    alert("任务名不能为空");
                    return false;
                }
            })
    })()
}
$(function () {
    newprojecttempalet();
})