﻿if (Globals.getCookie("SystemUserId") == null) {
    alert("请登录");
    location.href = "login.html";
}
var id = $.getUrlParam("id");
var createdby = Globals.getCookie("SystemUserId");
var address;
$(function () {
 
    $("#login").click(function () {
        if (confirm("确定注销？")) {
            location.href = "login.html";
        }
    });
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: Globals.ServiceUrl + "ScustomerId",
        success: function (data) {
            var s = JSON.parse(data.d);
            var option = $("#Select1").empty();
            for (var i in s) {
                option.append($("<option>").val(s[i].Customerid).text(s[i].Name));
            }
            $('#Select1').select2();
            if (id!=""&&id!=null) {
                $("#Select1").attr("disabled", "disabled");
                $("#Select1 option").attr("selected", false);
                $("#Select1 option[value=" + id + "]").attr("selected", true);
                $('#Select1').select2();
                
                 address = "customer-profile.html?id=" + id;
            } else {
                $('#Select1').select2();
                 address = "contact-list.html";
            }
            
        }, error: function (xhr) {
            alert("请联系管理员");
            return false;
        }
    })
 
    $("#btnSave").click(function () {
        if (Globals.trim($("#name").val())!= "") {
            var jsonPar = {
                contact: {
                    name: $("#name").val(),
                    customerid: $("#Select1").val(),
                    description: $("#Description").val()
                }
            }
            $.ajax({
                type: "post",
                contentType: "application/json;charset=utf-8",
                url: Globals.ServiceUrl + "Incontact",
                data: JSON.stringify(jsonPar),
                dataType: "json",
                success: function (data) {
                    var s = JSON.parse(data.d);
                    if (s) {
                        alert("创建成功");
                        location.href = address;
                    } else {
                        alert("创建失败");
                        return false;
                    }

                }, error: function (xhr) {
                    alert("请联系管理员");
                    return false;
                }
            })
        } else {
            alert("姓名不能为空");
            return false;
        }
           
        })
})