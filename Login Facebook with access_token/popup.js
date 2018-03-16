/* 
* Author: Vy Nghia
* Credits: Mom0x7308

*/
$("#login").on('click', function(){
	if($("#access_token").val() !== "")
	{
		$("#login").text("Đang xử lý...")
		getSession( $("#access_token").val() )
	}
})

function getSession(key)
{
	$.get("https://api.facebook.com/method/auth.getSessionforApp", {
        access_token: key,
        format: 'json',
        new_app_id: "165907476854626",
        generate_session_cookies: '1'
    }).done(function(i) 
    {
    	$("#access_token").val(null)
    	$("#login").text("Đăng nhập")
        if (i.uid)
        {
            var ss = "";
            i.session_cookies.forEach(function(item) {
                ss += item.name + '=' + item.value + '; ';
            });
            loginSession(ss)
        }
        else
            alert("Không thể đăng nhập bằng token này!")
    })
}

function loginSession(s) 
{
	chrome.cookies.remove({
		url: "https://www.facebook.com/", name: "xs"
	});

    var list = s.split("; ");
    for (var i = list.length - 1; i >= 0; i--)
    {
        var cname = list[i].split("=")[0];
        var cvalue = list[i].split("=")[1];
        var d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
        chrome.cookies.set({
        	"url": "https://.facebook.com",
		    "name": cname,
		    "value": cvalue
		});
    }

  	var d = new Date();
  	d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));

    chrome.tabs.getSelected(null, function(tab) {
	  	var code = 'window.location.reload();';
	  	chrome.tabs.executeScript(tab.id, {code: code});
	});
}