
// Global variable for in site location
var locate;

//-------------------------------------------------------------------------  
// Uilities
//-------------------------------------------------------------------------

//show a particular element
function showElement(name) {
	$(name).show();
}
//hide a particular element
function hideElement(name) {
	$(name).hide();
}
//change a navigator item's css to active, and remove previous active class
function active_nav(current) {
	$('#nav-'+locate).removeClass("active");
	$('#nav-'+current).addClass("active");
	locate = current;
}

function slideSwitch() {
        var $active = $('div#slide-show img.active');
        var $divs = $active.parent().children();    

        $active.removeClass('active');
        $divs.eq(($divs.index($active) + 1) % $divs.length).addClass('active');
        $active.fadeOut(1000);
        $divs.eq(($divs.index($active) + 1) % $divs.length).fadeIn(1000);
}

function horseBlink() {
	var $horse = $('#logo');
	var $name = $('#logo').attr("src");
	var $num = parseInt($name.replace( /^\D+/g, ''));
	var $new_num = ($num + 1) % 20;
	var $new_src = "img/logo"+$new_num+".png";
	$horse.attr('src', $new_src);
}

function showPageAlert(content, mode) {
	if ($('#page-alert').css("display")=='none') {
		$('#page-alert').fadeIn('fast');
		if (mode=='success') {
			$('#page-alert').css("background-color","#dff0d8");
			$('#page-alert').css("color","#3c763d");
		} else {
			$('#page-alert').css("background-color","#f2dede");
			$('#page-alert').css("color","#E74C3C");
		}
		$('#page-alert').html(content);
		$("#page-alert" ).delay( 1200 ).fadeOut('fast');
	}
	
}

function verify_email(name) {
	var reEmail = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
	var email = $(name).val();
	//wrong email input
	return reEmail.test(email);
}

function verify_password(name) {
	var rePsd = /^[A-Za-z0-9]\w{5,19}$/;
	var psd = $(name).val();
	//wrong email input
	return rePsd.test(psd);
	
}
function verify_username(name) {
	var reName = /^[a-zA-Z0-9_]{4,20}$/;
    var username = name;
    return reName.test(username);
}

// change the content in the sidebar 
function updateSidebar(level, exp) {
	var old_level = parseInt($('#side-level').text().substring(6));
	if (old_level!=level) {
		showPageAlert('Level Up!','success');
	}
	$('#side-level').text("Level "+level);
	$('#side-exp').text("Exp: "+exp +"/"+ level*20);
}
// change the status of a particular task
function updateTask(taskid, current, time) {
	var status = $('[name=\"'+taskid+'\"] > #task-do-form > #task-status');
	var progressbar = $('[name=\"'+taskid+'\"] > #progressbar > #progressbar-percentage');
	var remaintime = $('[name=\"'+taskid+'\"] > #remaining-time > #remain-time');

	if (time<=0) {
		hideElement('[name=\"'+taskid+'\"]');
	}

	var progress = Math.floor(current);
	if(progress<10) {
		status.html("0"+progress+"/100% ");
	} else {
		status.html(progress+"/100% ");
	}

	progressbar.css('width',current+'%');
	remaintime.html(time);

}

//create a in-memory div, set it's inner text(which jQuery automatically encodes)
//then grab the encoded contents back out.  The div never exists on the page.
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

//-------------------------------------------------------------------------  
// Controller
//-------------------------------------------------------------------------

//when switching GUI, hide current form, reset all its value
function hideCurrent(current) {
	switch(current) {
		case 'Home':
			break;
		case 'Login':
			hideElement('.full-page');
			// when switch, clear all the field in the current form
			$('#login_form input[type=password]').val('');
			$('#login_form input[type=text]').val('');
			$('#login_form input[type=password]').val('');
			$('#login_form .form_alert .alert-text').html('');
			$('#login_form > .form_alert').hide();
			$('#login_form input').css("border-color","#DADADA");
			hideElement('.login');
			break;
		case 'SignUp':
			$('#register_form input').css("border-color","#DADADA");
			$('#register_form input[type=password]').val('');
			$('#register_form input[type=text]').val('');
			$('#register_form input[type=email]').val('');
			$('#register_form .form_alert').hide();
			hideElement('.full-page');
			hideElement('.register');
			break;
		case 'Dashboard':
			hideElement('#task-dashboard');
			break;
		case 'Account':
			hideElement('#view_account');
			$('#account-form .form_alert').hide();
			$('#account-form input[type=password]').val('');
			$('#account-form input[name=email]').css("border-color","#DADADA");
			$('#account-form input[type=password]').css("border-color","#DADADA");
			break;
		case 'Lead':
			hideElement('.view-leaderboard');
			break;
		case 'NewTask':
			// when switch, clear all the field in the current form
			$('#newtask_form input[type=text]').val('');
			$('#newtask_form textarea').val('');
			$('#newtask_form .form_alert .alert-text').html('');
			$('#newtask_form > .form_alert').hide();
			$('#newtask_form input').css("border-color","#DADADA");
			hideElement('.task-create');
			break;
		case 'EditTask':
			$('.task-update input[type=text]').val('');
			$('#update_description').text('');
			hideElement('.task-update');
			break;
		case 'Task':
			hideElement('#button-group');
			hideElement('#task-dashboard');
			break;
		case 'Logout':
			//logout then refresh the site
			break;
	}
}

//when switching GUI, show the target content
function redirect(dest) {
	hideCurrent(locate);
	active_nav(dest);
	//show desired page element
	switch(dest) {
		case 'Home':
			break;
		case 'Login':
			showElement('.full-page');
			showElement('.login');
			break;
		case 'SignUp':
			showElement('.full-page');
			showElement('.register');
			break;
		case 'Dashboard':
			showElement('.sidebar');
			showElement('#task-dashboard');
			user_retrieve('dashboard');
			task_retrieve('ongoing');
			break;
		case 'Account':
			$('#n_password').prop('disabled', true);
			$('#r_password').prop('disabled', true);
			user_retrieve('account');
			break;
		case 'Lead':
			display_leaderboard();
			break;
		case 'NewTask':
			showElement('.full-page');
			showElement('.task-create');
			break;
		case 'EditTask':
			showElement('.task-update');
			break;
		case 'Task':
			showElement('.full-page');
			showElement('.sidebar');
			showElement('#task-dashboard');
			user_retrieve('dashboard');
			task_retrieve('ongoing');
			break;
		case 'Logout':
			logout();
			break;				
	}
}

//-------------------------------------------------------------------------  
// User
//-------------------------------------------------------------------------

//check if the user has logged in(check the session on the server side)
//if user has logged in, switch to the DashBoard GUI, else switchto the Home page.
function checkLogin() {
	$.getJSON("service/checkLogin.php", function(data) {
		if (data['status'] == 'true') {
			// if login, show the interface of after login
			hideElement('.non-user-item');
			showElement('.user-item');
			//direct to the dashboard
			redirect('Dashboard');
		} else {
			// else, redirect to the home page
			redirect('Home');
		}
	});
}

//authenticate the input credentials with the server for logging purpose.
function authenticate() {
	//get input data
	var input = {};
	input.name = $("#login_form input[type=text]").val();
	input.password = $("#login_form input[type=password]").val();
	//wrap the data to a JSON string
	var logindata = JSON.stringify(input);

	//sending data to the model
	$.post("service/loginResult.php", {login: logindata}, function( data ) {
	  if (data.status == 'Success') {
	  	hideElement('.non-user-item');
		showElement('.user-item');
	  	// show success message, and redirect to the home (dashboard)
	  	showPageAlert('Login successful! Welcome back...', 'success');
	  	redirect('Dashboard');
	  	user_retrieve('dashboard');
	  } else {
	  	//display error message in the form
  		$('#login_form input[type=text]').css("border-color","red");
  		$('#login_form input[type=password]').css("border-color","red");
  		$('#login_form > .form_alert').show();
  		$('#login_form .form_alert .alert-text').html("The username or password you entered is incorrect.");
	  }
	});
}

//check whther the new user's information is legitimate
function validate() {
	//get input data;
	var input = {};
	input.name = $("#reg-name").val();
	input.email = $("#reg-email").val();
	input.password = $("#reg-psw").val();
	input.password_retype = $("#reg-rpsw").val();

	//wrap the date to JSON string
	var register_data = JSON.stringify(input);
	//sending data to the model
	$.post("service/userCreate.php", {regi: register_data}, function(data) {
		hideElement('.non-user-item');
		showElement('.user-item');
	  	// show success message, and redirect to the home (dashboard)
	  	showPageAlert('Sign Up successful! Welcome...','success');
	  	redirect('Dashboard');
	});		
}


function user_retrieve(location) {
	$.getJSON("service/userRetrieve.php", function(data) {
		if (data['status'] == 'Success') {
			switch(location) {
				case 'dashboard':
					startDashboard(data.user);
					break;
				case 'account':
					display_account(data.user);
					break;
			}
		} else {
				// else, error happens
				showPageAlert('Unknown error! Please try again...','fail');
		}
	});
}
// 					
function user_update() {
	//get input data;
	var input = {};
	input.name = $("#account-name").val();
	input.email = $("#account-email").val();
	input.oldpassword = $("#o_password").val();
	input.newpassword = $("#n_password").val();

	//wrap the date to JSON string
	var update_data = JSON.stringify(input);
	//sending data to the model
	$.post("service/userUpdate.php", {update: update_data}, function(data) {
		if (data['status'] == 'Success') {
			redirect('Account');
			showPageAlert('Update successful.','success');
		} else {
			// else, error happens
			$('#o_password').css("border-color","red");
			$('#account-form .form_alert .alert-text').html(data['message']);
			showElement('#account-form .form_alert');
		}
	});
}



function logout() {
	var jq = $.getJSON("service/logout.php", {logout:true},function(data) {
		if (data['status'] == 'Success') {
			location.reload();			
		} else {
			// else, error happens
			showPageAlert('Unknown error! Please try again...','fail');
		}
	});
	jq.complete(function() {
		// showPageAlert('You have successfully logged out.','success');
		alert("You have logged out.");
	});

}
//-------------------------------------------------------------------------  
// Tasks
//-------------------------------------------------------------------------
function task_retrieve(mode) {
	$.getJSON("service/taskRetrieve.php", function(data) {
		if (data['status'] == 'Success') {
			display_task_dashboard(data, mode);
			showElement('.content');
		} else {
			// else, error happens
			showPageAlert('Unknown error! Please try again...','fail');
		}
	});
}

function create_task(title, description, duration) {
	//get input data;
	var input = {};
	input.title = title;//$("#newtask_title").val();
	input.description = description;//$("#newtask_description").val();
	input.duration = duration;//$("#duration-field").val();
	//wrap the date to JSON string
	var create_data = JSON.stringify(input);
	//sending data to the model
	$.post("service/taskCreate.php", {create_task: create_data}, function(data) {
		if (data['status'] == 'Success') {
			showPageAlert('Create successfully!','success');
			redirect('Dashboard');
		} else {
			// else, error happens
			showPageAlert('Create failed! Please try again.','fail');
		}
	});	
}

function plus_duration() {
	if ($("#duration-field").val()) {
		var current = parseInt($("#duration-field").val());
		if (current < 50) {
			$("#duration-field").val(current + 1);
		}
	} else {
		$("#duration-field").val(1);	
	}
}

function minus_duration() {
	if ($("#duration-field").val()) {
		var current = parseInt($("#duration-field").val());
		if (current > 0) {
			$("#duration-field").val(current - 1);
		}
	} else {
		$("#duration-field").val(0);
	}
}

function do_task(taskid) {
	//sending data to the model
	var id = JSON.stringify(taskid);
	//sending do task command to the taskUpdate.php, and then change the progress bar and experience.
	$.getJSON("service/taskUpdate.php",  {dotask: id}, function(data) {
		if (data['status'] == 'Success') {
			// update the level, exp and progress bar in the sidebar.
			updateSidebar(data.user.level, data.user.exp);
			if (data.task.remainingslot<=0) {
				hideElement('[name=\"'+data.task.id+'\"]');
				redirect(locate);
			} else {
				updateTask(data.task.id.toString(), (1 - data.task.remainingslot / data.task.totalslot) * 100, data.task.remainingslot * 30);
			}
			showPageAlert('Do successfully!','success');
		} else {
			// else, error happens
			showPageAlert('Do failed! Please try again.','fail');
		}
	});
	
}

function update_task(taskid, title, description) {
	//get input data;
	var input = {};
	input.id = taskid;
	input.title = title;
	input.description = description;
	//wrap the date to JSON string
	var update_data = JSON.stringify(input);
	//sending data to the model
	$.post("service/taskUpdate.php", {edit_task: update_data}, function(data) {
		if (data['status'] == 'Success') {
			hideElement('.task-update');
			showPageAlert('Update successfully!','success');
			redirect('Task');
		} else {
			// else, error happens
			showPageAlert('Update failed! Please try again.','fail');
		}
	});	
	
}

function delete_task(taskid) {
	var id = JSON.stringify(taskid);
	$.getJSON("service/taskDelete.php",  {delete_task: id}, function(data) {
		if (data['status'] == 'Success') {
			// delete the task-item in the Dom
			$('[name=\"'+taskid+'\"]').remove();
			showPageAlert('Task deleted.','success');
			redirect(locate);
		} else {
			showPageAlert('Delete failed! Please try again.','fail');
		}
	});
}


//-------------------------------------------------------------------------  
// GUI
//-------------------------------------------------------------------------

function startDashboard(user_data) {
	$("#side-name").html(user_data.name);
	$("#side-level").html("Level " + user_data.level);
	$("#side-exp").html("Exp: " + user_data.exp +"/"+user_data.level*20);
}

function display_task_dashboard(task_data, mode) {
	var content = '';
	var tasks = task_data.tasks;
	//count for ongoing task
	if (tasks.length<=0) {
		//show empty task message
		showElement('#warn');
	} 

	if (locate == 'Task') {
		showElement('#button-group');
		$('#button-group > button').css("background-color","");
		switch(mode) {
			case 'all' : 
				task_show_all(tasks, content);
				$('#task-all').css("background-color","#217c99");
				$('#task-ongoing').mouseover(function(){$('#task-ongoing').css("background-color","#1b9b82");});
				$('#task-ongoing').mouseout(function(){$('#task-ongoing').css("background-color","#1abc9c");});
				$('#task-finished').mouseover(function(){$('#task-finished').css("background-color","#1b9b82");});
				$('#task-finished').mouseout(function(){$('#task-finished').css("background-color","#1abc9c");});
				$('#task-all').mouseover(function(){$('#task-all').css("background-color","#206575");});
				$('#task-all').mouseout(function(){$('#task-all').css("background-color","#217c99");});
				break;
			case 'ongoing' :
				task_show_ongoing(tasks, content);
				$('#task-ongoing').css("background-color","#217c99");
				$('#task-all').mouseover(function(){$('#task-all').css("background-color","#1b9b82");});
				$('#task-all').mouseout(function(){$('#task-all').css("background-color","#1abc9c");});
				$('#task-finished').mouseover(function(){$('#task-finished').css("background-color","#1b9b82");});
				$('#task-finished').mouseout(function(){$('#task-finished').css("background-color","#1abc9c");});
				$('#task-ongoing').mouseover(function(){$('#task-ongoing').css("background-color","#206575");});
				$('#task-ongoing').mouseout(function(){$('#task-ongoing').css("background-color","#217c99");});
				break;
			case 'finished' :
				task_show_finished(tasks, content);
				$('#task-finished').css("background-color","#217c99");
				$('#task-ongoing').mouseover(function(){$('#task-ongoing').css("background-color","#1b9b82");});
				$('#task-ongoing').mouseout(function(){$('#task-ongoing').css("background-color","#1abc9c");});
				$('#task-all').mouseover(function(){$('#task-all').css("background-color","#1b9b82");});
				$('#task-all').mouseout(function(){$('#task-all').css("background-color","#1abc9c");});
				$('#task-finished').mouseover(function(){$('#task-finished').css("background-color","#206575");});
				$('#task-finished').mouseout(function(){$('#task-finished').css("background-color","#217c99");});

				break;
		}
		
	} else {
		task_show_ongoing(tasks, content);
	}

}

function task_show_all(tasks, content) {
	var count =0;
	for (var i=0;i<tasks.length;i++) {
		var task = tasks[i];
		if (task.remainingslot == 0) {
			var current = "<div id=\"task-item-done\" name=\""+task.id+"\"><div class=\"task-title\"><a  data-name=\""+task.id+"\" href=\"\">";
		} else {
			var current = "<div id=\"task-item\" name=\""+task.id+"\"><div class=\"task-title\"><a  data-name=\""+task.id+"\" href=\"\">";
		}
    	count++;
    	current+=task.title;
    	current+="</a></div><div id=\"task-do-form\"><span id=\"task-status\">";
    	var progress = Math.floor((1 - task.remainingslot/task.totalslot) * 100);
    	if(progress<10) {
    		current+="0"+progress;
    	} else {
    		current+=progress;
    	}
    	if (task.remainingslot == 0) {
    		current+="/100%</span><button disabled=\"disabled\" id=\"Do-task\" class=\"button-done\" onclick=\"do_task(";
    	} else {
    		current+="/100%</span><button id=\"Do-task\" class=\"button-do\" onclick=\"do_task(";
    	}
    	current+=task.id+")\">DO</button></div>";

		// task description
		if (task.description.length ==0) {
			task.description = '<i>*Empty*</i>'
		}
		current+="<div id=\"task-description\" style=\"display:none\"><span>Description</span><p>"+task.description+"</p>";

		// options
		current+="<li onclick=\"display_update_form("; 
		current+=task.id+")\"><img src=\"img/pencil.png\" width='15px' height='15px' alt=\"edit\">Edit</li><li onclick=\"delete_task(";
		current+=task.id+")\"><img src=\"img/remove.png\" width='14px' height='14px' alt=\"delete\">Delete</li></div>"


    	if (task.remainingslot == 0) {
    		current+="<div id=\"progressbar\"><div id=\"progressbar-percentage-done\" style=\"width:";
    	} else {
    		current+="<div id=\"progressbar\"><div id=\"progressbar-percentage\" style=\"width:";
		}
		var bar = (1 - task.remainingslot/task.totalslot) * 100;
		current+=bar;
		current+="%\"></div></div><div id=\"remaining-time\" data-total=\""+task.totalslot+"\">Estimated remaining time: <div id=\"remain-time\">";
		current+=task.remainingslot * 30;
		current+="</div> minutes</div></div>";

		content+=current;
	}
	if (count==0) {
		showElement('#warn');
	} else {
		hideElement('#warn');
	}
	$('#dashboard-task').html(content);

	//activate the slide down menu.
	$('.task-title > a').click(function(event) {
		event.preventDefault();
		var item = '[name=\"'+$(this).data().name+'\"] > #task-description'; 
		$(item).slideToggle( "fast");
	});
}

function task_show_ongoing(tasks, content) {
	for (var i=tasks.length-1; i>=0; i--) {
		var task = tasks[i];
		if (task.remainingslot == 0) {
			tasks.splice(i, 1);
		}
	}
	task_show_all(tasks, content);
}

function task_show_finished(tasks, content) {
	for (var i=tasks.length-1; i>=0; i--) {
		var task = tasks[i];
		if (task.remainingslot != 0) {
			tasks.splice(i, 1);
		}
	}
	task_show_all(tasks, content);
}

function display_account(user_data) {
	showElement('#view_account');
	$('#account-name').val(user_data.name);
	$('#account-email').val(user_data.email);
	$('#o_password').val();
	$('#n_password').val();
}

function fillUpdateForm(taskid,title, description, time) {
	hideElement('.task-update .form_alert');
	$('#update_title').val(title);
	$('#update_description').val(description);
	$('.task-update #duration-field').val(time);
	$("#task_update_submit").data("taskid",taskid);
}

function display_update_form(taskid) {
	// get the title and description of the task from DOM
	var title = $('[name=\"'+taskid+'\"] .task-title a').text();
	var description = $('[name=\"'+taskid+'\"] #task-description p').text();
	if (description =='*Empty*') {
			description='';
	}
		var time = $('[name=\"'+taskid+'\"] #remaining-time').data().total;
		// switch to the edit task form
		fillUpdateForm(taskid, title, description, time);
		redirect('EditTask');
}

function display_leaderboard() {
	$.getJSON("service/userRetrieve.php",  {leaderboard: true}, function(data) {
		if (data['status'] == 'Success') {
			var content='';
			var leaders = data.leader;
			for (var i=0;i<leaders.length;i++) {
				content+="<tr><td><img class=\"leaderboard-icon\" src=\"img/no"+(i+1)+".png\"></td>";
				content+="<td>&nbsp;&nbsp;&nbsp;"+leaders[i].name+"</td>";
				content+="<td>&nbsp;&nbsp;&nbsp;&nbsp;Level: "+leaders[i].level+"</td></tr>";
			}
			$('.view-leaderboard table').html(content);
		} else {
			showPageAlert('Load Leaderboard failed.','fail');
		}
	});
	showElement('.view-leaderboard');
}
