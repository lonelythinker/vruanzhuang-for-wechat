function getLength(str) {
	return str.replace(/[^\x00-xff]/g, "xx").length; //\x00-xff 此区间是单子节 ，除了此区间都是双字节。
}

function findStr(str, n) {
	var tmp = 0;
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i) == n) {
			tmp++;
		}
	}
	return tmp;
}
window.onload = function() {
	var aInput = document.getElementsByTagName('input');
	var oName = aInput[0];
	var dx = aInput[1];
	var pwd = aInput[3];
	var pwd2 = aInput[4];

	var aP = document.getElementsByTagName('p');
	var name_msg = aP[0];
	var dx_msg = aP[0];
	var pwd_msg = aP[0];
	var pwd2_msg = aP[0];
	var name_length = 0;
	var send = document.getElementById('send');
	var times = 60;
	var timer = null;
	send.onclick = function() {
		sendsms();
	};

	function sendsms() {
		var reg = /^0?1[2|3|4|5|7|8|9][0-9]\d{8}$/;
		mobile = document.getElementById("phonenumber").value;
		if (!reg.test(mobile)) {
			alert("请输入正确的手机号码");
			return false;
		} else {
			djs();
			timer = setInterval(djs, 1000);
			mui.ajax(apiurl + 'users/verify-code', {
				data: {
					mobile: mobile
				},
				dataType: 'json',
				type: 'get',
				timeout: 6000,
				success: function(data) {
					if (data.success == true) {
						verifynum = data.data.code;
					} else {
						alert('请求太频繁,请稍后再试');
						times = -1;
						djs();
						stopload();
					}
				},
				error: function(xhr, type, errorThrown, message) {
					alert("网络连接失败，请稍候再试");
					stopload();
					clearInterval("timer");
				}
			});
		}
	}

	function djs() { 
		send.innerHTML = times + "秒后重试";
		send.onclick = function() {
			return false;
		};
		send.style.background = '#ccc';
		send.style.border = '1px solid #ccc';
		times--;
		if (times <= 0) {
			send.innerHTML = "获取验证码";
			send.style.background = '#00b7ee';
			send.style.border = '1px solid #00b7ee';
			send.onclick = function() {
				sendsms();
			};
			times = 60;
			clearInterval(timer);
		}
	}

}